// Quest Management System
// Verwaltet alle Stationen und den Fortschritt

const UNLOCK_DATE = new Date(2026, 1, 9, 18, 46, 0);

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
            before.classList.add('hidden');
            after.classList.remove('hidden');
            return true;
        }
        
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        countdown.textContent = `Noch ${hours}h ${pad(minutes)}m ${pad(seconds)}s bis zur Aktivierung...`;
        return false;
    }
    
    if (isUnlocked || updateTimer()) {
        before.classList.add('hidden');
        after.classList.remove('hidden');
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
    
    function normalize(s) {
        return s
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
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
            feedback.textContent = "Richtig! ✨ Super! Weitere Stationen folgen bald...";
            sessionStorage.setItem('station2Completed', 'true');
            
            // Hier später: loadStation(3); wenn Station 3 existiert
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
}

// Global verfügbar machen für inline onclick falls nötig
window.loadStation = loadStation;