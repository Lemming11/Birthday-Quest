// Quest Management System
// Verwaltet alle Stationen und den Fortschritt

const UNLOCK_DATE = new Date(2026, 1, 17, 0, 0, 0); // Datum

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
                } else if (stationNumber === 5) {
                    initStation5();
                } else if (stationNumber === 6) {
                    initStation6();
                } else if (stationNumber === 7) {
                    initStation7();
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

// Station 1: Der sprechende Hut
function initStation1() {
    const correctHouse = 'ravenclaw';
    const COOLDOWN_SECONDS = 10;
    let cooldownActive = false;
    let countdownInterval = null;
    
    const form = document.getElementById('houseForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('feedback');
    const hintSection = document.getElementById('hintSection');
    const backBtn = document.getElementById('backBtn');
    const continueBtn = document.getElementById('continueBtn1');
    
    const funnyMessages = [
        "🎭 Der Hut runzelt die Stirn... 'Nein, nein, das passt nicht. Versuch es nochmal!'",
        "🧙 'Hmm, ich glaube, du hast nicht gut zugehört. Weisheit und Wissen, erinnerst du dich?'",
        "📚 Der Hut seufzt dramatisch: 'Das ist nicht das Haus für jemanden mit so viel Verstand!'",
        "🦉 'Falsch! Die Eulen würden dich dort niemals akzeptieren. Versuch's nochmal!'",
        "✨ 'Nope! Der Hut schüttelt sich. Das Haus der Weisen ruft nach dir... aber das war's nicht!'"
    ];
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (cooldownActive) {
            return;
        }
        
        const selectedHouse = document.querySelector('input[name="house"]:checked');
        
        if (!selectedHouse) {
            feedback.className = 'error';
            feedback.textContent = "Bitte wähle ein Haus aus!";
            return;
        }
        
        if (selectedHouse.value === correctHouse) {
            // Clear any existing countdown
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            
            feedback.className = 'success';
            feedback.textContent = "🎉 Ravenclaw! Perfekt! Der Hut ruft: 'Ja, genau dort gehörst du hin – ins Haus der Weisen und Wissenden!'";
            sessionStorage.setItem('station1Completed', 'true');
            
            // Show hint section
            if (hintSection) {
                hintSection.classList.remove('hidden');
            }
            
            // Enable continue button
            if (continueBtn) {
                continueBtn.disabled = false;
            }
            
            // Disable form
            submitBtn.disabled = true;
            const radioButtons = document.querySelectorAll('input[name="house"]');
            radioButtons.forEach(radio => radio.disabled = true);
        } else {
            // Wrong answer - activate cooldown
            cooldownActive = true;
            const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
            
            feedback.className = 'error';
            feedback.textContent = `${randomMessage}\n\n⏳ Du musst ${COOLDOWN_SECONDS} Sekunden warten, bevor du es erneut versuchen kannst...`;
            
            // Disable submit button
            submitBtn.disabled = true;
            
            let timeLeft = COOLDOWN_SECONDS;
            countdownInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft > 0) {
                    feedback.textContent = `${randomMessage}\n\n⏳ Noch ${timeLeft} Sekunden warten...`;
                } else {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                    cooldownActive = false;
                    submitBtn.disabled = false;
                    feedback.textContent = "Du kannst es jetzt erneut versuchen!";
                    feedback.className = '';
                }
            }, 1000);
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
            if (hintSection) {
                hintSection.classList.remove('hidden');
            }
        }
        
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(2);
        });
    }
}

// Station 2: Der Zaubertrank
function initStation2() {
    const correctAnswers = ['alraune', 'alraunen']; // Singular und Plural
    const COOLDOWN_SECONDS = 10;
    let cooldownActive = false;
    let countdownInterval = null;
    
    const form = document.getElementById('potionForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('feedback');
    const ingredientInput = document.getElementById('ingredientInput');
    const hintSection = document.getElementById('hintSection');
    const backBtn = document.getElementById('backBtn2');
    const continueBtn = document.getElementById('continueBtn2');
    
    const funnyMessages = [
        "🌿 'Petersilie? Ernsthaft? Das ist ein Küchenkraut, kein magischer Trank-Bestandteil!'",
        "🍄 'Nein, nein, nein! Diese Pflanze würde den Trank eher explodieren lassen als wiederbeleben!'",
        "🧙 Der Buchgeist seufzt: 'Hast du überhaupt das Bild angeschaut? Versuch es nochmal!'",
        "📖 'Falsch! Tipp: Die gesuchte Pflanze hat einen ziemlich... schreienden Ruf.'",
        "⚗️ 'Das kann nicht sein! Schau dir das Foto nochmal genau an. Du warst doch schon dort!'"
    ];
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (cooldownActive) {
            return;
        }
        
        const userAnswer = ingredientInput.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        if (!userAnswer) {
            feedback.className = 'error';
            feedback.textContent = "Bitte gib eine Antwort ein!";
            return;
        }
        
        // Prüfe ob die Antwort korrekt ist
        if (correctAnswers.includes(userAnswer)) {
            // Clear any existing countdown
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            
            feedback.className = 'success';
            feedback.textContent = "🎉 Richtig! Die Alraune! Ihre Wurzel ist tatsächlich die Hauptzutat für den Wiederbelebungstrank. Du notierst dir das Rezept sorgfältig – man weiß ja nie, wann man es brauchen könnte...";
            sessionStorage.setItem('station2Completed', 'true');
            
            // Show hint section
            if (hintSection) {
                hintSection.classList.remove('hidden');
            }
            
            // Enable continue button
            if (continueBtn) {
                continueBtn.disabled = false;
            }
            
            // Disable form
            submitBtn.disabled = true;
            ingredientInput.disabled = true;
        } else {
            // Wrong answer - activate cooldown
            cooldownActive = true;
            const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
            
            feedback.className = 'error';
            feedback.innerHTML = `${randomMessage}<br><br>⏳ Du musst ${COOLDOWN_SECONDS} Sekunden warten, bevor du es erneut versuchen kannst...`;
            
            // Disable submit button
            submitBtn.disabled = true;
            
            let timeLeft = COOLDOWN_SECONDS;
            countdownInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft > 0) {
                    feedback.innerHTML = `${randomMessage}<br><br>⏳ Noch ${timeLeft} Sekunden warten...`;
                } else {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                    cooldownActive = false;
                    submitBtn.disabled = false;
                    feedback.textContent = "Du kannst es jetzt erneut versuchen!";
                    feedback.className = '';
                }
            }, 1000);
        }
    });
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(1);
        });
    }
    
    if (continueBtn) {
        // Check if station is already completed
        const completed = sessionStorage.getItem('station2Completed');
        if (completed === 'true') {
            continueBtn.disabled = false;
            if (hintSection) {
                hintSection.classList.remove('hidden');
            }
        }
        
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(3);
        });
    }
}

// Station 3: Platzhalter
function initStation3() {
    const continueBtn = document.getElementById('continueBtn3');
    const backBtn = document.getElementById('backBtn3');
    const hintSection = document.getElementById('hintSection');
    
    // Check if station is already completed
    const completed = sessionStorage.getItem('station3Completed');
    if (completed === 'true') {
        // Show all challenges as completed
        document.getElementById('challenge1')?.classList.remove('hidden');
        document.getElementById('challenge2')?.classList.remove('hidden');
        document.getElementById('challenge3')?.classList.remove('hidden');
        document.getElementById('successMessage')?.classList.remove('hidden');
        if (hintSection) {
            hintSection.classList.remove('hidden');
        }
        if (continueBtn) {
            continueBtn.disabled = false;
        }
        // Disable all roll buttons when already completed
        const rollButtons = [
            document.getElementById('rollStealth'),
            document.getElementById('rollInitiative'),
            document.getElementById('rollStrength')
        ];
        rollButtons.forEach(btn => {
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }
        });
    }
    
    // D&D Challenge state
    let stealthPassed = false;
    let initiativePassed = false;
    let strengthPassed = false;
    
    // Dice roll function (W20)
    function rollD20() {
        return Math.floor(Math.random() * 20) + 1;
    }
    
    // Challenge 1: Stealth Check
    const rollStealthBtn = document.getElementById('rollStealth');
    if (rollStealthBtn) {
        rollStealthBtn.addEventListener('click', () => {
            const roll = rollD20();
            const resultDiv = document.getElementById('stealthResult');
            
            // Animate dice
            rollStealthBtn.innerHTML = '<span class="dice-animation">🎲</span> Würfeln (W20)';
            setTimeout(() => {
                rollStealthBtn.innerHTML = '🎲 Würfeln (W20)';
            }, 500);
            
            if (roll >= 12) {
                resultDiv.innerHTML = `<span class="success">✅ Du hast eine <strong>${roll}</strong> gewürfelt! Du schleichst erfolgreich vorbei.</span>`;
                stealthPassed = true;
                rollStealthBtn.disabled = true;
                rollStealthBtn.style.opacity = '0.5';
                rollStealthBtn.style.cursor = 'not-allowed';
                
                // Show next challenge
                setTimeout(() => {
                    document.getElementById('challenge2')?.classList.remove('hidden');
                }, 1000);
            } else {
                resultDiv.innerHTML = `<span class="error">❌ Du hast nur eine <strong>${roll}</strong> gewürfelt (benötigt: 12+). Versuche es nochmal!</span>`;
            }
        });
    }
    
    // Challenge 2: Initiative Check
    const rollInitiativeBtn = document.getElementById('rollInitiative');
    if (rollInitiativeBtn) {
        rollInitiativeBtn.addEventListener('click', () => {
            const roll = rollD20();
            const resultDiv = document.getElementById('initiativeResult');
            
            // Animate dice
            rollInitiativeBtn.innerHTML = '<span class="dice-animation">🎲</span> Würfeln (W20)';
            setTimeout(() => {
                rollInitiativeBtn.innerHTML = '🎲 Würfeln (W20)';
            }, 500);
            
            if (roll >= 10) {
                resultDiv.innerHTML = `<span class="success">✅ Du hast eine <strong>${roll}</strong> gewürfelt! Du bist schneller als der Wächter.</span>`;
                initiativePassed = true;
                rollInitiativeBtn.disabled = true;
                rollInitiativeBtn.style.opacity = '0.5';
                rollInitiativeBtn.style.cursor = 'not-allowed';
                
                // Show next challenge
                setTimeout(() => {
                    document.getElementById('challenge3')?.classList.remove('hidden');
                }, 1000);
            } else {
                resultDiv.innerHTML = `<span class="error">❌ Du hast nur eine <strong>${roll}</strong> gewürfelt (benötigt: 10+). Versuche es nochmal!</span>`;
            }
        });
    }
    
    // Challenge 3: Strength Check
    const rollStrengthBtn = document.getElementById('rollStrength');
    if (rollStrengthBtn) {
        rollStrengthBtn.addEventListener('click', () => {
            const roll = rollD20();
            const resultDiv = document.getElementById('strengthResult');
            
            // Animate dice
            rollStrengthBtn.innerHTML = '<span class="dice-animation">🎲</span> Würfeln (W20)';
            setTimeout(() => {
                rollStrengthBtn.innerHTML = '🎲 Würfeln (W20)';
            }, 500);
            
            if (roll >= 8) {
                resultDiv.innerHTML = `<span class="success">✅ Du hast eine <strong>${roll}</strong> gewürfelt! Du hebst den Schatz erfolgreich.</span>`;
                strengthPassed = true;
                rollStrengthBtn.disabled = true;
                rollStrengthBtn.style.opacity = '0.5';
                rollStrengthBtn.style.cursor = 'not-allowed';
                
                // All challenges completed!
                setTimeout(() => {
                    document.getElementById('successMessage')?.classList.remove('hidden');
                    if (hintSection) {
                        hintSection.classList.remove('hidden');
                    }
                    if (continueBtn) {
                        continueBtn.disabled = false;
                    }
                    // Mark station as completed when all challenges are done
                    sessionStorage.setItem('station3Completed', 'true');
                }, 1000);
            } else {
                resultDiv.innerHTML = `<span class="error">❌ Du hast nur eine <strong>${roll}</strong> gewürfelt (benötigt: 8+). Versuche es nochmal!</span>`;
            }
        });
    }
    
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

// Station 4: Die Grüne Drachenschenke (Vegan Tavern)
function initStation4() {
    const continueBtn = document.getElementById('continueBtn4');
    const backBtn = document.getElementById('backBtn4');
    const menuForm = document.getElementById('menuForm');
    const menuInput = document.getElementById('menuInput');
    const submitBtn = document.getElementById('submitBtn4');
    const feedback = document.getElementById('feedback4');
    const hintSection = document.getElementById('hintSection4');
    
    // Check if station is already completed
    if (sessionStorage.getItem('station4Completed') === 'true') {
        if (continueBtn) continueBtn.disabled = false;
        if (hintSection) hintSection.classList.remove('hidden');
    }
    
    if (menuForm) {
        menuForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const answer = menuInput.value.trim().toLowerCase();
            
            // Correct answer is "1" (first position on the menu)
            // Accept various formats: "1", "eins", "erste", etc.
            const isCorrect = answer === '1' || 
                            answer === '1.' ||
                            answer === 'eins' ||
                            answer === 'erste' ||
                            answer === 'erster' ||
                            answer === 'der erste' ||
                            /^(platz|nummer|position)\s*1\.?$/.test(answer);
            
            if (isCorrect) {
                feedback.innerHTML = `<span class="success">✅ Richtig! Die „Erbsen-Minz-Suppe der Erholung" steht an <strong>erster Stelle</strong> auf der Speisekarte. Die Wirtin serviert dir eine dampfende Schüssel – köstlich und stärkend!</span>`;
                feedback.className = 'success';
                
                // Show hint section after a brief delay
                setTimeout(() => {
                    if (hintSection) {
                        hintSection.classList.remove('hidden');
                    }
                    if (continueBtn) {
                        continueBtn.disabled = false;
                    }
                    // Mark station as completed
                    sessionStorage.setItem('station4Completed', 'true');
                }, 800);
            } else {
                feedback.innerHTML = `<span class="error">❌ Hmm, das scheint nicht zu stimmen. Die Wirtin schüttelt den Kopf. Lies das Rätsel nochmal genau – die Antwort ist eine <strong>Zahl</strong>!</span>`;
                feedback.className = 'error';
            }
        });
    }
    
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('station4Completed', 'true');
            loadStation(5);
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(3);
        });
    }
}

// Station 5: Nonogram
function initStation5() {
    const continueBtn = document.getElementById('continueBtn5');
    const backBtn = document.getElementById('backBtn5');
    const resetBtn = document.getElementById('resetBtn5');
    const feedback = document.getElementById('nonogram-feedback');
    const hintSection = document.getElementById('hintSection5');
    
    // Heart pattern (9x9 grid)
    // 1 = filled, 0 = empty
    const solution = [
        [0, 1, 1, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
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
        
        // Calculate responsive cell size based on viewport
        const viewportWidth = window.innerWidth;
        const cardPadding = 32; // Approximate padding from .card (16px each side)
        const availableWidth = Math.min(viewportWidth - cardPadding, 600); // Max 600px for larger screens
        
        // Calculate cell size to fit the grid
        // Formula: (availableWidth - rowClueWidth - borders) / cols
        const rowClueWidth = viewportWidth < 400 ? 30 : 40;
        const borderSpace = (cols + 2) * 2; // Approximate border space
        const cellSize = Math.floor((availableWidth - rowClueWidth - borderSpace) / cols);
        const actualCellSize = Math.max(20, Math.min(cellSize, 30)); // Between 20px and 30px
        
        const table = document.createElement('table');
        table.style.margin = '20px auto';
        table.style.borderCollapse = 'collapse';
        table.style.background = '#f5f5f5';
        table.style.maxWidth = '100%';
        table.style.width = 'auto';
        
        // Header row with column clues
        const headerRow = document.createElement('tr');
        const cornerCell = document.createElement('td');
        cornerCell.style.background = '#2b2b3d';
        cornerCell.style.border = '1px solid #666';
        headerRow.appendChild(cornerCell);
        
        for (let c = 0; c < cols; c++) {
            const th = document.createElement('td');
            th.textContent = colClues[c].join(' ');
            th.style.padding = '2px';
            th.style.textAlign = 'center';
            th.style.fontWeight = 'bold';
            th.style.background = '#2b2b3d';
            th.style.color = '#d4c5ff';
            th.style.border = '1px solid #666';
            th.style.width = actualCellSize + 'px';
            th.style.fontSize = viewportWidth < 400 ? '0.7em' : '0.8em';
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);
        
        // Grid rows
        for (let r = 0; r < rows; r++) {
            const tr = document.createElement('tr');
            
            // Row clue
            const rowClueCell = document.createElement('td');
            rowClueCell.textContent = rowClues[r].join(' ');
            rowClueCell.style.padding = '2px';
            rowClueCell.style.textAlign = 'right';
            rowClueCell.style.fontWeight = 'bold';
            rowClueCell.style.background = '#2b2b3d';
            rowClueCell.style.color = '#d4c5ff';
            rowClueCell.style.border = '1px solid #666';
            rowClueCell.style.width = rowClueWidth + 'px';
            rowClueCell.style.fontSize = viewportWidth < 400 ? '0.7em' : '0.8em';
            tr.appendChild(rowClueCell);
            
            // Grid cells
            for (let c = 0; c < cols; c++) {
                const td = document.createElement('td');
                td.style.width = actualCellSize + 'px';
                td.style.height = actualCellSize + 'px';
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
                
                // Touch start to toggle cell or start dragging
                td.addEventListener('touchstart', (e) => {
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
            sessionStorage.setItem('station5Completed', 'true');
            
            // Show hint section
            if (hintSection) {
                hintSection.classList.remove('hidden');
            }
            
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
        const completed = sessionStorage.getItem('station5Completed');
        if (continueBtn && completed !== 'true') {
            continueBtn.disabled = true;
        }
        // Hide hint section when resetting
        if (hintSection && completed !== 'true') {
            hintSection.classList.add('hidden');
        }
    }
    
    // Initialize
    createGrid();
    
    // Helper function to get cell from touch coordinates
    function getCellFromTouch(touch) {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.dataset.row !== undefined && element.dataset.col !== undefined) {
            return element;
        }
        return null;
    }
    
    // Add touchmove listener to the nonogram container for dragging across cells
    const nonogramContainer = document.getElementById('nonogram-container');
    if (nonogramContainer) {
        nonogramContainer.addEventListener('touchmove', (e) => {
            if (!isDragging || dragFillValue === null || puzzleSolved) return;
            if (e.touches.length === 0) return; // Safety check for touch events
            
            // Only prevent default if we're actively dragging to avoid blocking page scroll
            const touch = e.touches[0];
            const cell = getCellFromTouch(touch);
            
            if (cell) {
                e.preventDefault(); // Prevent scrolling only when over grid cells
                const r = parseInt(cell.dataset.row);
                const c = parseInt(cell.dataset.col);
                if (userGrid[r][c] !== dragFillValue) {
                    userGrid[r][c] = dragFillValue;
                    updateCellStyle(cell, r, c);
                }
            }
        }, { passive: false });
    }
    
    // Helper function to end dragging and check solution
    function endDragging() {
        if (isDragging) {
            isDragging = false;
            dragFillValue = null;
            checkSolution();
        }
    }
    
    // Add global mouseup and touchend listeners to stop dragging and check solution
    document.addEventListener('mouseup', endDragging);
    document.addEventListener('touchend', endDragging);
    
    // Check if already completed
    const completed = sessionStorage.getItem('station5Completed');
    if (completed === 'true') {
        // Restore solution
        puzzleSolved = true;
        userGrid = solution.map(row => [...row]);
        createGrid();
        feedback.className = 'success';
        feedback.textContent = '❤️ Perfekt! Du hast das Herz enthüllt! Weiter zur nächsten Station...';
        if (hintSection) {
            hintSection.classList.remove('hidden');
        }
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
            loadStation(6);
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(4);
        });
    }
}

// Station 6: Stromberg Quiz
function initStation6() {
    const form = document.getElementById('strombergForm');
    const submitBtn = document.getElementById('submitBtn6');
    const feedback = document.getElementById('feedback6');
    const continueBtn = document.getElementById('continueBtn6');
    const backBtn = document.getElementById('backBtn6');
    const hintSection = document.getElementById('hintSection6');
    const answerOptionsContainer = document.getElementById('answerOptions');
    
    // Define answer options with correct/incorrect flags
    const options = [
        { id: 'blumenladen', text: 'Blumenladen', correct: false },
        { id: 'schadensregulierung', text: 'Schadensregulierung', correct: true },
        { id: 'eiskunstlauf', text: 'Eiskunstlauf', correct: false },
        { id: 'parkplatz', text: 'Parkplatz', correct: true },
        { id: 'ki', text: 'Künstliche Intelligenz', correct: false }
    ];
    
    // Shuffle options randomly
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
    
    // Create checkbox options in random order
    if (answerOptionsContainer) {
        shuffledOptions.forEach(option => {
            const label = document.createElement('label');
            label.style.cssText = 'display: flex; align-items: center; cursor: pointer; padding: 0.4rem;';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'strombergAnswer';
            checkbox.value = option.id;
            checkbox.style.marginRight = '0.8rem';
            
            const span = document.createElement('span');
            span.textContent = option.text;
            
            label.appendChild(checkbox);
            label.appendChild(span);
            answerOptionsContainer.appendChild(label);
        });
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const selectedAnswers = formData.getAll('strombergAnswer');
            
            // Check if at least one answer is selected
            if (selectedAnswers.length === 0) {
                feedback.innerHTML = '❌ Bitte wähle mindestens eine Antwort aus!';
                feedback.className = 'error';
                return;
            }
            
            // Check if exactly the correct answers are selected
            const correctAnswers = options.filter(opt => opt.correct).map(opt => opt.id);
            const isCorrect = selectedAnswers.length === correctAnswers.length &&
                            selectedAnswers.every(answer => correctAnswers.includes(answer));
            
            if (isCorrect) {
                feedback.innerHTML = '🎉 Perfekt! Das Herz leuchtet hell auf – du hast die richtige Antwort gefunden!<br>Du weißt genau, dass Stromberg am besten <strong>zu zweit</strong> geschaut wird. ❤️';
                feedback.className = 'success';
                
                if (hintSection) {
                    hintSection.classList.remove('hidden');
                }
                if (continueBtn) {
                    continueBtn.disabled = false;
                }
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
                
                // Mark station as completed
                sessionStorage.setItem('station6Completed', 'true');
            } else {
                feedback.innerHTML = '❌ Nicht ganz richtig! Erinnere dich an die gemeinsamen Abende mit Stromberg...<br>Versuche es noch einmal!';
                feedback.className = 'error';
            }
        });
    }
    
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(7);
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(5);
        });
    }
}

// Station 7: Abschlussseite
function initStation7() {
    const backBtn = document.getElementById('backBtn7');
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(6);
        });
    }
}

// Global verfügbar machen für inline onclick falls nötig
window.loadStation = loadStation;
