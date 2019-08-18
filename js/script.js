// Definitions
let turn = 1; let gridVal;
let players = ["cell_1-1", "cell_10-10"];
let blockers = []; let weapons = [];
let firstPlayer; let secondPlayer;
let weapon_class;
// players class and Definitions
class player {
    constructor(name, spriteClass, position, turn) {
        this.name = name;
        this.spriteClass = spriteClass;
        this.position = position;
        this.turn = turn;
        this.attackValue = 10;
        this.weapon;
    }
    playerPosition() {
        let playerCell = $('#' + this.position);
        playerCell.addClass('sprite ' + this.spriteClass);
    };
    changePosition(newPosition){
        $('#' + this.position).removeClass(this.spriteClass);
        $('#' + newPosition).addClass('sprite ' + this.spriteClass);
        this.position = newPosition;
        console.log(this.name + ": " + this.position);
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
    //to identify the position of the last cell (10th) on grid
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
        $('#whale_on').css('background-color', '#d5d5d5');
        $('#turtle_on').css('background-color', '#5eb80b');
        let p = movements(firstPlayer);
        turn = 2;
    }
    else if (turn == 2) {
        $('#turtle_on').css('background-color', '#d5d5d5');
        $('#whale_on').css('background-color', '#5eb80b');
        let p = movements(secondPlayer);
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

function id_value(x, y){
    return "cell_" + x.toString(10) + '-' + y.toString(10);
}
// movements function
function movements(player){
    let x_new = xy_extract(player.position)[0];
    let y_new = xy_extract(player.position)[1];
    let updatedPosition;
    let possibleCellID;
    let move = true;

    // if(move == false){
    //
    // }
    // possible cells horizontally
    for(let i = x_new + 1; i <= x_new + 3; i++){
        possibleCellID = id_value(i, y_new);
        if($('#' + possibleCellID).hasClass('blocker')){
            break;
        } else if($('#' + possibleCellID).hasClass('sprite')){
            break;
        } else if(i>10){
            break;
        }else{
            $('#' + possibleCellID).addClass('possible-cell');
        }

    }
    for(let i = x_new - 1; i >= x_new - 3; i--){
        possibleCellID = id_value(i, y_new);
        if($('#' + possibleCellID).hasClass('blocker')){
            break;
        } else if($('#' + possibleCellID).hasClass('sprite')){
            break;
        } else if(i<1){
            break;
        }else{
            $('#' + possibleCellID).addClass('possible-cell');
        }
    }

    // possible cells vertically
    for(let i = y_new + 1; i <= y_new + 3; i++){
        possibleCellID = id_value(x_new, i);
        if($('#' + possibleCellID).hasClass('blocker')){
            break;
        } else if($('#' + possibleCellID).hasClass('sprite')){
            break;
        }else if(i>10){
            break;
        } else{
            $('#' + possibleCellID).addClass('possible-cell');
        }
    }
    for(let i = y_new - 1; i >= y_new - 3; i--){
        possibleCellID = id_value(x_new, i);
        if($('#' + possibleCellID).hasClass('blocker')){
            break;
        } else if($('#' + possibleCellID).hasClass('sprite')){
            break;
        } else if(i<1){
            break;
        }else{
            $('#' + possibleCellID).addClass('possible-cell');
        }
    }

    let possibleCell = $('.possible-cell');
    // possibleCell.hover(function(){
    //     $(this).css('background-color', '#5eb80b');
    //     $(this).css('cursor', 'pointer');
    // }, function(){
    //     $(this).css('background-color', '');
    // });

    possibleCell.click( function(){
        $('.grid-cell').removeClass('possible-cell');
        updatedPosition = $(this).attr('id');
        player.changePosition(updatedPosition);
        // take weapon
        if(weapons.indexOf(updatedPosition) > -1){
            weapon_class = $(this).attr('class').split(' ').splice(2, 1);
            $(this).removeClass(weapon_class + ' weapon');
            switch (weapon_class[0]) {
                case 'w1':
                $('#' + player.name + '_weapon').attr('src', 'img/weapons/w-bag.png');
                break;
                case "w2":
                $('#' + player.name + '_weapon').attr('src', 'img/weapons/w-oil.png');
                break;
                case 'w3':
                $('#' + player.name + '_weapon').attr('src', 'img/weapons/w-bottle.png');
                break;
                case 'w4':
                $('#' + player.name + '_weapon').attr('src', 'img/weapons/w-cup.png');
                break;
                case 'w5':
                $('#' + player.name + '_weapon').attr('src', 'img/weapons/w-garbage.png');
                break;
                default:
            }
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
                fight();
            }
        startGame();
    });
}

// fuction to execute attack action
function fight(){
    if(turn == 1){
        $('#turtle_btns').css('display', 'block');
        $('#whale_btns').css('display', 'none');
        if($('#turtle_power').val()  <= 0){
            alert('Game over');
        }else {
            firstPlayer.attackValue = 10;
            $('#turtle_attack').click(function(){
                var curr_val = $('#whale_power').val();
                var new_val = Number(curr_val) - secondPlayer.attackValue;
                $('#whale_power').val(new_val);
            });
            $('#turtle_defend').click(function(){
                firstPlayer.attackValue = 5;
            });
        }
    }else if(turn == 2){
        $('#whale_btns').css('display', 'block');
        $('#turtle_btns').css('display', 'none');
        if($('#whale_power').val() <= 0){
            alert('Game over');
        }else {
            secondPlayer.attackValue = 10;
            $('#whale_attack').click(function(){
                var curr_val = $('#turtle_power').val();
                var new_val = Number(curr_val) - firstPlayer.attackValue;
                $('#turtle_power').val(new_val);
            });
            $('#whale_defend').click(function(){
                secondPlayer.attackValue = 5;
            });
        }
    }
}

// all functions needs to be loaded with page
$('#start_button').click(function(){
    $( "#start" ).replaceWith( "" );
    createGrid();
    weaponsPositions();
    blockersPositions();
    firstPlayer = new player("turtle", "first-sprite", "cell_1-1", '1');
    secondPlayer = new player("whale", "second-sprite", "cell_10-10", '2');
    firstPlayer.playerPosition();
    secondPlayer.playerPosition();
    startGame();
});
