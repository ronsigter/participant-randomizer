# Randomizer

A Chrome extension that randomizes the speaking order of participants in a Google Meet call. Use it to pick a random order for presentations, stand-ups, or round-robin discussions.

## Overview

When you click the extension icon, a popup opens with:

- **Output area** – Shows the result of the randomizer (e.g. "Found 5 participants." and a numbered list) or an error message with hints.
- **Randomize** – Runs the randomizer on the current Google Meet tab and displays the new order.
- **Copy** – Copies the current output to the clipboard.

The extension only works on [Google Meet](https://meet.google.com) (online). It reads the Participants panel and shuffles the list using a Fisher–Yates shuffle.

## How to use

1. **Load the extension** (see [Load an unpacked extension](#load-an-unpacked-extension) below).
2. **Join or open a Google Meet call** in a tab.
3. **Open the Participants panel** in Meet (click "People" or the participant count in the top bar).
4. **Click the Randomizer icon** in the Chrome toolbar to open the popup.
5. **Click Randomize** – the popup will show the randomized speaking order.
6. **Click Copy** to copy the list to the clipboard (e.g. for pasting into chat or notes).

If you see an error, make sure the **active tab** is the Meet call and the **Participants panel is open**. Reload the Meet tab after installing or updating the extension so the content script is injected.

## Load an unpacked extension

To install the extension locally in Chrome:

1. Open the Extensions page: go to `chrome://extensions` in a new tab.  
   - Or click the Extensions menu (puzzle icon) and choose **Manage Extensions**.  
   - Or use the Chrome menu → **More tools** → **Extensions**.
2. Turn on **Developer mode** (toggle in the top-right).
3. Click **Load unpacked** and select the folder that contains this README and `manifest.json`.

The extension will appear in your extensions list. Pin it to the toolbar (via the puzzle menu) so you can open the popup quickly.

## Reload the extension

After changing the code, reload the extension to see your changes:

- Go to `chrome://extensions`.
- Find **Randomizer** and click the **Reload** (circular arrow) button.

| Component        | Requires extension reload |
|-----------------|---------------------------|
| manifest.json   | Yes                       |
| Content scripts | Yes (and reload the Meet tab) |
| Popup (HTML/JS) | No (reopen the popup)     |

## Find console logs and errors

### Popup

To debug the popup (Randomize / Copy behavior):

1. Open the popup (click the extension icon).
2. Right-click inside the popup.
3. Choose **Inspect**.
4. In DevTools, open the **Console** tab. You’ll see logs like `[Randomizer] Randomize clicked` and any errors.

### Content script (Meet page)

To debug the randomizer logic on the Meet page:

1. Open a Google Meet tab.
2. Press **F12** (or right-click → Inspect) to open DevTools for that tab.
3. In the **Console** tab, logs and errors from `randomizer.js` appear in the page context.

### Extension errors

If something is broken, an **Errors** button may appear on the Extensions page next to Randomizer. Click it to see details (e.g. missing files or permission issues).

## Project structure

```
randomizer/
├── manifest.json      # Extension config, permissions, content script
├── randomizer.html    # Popup UI
├── popup.js           # Popup logic (Randomize, Copy)
├── randomizer.js      # Content script: reads Meet participants, shuffles, responds to messages
├── randomizer.png     # Toolbar icon (e.g. 48×48 px)
└── README.md          # This file
```

- **manifest.json** – Declares the popup, icon, `tabs` and `host_permissions`, and injects `randomizer.js` on `https://meet.google.com/*`.
- **randomizer.html** – Popup layout and styles; loads `popup.js`.
- **popup.js** – Gets the active tab, sends a "randomize" message to the content script, and updates the output; handles Copy.
- **randomizer.js** – Injected into Meet tabs; finds the Participants panel, reads names, shuffles, and replies with `{ ok, message, order? }`.

For more on Chrome extension basics, see [Chrome Extension tutorials](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world).
