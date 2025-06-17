let startTime, updatedTime, difference = 0, tInterval;
let running = false;
let isCountdown = false;
const countdownTime = 60000; // 1 minute default
const display = document.getElementById('display');
const lapsContainer = document.getElementById('laps');

const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const darkModeToggle = document.getElementById('darkModeToggle');
const countdownToggle = document.getElementById('countdownToggle');

// Format time to hh:mm:ss.ms
function formatTime(diff) {
  let hours = Math.floor(diff / 3600000);
  let minutes = Math.floor((diff % 3600000) / 60000);
  let seconds = Math.floor((diff % 60000) / 1000);
  let milliseconds = diff % 1000;

  return (
    (hours < 10 ? "0" + hours : hours) + ":" +
    (minutes < 10 ? "0" + minutes : minutes) + ":" +
    (seconds < 10 ? "0" + seconds : seconds) + "." +
    (milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds)
  );
}

// Update display every 10ms
function updateTime() {
  updatedTime = new Date().getTime();
  difference = isCountdown
    ? countdownTime - (updatedTime - startTime)
    : updatedTime - startTime;

  if (difference <= 0 && isCountdown) {
    difference = 0;
    pauseTimer();
  }

  display.textContent = formatTime(difference);
}

function startTimer() {
  startTime = new Date().getTime() - (isCountdown ? (countdownTime - difference) : difference);
  tInterval = setInterval(updateTime, 10);
  running = true;
  startStopBtn.textContent = 'Pause';
}

function pauseTimer() {
  clearInterval(tInterval);
  running = false;
  startStopBtn.textContent = 'Start';
}

function resetTimer() {
  clearInterval(tInterval);
  running = false;
  difference = isCountdown ? countdownTime : 0;
  display.textContent = formatTime(difference);
  startStopBtn.textContent = 'Start';
  lapsContainer.innerHTML = '';
  localStorage.removeItem('laps');
}

function recordLap() {
  if (running) {
    const lapTime = display.textContent;
    const li = document.createElement('li');
    li.textContent = lapTime;
    lapsContainer.appendChild(li);

    const storedLaps = JSON.parse(localStorage.getItem('laps')) || [];
    storedLaps.push(lapTime);
    localStorage.setItem('laps', JSON.stringify(storedLaps));
  }
}

// Dark Mode
darkModeToggle.addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
});

// Countdown Toggle
countdownToggle.addEventListener('change', function () {
  isCountdown = this.checked;
  resetTimer();
});

// Load laps from localStorage on page load
window.addEventListener('load', () => {
  const storedLaps = JSON.parse(localStorage.getItem('laps')) || [];
  storedLaps.forEach(time => {
    const li = document.createElement('li');
    li.textContent = time;
    lapsContainer.appendChild(li);
  });

  // Restore dark mode if already enabled
  if (localStorage.getItem('darkMode') === 'true') {
    darkModeToggle.checked = true;
    document.body.classList.add('dark');
  }
});

// Event Listeners
startStopBtn.addEventListener('click', () => running ? pauseTimer() : startTimer());
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
