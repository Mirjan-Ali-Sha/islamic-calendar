# Islamic Calendar PWA

A Progressive Web App (PWA) displaying the Hijri (Islamic) calendar alongside the Gregorian calendar, featuring prayer times, Qibla direction, and location detection.

## Features
- **Hijri Calendar:** Displays the current Hijri date with manual adjustment support.
- **Prayer Times:** Accurate prayer times based on location and calculation method.
- **Qibla Compass:** Shows the direction of the Qibla (Mecca).
- **Events:** Lists important Islamic events for the month.
- **PWA Support:** Installable on mobile and desktop devices.
- **Offline Mode:** Works without an internet connection after initial load.

## Installation
1.  Clone the repository or download the source code.
2.  Open `index.html` in a web browser.
3.  **Note:** For PWA features (Service Worker) and Geolocation to work correctly, the app must be served over **HTTPS** or `localhost`.

### Running Locally
You can use a simple static file server like `http-server`:
```bash
npx http-server .
```
Then open `http://localhost:8080`.

## Configuration
- **Location:** Automatically detected or manually selectable.
- **Calculation Method:** Choose from various standard calculation methods (MWL, ISNA, Egypt, etc.) in settings.
- **Hijri Adjustment:** If the Hijri date is off by a day, you can adjust it in the settings menu.

## Testing
Test scripts are located in the `test-file` directory.
- `verify_fix.js`: Verifies app initialization logic.
- `test_hijri_adjustment.js`: Verifies the core Hijri engine's adjustment logic.
- `test_consistency.js`: Checks for internal consistency.

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript.
- No external frameworks or dependencies.
