# Desktop Pet

A floating desktop companion dog built with Electron. Sits, licks, lies down, and responds to interactions — stays on top of your workspace.

## Features

- **Floating on desktop** — transparent, frameless, always-on-top window
- **Idle animations** — the dog sits quietly, periodically licks
- **Auto lie-down** — after 30s idle, the dog lies down
- **Draggable** — drag to reposition anywhere on screen
- **Click bubble** — click the dog to see a speech bubble

## Tech Stack

- Electron 28
- HTML5 Canvas
- State machine animation

## Quick Start

```bash
npm install
npm start
```

## Build

Build for current platform (Windows/Linux from WSL2, macOS on macOS):

```bash
npm run build:win      # Windows: portable .exe + NSIS installer
npm run build:linux    # Linux: AppImage + deb
npm run build:mac      # macOS: DMG + zip
```

Build artifacts are placed in `dist/`.

See `.github/workflows/build.yml` for multi-platform CI via GitHub Actions.

## Project Structure

```
├── main.js              # Electron main process
├── preload.js           # contextBridge for drag IPC
├── renderer/
│   ├── index.html       # Canvas host
│   ├── app.js           # Entry point, image loading
│   ├── state-machine.js # State machine (idle/licking/lying/bouncing)
│   ├── renderer.js      # Canvas draw loop
│   ├── interactions.js  # Mouse click/drag handling
│   └── bubble.js        # Speech bubble overlay
├── assets/
│   ├── *.png            # Runtime sprites (base, tongue, lie)
│   └── *-source.png     # Original source images
└── package.json
```

## Platform Notes

- **WSL2**: Tested with WSLg for GUI rendering. GPU sandbox warnings are expected and harmless.
- **macOS**: Built without code signing. On first launch, right-click the app and select "Open" to bypass Gatekeeper.

## License

MIT
