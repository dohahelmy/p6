// Definitions
let gridVal;
let players = ["cell-1-1", "cell-10-10"];
let turn = 1;
let blockers = [];
let weapons = [];
let firstPlayer; let secondPlayer;

// players class and Definitions
class player {
    constructor(name, spriteClass, position, turn) {
        this.name = name;
        this.spriteClass = spriteClass;
        this.position = position;
        this.turn = turn;
    }
    playerPosition() {
        let playerCell = $('#' + this.position);
        playerCell.addClass('sprite ' + this.spriteClass);
    };
}

/*
changePosition(newPostion){
    $(palyer.postion).removeClass('playerone');
}
changePosition(newPostion){
    $(palyer.postion).removeClass('playerone');
    changePosition(newPostion){
        $(newPostion).addClass('playerone');
    }
}
*/

// function to create the grid
function createGrid() {
    // document.getElementById
    let grid = $('#game-grid');
    for (let i = 1; i <= 100; i++) {
        gridval = cellPosition(i);
        let gridCell = "<div class='grid-cell' id='cell-" + gridval + "'></div>";
        grid.append(gridCell);
    }
}

// function to identify the position of the gridCell
function cellPosition(i){
    // to identify column number
    let gridCol = i % 10;
    //to identify row number
    let gridRow = Math.floor(i / 10);
    if(gridCol > 0){
        gridRow = gridRow + 1;
    }
    //to identify the position of the last cell (12th) on grid
    else if(gridCol == 0){
        gridCol = 10;
    }
    return gridCol + "-" + gridRow;
}

// generate random location
function randomLocation (){
    let randomPosition = Math.floor((Math.random() * 100) + 1);
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
    for (let i = 0; i < 10; i++) {
        let idPosition = randomLocation();
        // check id retunred if reserved or not
        if(blockers.indexOf(idPosition) > -1 || weapons.indexOf(idPosition) > -1 || players.indexOf(idPosition) > -1){
            i--;
        } else{
            // assign checked values
            blockers[i] = idPosition;
            let locationValue = $('#' + idPosition);
            locationValue.addClass('blocker');
        }
    }
}
// weapons random locations load
function weaponsPositions(){
    for (let i = 1; i < 6; i++) {
        let idPosition = randomLocation();
        // check id retunred if reserved or not
        if(blockers.indexOf(idPosition) > -1 || weapons.indexOf(idPosition) > -1 || players.indexOf(idPosition) > -1){
            i--;
        } else {
            // assign checked values
            weapons[i] = idPosition;
            let locationValue = $('#' + idPosition);            locationValue.addClass('weapon w' + [i]);
        }
    }
}

// function to start game and switching turns
function startGame() {
    if (turn == 1){
        // $('.turn-on').css('background-color', '#5eb80b');
        let p1 = firstPlayer.position;
        console.log(p1);
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
    let dash = position.indexOf("-");
    let x_value = parseInt(position.substring(5, dash), 10);
    console.log(x_value);
    let y_value = parseInt(position.substring(dash + 1, position.length), 10);
    let x_new = x_value;
    let y_new = y_value;
    let updatedPosition;
    let steps = 0;

    $(document).keydown(function (e) {
        switch (e.keyCode) {
            // left arrow
            case 37:
                if (x_new == 1) {
                    alert('unacceptable move');
                }else {
                    x_new--;
                    steps++;
                }
                break;
            // up arrow
            case 38:
                if (y_new == 1) {
                    alert('unacceptable move');
                }else {
                    y_new--;
                    steps++;
                }
                break;
            // right arrow
            case 39:
                if (x_new == 10) {
                    alert('unacceptable move');
                }else {
                    x_new++;
                    steps++;
                }
                break;
            // down arrow
            case 40:
                if (y_new == 10) {
                    alert('unacceptable move');
                }else {
                    y_new++;
                    steps++;
                }
                break;
            default:
            // alert('press arrows');
        }
        updatedPosition = "cell-" + x_new +"-"+ y_new;
        console.log(updatedPosition);
        // return updatedPosition;
    });
    // create change position function instructed by mostafa
    return updatedPosition;
}

// all functions needs to be loaded with page
$(document).ready(function(){
    createGrid();
    weaponsPositions();
    blockersPositions();

    firstPlayer = new player("player1", "first-sprite", "cell-1-1", '1');
    secondPlayer = new player("player2", "second-sprite", "cell-10-10", '2');
    firstPlayer.playerPosition();
    secondPlayer.playerPosition();
    startGame();
});
