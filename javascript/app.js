// assign variable values (declaration)

var playBtn = document.querySelector('.play-btn');
var page1 = document.querySelector('.page-1');
var page2 = document.querySelector('.page-2');
var page3 = document.querySelector('.page-3');
var fixedBackground = document.querySelector('.fixed-background');
var player1Form = document.querySelector('.player-1-form');
var player2Form = document.querySelector('.player-2-form');
var reviewScreen = document.querySelector('.review-container');
var player1Section = document.querySelector('.player-1-section');
var player2Section = document.querySelector('.player-2-section');
var player1SubmitBtn = document.querySelector('.player-1-submit-btn');
var player1NameInput = document.querySelector('.player-1-name');
var player1Avatars = document.getElementsByName('player1Avatar');
var player2SubmitBtn = document.querySelector('.player-2-submit-btn');
var player2NameInput = document.querySelector('.player-2-name');
var player2Avatars = document.getElementsByName('player2Avatar');

var player1Title = document.querySelector('.player-1-title');
var player2Title = document.querySelector('.player-2-title');
var player1ReviewAvatar = document.querySelector('.player-1-review-avatar');
var player2ReviewAvatar = document.querySelector('.player-2-review-avatar'); 

var startBtn = document.querySelector('.start-btn');
var logScreen = document.querySelector('.game-log');
var player1NameSidePanel = document.querySelector('.player-1-box h3');
var player1AvatarSidePanel = document.querySelector('.player-1-box img');
var player2NameSidePanel = document.querySelector('.player-2-box h3');
var player2AvatarSidePanel = document.querySelector('.player-2-box img');
var player1WinTicker = document.querySelector('.player-1-wins');
var player1DrawTicker = document.querySelector('.player-1-draws');
var player2WinTicker = document.querySelector('.player-2-wins');
var player2DrawTicker = document.querySelector('.player-2-draws');

var rematchBtn = document.querySelector('.rematch-btn');

var topLog = document.querySelector('.game-log p')


var player1 = {
    name: '',
    avatarName: '',
    avatarUrl: '',
    winCount: 0,
    drawCount: 0
}
var player2 = {
    name: '',
    avatarName: '',
    avatarUrl: '',
    winCount: 0,
    drawCount: 0
}

var gamesPlayed = 0;



var allBoxes = document.querySelectorAll('.box');
var turnCount = 0;
var winList = [
    [allBoxes[0],allBoxes[1],allBoxes[2]],
    [allBoxes[3],allBoxes[4],allBoxes[5]],
    [allBoxes[6],allBoxes[7],allBoxes[8]],
    [allBoxes[0],allBoxes[3],allBoxes[6]],
    [allBoxes[1],allBoxes[4],allBoxes[7]],
    [allBoxes[2],allBoxes[5],allBoxes[8]],
    [allBoxes[0],allBoxes[4],allBoxes[8]],
    [allBoxes[2],allBoxes[4],allBoxes[6]]
];

var isGameActive = true;

// page-1 functions

function handlePlayBtn() {
    
    page1.classList.add('hidden');
    page2.classList.remove('hidden');
}

// page-2 functions

    function submitPlayer1Choice() {
        
        player1Section.classList.add('hidden');
        player2Section.classList.remove('hidden');
        if (player1NameInput.value === '') {
            player1.name = 'Anonymous';
        } else {
            player1.name = player1NameInput.value;
        }

        for (var i = 0; i < player1Avatars.length; i++) {
            if (player1Avatars[i].checked === true) {
                player1.avatarName = player1Avatars[i].value;
                player1.avatarUrl = player1Avatars[i].dataset.url;
            }
        }


    }

    function submitPlayer2Choice() {
        
        player2Section.classList.add('hidden');
        

        if (player2NameInput.value === '') {
            player2.name = 'Anonymous';
        } else {
            player2.name = player2NameInput.value;
        }

        for (var i = 0; i < player2Avatars.length; i++) {
            if (player2Avatars[i].checked === true) {
                player2.avatarName = player2Avatars[i].value;
                player2.avatarUrl = player2Avatars[i].dataset.url;
            }
        }

        player1Title.textContent = `Player 1: ${player1.name}`;
        player2Title.textContent = `Player 2: ${player2.name}`;
        player1ReviewAvatar.src = player1.avatarUrl;
        player2ReviewAvatar.src = player2.avatarUrl;
        reviewScreen.classList.remove('hidden');


    }

    function startGame() {
        page2.classList.add('hidden');
        page3.classList.remove('hidden');
        fixedBackground.classList.add('hidden');
        createLog(`game started, ${player1.name} vs ${player2.name}. First turn is ${player1.name}`)
        player1NameSidePanel.textContent = `Player 1: ${player1.name}`;
        player1AvatarSidePanel.src = player1.avatarUrl;
        player2NameSidePanel.textContent = `Player 2: ${player2.name}`;
        player2AvatarSidePanel.src = player2.avatarUrl;
    }
// game-log functions

function createLog(string) {
    var logEntry = document.createElement('p');
    var setDateFormat = new Intl.DateTimeFormat("en" , {
        timeStyle: "medium"
      });
    var timeStamp = setDateFormat.format(Date.now());
    var textNode = document.createTextNode(`- ${timeStamp}: ${string}`);
    logEntry.appendChild(textNode);
    logScreen.insertBefore(logEntry,document.querySelector('.game-log p'));
}



// page-3 (game) functions

function handleBoardClick(event) {
    
    if (isGameActive) {
        if (!alreadyTaken(event.target)) {
            assignPiece(event.target);
            
            
            if (firstPlayerWins()) {
                console.log('player 1 wins')
                isGameActive = false;
                createLog(`${player1.name} wins! Game finished.`);
                player1.winCount += 1;
                player1WinTicker.textContent = player1.winCount;
                gamesPlayed += 1;
            } else if (secondPlayerWins()) {
                console.log('player 2 wins')
                isGameActive = false;
                createLog(`${player2.name} wins! Game finished.`);
                player2.winCount += 1;
                player2WinTicker.textContent = player2.winCount;
                gamesPlayed += 1;
            } else if (isDraw()) {
                console.log('draw');
                isGameActive = false;
                createLog(`A draw! Game finished.`);

                for (var i = 0; i < allBoxes.length; i++) {
                    allBoxes[i].classList.add('draw-highlight');
                }

                player1.drawCount += 1;
                player2.drawCount += 1;
                player1DrawTicker.textContent = player1.drawCount;
                player2DrawTicker.textContent = player2.drawCount;
                gamesPlayed += 1;
            } else {
                if (turnCount % 2 < 1) {
                    createLog(`Square ${event.target.dataset.square} chosen. Your turn ${player2.name}`);
                } else {
                    createLog(`Square ${event.target.dataset.square} chosen. Your turn ${player1.name}`);
                }
            }
        
            turnCount ++

        } else {
            createLog(`Square ${event.target.dataset.square} is already taken. Try again.`)
        }
        
    }
    
    
}

function alreadyTaken(element) {
    if (element.classList.contains('green') || element.classList.contains('red')) {
        return true
    } else {
        return false
    }
}

function assignPiece(element) {
    if (turnCount % 2 < 1) {
        element.classList.add('green');
    } else {
        element.classList.add('red');
    }
}

function firstPlayerWins() {

    for (var i = 0; i < winList.length; i++) {

        if (winList[i][0].classList.contains('green')) {
            
            if (winList[i][1].classList.contains('green')) {
                
                if (winList[i][2].classList.contains('green')) {

                    winList[i][0].classList.add('highlight');
                    winList[i][1].classList.add('highlight');
                    winList[i][2].classList.add('highlight');

                    return true
                }
            }
        }
    }
}

function secondPlayerWins() {

    for (var i = 0; i < winList.length; i++) {

        if (winList[i][0].classList.contains('red')) {
            
            if (winList[i][1].classList.contains('red')) {
                
                if (winList[i][2].classList.contains('red')) {

                    winList[i][0].classList.add('highlight');
                    winList[i][1].classList.add('highlight');
                    winList[i][2].classList.add('highlight');
                    return true
                }
            }
        }
    }
}

function isDraw() {
    var boxTakenCount = 0;

    for (var i = 0; i < allBoxes.length; i++) {
        if (allBoxes[i].classList.contains('red') || allBoxes[i].classList.contains('green')) {
            boxTakenCount ++
        }
    }

    if (boxTakenCount === 9) {
        return true
    } else {
        return false
    }
}

function resetGame() {
    for (var i = 0; i < allBoxes.length; i++) {
        allBoxes[i].classList.remove('green');
        allBoxes[i].classList.remove('red');
        allBoxes[i].classList.remove('highlight');
        allBoxes[i].classList.remove('draw-highlight');
    }

    turnCount = 0;
    createLog(`game reset, ${player1.name} vs ${player2.name}. First turn is ${player1.name}`)

    isGameActive = true;
}


// page-1 listeners

playBtn.addEventListener('click', handlePlayBtn);

// page-2 listeners

player1SubmitBtn.addEventListener('click', submitPlayer1Choice);

player2SubmitBtn.addEventListener('click', submitPlayer2Choice);

startBtn.addEventListener('click', startGame);

// page-3 listeners


rematchBtn.addEventListener('click', resetGame);

for (var i = 0; i < allBoxes.length; i++) {
    allBoxes[i].addEventListener('click', handleBoardClick);
}