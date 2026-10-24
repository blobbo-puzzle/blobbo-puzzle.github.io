import test from 'node:test';
import assert from 'node:assert/strict';
import { BlobboAudio } from '../src/audio.js';

// A small audio-device substitute: it records scheduled sources and supplies a
// controllable clock. The assertions exercise consent and lifecycle behavior,
// not the particular oscillators or envelopes used to compose each sound.
function audioDevice(t, { resumeMode = 'immediate' } = {}) {
  const originals = {
    AudioContext: globalThis.AudioContext,
    webkitAudioContext: globalThis.webkitAudioContext,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval,
  };
  const contexts = [], timers = new Map(), resumes = [];
  let timerId = 0;
  class Parameter {
    constructor(value = 0) { this.value = value; this.events = []; }
    setValueAtTime(value, time) { this.value = value; this.events.push({ value, time }); }
    linearRampToValueAtTime(value, time) { this.setValueAtTime(value, time); }
    exponentialRampToValueAtTime(value, time) {
      assert.ok(value > 0, 'exponential envelopes must have a positive target');
      this.setValueAtTime(value, time);
    }
    cancelScheduledValues() {}
  }
  class AudioNode {
    constructor() {
      for (const field of ['gain', 'frequency', 'Q', 'threshold', 'knee', 'ratio', 'attack', 'release']) {
        this[field] = new Parameter();
      }
    }
    connect(destination) { return destination; }
    disconnect() {}
  }
  class Source extends AudioNode {
    constructor(context, kind) { super(); this.context = context; this.kind = kind; this.stopTime = Infinity; }
    start(time) { this.startTime = time; this.context.sources.push(this); }
    stop(time) { this.stopTime = time; }
    finish() { if (!this.ended) { this.ended = true; this.onended?.(); } }
  }
  class Context {
    constructor() {
      this.state = 'suspended'; this.currentTime = 0; this.sampleRate = 8000;
      this.destination = new AudioNode(); this.sources = []; contexts.push(this);
    }
    createDynamicsCompressor() { return new AudioNode(); }
    createGain() { return new AudioNode(); }
    createBiquadFilter() { return new AudioNode(); }
    createAnalyser() {
      const node = new AudioNode();
      node.getFloatTimeDomainData = samples => samples.fill(0);
      return node;
    }
    createOscillator() { return new Source(this, 'tone'); }
    createBufferSource() { return new Source(this, 'noise'); }
    createBuffer(_channels, length) {
      const samples = new Float32Array(length);
      return { getChannelData: () => samples };
    }
    async resume() {
      if (resumeMode === 'stuck') return;
      if (resumeMode === 'deferred') return new Promise(resolve => resumes.push({ context: this, resolve }));
      this.state = 'running'; this.onstatechange?.();
    }
    async suspend() { this.state = 'suspended'; this.onstatechange?.(); }
    async close() { this.state = 'closed'; this.sources.forEach(source => source.finish()); }
  }
  globalThis.AudioContext = Context;
  globalThis.webkitAudioContext = undefined;
  globalThis.setInterval = callback => { const id = ++timerId; timers.set(id, callback); return id; };
  globalThis.clearInterval = id => timers.delete(id);
  t.after(() => Object.assign(globalThis, originals));
  return {
    contexts, timers,
    finishResume() {
      resumes.splice(0).forEach(({ context, resolve }) => {
        context.state = 'running'; context.onstatechange?.(); resolve();
      });
    },
    advance(seconds) {
      contexts.forEach(context => {
        if (context.state === 'running') context.currentTime += seconds;
        context.sources.forEach(source => { if (source.stopTime <= context.currentTime) source.finish(); });
      });
      [...timers.values()].forEach(callback => callback());
    },
  };
}

test('audio requires an enabled channel and explicit unlock before creating a device', async t => {
  const device = audioDevice(t);
  const audio = new BlobboAudio();
  try {
    assert.equal(audio.effectsEnabled, false);
    assert.equal(audio.musicEnabled, false);
    assert.equal(await audio.unlock(), false);
    audio.playEvents([{ type: 'chest' }]);
    audio.playUI('select');
    assert.equal(device.contexts.length, 0);
    audio.setEffects(true);
    audio.setMusic(true);
    audio.playEvents([{ type: 'chest' }]);
    assert.equal(device.contexts.length, 0, 'changing preferences alone must not start audio');
    assert.equal(await audio.unlock(), true);
    assert.equal(device.contexts.length, 1);
    assert.equal(audio.unlocked, true);
  } finally { await audio.dispose(); }
});

test('the first action waits for an asynchronous device resume instead of scheduling into suspended audio', async t => {
  const device = audioDevice(t, { resumeMode: 'deferred' });
  const audio = new BlobboAudio();
  try {
    audio.setEffects(true);
    const ready = audio.unlock();
    const played = audio.playEvents([{ type: 'move' }]);
    assert.equal(device.contexts[0].sources.length, 0);
    assert.equal(audio.getState().contextState, 'suspended');
    assert.equal(audio.getState().unlocked, false);
    assert.equal(audio.getState().queuedCues, 1);
    device.finishResume();
    assert.equal(await ready, true);
    assert.equal(await played, true);
    assert.ok(device.contexts[0].sources.length > 0);
    assert.equal(audio.getState().queuedCues, 0);
    assert.equal(audio.getState().contextState, 'running');
    assert.equal(audio.getState().outputRms, 0, 'mock device does not synthesize actual PCM');
    assert.equal(audio.getState().outputPeak, 0);
  } finally { await audio.dispose(); }
});

test('muting during resume cancels queued sounds and never emits them afterward', async t => {
  const device = audioDevice(t, { resumeMode: 'deferred' });
  const audio = new BlobboAudio();
  try {
    audio.setEffects(true);
    const ready = audio.unlock();
    const played = audio.playUI('select');
    audio.setEffects(false);
    assert.equal(await played, false);
    device.finishResume();
    await ready;
    assert.equal(device.contexts[0].sources.length, 0);
  } finally { await audio.dispose(); }
});

test('hiding during device activation cancels the pending cue without resurrecting background audio', async t => {
  const device = audioDevice(t, { resumeMode: 'deferred' });
  const audio = new BlobboAudio();
  try {
    audio.setEffects(true);
    audio.setMusic(true);
    const ready = audio.unlock();
    const played = audio.playUI('select');
    await audio.suspend();
    device.finishResume();
    assert.equal(await ready, false);
    assert.equal(await played, false);
    assert.equal(device.contexts[0].sources.length, 0);
    assert.equal(device.timers.size, 0);
    assert.equal(audio.getState().suspended, true);
  } finally { await audio.dispose(); }
});

test('a browser which stays suspended reports failure rather than pretending sound is unlocked', async t => {
  audioDevice(t, { resumeMode: 'stuck' });
  const audio = new BlobboAudio();
  try {
    audio.setEffects(true);
    const ready = audio.unlock();
    const played = audio.playEvents([{ type: 'chest' }]);
    assert.equal(await ready, false);
    assert.equal(await played, false);
    assert.equal(audio.getState().unlocked, false);
    assert.match(audio.getState().lastError, /suspended/);
  } finally { await audio.dispose(); }
});

test('music and effects can each play while the other is disabled', async t => {
  const device = audioDevice(t);
  const audio = new BlobboAudio();
  try {
    audio.setEffects(true);
    await audio.unlock();
    const context = device.contexts[0];
    audio.playEvents([{ type: 'chest' }]);
    assert.ok(context.sources.length > 0);
    assert.equal(device.timers.size, 0);

    audio.setEffects(false);
    let count = context.sources.length;
    audio.playEvents([{ type: 'chest' }]);
    audio.playUI('win');
    assert.equal(context.sources.length, count);
    audio.setMusic(true);
    assert.ok(context.sources.length > count, 'music should start independently');
    assert.equal(device.timers.size, 1);
    count = context.sources.length;
    device.advance(0.5);
    device.advance(0.5);
    device.advance(0.5);
    assert.ok(context.sources.length > count, 'the music clock should keep scheduling');

    audio.setMusic(false);
    assert.equal(device.timers.size, 0);
    audio.setEffects(true);
    count = context.sources.length;
    audio.playUI('undo');
    assert.ok(context.sources.length > count, 'effects should work with music off');
  } finally { await audio.dispose(); }
});

test('visibility suspension stops scheduling, resume recovers, and disposal closes the device', async t => {
  const device = audioDevice(t);
  const audio = new BlobboAudio();
  audio.setMusic(true);
  audio.setEffects(true);
  await audio.unlock();
  const context = device.contexts[0];
  await audio.suspend();
  assert.equal(context.state, 'suspended');
  assert.equal(device.timers.size, 0);
  const count = context.sources.length;
  audio.playEvents([{ type: 'move' }]);
  device.advance(2);
  assert.equal(context.sources.length, count);
  assert.equal(await audio.resume(), true);
  assert.equal(context.state, 'running');
  assert.equal(device.timers.size, 1);
  await audio.dispose();
  assert.equal(context.state, 'closed');
  assert.equal(device.timers.size, 0);
  assert.equal(audio.unlocked, false);
});

test('the final chest has distinct short feedback, separate from both ordinary collection and victory', async t => {
  const device = audioDevice(t);
  const audio = new BlobboAudio();
  try {
    audio.setEffects(true);
    await audio.unlock();
    const context = device.contexts[0];
    function phrase(event) {
      const first = context.sources.length;
      audio.playEvents([event]);
      const sources = context.sources.slice(first);
      assert.ok(sources.length > 0);
      return {
        signature: sources.map(source => [source.kind, source.startTime, source.frequency.events[0]?.value]),
        lastStart: Math.max(...sources.map(source => source.startTime)),
      };
    }
    const ordinary = phrase({ type: 'chest', message: 'A toy chest collected.' });
    const finalChest = phrase({ type: 'chest', message: 'All toy chests collected! Find the stairs.' });
    const victory = phrase({ type: 'win', message: 'Room cleared!' });
    assert.notDeepEqual(ordinary.signature, finalChest.signature);
    assert.notDeepEqual(finalChest.signature, victory.signature);
    assert.ok(finalChest.lastStart < victory.lastStart, 'stairway victory should have the longer phrase');
  } finally { await audio.dispose(); }
});

test('engine event and UI cues schedule without errors, and long hazard chains remain restrained', async t => {
  const device = audioDevice(t);
  const audio = new BlobboAudio();
  try {
    audio.setEffects(true);
    await audio.unlock();
    const context = device.contexts[0];
    for (const type of ['move', 'pickup', 'splash', 'arrow', 'fall', 'push', 'sail', 'drop', 'grow', 'blocked', 'wait', 'dead']) {
      device.advance(0.2);
      const count = context.sources.length;
      audio.playEvents([{ type }]);
      assert.ok(context.sources.length > count, `${type} should give audible feedback`);
    }
    for (const tile of ['A', 'S', 'K']) audio.playEvents([{ type: 'tool', tile }]);
    for (const kind of ['undo', 'restart', 'select', 'win']) audio.playUI(kind);
    let count = context.sources.length;
    audio.playEvents([{ type: 'arrow' }]);
    const oneArrow = context.sources.length - count;
    count = context.sources.length;
    audio.playEvents(Array.from({ length: 50 }, () => ({ type: 'arrow' })));
    assert.equal(context.sources.length - count, oneArrow, 'one chain should not stack fifty identical sounds');
  } finally { await audio.dispose(); }
});
