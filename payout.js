const pointsDisplay = document.getElementById('pointsDisplay');
const cashButton = document.getElementById('cougarButton');
var buttons = document.querySelectorAll('.redeemButton');
var cougarCash = 0; 
var points = 0;


const cashDisplay = document.getElementById('cashDisplay');

function updateCougarCash() {
    localStorage.setItem('cougarCash', cougarCash);
    cashDisplay.textContent = String(cougarCash);
}


function getPoints() {
    try {
        cash = localStorage.getItem('cougarCash');
        if (cash == 'NaN') {
            cougarCash = 0;
            localStorage.setItem('cougarCash', cougarCash);
        }
        else {
            cougarCash = parseInt(cash);
        }
    } catch (error) {
        points = 0;
        localStorage.setItem('cougarCash', points);
    }
   
    cashDisplay.textContent = String( cougarCash);
}

cashButton.addEventListener('click', function() {
    if (points >= 5) {
        points -= 5;
        cougarCash += 5; // Update cougarCash variable
        updateCougarCash();
        updatePoints();
    } else {
        alert("You don't have enough points!");
    }
     // Update local storage variable
});


buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        console.log("points: " + points);
        if (points >= 5) {
            points -= 5;
            updatePoints();
        }
    });
});


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
   
    pointsDisplay.textContent = String( points);
    getCash();
    
}

function updatePoints() {
    console.log("updating points"  );
    localStorage.setItem('points', points);
    pointsDisplay.textContent = String(points);
}


window.addEventListener('load', getPoints);

