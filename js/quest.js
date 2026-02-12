// Quest Management System
// Verwaltet alle Stationen und den Fortschritt

const UNLOCK_DATE = new Date(2026, 1, 11, 18, 30, 0); // 2026-02-11 18:30:00

// Aktueller Quest-Zustand
let currentStation = 0;

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    // Lade gespeicherten Fortschritt
    const savedStation = sessionStorage.getItem('currentStation');
    if (savedStation) {
        currentStation = parseInt(savedStation);
    }
    
    loadStation(currentStation);
});

// Station laden
async function loadStation(stationNumber) {
    const content = document.getElementById('content');
    
    // Prüfe ob Station 0 freigeschaltet ist
    if (stationNumber === 0) {
        const now = new Date();
        const isUnlocked = now >= UNLOCK_DATE;
        
        try {
            const response = await fetch(`./stations/station${stationNumber}.html`);
            const html = await response.text();
            content.innerHTML = html;
            
            // Station 0 spezifische Logik
            if (stationNumber === 0) {
                initStation0(isUnlocked);
            }
        } catch (error) {
            content.innerHTML = '<h1>❌ Fehler beim Laden</h1><p>Station konnte nicht geladen werden.</p>';
        }
    } else {
        // Andere Stationen nur laden wenn vorherige abgeschlossen
        const completed = sessionStorage.getItem(`station${stationNumber - 1}Completed`);
        if (completed === 'true') {
            try {
                const response = await fetch(`./stations/station${stationNumber}.html`);
                const html = await response.text();
                content.innerHTML = html;
                
                if (stationNumber === 1) {
                    initStation1();
                } else if (stationNumber === 2) {
                    initStation2();
                } else if (stationNumber === 3) {
                    initStation3();
                } else if (stationNumber === 4) {
                    initStation4();
                }
            } catch (error) {
                content.innerHTML = '<h1>❌ Fehler</h1><p>Diese Station existiert noch nicht.</p>';
            }
        } else {
            content.innerHTML = '<h1>🔒 Nicht freigeschaltet</h1><p>Du musst erst die vorherige Station abschließen.</p>';
        }
    }
    
    currentStation = stationNumber;
    sessionStorage.setItem('currentStation', stationNumber);
}

// Station 0: Countdown-Timer
function initStation0(isUnlocked) {
    const before = document.getElementById('beforeUnlock');
    const after = document.getElementById('afterUnlock');
    const countdown = document.getElementById('countdown');
    const startBtn = document.getElementById('startBtn');
    
    function pad(n) { return n.toString().padStart(2, "0"); }
    
    function updateTimer() {
        const now = new Date();
        const diff = UNLOCK_DATE - now;
        
        if (diff <= 0) {
            if (before) before.classList.add('hidden');
            if (after) after.classList.remove('hidden');
            return true;
        }
        
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');
        
        if (hEl && mEl && sEl) {
            hEl.textContent = pad(hours);
            mEl.textContent = pad(minutes);
            sEl.textContent = pad(seconds);
        } else if (countdown) {
            countdown.textContent = `Noch ${hours}h ${pad(minutes)}m ${pad(seconds)}s bis zur Aktivierung...`;
        }
        
        return false;
    }
    
    if (isUnlocked || updateTimer()) {
        if (before) before.classList.add('hidden');
        if (after) after.classList.remove('hidden');
    } else {
        setInterval(updateTimer, 1000);
    }
    
    // Start-Button Event
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('station0Completed', 'true');
            loadStation(1);
        });
    }
}

// Station 1: Rätsel
function initStation1() {
    const validAnswers = new Set([
        "löwe", "loewe", "lion", "gryffindor",
        "rabe", "raven", "ravenclaw"
    ]);
    
    const form = document.getElementById('riddleForm');
    const answerInput = document.getElementById('answer');
    const feedback = document.getElementById('feedback');
    const backBtn = document.getElementById('backBtn');
    const continueBtn = document.getElementById('continueBtn1');
    
    function normalize(s) {
        return s
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[ -]/g, "");
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = normalize(answerInput.value);
        
        if (!val) {
            feedback.className = 'error';
            feedback.textContent = "Bitte gib eine Antwort ein.";
            return;
        }
        
        if (validAnswers.has(val)) {
            feedback.className = 'success';
            feedback.textContent = "Richtig! ✨ Super! Weiter zur nächsten Station...";
            sessionStorage.setItem('station1Completed', 'true');
            
            // Enable continue button
            if (continueBtn) {
                continueBtn.disabled = false;
            }
        } else {
            feedback.className = 'error';
            const snark = [
                "Fast! Aber die Katze schüttelt nur den Kopf.",
                "Nope – die sprechende Mütze kichert leise.",
                "Nicht ganz. Die Eulen tuscheln schon … versuch's nochmal!"
            ];
            feedback.textContent = snark[Math.floor(Math.random() * snark.length)];
        }
    });
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(0);
        });
    }
    
    if (continueBtn) {
        // Check if station is already completed
        const completed = sessionStorage.getItem('station1Completed');
        if (completed === 'true') {
            continueBtn.disabled = false;
        }
        
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(2);
        });
    }
}

// Station 2: Nonogram
function initStation2() {
    const continueBtn = document.getElementById('continueBtn2');
    const backBtn = document.getElementById('backBtn2');
    const resetBtn = document.getElementById('resetBtn');
    const feedback = document.getElementById('nonogram-feedback');
    
    // Heart pattern (11x11 grid)
    // 1 = filled, 0 = empty
    const solution = [
        [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    ];
    
    // Calculate row and column clues
    function calculateClues(grid) {
        const rows = grid.length;
        const cols = grid[0].length;
        const rowClues = [];
        const colClues = [];
        
        // Row clues
        for (let r = 0; r < rows; r++) {
            const clue = [];
            let count = 0;
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] === 1) {
                    count++;
                } else if (count > 0) {
                    clue.push(count);
                    count = 0;
                }
            }
            if (count > 0) clue.push(count);
            rowClues.push(clue.length > 0 ? clue : [0]);
        }
        
        // Column clues
        for (let c = 0; c < cols; c++) {
            const clue = [];
            let count = 0;
            for (let r = 0; r < rows; r++) {
                if (grid[r][c] === 1) {
                    count++;
                } else if (count > 0) {
                    clue.push(count);
                    count = 0;
                }
            }
            if (count > 0) clue.push(count);
            colClues.push(clue.length > 0 ? clue : [0]);
        }
        
        return { rowClues, colClues };
    }
    
    const { rowClues, colClues } = calculateClues(solution);
    const rows = solution.length;
    const cols = solution[0].length;
    let userGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
    let puzzleSolved = false;
    let isDragging = false;
    let dragFillValue = null;
    
    // Create the grid
    function createGrid() {
        const container = document.getElementById('nonogram-grid');
        container.innerHTML = '';
        
        const table = document.createElement('table');
        table.style.margin = '20px auto';
        table.style.borderCollapse = 'collapse';
        table.style.background = '#f5f5f5';
        
        // Header row with column clues
        const headerRow = document.createElement('tr');
        const cornerCell = document.createElement('td');
        cornerCell.style.background = '#2b2b3d';
        cornerCell.style.border = '1px solid #666';
        headerRow.appendChild(cornerCell);
        
        for (let c = 0; c < cols; c++) {
            const th = document.createElement('td');
            th.textContent = colClues[c].join(' ');
            th.style.padding = '8px';
            th.style.textAlign = 'center';
            th.style.fontWeight = 'bold';
            th.style.background = '#2b2b3d';
            th.style.color = '#d4c5ff';
            th.style.border = '1px solid #666';
            th.style.minWidth = '40px';
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);
        
        // Grid rows
        for (let r = 0; r < rows; r++) {
            const tr = document.createElement('tr');
            
            // Row clue
            const rowClueCell = document.createElement('td');
            rowClueCell.textContent = rowClues[r].join(' ');
            rowClueCell.style.padding = '8px';
            rowClueCell.style.textAlign = 'right';
            rowClueCell.style.fontWeight = 'bold';
            rowClueCell.style.background = '#2b2b3d';
            rowClueCell.style.color = '#d4c5ff';
            rowClueCell.style.border = '1px solid #666';
            rowClueCell.style.minWidth = '60px';
            tr.appendChild(rowClueCell);
            
            // Grid cells
            for (let c = 0; c < cols; c++) {
                const td = document.createElement('td');
                td.style.width = '40px';
                td.style.height = '40px';
                td.style.border = '1px solid #666';
                td.style.cursor = 'pointer';
                td.style.transition = 'background 0.2s';
                td.dataset.row = r;
                td.dataset.col = c;
                
                updateCellStyle(td, r, c);
                
                // Mousedown to toggle cell or start dragging
                td.addEventListener('mousedown', (e) => {
                    if (puzzleSolved) return;
                    e.preventDefault();
                    isDragging = true;
                    dragFillValue = userGrid[r][c] === 1 ? 0 : 1;
                    userGrid[r][c] = dragFillValue;
                    updateCellStyle(td, r, c);
                });
                
                // Drag to fill multiple cells
                td.addEventListener('mouseenter', () => {
                    if (puzzleSolved) return;
                    if (isDragging && dragFillValue !== null) {
                        userGrid[r][c] = dragFillValue;
                        updateCellStyle(td, r, c);
                    }
                });
                
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        
        container.appendChild(table);
    }
    
    function updateCellStyle(cell, r, c) {
        if (userGrid[r][c] === 1) {
            // Filled cell - black during solving, red when solved
            cell.style.background = puzzleSolved ? '#ff4d4d' : '#000000';
            cell.textContent = '';
        } else {
            // Empty cell - white background
            cell.style.background = '#ffffff';
            cell.textContent = '';
        }
    }
    
    function checkSolution() {
        let correct = true;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (userGrid[r][c] !== solution[r][c]) {
                    correct = false;
                    break;
                }
            }
            if (!correct) break;
        }
        
        if (correct) {
            puzzleSolved = true;
            // Update all cells to show red color
            const cells = document.querySelectorAll('#nonogram-grid td[data-row]');
            cells.forEach(cell => {
                const r = parseInt(cell.dataset.row);
                const c = parseInt(cell.dataset.col);
                updateCellStyle(cell, r, c);
                // Remove cursor pointer style for locked cells
                cell.style.cursor = 'default';
            });
            feedback.className = 'success';
            feedback.textContent = '❤️ Perfekt! Du hast das Herz enthüllt! Weiter zur nächsten Station...';
            sessionStorage.setItem('station2Completed', 'true');
            if (continueBtn) {
                continueBtn.disabled = false;
            }
        } else {
            feedback.className = '';
            feedback.textContent = '';
        }
    }
    
    function resetGrid() {
        userGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
        puzzleSolved = false;
        createGrid();
        feedback.className = '';
        feedback.textContent = '';
        // Don't disable the continue button if station is already completed
        const completed = sessionStorage.getItem('station2Completed');
        if (continueBtn && completed !== 'true') {
            continueBtn.disabled = true;
        }
    }
    
    // Initialize
    createGrid();
    
    // Add global mouseup listener to stop dragging and check solution
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dragFillValue = null;
            checkSolution();
        }
    });
    
    // Check if already completed
    const completed = sessionStorage.getItem('station2Completed');
    if (completed === 'true') {
        // Restore solution
        puzzleSolved = true;
        userGrid = solution.map(row => [...row]);
        createGrid();
        feedback.className = 'success';
        feedback.textContent = '❤️ Perfekt! Du hast das Herz enthüllt! Weiter zur nächsten Station...';
        if (continueBtn) {
            continueBtn.disabled = false;
        }
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetGrid();
        });
    }
    
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(3);
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(1);
        });
    }
}

// Station 3: Platzhalter
function initStation3() {
    const continueBtn = document.getElementById('continueBtn3');
    const backBtn = document.getElementById('backBtn3');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('station3Completed', 'true');
            loadStation(4);
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(2);
        });
    }
}

// Station 4: Platzhalter
function initStation4() {
    const backBtn = document.getElementById('backBtn4');
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(3);
        });
    }
}

// Global verfügbar machen für inline onclick falls nötig
window.loadStation = loadStation;