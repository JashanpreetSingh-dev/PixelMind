# PWA icons

For "Add to Home Screen" and install prompts to work correctly, add these files to `public/`:

| File          | Size    | Use                    |
|---------------|---------|------------------------|
| `icon-192.png`| 192×192 | Home screen, Android   |
| `icon-512.png`| 512×512 | Splash / install UI    |

- Format: PNG, square.
- Use your app logo or a simple "P" / pixel icon; avoid tiny text.
- Tools: [realfavicongenerator.net](https://realfavicongenerator.net/), [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator), or export from Figma.

Until these exist, the app still works; some install prompts may not show an icon or may fall back to a default.
