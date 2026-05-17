# Desktop Pet

A floating desktop companion dog built with Electron. Sits, licks, lies down, and responds to interactions — stays on top of your workspace.

## Features

- **Floating on desktop** — transparent, frameless, always-on-top window
- **Idle animations** — the dog sits quietly, periodically licks
- **Auto lie-down** — after 30s idle, the dog lies down
- **Draggable** — drag to reposition anywhere on screen
- **Click bubble** — click the dog to see a speech bubble
- **System tray** — minimize to tray, right-click to quit

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
├── main.js              # Electron main process (tray, window)
├── preload.js           # contextBridge for drag IPC
├── scripts/
│   └── process_images.py  # Image processing pipeline
├── renderer/
│   ├── index.html       # Canvas host
│   ├── app.js           # Entry point, image loading
│   ├── state-machine.js # State machine (idle/licking/lying/bouncing)
│   ├── renderer.js      # Canvas draw loop
│   ├── interactions.js  # Mouse click/drag handling
│   └── bubble.js        # Speech bubble overlay
├── assets/
│   ├── *.png            # Runtime sprites (base, tongue, lie)
│   ├── *-source.png     # Original source images
│   └── tray-icon.png    # System tray icon
└── package.json
```

## Image Pipeline

Source images (`*-source.png`) are RGB with solid backgrounds. Runtime sprites are RGBA with transparency, produced via:

```bash
# Batch convert all source images to runtime sprites
python3 scripts/process_images.py batch --source-dir assets --output-dir assets

# Remove watermarks from existing runtime sprites
python3 scripts/process_images.py clean assets/*.png --in-place

# Generate tray icon from base sprite
python3 scripts/process_images.py trayicon --base assets/base.png --output assets/tray-icon.png --size 64

# Convert a single source image
python3 scripts/process_images.py convert assets/sit-source.png assets/base.png
```

**Requirements:** Python 3.12+ with Pillow (`pip install pillow`).

**Pipeline steps:**
1. Source RGB image is opened
2. Background removal: pixels where R, G, B all exceed 240 are set to transparent
3. Watermark removal: bottom-right corner watermark region is cleared
4. Result saved as RGBA PNG

Use `--bg-threshold` to adjust background removal sensitivity (default 240, lower = more aggressive).

## Platform Notes

- **WSL2**: Tested with WSLg for GUI rendering. GPU sandbox warnings are expected and harmless.
- **macOS**: Built without code signing. On first launch, right-click the app and select "Open" to bypass Gatekeeper.

## License

MIT
