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

// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreen-btn');

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen().then(() => {
            fullscreenBtn.textContent = '⛷'; // Exit fullscreen icon
        }).catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        // Exit fullscreen
        document.exitFullscreen().then(() => {
            fullscreenBtn.textContent = '⛶'; // Enter fullscreen icon
        }).catch(err => {
            console.log('Error attempting to exit fullscreen:', err);
        });
    }
}

// Add click event to fullscreen button
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Listen for fullscreen changes (e.g., when user presses Esc)
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.textContent = '⛶'; // Exit fullscreen icon
    } else {
        fullscreenBtn.textContent = '⛶'; // Enter fullscreen icon
    }
});

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
    updateContainerLayout();
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
    userDiv.appendChild(counter);    // + button below the counter
    const plusBtn = document.createElement('button');
    plusBtn.className = 'increment-btn';
    plusBtn.textContent = '+';
    // Function to handle increment with proper concurrency support
    const incrementCounter = () => {
        // Use atomic operation to prevent race conditions
        let val = parseInt(counter.textContent, 10) || 0;
        counter.textContent = val + 1;
        updateTotalCounter(); // Update total counter on increment
    };

    // Prevent double-firing on devices that support both touch and mouse
    let lastTouchTime = 0;
    let hasTouch = false;

    // Handle touch events for true multitouch support
    plusBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hasTouch = true;
        lastTouchTime = Date.now();

        // Support multiple simultaneous touches
        for (let i = 0; i < e.touches.length; i++) {
            incrementCounter();
        }
    }, { passive: false });

    // Handle click events for mouse/desktop
    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If touch event fired recently, ignore the click to prevent double increment
        if (hasTouch && Date.now() - lastTouchTime < 300) {
            return;
        }

        incrementCounter();
    });

    // Reset touch flag after a delay
    plusBtn.addEventListener('touchend', () => {
        setTimeout(() => {
            hasTouch = false;
        }, 300);
    });

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
    filter: '.increment-btn', // Prevent dragging by the increment button
    preventOnFilter: false, // Allow the button to still function
    onStart: function (evt) {
        evt.item.classList.add('moving');
    },
    onEnd: function (evt) {
        evt.item.classList.remove('moving');
        updateContainerLayout(); // Update layout after drag ends
    }
});

// Function to update container layout based on number of cards
function updateContainerLayout() {
    const users = container.querySelectorAll('.user');
    const userCount = users.length;

    console.log('updateContainerLayout called, userCount:', userCount);

    // Remove any existing layout classes
    container.classList.remove('two-cards');

    // Add appropriate class based on user count
    if (userCount === 2) {
        container.classList.add('two-cards');
        console.log('Added two-cards class');
    }

    console.log('Container classes:', container.className);
}

// Load data from URL
loadConfig();

// Initialize total counter display
updateTotalCounter();

// Initialize container layout with a small delay to ensure DOM is ready
setTimeout(() => {
    updateContainerLayout();
}, 100);