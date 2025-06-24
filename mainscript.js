let colorOptions = ["#fffb00aa", "#19fff4aa", "#003cd5aa", "#a000d5aa", "#ff1fd6aa"];
const container = document.getElementById('container');
const addUserButton = document.getElementById('addUser');

// Stopwatch variables
let stopwatchRunning = false;
let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0;
let stopwatchInterval = null;
const stopwatchDisplay = document.getElementById('stopwatch');

// Initialize stopwatch as paused
stopwatchDisplay.classList.add('paused');

// Stopwatch functionality
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStopwatch() {
    if (stopwatchRunning) {
        const currentTime = Date.now();
        const totalElapsed = stopwatchElapsedTime + (currentTime - stopwatchStartTime);
        stopwatchDisplay.textContent = formatTime(totalElapsed);
    }
}

function toggleStopwatch() {
    if (stopwatchRunning) {
        // Pause stopwatch
        stopwatchElapsedTime += Date.now() - stopwatchStartTime;
        stopwatchRunning = false;
        clearInterval(stopwatchInterval);
        stopwatchDisplay.classList.add('paused');
    } else {        // Start stopwatch
        stopwatchStartTime = Date.now();
        stopwatchRunning = true;
        stopwatchInterval = setInterval(updateStopwatch, 1000);
        stopwatchDisplay.classList.remove('paused');
    }
}

// Add click event to stopwatch
stopwatchDisplay.addEventListener('click', toggleStopwatch);

// Function to update total counter
function updateTotalCounter() {
    const counters = document.querySelectorAll('.counter');
    let total = 0;
    counters.forEach(counter => {
        total += parseInt(counter.textContent, 10) || 0;
    });

    // Update total display
    const existingNumber = document.getElementById('total');
    if (existingNumber) {
        existingNumber.innerHTML = total;
    } else {
        const totalNumber = document.createElement('p');
        totalNumber.className = 'total';
        totalNumber.innerHTML = total;
        stopwatchDisplay.appendChild(totalNumber);
    }
}

function loadConfig() {
    const params = new URLSearchParams(window.location.search);
    const urlnames = params.get('names');
    const urlcolors = params.get('colors');
    if (!urlnames || !urlcolors) {
        window.location.href = "/"
    };
    const names = urlnames.split(";");
    const colors = urlcolors.split(";");
    container.innerHTML = ''; names.forEach((name, index) => {
        createUser(name, colors[index]);
    });

    updateTotalCounter();
}

function createUser(name = '', colorIndex = 0) {
    const userDiv = document.createElement('div');
    userDiv.className = 'user';
    userDiv.style.background = colorOptions[colorIndex % colorOptions.length];

    // Subtle name at the top
    const nameP = document.createElement('p');
    nameP.className = 'user-name';
    nameP.textContent = name;
    userDiv.appendChild(nameP);

    // Large counter in the center
    const counter = document.createElement('div');
    counter.className = 'counter';
    counter.textContent = '0';
    userDiv.appendChild(counter);

    // + button below the counter
    const plusBtn = document.createElement('button');
    plusBtn.className = 'increment-btn';
    plusBtn.textContent = '+';
    plusBtn.onclick = () => {
        let val = parseInt(counter.textContent, 10) || 0;
        counter.textContent = val + 1;
        updateTotalCounter(); // Update total counter on increment
    };
    userDiv.appendChild(plusBtn);

    container.appendChild(userDiv);
}

// Remove addUser button and editing
addUserButton.style.display = 'none';

// Enable SortableJS for the container
if (window.userSortable) window.userSortable.destroy();
window.userSortable = Sortable.create(container, {
    animation: 180, // Use SortableJS built-in animation
    ghostClass: 'sortable-ghost',
    setOption: true,
    onStart: function (evt) {
        evt.item.classList.add('moving');
    },
    onEnd: function (evt) {
        evt.item.classList.remove('moving');
    }
});

// Load data from URL
loadConfig();

// Initialize total counter display
updateTotalCounter();