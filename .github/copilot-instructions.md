# Copilot Instructions for Birthday-Quest

## Project Overview

Birthday-Quest is a web-based interactive birthday quest/scavenger hunt application built with vanilla HTML, CSS, and JavaScript. The application features multiple sequential stations (challenges) that unlock based on time and user progress. It's designed as a personalized birthday experience with a dark theme and magical aesthetic.

**Tech Stack:**
- Pure HTML5, CSS3, and JavaScript (no frameworks)
- Client-side only (no backend)
- Uses `sessionStorage` for progress tracking
- Designed for German language content

## Coding Standards & Conventions

### HTML Structure
- Use semantic HTML5 elements
- Each station is a separate HTML file in the `stations/` directory
- Station file naming: `station1.html` is the unnumbered start/countdown page, then actual challenges start with `station2.html` (labeled "Station 1"), `station3.html` (labeled "Station 2"), etc.
- All stations use a `.card` div container with heading, content, and navigation buttons
- Use `aria-live="polite"` for dynamic feedback messages
- Include proper `role="status"` attributes for accessibility

### JavaScript
- Use vanilla JavaScript (ES6+) - no frameworks or libraries
- All quest logic is in `js/quest.js`
- Each station requires an `initStation{N}()` function that sets up event listeners
- Station progression is tracked via `sessionStorage` with keys like `station{N}Completed` and `currentStation`
- Use `async/await` for loading station HTML files
- Use `addEventListener` for event handling, never inline handlers
- Normalize user input before validation using `.toLowerCase()`, `.trim()`, and `.normalize("NFD")`

### CSS & Styling
- Use embedded CSS in `index.html` (no external stylesheets)
- Inline styles are acceptable for station-specific layout adjustments (e.g., `text-align: center`)
- Follow the established dark theme color scheme:
  - Background: `#0d0d0d`
  - Text: `#e6e6e6`
  - Card background: `#151522`
  - Border: `#2b2b3d`
- All navigation buttons use the `.btn` class with:
  - Purple background: `#4b0082`
  - Hover state: `#6a0dad`
- Disabled buttons use:
  - Background: `#2b2b3d`
  - Text color: `#666`
  - Opacity: `0.5`
  - Cursor: `not-allowed`
- Button order convention: back button first (left), then continue button (right)
- Use CSS custom properties in `:root` for theme colors
- Maintain consistent spacing and border-radius values

### Navigation & User Flow
- Continue buttons should not auto-navigate; users control navigation manually by clicking the enabled continue button
- Station progression requires completing the previous station
- Always disable continue buttons initially and enable them only after task completion
- Back buttons should navigate to the previous station
- Use `sessionStorage` to track completion status, never modify without validation

### Form Handling
- Use proper `<form>` elements with `autocomplete="off"` for quiz/riddle inputs
- Prevent default form submission with `e.preventDefault()`
- Provide clear, friendly feedback messages in German
- Use `.success` class for positive feedback (green text: `#9cffb0`)
- Use `.error` class for negative feedback (red text: `#ff7a7a`)

### Content & Language
- All user-facing content must be in German
- Use emotive, magical-themed language consistent with the existing style
- Maintain the playful, personalized tone

## Testing & Validation

### Manual Testing
- Test all navigation flows between stations
- Verify `sessionStorage` persistence across page refreshes
- Test date/time-based unlocking functionality
- Verify responsive design on different screen sizes
- Test all form validation and user input handling
- Check accessibility features (keyboard navigation, screen reader support)

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use standard ES6+ features (no polyfills needed)
- Test `sessionStorage` availability

## Common Patterns

### Adding a New Station
1. Create `stations/station{N}.html` with the card structure
2. Add corresponding `initStation{N}()` function in `js/quest.js`
3. Set up navigation buttons with proper IDs
4. Implement station-specific logic (riddles, puzzles, etc.)
5. Update `sessionStorage` on completion
6. Ensure back/continue button handlers are configured

### Station HTML Template
Note: Replace `{N}` with the actual station number (e.g., `continueBtn2` for Station 1 in station2.html)

```html
<div class="card">
    <h1 style="text-align: center;">✨ Station X – Title</h1>
    <p class="note">Station content...</p>
    
    <!-- Station-specific elements -->
    
    <button id="backBtn" class="btn">⬅️ Zurück zur vorherigen Station</button>
    <button id="continueBtn{N}" class="btn" disabled>➡️ Weiter zu Station {N+1}</button>
</div>
```

### Station Init Function Pattern
Note: Replace `{N}` with actual numbers (e.g., `initStation2()` for station2.html)

```javascript
function initStation{N}() {
    const backBtn = document.getElementById('backBtn');
    const continueBtn = document.getElementById('continueBtn{N}');
    
    // Station-specific logic
    
    backBtn.addEventListener('click', () => {
        loadStation({N-1});
    });
    
    continueBtn.addEventListener('click', () => {
        sessionStorage.setItem('station{N}Completed', 'true');
        loadStation({N+1});
    });
}
```

## Important Constraints

- **No external dependencies**: Keep the project dependency-free
- **No build process**: All code must run directly in the browser
- **Preserve personalization**: This is a birthday gift; maintain the personal touches and references
- **German language**: All content additions should be in German
- **Dark theme**: Never introduce light theme elements
- **Session storage only**: Don't implement server-side storage or cookies

## File Structure

```
Birthday-Quest/
├── index.html           # Main entry point with styles
├── CNAME               # GitHub Pages domain configuration
├── station2.html       # Legacy file (kept for compatibility)
├── js/
│   └── quest.js        # Main quest logic and station management
└── stations/
    ├── station1.html   # Start/countdown page
    ├── station2.html   # First challenge
    ├── station3.html   # Second challenge
    ├── station4.html   # Third challenge
    └── station5.html   # Fourth challenge
```

## Pull Request Guidelines

- Keep changes minimal and focused
- Test all changes manually in a browser
- Preserve the existing visual design and theme
- Ensure backward compatibility with saved progress
- Update this file if adding new patterns or conventions
