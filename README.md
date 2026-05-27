Minima Timer
============

Minimal, focused countdown timer with a clean circular display and optional sound on completion.

Features
--------
- Hours, minutes, and seconds inputs
- Start, pause, resume, and reset controls
- Circular progress indicators for each time unit
- Light and dark themes
- Web Audio bell on completion

Tech Stack
----------
- React 19
- Vite (rolldown-vite)
- ESLint

Getting Started
---------------
1. Install dependencies:
	- `npm install`
2. Start the dev server:
	- `npm run dev`

Scripts
-------
- `npm run dev` - Start the dev server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

Project Structure
-----------------
- `src/App.jsx` - Main timer logic and UI
- `src/App.css` - Component styles
- `src/index.css` - Base styles and resets
- `src/bellSound.js` - Web Audio bell implementation

Audio Notes
-----------
The bell uses the Web Audio API. Some browsers require a user gesture before audio can play.

Contributing
------------
Issues and pull requests are welcome. Please keep changes focused and include a clear description of the problem and solution.

License
-------
Not specified. If you plan to reuse or redistribute, add a license file.
