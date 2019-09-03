/*____________________________________________________________________________
// Global Defenitions //
____________________________________________________________________________*/
let turn = 1; let cell_val;
let players = ["cell_1-1", "cell_10-10"];
let blockers = []; let weapons = [];
let firstPlayer, secondPlayer;
let w1, w2, w3, w4, w5, w6, w7;
let fightStatus = 0;
let possibleCellID;
let lower = [];

/*____________________________________________________________________________
// players class and Definitions //
____________________________________________________________________________*/
class player {
    constructor(name, spriteClass, position, turn, power, defaultWeaponName, weapon, attackValue) {
        this.name = name;
        this.spriteClass = spriteClass;
        this.position = position;
        this.turn = turn;
        this.power = power;
        this.defaultWeaponName = defaultWeaponName;
        this.weapon = weapon;
        this.attackValue = attackValue;
    }
    // put players into first positions
    playerPosition(){
        let playerCell = $('#' + this.position);
        playerCell.addClass('sprite ' + this.spriteClass);
    };
    // change the player positon when moving
    changePosition(newPosition){
        $('#' + this.position).removeClass('sprite ' + this.spriteClass);
        $('#' + newPosition).addClass('sprite ' + this.spriteClass);
        this.position = newPosition;
    };
    // add the default weapon to the player board
    defaultWeapon(){
        $('#' + this.name + '_weapon').attr('src', 'img/weapons/' + this.weapon +'.png');
        $('#' + this.name +'AttackValue').html("Attack Value = 10");
    };
    // announce the winner
    winner(){
        $('#turtle_btns').css('display', "none");
        $('#whale_btns').css('display', "none");
        $('.wpn').css('display', 'none');
        $('#' + this.name).append("<h1 class='winner'>WINNER</h1>");
    }
}


/*____________________________________________________________________________
// Grid and grid cells related functions //
____________________________________________________________________________*/
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

// function to create the grid
function createGrid() {
    for (let i = 1; i <= 100; i++) {
        cell_val = cellPosition(i);
        let gridCell = "<div class='grid-cell' id='cell_" + cell_val + "'></div>";
        $('#game-grid').append(gridCell);
    }
}

// function to generate random location
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
// Weapons-related Definitions and Functions //
____________________________________________________________________________*/
class weapon {
    constructor(name, weaponClass, position, damageValue){
        this.name = name;
        this.weaponClass = weaponClass;
        this.position = position;
        this.damageValue= damageValue;
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
            $('#' + idPosition).addClass('weapon w' + [i]);
        }
    }
}

// function to Add weapom image and attack value to player board
function collectedWeapon(player, weapon_num){
    player.weapon = weapon_num;
    $('.'+weapon_num).removeClass(weapon_num);
    player.attackValue = eval(weapon_num).damageValue;
    $('#' + player.name +'AttackValue').html("Attack Value = "+ player.attackValue);
    $('#' + player.name + '_weapon').attr('src', 'img/weapons/' + weapon_num +'.png');
}

// function to Drop current weapon and collecting new weapon
function dropingWeapon(player, position, new_weapon){
    $('#' + player.position).addClass('weapon ' + player.weapon);
    player.changePosition(position);
    let newWeapon = collectedWeapon(player, new_weapon);
    player.weapon = new_weapon;
}


/*____________________________________________________________________________
// Game-related Actions functions  //
____________________________________________________________________________*/
//mini functions to minimize main functions of the game
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

// construct id from x and y points
function id_value(x, y){
    return "cell_" + x.toString() + '-' + y.toString();
}

// function to check if the grid cell contains any blocker
function isblocker(i){
    return $('#' + possibleCellID).hasClass('blocker') ||  $('#' + possibleCellID).hasClass('sprite') || (i < 1) || (i > 10);
}

// function to add possible cell class to positions lower current position
function lowerLoop(){
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
            } else if(x_new < x){
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
    lowerLoop();

    //Vertical possible cells
    for(y_new; y_new <= y + 3; y_new++){
        possibleCellID = id_value(x, y_new);
        if(isblocker(y_new)){
            if(y_new == y){
                continue;
            } else if(y_new < y){
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
    lowerLoop();
}

// function to activating movements or fight functions on turn
function moveOrFight() {
    $('.grid-cell').unbind('click');
    if(fightStatus == 0){
        if(turn == 1){
            movements(firstPlayer);
        }else if(turn == 2){
            movements(secondPlayer);
        }
    }else{
        fight();
    }
    changeTurn();
}

// On Click action to move player
function registerListner(cells, player){
    cells.bind("click", function(){
        $('.grid-cell').removeClass('possible-cell');
        updatedPosition = $(this).attr('id');
        player.changePosition(updatedPosition);
        // take weapon
        if(weapons.indexOf(updatedPosition) > -1){
            let weapon_class = ($(this).attr('class').split(' ').splice(2, 1)).toString();
            dropingWeapon(player, player.position, weapon_class);
        }
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
                fightStatus = 1;
                changeTurn();
        }
        moveOrFight();
    });
}

// movements function
function movements(player){
    possibleSide(player);
    let possibleCell = $('.possible-cell');
    registerListner(possibleCell, player);
}

// function to execute the attack and defend buttons
function attack(player1, player2){
    $('#' + player2.name + '_attack').unbind("click");
    $('#' + player2.name + '_defend').unbind("click");
    // show and hide attack buttons
    $('#' + player1.name + '_btns').css('display', 'block');
    $('#' + player2.name + '_btns').css('display', 'none');
    // reset attack value
    player2.attackValue = eval(player2.weapon).damageValue;
    // attack button
    $('#' + player1.name + '_attack').bind("click", function(){
        let curr_val = $('#' + player2.name + '_power').val();
        let new_val = Number(curr_val) - player1.attackValue;
        $('#' + player2.name + '_power').val(new_val);
        player1.power = new_val;
        $('#'+ player2.name + '_progress_value').html(new_val + '%');
        moveOrFight();
    });
    // defend button
    $('#' + player1.name + '_defend').bind("click", function(){
        player2.attackValue = player2.attackValue / 2;
        moveOrFight();
    });
    // end game condition
    if(player2.power <= 0){
        player2.winner();
    }
}

// function to execute attack and switch turns for players to fight
function fight(){
    if (turn == 1) {
        attack(firstPlayer, secondPlayer);
    }else if (turn == 2) {
        attack(secondPlayer, firstPlayer);
    }
}

// all functions needs to be loaded when start game to clicked
$('#start_button').click(function(){
    $( "#start" ).replaceWith("");
    createGrid();
    weaponsPositions();
    blockersPositions();

    firstPlayer = new player("turtle", "first-sprite", "cell_1-1", '1', 100, 'straw', 'w6', 10);
    secondPlayer = new player("whale", "second-sprite", "cell_10-10", '2', 100, 'cap', 'w7', 10);
    firstPlayer.playerPosition();
    secondPlayer.playerPosition();
    firstPlayer.defaultWeapon();
    secondPlayer.defaultWeapon();

    w1 = new weapon('bag', 'w1', weapons[1], 15);
    w2 = new weapon('oil', 'w2', weapons[2], 35);
    w3 = new weapon('bottle', 'w3', weapons[3], 25);
    w4 = new weapon('cup', 'w4', weapons[4], 20);
    w5 = new weapon('garbage', 'w5', weapons[5], 30);
    w6 = new weapon('p1w', 'w5', weapons[6], 10);
    w7 = new weapon('p2w', 'w7', weapons[7], 10);

    moveOrFight();
});
