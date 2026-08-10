// Timer Function (পরে কুইজ পেজে ব্যবহার হবে)
function startTimer(seconds, displayElement, onTimeout) {
    let remaining = seconds;
    const timer = setInterval(() => {
        remaining--;
        displayElement.textContent = remaining;
        if (remaining <= 10) {
            displayElement.classList.add('timer-warning');
        }
        if (remaining <= 0) {
            clearInterval(timer);
            if (onTimeout) onTimeout();
        }
    }, 1000);
}

// Tab Switch Detection
let tabSwitchCount = 0;
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        tabSwitchCount++;
        document.getElementById('tab_switch_count').value = tabSwitchCount;
    }
});