// Quest Management System
// Verwaltet alle Stationen und den Fortschritt

const UNLOCK_DATE = new Date(2026, 1, 11, 18, 30, 0); // 2026-02-11 18:30:00

// Aktueller Quest-Zustand
let currentStation = 1;

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
    
    // Prüfe ob Station 1 freigeschaltet ist
    if (stationNumber === 1) {
        const now = new Date();
        const isUnlocked = now >= UNLOCK_DATE;
        
        try {
            const response = await fetch(`./stations/station${stationNumber}.html`);
            const html = await response.text();
            content.innerHTML = html;
            
            // Station 1 spezifische Logik
            if (stationNumber === 1) {
                initStation1(isUnlocked);
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
                
                if (stationNumber === 2) {
                    initStation2();
                } else if (stationNumber === 3) {
                    initStation3();
                } else if (stationNumber === 4) {
                    initStation4();
                } else if (stationNumber === 5) {
                    initStation5();
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

// Station 1: Countdown-Timer
function initStation1(isUnlocked) {
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
            sessionStorage.setItem('station1Completed', 'true');
            loadStation(2);
        });
    }
}

// Station 2: Rätsel
function initStation2() {
    const validAnswers = new Set([
        "löwe", "loewe", "lion", "gryffindor",
        "rabe", "raven", "ravenclaw"
    ]);
    
    const form = document.getElementById('riddleForm');
    const answerInput = document.getElementById('answer');
    const feedback = document.getElementById('feedback');
    const backBtn = document.getElementById('backBtn');
    const continueBtn = document.getElementById('continueBtn2');
    
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
            sessionStorage.setItem('station2Completed', 'true');
            
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
            loadStation(1);
        });
    }
    
    if (continueBtn) {
        // Check if station is already completed
        const completed = sessionStorage.getItem('station2Completed');
        if (completed === 'true') {
            continueBtn.disabled = false;
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
    const continueBtn = document.getElementById('continueBtn4');
    const backBtn = document.getElementById('backBtn4');
    
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

// Station 5: Platzhalter
function initStation5() {
    const backBtn = document.getElementById('backBtn5');
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadStation(4);
        });
    }
}

// Global verfügbar machen für inline onclick falls nötig
window.loadStation = loadStation;