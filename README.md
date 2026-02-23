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

## Managing Multilingual Content (Tutorials, Duas & Hadiths)
The app uses Google Translate APIs to generate and serve content in 11 different languages. The data is ultimately bundled into `islamic-content.js`. Here are the detailed, step-by-step instructions on how to update them:

### Updating Tutorials
Tutorials contain large bodies of text and HTML, so they are managed via a build process.

**Step 1: Edit the Source Content**
- To edit general English tutorials, open `Translation-Scripts-Data/english_tutorials.js` and edit the `body` field of the respective tutorial.
- To edit the highly detailed Salah guides, you must edit the master text files directly: 
  - English: `Translation-Scripts-Data/An Exhaustive Theological and Jurisprudential Guide to the Mechanics of Islamic Prayer (Salah)_EN.txt`
  - Bengali: `Translation-Scripts-Data/An Exhaustive Theological and Jurisprudential Guide to the Mechanics of Islamic Prayer (Salah)_BN.txt`

**Step 2: Inject the Salah Content (If Applicable)**
If you edited the `.txt` Salah guides in Step 1, you must first convert them into HTML and inject them into the English tutorial array. To do this, run:
```bash
node inject_new_salah.js
```
*(Note: This step is not required if you only edited `english_tutorials.js` directly).*

**Step 3: Regenerate All Translations**
Once the base English content is updated, run the main translation script. This script sequentially reads the English base, connects to Google Translate APIs to translate the text into 10 other languages (Arabic, Bengali, Urdu, Turkish, Malay, Indonesian, French, Hindi, Telugu, Tamil, and Malayalam), and permanently injects the results into the `TUTORIALS` array in `islamic-content.js`.
```bash
node Translation-Scripts-Data/remake_translations.js
```
*(Wait for the console output to indicate completion for all 18 tutorials).*

**Step 4: Bump the Cache Version**
Because this is a Progressive Web App (PWA) with aggressive offline caching, users will not see the new tutorials unless you force their browser to update.
1. Formally open `app.js` and change `APP_VERSION` to a new number (e.g., `1.5.3` -> `1.5.4`).
2. Open `sw.js` and change `SW_VERSION` to precisely match that same number.


### Updating Daily Duas & Hadiths
The 30 daily Duas and Hadiths (one for each day of the month) are not built via external scripts. They are hardcoded and edited manually.

**Step 1: Locate the Content**
1. Open up the `islamic-content.js` file.
2. At the very top, locate the variable named `DAILY_CONTENT`. This array contains 30 objects, each representing one day of a typical lunar month.

**Step 2: Modify the Object**
1. Each object is tagged with a `type` (`'dua'` or `'hadith'`).
2. You can freely edit the core Arabic text (`ar`), the transliteration (`tr`), and the source reference (`ref`).
3. Inside the `translations` internal object, you can manually replace or correct any of the 11 translated strings (e.g., `'en'` for English, `'ur'` for Urdu, etc.).

**Step 3: Bump the Cache Version**
As with the tutorials, you must bust the offline cache for the users to inherit the updated Duas/Hadiths.
1. Open `app.js` and change `APP_VERSION` to a new number.
2. Open `sw.js` and change `SW_VERSION` to match.

## Testing
- Test scripts are located in the `test-files` directory.
- `verify_fix.js`: Verifies app initialization logic.
- `test_hijri_adjustment.js`: Verifies the core Hijri engine's adjustment logic.
- `test_consistency.js`: Checks for internal consistency.

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript.
- No external frameworks or dependencies.
