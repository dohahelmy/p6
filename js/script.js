/*____________________________________________________________________________
Defenitions
____________________________________________________________________________*/
// Global Definitions
let turn = 1; let cell_val;
let players = ["cell_1-1", "cell_10-10"];
let blockers = []; let weapons = [];
let firstPlayer; let secondPlayer;

// let weapon_class;

// players class and Definitions
class player {
    constructor(name, spriteClass, position, turn, power) {
        this.name = name;
        this.spriteClass = spriteClass;
        this.position = position;
        this.turn = turn;
        this.power = power;
        this.attackValue = 10;
        this.weapon = null;
        console.log(this.weapon);
     }
    playerPosition() {
        let playerCell = $('#' + this.position);
        playerCell.addClass('sprite ' + this.spriteClass);
    };
    changePosition(newPosition){
        $('#' + this.position).removeClass('sprite ' + this.spriteClass);
        $('#' + newPosition).addClass('sprite ' + this.spriteClass);
        this.position = newPosition;
    };
    winner(){
        $('#turtle_btns').css('display', "none");
        $('#whale_btns').css('display', "none");
        $(this).append("<h1 class='winner'>WINNER</h1>");
    }
}


/*____________________________________________________________________________
Mini functions
____________________________________________________________________________*/
// function to check if the value is existed in the array
/*function isInArray(value, array) {
    return array.indexOf(value) > -1;
}*/

/*____________________________________________________________________________
Grid creating and Grid-cells position assign and extraction
____________________________________________________________________________*/
// function to create the grid
function createGrid() {
    for (let i = 1; i <= 100; i++) {
        cell_val = cellPosition(i);
        let gridCell = "<div class='grid-cell' id='cell_" + cell_val + "'></div>";
        $('#game-grid').append(gridCell);
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
    //to identify the position of the last cell (10th) on grid
    else if(gridCol == 0){
        gridCol = 10;
    }
    return gridCol + "-" + gridRow;
}

// generate random location
function randomLocation (){
    let randomPosition = Math.floor((Math.random() * 100) + 1);
    cell_val = cellPosition(randomPosition);
    let cell_id = 'cell_' + cell_val;
    return cell_id;
}

// function to extract x and y values of a position
function xy_extract(position){
    let dash = position.indexOf("-");
    let x_value = parseInt(position.substring(5, dash), 10);
    let y_value = parseInt(position.substring(dash + 1, position.length), 10);
    return [x_value, y_value];
}


/*____________________________________________________________________________
// Blockers functions //
____________________________________________________________________________*/
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
            $('#' + idPosition).addClass('blocker');
        }
    }
}


/*____________________________________________________________________________
// Weapons-related functions //
____________________________________________________________________________*/
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
            $('#' + idPosition).addClass('weapon w' + [i]);
        }
    }
}

// Adding weapom image to player board
function collectedWeapon(player, weapon_num){
    player.weapon = weapon_num;
    $('.'+weapon_num).removeClass(weapon_num);
    return $('#' + player.name + '_weapon').attr('src', 'img/weapons/' + weapon_num +'.png');

}

// Droping current weapon and collecting new weapon

function dropingWeapon(player, position, new_weapon){
    $('#' + player.position).addClass('weapon ' + player.weapon);
    player.changePosition(position);
    let newWeapon = collectedWeapon(player, new_weapon);
    player.weapon = new_weapon;
}


/*____________________________________________________________________________
// Game-related Actions functions  //
____________________________________________________________________________*/
// function to switching turns using a bullet on board
function changeTurn(){
    if (turn == 1){
        $('#whale_on').css('background-color', '#d5d5d5');
        $('#turtle_on').css('background-color', '#5eb80b');
        turn = 2;
    }
    else if (turn == 2) {
        $('#turtle_on').css('background-color', '#d5d5d5');
        $('#whale_on').css('background-color', '#5eb80b');
        turn = 1;
    }
}

// activating movements functions on turn
function turnOnMovement() {
    $('.grid-cell').unbind('click');
    if (turn == 1){
        movements(firstPlayer);
        changeTurn();
    }
    else if (turn == 2) {
        movements(secondPlayer);
        changeTurn();
    }
}


function id_value(x, y){
    return "cell_" + x.toString() + '-' + y.toString();
}


let possibleCellID;
let lower = [];
// Mostafa edits
function isblocker(i){
    return $('#' + possibleCellID).hasClass('blocker') ||  $('#' + possibleCellID).hasClass('sprite') || (i < 1) || (i > 10);
}

function lowerForLoop(){
    for(let i = 0; i < lower.length; i++){
        $('#' + lower[i]).addClass('possible-cell');
    }
    lower = [];
}

// function to get possible cells to move player in a new position
function possibleSide(player){
    let x = xy_extract(player.position)[0];
    let y = xy_extract(player.position)[1];
    let x_new = x - 3;
    let y_new = y - 3;

    // Horizontal possible cells
    for(x_new; x_new <= x + 3; x_new++){
        possibleCellID = id_value(x_new, y);
        if(isblocker(x_new)){
            if(x_new == x){
                continue;
            }
            if(x_new < x){
                lower = [];
            } else{
                break;
            }
        }else {
            if(x_new < x){
                lower.push(possibleCellID);
            }else {
                $('#' + possibleCellID).addClass('possible-cell');
            }
        }
    }
    lowerForLoop();

    //Vertical possible cells
    for(y_new; y_new <= y + 3; y_new++){
        possibleCellID = id_value(x, y_new);
        if(isblocker(y_new)){
            if(y_new == y){
                continue;
            }
            if(y_new < y){
                lower = [];
            } else{
                break;
            }
        }else {
            if(y_new < y){
                lower.push(possibleCellID);
            }else {
                $('#' + possibleCellID).addClass('possible-cell');
            }
        }
    }
    lowerForLoop();
}

// On Click action to move player
function registerListner(cells,player){
    cells.bind("click", function(){
        $('.grid-cell').removeClass('possible-cell');
        updatedPosition = $(this).attr('id');
        player.changePosition(updatedPosition);
        // take weapon
        if(weapons.indexOf(updatedPosition) > -1){
            let weapon_class = ($(this).attr('class').split(' ').splice(2, 1)).toString();
            if(player.weapon == null){
                collectedWeapon(player, weapon_class);
            }else {
                dropingWeapon(player, player.position, weapon_class);
            }
        }
        // player.replaceWeapon(weapon_class);
        console.log(turn);
        // fight activation state
        let p1_xy = xy_extract(firstPlayer.position);
        let p2_xy = xy_extract(secondPlayer.position);
        let x_diff = p1_xy[0] - p2_xy[0];
        let y_diff = p1_xy[1] - p2_xy[1];
        if(
            (x_diff == -1 && y_diff == 0) ||
            (x_diff == 1 && y_diff == 0) ||
            (x_diff == 0 && y_diff == -1) ||
            (x_diff == 0 && y_diff == 1)){
                fight();
                console.log(turn);
                return;
        } else{
            if (turn == 1){
                turn = 2;
            }
            else if (turn == 2) {
                turn = 1;
            }
            changeTurn();
            turnOnMovement();
        }
    });
}

// movements function
function movements(player){
    possibleSide(player);
    let possibleCell = $('.possible-cell');
    registerListner(possibleCell, player);
}

function fightBtns(player1, player2){
    $('#' + player1 + '_btns').css('display', 'block');
    $('#' + player2 + '_btns').css('display', 'none');
}


function fight(){
    // $('.grid-cell').unbind('click');
    if (firstPlayer.power <= 0 || secondPlayer.power <= 0) {
        alert('Game Over');
    }else {
        if (turn == 1) {
            $('#whale_attack').unbind("click");
            $('#whale_defend').unbind("click");
            fightBtns(firstPlayer.name, secondPlayer.name);
            firstPlayer.attackValue = 10;
            $('#turtle_attack').bind("click", function(){
                let curr_val = $('#whale_power').val();
                let new_val = Number(curr_val) - secondPlayer.attackValue;
                $('#whale_power').val(new_val);
                firstPlayer.power = new_val;
            });
            $('#turtle_defend').bind("click", function(){
                firstPlayer.attackValue = 5;
            });
            turn = 2;
            changeTurn();
        }else if (turn == 2) {
            $('#turtle_attack').unbind("click");
            $('#turtle_defend').unbind("click");
            fightBtns(secondPlayer.name, firstPlayer.name);
            secondPlayer.attackValue = 10;
            $('#whale_attack').bind("click", function(){
                let curr_val = $('#turtle_power').val();
                let new_val = Number(curr_val) - firstPlayer.attackValue;
                $('#turtle_power').val(new_val);
                secondPlayer.power = new_val;
            });
            $('#whale_defend').bind("click", function(){
                secondPlayer.attackValue = 5;
            });
            turn = 1;
            changeTurn();
        }
    }
}


// all functions needs to be loaded with page
$('#start_button').click(function(){
    $( "#start" ).replaceWith("");
    createGrid();
    weaponsPositions();
    blockersPositions();
    firstPlayer = new player("turtle", "first-sprite", "cell_1-1", '1', 100);
    secondPlayer = new player("whale", "second-sprite", "cell_10-10", '2', 100);
    firstPlayer.playerPosition();
    secondPlayer.playerPosition();
    turnOnMovement();
});
