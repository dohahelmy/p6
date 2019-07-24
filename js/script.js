// Definitions
let turn = 1; let gridVal;
let players = ["cell_1-1", "cell_10-10"];
let blockers = []; let weapons = [];
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
    changePosition(newPosition){
        $(this.position).removeClass(this.spriteClass);
        $(newPosition).addClass(this.spriteClass);
    };
}

// function to create the grid
function createGrid() {
    // document.getElementById
    let grid = $('#game-grid');
    for (let i = 1; i <= 100; i++) {
        gridval = cellPosition(i);
        let gridCell = "<div class='grid-cell' id='cell_" + gridval + "'></div>";
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
    let cell_id = 'cell_' + gridval;
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
        $('#turtle_on').css('background-color', '#5eb80b');
        $('#whale_on').css('background-color', '#d5d5d5');
        let p = movements(firstPlayer.position);
        firstPlayer.changePosition(p);
        turn = 2;
    }
    else if (turn == 2) {
        $('#whale_on').css('background-color', '#5eb80b');
        $('#turtle_on').css('background-color', '#d5d5d5');
        let p = movements(secondPlayer.position);
        secondPlayer.changePosition(p);
        turn = 1;
    }
}

// function to extract x and y values of a position
function xy_extract(position){
    let dash = position.indexOf("-");
    let x_value = parseInt(position.substring(5, dash), 10);
    let y_value = parseInt(position.substring(dash + 1, position.length), 10);
    return [x_value, y_value];
}

// movements function
function movements(position){
    let x_new = xy_extract(position)[0];
    let y_new = xy_extract(position)[1];
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
            case 32:
                startGame();
            default:
        }
        updatedPosition = "cell_" + x_new.toString(10) +"-"+ y_new.toString(10);
        console.log(updatedPosition);
    });
    return updatedPosition;
}


// fuction to execute attack action
function attack(){
    let p1_xy = xy_extract(firstPlayer.position);
    let p2_xy = xy_extract(secondPlayer.position);
    let x_difference = p1_xy[0] - p2_xy[0];
    let y_difference = p1_xy[1] - p2_xy[1];
    if(
        (x_difference == -1 || x_difference == 1) ||
        (y_difference == -1 || y_difference == 1)){
            $('.attack').css('display', 'block');
            if(turn == 1){
                $('#turtle_attack').click(function(){
                    $('#whale_power').value -= 10;
                });
                $('#turtle_defend').click(function(){
                    $('#turtle_power').value -= 5;
                });
                if($('#turtle_power').value == 100){
                    alert('Game over');
                }
            }else if(turn == 2){
                $('#whale_attack').click(function(){
                    $('#turtle_power').value -= 10;
                });
                $('#whale_defend').click(function(){
                    $('#whale_power').value -= 5;
                });
                if($('#whale_power').value == 100){
                    alert('Game over');
                }
            }
    }
}

// all functions needs to be loaded with page
$('#start_button').click(function(){
    $( "#start" ).replaceWith( "" );
    createGrid();
    weaponsPositions();
    blockersPositions();
    firstPlayer = new player("player1", "first-sprite", "cell_1-1", '1');
    secondPlayer = new player("player2", "second-sprite", "cell_10-10", '2');
    firstPlayer.playerPosition();
    secondPlayer.playerPosition();
    startGame();
});
