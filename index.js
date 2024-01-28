// JavaScript

const pointsDisplay = document.getElementById('points');
//const timeDisplay = document.getElementById('time');
const editButton = document.getElementById('editButton');
const spotBtn = document.getElementById('showSpots');
const messageDisplay = document.getElementById('message');

let points = 0;
let currentTime = new Date();
let alarmTime = null;
let isLocked = false;
let countdown = 0;

function getPoints() {
    try {
        points = localStorage.getItem('points');
        if (points == 'NaN') {
            points = 0;
            localStorage.setItem('points', points);
        }
        else {
            points = parseInt(points);
        }
    } catch (error) {
        points = 0;
        localStorage.setItem('points', points);
    }
   
    pointsDisplay.textContent = String("XP: " + points);

    if (points >= 40) {
        removeDisabled(spotBtn);
        // showTable();
    }
}

function showTable() {
  document.getElementById('lotTable').style.display = 'inline';
}

function updatePoints() {
    localStorage.setItem('points', points);
    
    pointsDisplay.textContent = String("Points: " + points);
    console.log(pointsDisplay.textContent, points);

}

// function updateTime() {
//     const now = new Date();
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const seconds = String(now.getSeconds()).padStart(2, '0');
//     const timeString = `${hours}:${minutes}:${seconds}`;
//     timeDisplay.textContent = timeString;

//     if (isLocked && alarmTime && timeString === alarmTime) {
//         alert('Alarm!');
//     }

//     requestAnimationFrame(updateTime);
// }


const FULL_DASH_ARRAY = 283;
const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;

//All buttons
let startBtn = document.querySelector(".start");
let stopBtn = document.querySelector(".stop");
let resetBtn = document.querySelector(".reset");

//DOM elements
let timer = document.querySelector("#base-timer-path-remaining");
let timeLabel = document.getElementById("base-timer-label");

//Time related vars
let TIME_LIMIT = 30; //in minutes!! but they pass like seconds
let timePassed = -1;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

function reset() {
  clearInterval(timerInterval);
  resetVars();
  startBtn.innerHTML = "Park";
  timer.setAttribute("stroke-dasharray", RESET_DASH_ARRAY);
}

function start(withReset = false) {
  setDisabled(startBtn);
  removeDisabled(stopBtn);
  if (withReset) {
    resetVars();
  }
  startTimer();
}

function stop() {
  setDisabled(stopBtn);
  removeDisabled(startBtn);
//   startBtn.innerHTML = "Continue";
  clearInterval(timerInterval);
  // add points based on time limit
  points += timeLeft + 10;
  let spotmessage = points < 40 ? "" : " Thanks to your diligence, you can now view open spots!"
  if (points >= 40) {
    removeDisabled(spotBtn);
    // showTable();
  }
  messageDisplay.innerHTML = "Thanks for leaving in time! You earned " + String(timeLeft + 10) + " points!" + spotmessage;
  updatePoints();
  reset();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    timeLabel.innerHTML = formatTime(timeLeft);
    setCircleDasharray();

    if (timeLeft === 0) {
      timeIsUp();
    }
  }, 1000);
}

spotBtn.addEventListener("click",function() {
    showTable();

});

window.addEventListener("load", () => {
  timeLabel.innerHTML = formatTime(TIME_LIMIT);
  setDisabled(stopBtn);
  setDisabled(spotBtn);
});

// if points is over 30, we can see where empty spots may be

document.getElementById('showImage').addEventListener('click', function() {
    if (document.getElementById('popup').style.display == 'flex') {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('showImage').textContent  = "Show Map";
    }
    else {
        document.getElementById('popup').style.display = 'flex';}
        document.getElementById('showImage').innerHTML  = "Hide Map";

});

//---------------------------------------------
//HELPER METHODS
//---------------------------------------------
function setDisabled(button) {
  button.setAttribute("disabled", "disabled");
}

function removeDisabled(button) {
  button.removeAttribute("disabled");
}
function timeIsUp() {
  setDisabled(startBtn);
  removeDisabled(stopBtn);
  clearInterval(timerInterval);
  messageDisplay.innerHTML = "You're still parked. No worries, but no points this time!"
    reset();
}

function resetVars() {
  removeDisabled(startBtn);
  setDisabled(stopBtn);
  timePassed = -1;
  timeLeft = TIME_LIMIT;
  timeLabel.innerHTML = formatTime(TIME_LIMIT);
}

function formatTime(time) {
  const hours = Math.floor(time/60);
  let minutes = time % 60;

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  timer.setAttribute("stroke-dasharray", circleDasharray);
}

editButton.addEventListener('click', () => {
    if (isLocked) {
        isLocked = false;
        editButton.textContent = 'Add Time';
    } else {
        const newTime = prompt('Enter an amount of time in HH:MM');
        if (newTime) {
            const [hours, minutes] = newTime.split(':');
            let hr = parseInt(hours);
            let min = parseInt(minutes);
            TIME_LIMIT += hr*60 + min;
            timeLabel.innerHTML = formatTime(TIME_LIMIT);
            //currentTime.setHours(hours);
            //currentTime.setMinutes(minutes);
            //alarmTime = newTime;
            //isLocked = true;
            //editButton.textContent = 'Unlock Time';

            // Calculate the time difference between current time and alarm time
            //const timeDiff = (currentTime.getTime() - new Date().getTime()) / 1000;
            //countdown = Math.ceil(timeDiff);
        }
    }
});

window.addEventListener('load', getPoints);
