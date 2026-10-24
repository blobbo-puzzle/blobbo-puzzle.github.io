/**
 * Original procedural soundtrack and effects. No recordings, samples, external
 * assets, or melodies from Blobbo or another game are used.
 *
 * Consent is explicit: both channels begin disabled. Set the chosen toggles,
 * then call unlock() from a click/key gesture. Setting a toggle alone never
 * creates an AudioContext. Effects and music have separate buses and switches.
 */

const BPM = 86;
const EIGHTH = 60 / BPM / 2;
const LOOK_AHEAD = 0.18;
const MUSIC_LEVEL = 0.30;
const EFFECTS_LEVEL = 0.90;
const midi = note => 440 * 2 ** ((note - 69) / 12);

// A new 32-bar, C-pentatonic tune. Tuples are eighth-note position, MIDI note,
// and duration in eighth notes. The gaps leave the puzzle room quiet to think.
const MELODY = [
  [[0, 72, 2], [3, 76, 1], [5, 74, 2]],
  [[1, 79, 2], [4, 76, 3]],
  [[0, 74, 1], [2, 72, 2], [6, 69, 1]],
  [[1, 72, 3], [5, 76, 2]],
  [[0, 79, 2], [3, 81, 1], [6, 76, 1]],
  [[0, 74, 3], [5, 72, 2]],
  [[1, 69, 2], [4, 74, 2], [7, 72, 1]],
  [[0, 76, 2], [4, 74, 3]],
  [[0, 72, 1], [2, 79, 2], [6, 76, 1]],
  [[1, 74, 2], [5, 69, 2]],
  [[0, 72, 3], [4, 76, 1], [6, 79, 1]],
  [[2, 74, 2], [5, 72, 2]],
  [[0, 81, 2], [3, 79, 2], [6, 76, 1]],
  [[1, 72, 2], [5, 74, 2]],
  [[0, 76, 2], [3, 69, 1], [5, 72, 2]],
  [[0, 74, 2], [4, 67, 3]],
  [[0, 76, 2], [3, 79, 1], [5, 81, 2]],
  [[1, 79, 3], [6, 74, 1]],
  [[0, 76, 1], [2, 72, 2], [5, 69, 2]],
  [[1, 74, 2], [4, 76, 3]],
  [[0, 79, 3], [4, 72, 1], [6, 74, 1]],
  [[2, 76, 2], [5, 79, 2]],
  [[0, 81, 2], [3, 76, 2], [6, 72, 1]],
  [[1, 74, 3], [6, 67, 1]],
  [[0, 72, 2], [3, 74, 1], [5, 79, 2]],
  [[1, 76, 2], [4, 72, 3]],
  [[0, 69, 2], [3, 72, 1], [6, 74, 1]],
  [[1, 76, 3], [5, 79, 2]],
  [[0, 74, 2], [4, 72, 2]],
  [[1, 69, 2], [5, 67, 2]],
  [[0, 74, 2], [3, 76, 1], [5, 72, 2]],
  [[0, 72, 4]],
];

// C, Am, F, G / C, Em, F, G, with a quieter second-half variation.
const HARMONY = [
  [48, 60, 64, 67], [45, 60, 64, 69], [41, 60, 65, 69], [43, 59, 62, 67],
  [48, 60, 64, 67], [40, 59, 64, 67], [41, 60, 65, 69], [43, 59, 62, 67],
  [45, 60, 64, 69], [41, 60, 65, 69], [48, 60, 64, 67], [43, 59, 62, 67],
  [41, 60, 65, 69], [48, 60, 64, 67], [43, 59, 62, 67], [48, 60, 64, 67],
];

export class BlobboAudio {
  constructor() {
    this._effectsEnabled = false;
    this._musicEnabled = false;
    this._unlocked = false;
    this._suspended = false;
    this._context = null;
    this._effects = null;
    this._music = null;
    this._noiseBuffer = null;
    this._timer = null;
    this._nextStepTime = 0;
    this._musicStep = 0;
    this._voices = new Set();
    this._lastCueTime = -Infinity;
    this._unlockPromise = null;
    this._pendingCues = [];
    this._lastError = null;
    this._activation = 0;
    this._analyser = null;
    this._meterBuffer = null;
  }

  get effectsEnabled() { return this._effectsEnabled; }
  get musicEnabled() { return this._musicEnabled; }
  get unlocked() { return this._unlocked; }
  get supported() { return Boolean(globalThis.AudioContext || globalThis.webkitAudioContext); }

  getState() {
    let outputRms = 0, outputPeak = 0;
    if (this._analyser?.getFloatTimeDomainData && this._meterBuffer && this._context?.state === 'running') {
      this._analyser.getFloatTimeDomainData(this._meterBuffer);
      let energy = 0;
      for (const sample of this._meterBuffer) {
        energy += sample * sample;
        outputPeak = Math.max(outputPeak, Math.abs(sample));
      }
      outputRms = Math.sqrt(energy / this._meterBuffer.length);
    }
    return {
      supported: this.supported, contextState: this._context?.state ?? 'not-created',
      effectsEnabled: this._effectsEnabled, musicEnabled: this._musicEnabled,
      unlocked: this._unlocked, suspended: this._suspended,
      activeVoices: this._voices.size, queuedCues: this._pendingCues.length,
      pendingUnlock: Boolean(this._unlockPromise), lastError: this._lastError,
      effectsGain: this._effects?.gain.value ?? 0, musicGain: this._music?.gain.value ?? 0,
      outputRms, outputPeak,
    };
  }

  setEffects(enabled) {
    this._effectsEnabled = Boolean(enabled);
    this._rampBus(this._effects, this._effectsEnabled ? EFFECTS_LEVEL : 0);
    if (!this._effectsEnabled) {
      this._stopVoices('effects', 0.045);
      this._clearPendingCues();
    }
    return this._effectsEnabled;
  }

  setMusic(enabled) {
    this._musicEnabled = Boolean(enabled);
    if (!this._musicEnabled) {
      this._stopScheduler();
      this._rampBus(this._music, 0, 0.16);
      this._stopVoices('music', 0.18);
    } else if (this._unlocked && !this._suspended) {
      this._rampBus(this._music, MUSIC_LEVEL, 0.24);
      this._startScheduler();
    }
    return this._musicEnabled;
  }

  async unlock() {
    if (!this._effectsEnabled && !this._musicEnabled) return false;
    if (!this.supported) { this._lastError = 'Web Audio is not supported by this browser.'; return false; }
    try {
      if (!this._context || this._context.state === 'closed') this._initialize();
      this._suspended = false;
      if (this._context.state === 'running') return this._activateRunningContext();
      if (this._unlockPromise) {
        // A resume requested outside a gesture can remain pending. A later
        // real click must issue resume again, rather than merely waiting on it.
        this._context.resume().catch(error => { this._lastError = error.message || String(error); });
        return this._unlockPromise;
      }
      const activation = ++this._activation;
      const context = this._context;
      // resume() is called synchronously in the caller's user gesture. Sounds
      // are queued until the context actually runs; none are scheduled against
      // a suspended clock or silently lost during an asynchronous resume.
      const resumed = context.resume();
      const pending = Promise.resolve(resumed).then(() => {
        if (activation !== this._activation || context !== this._context || this._suspended) return false;
        if (context.state !== 'running') {
          this._lastError = `Audio is ${context.state}; tap Sound on or try another browser tab.`;
          this._clearPendingCues();
          return false;
        }
        return this._activateRunningContext();
      }).catch(error => {
        this._lastError = error.message || String(error);
        this._unlocked = false;
        this._clearPendingCues();
        return false;
      }).finally(() => { if (this._unlockPromise === pending) this._unlockPromise = null; });
      this._unlockPromise = pending;
      return pending;
    } catch (error) {
      this._unlocked = false;
      this._lastError = error.message || String(error);
      this._clearPendingCues();
      return false;
    }
  }

  _activateRunningContext() {
    if (this._suspended || this._context?.state !== 'running') return false;
    this._unlocked = true;
    this._lastError = null;
    this._rampBus(this._effects, this._effectsEnabled ? EFFECTS_LEVEL : 0);
    if (this._musicEnabled) {
      this._rampBus(this._music, MUSIC_LEVEL, 0.24);
      this._startScheduler();
    }
    this._flushPendingCues();
    return true;
  }

  _initialize(providedContext) {
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    this._context = providedContext ?? new Context();
    const context = this._context;
    context.onstatechange = () => {
      if (context !== this._context) return;
      if (context.state === 'running') this._activateRunningContext();
      else {
        this._unlocked = false;
        this._stopScheduler();
      }
    };
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 22;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.006;
    compressor.release.value = 0.18;
    this._analyser = context.createAnalyser?.() ?? null;
    if (this._analyser) {
      this._analyser.fftSize = 1024;
      this._meterBuffer = new Float32Array(this._analyser.fftSize);
      compressor.connect(this._analyser).connect(context.destination);
    } else {
      this._meterBuffer = null;
      compressor.connect(context.destination);
    }

    this._effects = context.createGain();
    this._music = context.createGain();
    this._effects.gain.value = this._effectsEnabled ? EFFECTS_LEVEL : 0;
    this._music.gain.value = 0;
    const effectsFilter = context.createBiquadFilter();
    effectsFilter.type = 'lowpass';
    effectsFilter.frequency.value = 4700;
    effectsFilter.Q.value = 0.4;
    const musicFilter = context.createBiquadFilter();
    musicFilter.type = 'lowpass';
    musicFilter.frequency.value = 3000;
    musicFilter.Q.value = 0.45;
    this._effects.connect(effectsFilter).connect(compressor);
    this._music.connect(musicFilter).connect(compressor);

    this._noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.5), context.sampleRate);
    const noise = this._noiseBuffer.getChannelData(0);
    for (let i = 0; i < noise.length; i++) noise[i] = Math.random() * 2 - 1;
  }

  _rampBus(bus, target, duration = 0.045) {
    if (!bus || !this._context) return;
    const now = this._context.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.linearRampToValueAtTime(target, now + duration);
  }

  _tone(frequency, time, duration, volume, {
    wave = 'triangle', endFrequency = frequency, bus = 'effects', attack = 0.006, cutoff = 0,
  } = {}) {
    if (!this._context) return;
    const context = this._context;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), time);
    if (endFrequency !== frequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), time + duration);
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(volume, time + Math.min(attack, duration / 3));
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    let filter;
    if (cutoff) {
      filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = cutoff;
      filter.Q.value = 0.5;
      oscillator.connect(filter).connect(envelope);
    } else oscillator.connect(envelope);
    envelope.connect(bus === 'music' ? this._music : this._effects);
    const voice = { source: oscillator, envelope, filter, bus };
    this._voices.add(voice);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
      filter?.disconnect();
      this._voices.delete(voice);
    };
    oscillator.start(time);
    oscillator.stop(time + duration + 0.015);
  }

  _noise(time, duration, volume, frequency = 2200) {
    if (!this._context) return;
    const context = this._context;
    const source = context.createBufferSource();
    source.buffer = this._noiseBuffer;
    const envelope = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 0.8;
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(volume, time + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    source.connect(filter).connect(envelope).connect(this._effects);
    const voice = { source, envelope, filter, bus: 'effects' };
    this._voices.add(voice);
    source.onended = () => {
      source.disconnect(); envelope.disconnect(); filter.disconnect();
      this._voices.delete(voice);
    };
    source.start(time);
    source.stop(time + duration + 0.01);
  }

  _bell(note, time, volume = 0.08, duration = 0.3, bus = 'effects') {
    const frequency = midi(note);
    this._tone(frequency, time, duration, volume, { wave: 'triangle', bus });
    this._tone(frequency * 2, time, duration * 0.55, volume * 0.19, { wave: 'sine', bus });
  }

  _wah(time, pitch = 210, duration = 0.18, descending = false) {
    // Two moving resonances give a small cartoon-vowel character. This is
    // synthesis, not a recording or an imitation of the original voice actor.
    const context = this._context;
    const source = context.createOscillator();
    const envelope = context.createGain();
    source.type = 'square';
    source.frequency.setValueAtTime(pitch, time);
    source.frequency.exponentialRampToValueAtTime(pitch * (descending ? 0.60 : 1.23), time + duration);
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(0.07, time + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    const filters = [520, 1250].map((frequency, index) => {
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = index ? 3.2 : 4;
      filter.frequency.setValueAtTime(frequency, time);
      filter.frequency.linearRampToValueAtTime(frequency * (descending ? 0.67 : 1.35), time + duration * 0.6);
      source.connect(filter).connect(envelope);
      return filter;
    });
    envelope.connect(this._effects);
    const voice = { source, envelope, bus: 'effects' };
    this._voices.add(voice);
    source.onended = () => {
      source.disconnect(); envelope.disconnect(); filters.forEach(filter => filter.disconnect());
      this._voices.delete(voice);
    };
    source.start(time);
    source.stop(time + duration + 0.01);
  }

  playEvents(events = []) {
    if (!this._effectsEnabled || !Array.isArray(events) || !events.length) return Promise.resolve(false);
    const types = new Set(events.map(event => event?.type));
    if (types.has('dead')) return this._playCues(['dead']);
    if (types.has('win')) return this._playCues(['win']);

    // A chain may contain dozens of arrow/fall events. One sound per category
    // gives the chain character without overwhelming the music or the player.
    const cues = [];
    if (types.has('chest')) cues.push(events.some(event => event.type === 'chest'
      && event.message?.startsWith('All toy chests')) ? 'all' : 'chest');
    if (types.has('pickup')) cues.push('pickup');
    if (types.has('tool')) {
      const tool = events.find(event => event.type === 'tool')?.tile;
      cues.push(tool === 'S' ? 'snip' : tool === 'A' ? 'axe' : 'extinguish');
    }
    if (types.has('splash')) cues.push('splash');
    if (types.has('arrow') || types.has('spike')) cues.push('arrow');
    if (types.has('fall')) cues.push('ball');
    if (!cues.length) {
      if (types.has('push')) cues.push('push');
      else if (types.has('sail')) cues.push('sail');
      else if (types.has('drop')) cues.push('drop');
      else if (types.has('grow')) cues.push('grow');
      else if (types.has('move')) cues.push('move');
      else if (types.has('blocked')) cues.push('blocked');
      else if (types.has('wait')) cues.push('wait');
    }
    return this._playCues(cues.slice(0, 3));
  }

  _scheduleCues(cues, delay = 0) {
    if (!this._canPlayEffects() || !cues.length) return false;
    const time = this._context.currentTime + 0.02 + delay;
    // Suppress dense repeats from held direction keys, but never suppress the
    // feedback for picking up a chest, using a tool, or releasing a hazard.
    if (cues.every(cue => ['move', 'blocked', 'wait'].includes(cue)) && time - this._lastCueTime < 0.055) return false;
    this._lastCueTime = time;
    cues.slice(0, 3).forEach((cue, index) => this._cue(cue, time + index * 0.036));
    return true;
  }

  _playCues(cues) {
    if (!this._effectsEnabled || this._suspended || !cues.length) return Promise.resolve(false);
    if (this._canPlayEffects()) return Promise.resolve(this._scheduleCues(cues));
    // playEvents does not invent consent or create a device. Calling unlock()
    // in the gesture before playEvents() is enough; awaiting it is optional.
    if (!this._context || this._context.state === 'closed' || (this._lastError && !this._unlockPromise)) return Promise.resolve(false);
    return new Promise(resolve => {
      while (this._pendingCues.length >= 3) this._pendingCues.shift().resolve(false);
      this._pendingCues.push({ cues, resolve, created: Date.now() });
    });
  }

  _flushPendingCues() {
    if (!this._canPlayEffects()) return;
    const pending = this._pendingCues.splice(0);
    pending.forEach((entry, index) => {
      entry.resolve(Date.now() - entry.created <= 2000 && this._scheduleCues(entry.cues, index * 0.065));
    });
  }

  _clearPendingCues() {
    this._pendingCues.splice(0).forEach(entry => entry.resolve(false));
  }

  playUI(kind) {
    const cue = { won: 'win', restart: 'restart', undo: 'undo', select: 'select', win: 'win' }[kind];
    return cue ? this._playCues([cue]) : Promise.resolve(false);
  }

  _canPlayEffects() {
    return this._effectsEnabled && this._unlocked && !this._suspended
      && this._context && this._context.state === 'running';
  }

  _cue(kind, time) {
    switch (kind) {
      case 'move':
        this._tone(245, time, 0.085, 0.065, { wave: 'triangle', endFrequency: 125 });
        this._tone(125, time + 0.012, 0.06, 0.012, { wave: 'square', cutoff: 900 });
        break;
      case 'chest':
        this._wah(time, 240, 0.13);
        this._bell(76, time, 0.085, 0.28);
        this._bell(84, time + 0.09, 0.072, 0.37);
        break;
      case 'all':
        // The final toy chest gets its own compact answer; reaching the stairs
        // still has the longer victory phrase.
        this._wah(time, 260, 0.15);
        [76, 79, 84].forEach((note, index) => this._bell(note, time + index * 0.08,
          0.073, index === 2 ? 0.42 : 0.20));
        break;
      case 'pickup':
        this._bell(72, time, 0.06, 0.17);
        this._bell(79, time + 0.065, 0.05, 0.2);
        break;
      case 'ball':
        this._tone(155, time, 0.15, 0.10, { wave: 'triangle', endFrequency: 52 });
        this._noise(time, 0.055, 0.038, 500);
        break;
      case 'arrow':
        this._tone(1050, time, 0.12, 0.04, { wave: 'square', endFrequency: 220, cutoff: 2400 });
        this._noise(time, 0.10, 0.014, 3400);
        break;
      case 'snip':
        this._noise(time, 0.045, 0.065, 2800);
        this._noise(time + 0.072, 0.045, 0.042, 3800);
        break;
      case 'splash':
        this._tone(500, time, 0.12, 0.06, { wave: 'sine', endFrequency: 155 });
        this._tone(790, time + 0.075, 0.14, 0.034, { wave: 'sine', endFrequency: 310 });
        this._noise(time, 0.16, 0.025, 1500);
        break;
      case 'axe':
        this._tone(190, time, 0.10, 0.085, { wave: 'triangle', endFrequency: 98 });
        this._noise(time, 0.06, 0.06, 1050);
        this._tone(310, time + 0.018, 0.065, 0.015, { wave: 'square', cutoff: 1100 });
        break;
      case 'extinguish': this._noise(time, 0.28, 0.055, 2100); break;
      case 'push': this._tone(160, time, 0.13, 0.07, { endFrequency: 115, cutoff: 900 }); break;
      case 'sail': this._tone(460, time, 0.13, 0.038, { wave: 'sine', endFrequency: 290 }); break;
      case 'grow': this._tone(260, time, 0.12, 0.032, { endFrequency: 390 }); break;
      case 'drop': this._tone(300, time, 0.095, 0.06, { endFrequency: 150 }); break;
      case 'blocked': this._tone(115, time, 0.055, 0.04, { wave: 'square', cutoff: 700 }); break;
      case 'wait': this._tone(310, time, 0.045, 0.022, { wave: 'sine' }); break;
      case 'undo':
        this._bell(76, time, 0.052, 0.14);
        this._bell(72, time + 0.065, 0.043, 0.18);
        break;
      case 'restart':
        [60, 67, 72].forEach((note, index) => this._bell(note, time + index * 0.055, 0.047, 0.22));
        break;
      case 'select': this._bell(79, time, 0.04, 0.12); break;
      case 'dead':
        this._wah(time, 180, 0.26, true);
        [64, 60, 55, 48].forEach((note, index) => this._tone(midi(note), time + index * 0.105, 0.18,
          0.085 - index * 0.008, { wave: 'triangle', endFrequency: midi(note - 2) }));
        break;
      case 'win':
        [72, 76, 79, 74, 79, 84].forEach((note, index) => this._bell(note, time + index * 0.11,
          index === 5 ? 0.082 : 0.06, index === 5 ? 0.58 : 0.24));
        break;
    }
  }

  _startScheduler() {
    if (this._timer !== null || !this._context || this._context.state !== 'running'
      || !this._musicEnabled || !this._unlocked || this._suspended) return;
    this._nextStepTime = this._context.currentTime + 0.08;
    this._scheduleMusic();
    this._timer = globalThis.setInterval(() => this._scheduleMusic(), 35);
  }

  _scheduleMusic() {
    if (!this._context || this._context.state !== 'running' || !this._musicEnabled || this._suspended) return;
    const now = this._context.currentTime;
    // After a throttled timer, pick up at the next step instead of scheduling
    // a burst of stale notes. Normal rhythm always follows AudioContext time.
    if (this._nextStepTime < now - EIGHTH) this._nextStepTime = now + 0.04;
    while (this._nextStepTime < now + LOOK_AHEAD) {
      this._musicAtStep(this._musicStep, this._nextStepTime);
      this._musicStep = (this._musicStep + 1) % (32 * 8);
      this._nextStepTime += EIGHTH;
    }
  }

  _musicAtStep(step, time) {
    const bar = Math.floor(step / 8);
    const beat = step % 8;
    const harmony = HARMONY[Math.floor(bar / 2)];
    const phraseVolume = bar >= 16 && bar < 24 ? 0.88 : 1;
    for (const [position, note, length] of MELODY[bar]) {
      if (position !== beat) continue;
      const duration = EIGHTH * length * 0.88;
      // Soft triangle/flute voice, with a small bell accent every four bars.
      this._tone(midi(note), time, duration, 0.055 * phraseVolume,
        { bus: 'music', wave: 'triangle', attack: 0.022, cutoff: 2100 });
      if (beat === 0 && bar % 4 === 0) this._bell(note + 12, time, 0.009, 0.4, 'music');
    }
    if (beat === 0) {
      this._tone(midi(harmony[0]), time, EIGHTH * 2.6, 0.058,
        { bus: 'music', wave: 'sine', attack: 0.016 });
      harmony.slice(1).forEach((note, index) => this._tone(midi(note), time + index * 0.014,
        EIGHTH * 5.5, 0.015, { bus: 'music', wave: 'triangle', attack: 0.09, cutoff: 1300 }));
    } else if (beat === 4 && bar % 4 !== 3) {
      this._tone(midi(harmony[0] + 7), time, EIGHTH * 1.7, 0.033,
        { bus: 'music', wave: 'sine', attack: 0.014 });
    }
  }

  _stopScheduler() {
    if (this._timer !== null) globalThis.clearInterval(this._timer);
    this._timer = null;
  }

  _stopVoices(bus, fade = 0) {
    if (!this._context) return;
    const now = this._context.currentTime;
    for (const voice of this._voices) {
      if (bus && voice.bus !== bus) continue;
      try {
        voice.envelope.gain.cancelScheduledValues(now);
        voice.envelope.gain.setValueAtTime(voice.envelope.gain.value, now);
        voice.envelope.gain.linearRampToValueAtTime(0, now + fade);
        voice.source.stop(now + fade + 0.005);
      } catch { /* A source which just ended needs no additional cleanup. */ }
    }
  }

  async suspend() {
    this._suspended = true;
    this._activation++;
    this._unlockPromise = null;
    this._unlocked = false;
    this._clearPendingCues();
    this._stopScheduler();
    this._stopVoices(null, 0);
    if (!this._context || this._context.state === 'closed') return;
    try { await this._context.suspend(); } catch { /* Visibility changes must never break the game. */ }
  }

  async resume() {
    this._suspended = false;
    if (!this._context || (!this._effectsEnabled && !this._musicEnabled)) return false;
    return this.unlock();
  }

  async dispose() {
    this._activation++;
    this._unlockPromise = null;
    this._stopScheduler();
    this._clearPendingCues();
    this._stopVoices(null, 0);
    this._unlocked = false;
    if (this._context && this._context.state !== 'closed') {
      try { await this._context.close(); } catch { /* Best-effort teardown. */ }
    }
    this._voices.clear();
  }
}

/** Render real PCM with the browser's own Web Audio engine, without speakers.
 * The caller can measure the buffer or encode/play it as an audible diagnostic.
 * This helper neither changes the game's toggles nor bypasses playback consent.
 */
export async function renderAudioPreview({ kind = 'effects', duration = 4, sampleRate = 44100 } = {}) {
  const OfflineContext = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  if (!OfflineContext) throw new Error('Offline Web Audio rendering is unavailable in this browser.');
  const seconds = Math.min(30, Math.max(1, Number(duration) || 4));
  const rate = Math.min(96000, Math.max(8000, Number(sampleRate) || 44100));
  const context = new OfflineContext(1, Math.ceil(seconds * rate), rate);
  const audio = new BlobboAudio();
  audio._effectsEnabled = true;
  audio._initialize(context);
  context.onstatechange = null;
  audio._music.gain.value = MUSIC_LEVEL;
  if (kind === 'music' || kind === 'mix') {
    for (let step = 0; step * EIGHTH + 0.05 < seconds; step++) {
      audio._musicAtStep(step % 256, step * EIGHTH + 0.05);
    }
  }
  if (kind !== 'music') {
    const cues = [['move', 0.1], ['chest', 0.45], ['ball', 1.05], ['arrow', 1.45],
      ['splash', 1.85], ['snip', 2.35], ['all', 2.7], ['win', 3.2]];
    for (const [cue, time] of cues) if (time < seconds - 0.15) audio._cue(cue, time);
  }
  return context.startRendering();
}
