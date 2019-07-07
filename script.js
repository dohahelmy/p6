// Definitions
let gridVal;
let players = ["cell-1,1", "cell-12,12"];
let turn = 1;
let blockers = [];
let weapons = [];


// players class and Definitions
class player {
    constructor(name, imgColor, position) {
        this.name = name;
        this.imgColor = imgColor;
        this.position = position;
    }
    playerPosition() {
        let playerCell = document.getElementById(this.position);
        playerCell.innerHTML = "<div id='" + this.name + "' class='sprite'></div>";
        let backgroundImageChange = "url('" + this.imgColor + "')";
        document.getElementById(this.name).style.backgroundImage = backgroundImageChange;
    };
}

// players Definitions
let firstPlayer = new player("player1", "ninja-red.png", "cell-3,1");
let secondPlayer = new player("player2", "ninja-blue.png", "cell-12,12");


// function to create the grid
function createGrid() {
    let grid = document.getElementById('game-grid');
    for (let i = 1; i <= 144; i++) {
        gridval = cellPosition(i);
        let gridCell = "<div class='grid-cell' id='cell-" + gridval + "'></div>";
        grid.innerHTML += gridCell;
    }
}

// function to identify the position of the gridCell
function cellPosition(i){
    // to identify column number
    let gridCol = i % 12;
    //to identify row number
    let gridRow = Math.floor(i / 12);
    if(gridCol > 0){
        gridRow = gridRow + 1;
    }
    //to identify the position of the last cell (12th) on grid
    else if(gridCol == 0){
        gridCol = 12;
    }
    return [gridCol, gridRow];
}

// generate random location
function randomLocation (){
    let randomPosition = Math.floor((Math.random() * 144) + 1);
    gridval = cellPosition(randomPosition);
    let cell_id = 'cell-' + gridval;
    return cell_id;
}

// function to check if the value is existed in the array
/*function isInArray(value, array) {
  return array.indexOf(value) > -1;
}*/

// blocker random locations load
function blockersPositions(){
    for (let i = 0; i < 15; i++) {
        let idPosition = randomLocation();
        // check id retunred if reserved or not
        if(blockers.indexOf(idPosition) > -1 || weapons.indexOf(idPosition) > -1 || players.indexOf(idPosition) > -1){
            i--;
        } else{
            // assign checked values
            blockers[i] = idPosition;
            // console.log(blockers);
            let locationValue = document.getElementById(idPosition);
            locationValue.innerHTML = "<div class='blocker'></div>";
        }
    }
}
// weapons random locations load
function weaponsPositions(){
    for (let i = 0; i < 4; i++) {
        let idPosition = randomLocation();
        // check id retunred if reserved or not
        if(blockers.indexOf(idPosition) > -1 || weapons.indexOf(idPosition) > -1 || players.indexOf(idPosition) > -1){
            i--;
        } else {
            // assign checked values
            weapons[i] = idPosition;
            let locationValue = document.getElementById(idPosition);
            locationValue.innerHTML = "<div class='weapon weaponA'></div>";
        }
    }
}

// function to start game and switching turns
function startGame() {
    if (turn == 1){
        let p1 = firstPlayer.position;
        // console.log(p1);
        firstPlayer.position = movements(p1);
        // console.log(firstPlayer.position);
        turn == 2;
    }
    else if (turn == 2) {
        let p2 = secondPlayer.position;
        // console.log(p2);
        secondPlayer.position = movements(p2);
        // console.log(secondPlayer.position);
        turn == 1;
    }
}

// movements function
function movements(position){
    // extracting x and y values for movements
    let currentPosition = position;
    let commaPosition = currentPosition.indexOf(",");
    let x_value = parseInt(currentPosition.substring(5, commaPosition), 10);
    let y_value = parseInt(currentPosition.substring(commaPosition + 1, currentPosition.length), 10);
    let x_new = x_value;
    let y_new = y_value;
    let updatedPosition;
    let steps = 0;

    document.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            // left arrow
            case 37:
                if(x_new == 1 || steps >= 3){
                    alert("unaccepted move");

                }else {
                    x_new--;
                    steps++;
                }
                break;
            // up arrow
            case 38:
                if(y_new == 1 || steps >= 3){
                    alert("unaccepted move");
                }
                else {
                    y_new--;
                    steps++;
                }
                break;
            // right arrow
            case 39:
                if(x_new == 12 || steps >= 3){
                    alert("unaccepted move");
                }else {
                    x_new++;
                    steps++;
                }
                break;
            // down arrow
            case 40:
                if(y_new == 12 || steps >= 3){
                    alert("unaccepted move");
                }else {
                    y_new++;
                    steps++;
                }
                break;
        }
        updatedPosition = "cell-" + x_new +","+ y_new;
        console.log(updatedPosition);
        return updatedPosition;
    });
}

// all functions needs to be loaded with page
function onceLoaded(){
    createGrid();
    weaponsPositions();
    blockersPositions();
    firstPlayer.playerPosition();
    secondPlayer.playerPosition();
    startGame();
}
