# Hosting and release

The game is HTML, CSS, and JavaScript. It runs entirely in the player's browser with Canvas and Web Audio. There is no application server, database, account system, API key, or paid engine. Progress and user-created rooms are stored locally in that browser; use JSON export for portable room backups.

The source is prepared for GitHub but has not been pushed or published. Rights remain reserved under the existing license.

## Ready-to-upload folders

The prepared `release/` directory contains two alternatives:

- **`upload-to-host/`**: the playable website. Upload its contents unchanged; `index.html` must be at the site root. It is self-contained, with no build or supporting gameplay files required. The other files preserve credits and the reserved-rights notice.
- **`upload-to-github/`**: the complete editable source repository, with tests, developer documentation and the automatic Pages workflow. Use this folder as the repository root, including hidden files.

`blobbo-web.zip` contains the first folder's contents at ZIP root. `blobbo-source.zip` contains the second inside a `blobbo/` folder. `Blobbo.html` is the same game as the website's `index.html`, for offline play. `START-HERE.txt` explains both upload options. From source, `npm run release` rebuilds all of these.

## Simplest GitHub Pages setup: game only

1. Create an empty GitHub repository, for example `blobbo-browser`.
2. Upload the **contents** of `release/upload-to-host/` to the repository root on `main`. Do not nest them inside another folder. The web uploader works; include `.nojekyll` if visible in your file picker (this site also works without it).
3. Choose **Settings → Pages → Build and deployment → Source → Deploy from a branch**.
4. Select **main** and **/ (root)**, then **Save**. The Pages settings show the playable URL after deployment.

To update, replace the hosted files with the next release's contents. These steps follow [GitHub's publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Full source repository + automatic GitHub Pages

GitHub Pages serves static sites directly from a repository, supports project URLs and custom domains, and is available for public repositories on GitHub Free. See [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

1. Create an empty GitHub repository named, for example, `blobbo-browser`. Use **`release/upload-to-github/` as its root**, not the surrounding `release/` folder. Alternatively, extract the source ZIP and use its `blobbo/` folder.
2. Initialize that folder with Git or GitHub Desktop, add the source files including `.github/` and `.gitignore`, and commit/publish them to `main`. `dist/`, `release/`, and `reports/` are generated and ignored.
3. In the repository, choose **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Open **Actions → Verify and deploy → Run workflow** on `main`. If the first push ran before Pages was enabled, rerun that workflow after enabling it.
5. The workflow tests the game, replays every built-in solution plus 1,000 seeds, builds both editions, and deploys only `dist/`. Its deployment/environment link is the playable URL, normally `https://YOUR-NAME.github.io/blobbo-browser/`.

Subsequent pushes to `main` repeat verification and update the site automatically. Pull requests run the checks and produce downloadable artifacts but do not deploy. The workflow needs no personal access token: it uses GitHub's scoped workflow token. Details: [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

All runtime paths are relative, so project-subdirectory hosting works. The full source, tests, research, and walkthroughs are excluded from the deployed site; authored level data and their reference solutions remain inspectable in client JavaScript, as in any client-side game.

The `blobbo-release` artifact on each successful workflow contains both upload folders, offline HTML, ZIPs, instructions and checksums. The downloads can also be attached manually to a GitHub Release. The current reserved-rights license is preserved in both upload folders.

## Fast upload without Git: Cloudflare Pages

In Cloudflare's dashboard go to **Workers & Pages → Create application → Get started → Drag and drop your files**. Give the project a name and upload `release/blobbo-web.zip` or `release/upload-to-host/`, then deploy. These files are already built. Cloudflare returns a public `pages.dev` URL. See [Direct Upload instructions](https://developers.cloudflare.com/pages/get-started/direct-upload/).

A Direct Upload project cannot later switch to Git integration; a new project is needed for that. Use GitHub Pages if automatic updates from this repository are the goal.

## Any existing web host

Upload the contents of `release/upload-to-host/` to one directory served over HTTPS. No rewrite rules, build command, or server-side runtime are required. The generated `dist/` is an equivalent multi-file website used by the full-source GitHub workflow; when using that edition, keep all its files together.

The existing local development server is for development only. Players do not need Node.js. Hosting gives people a convenient link; it does not run the game's logic in the background.
