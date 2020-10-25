var game;
var turn = PLAYER1;

var socket = io();
socket.emit('player in', window.location.href);
//input
socket.on('chat message', function(msg){
    console.log(msg);
    if(msg == "p1") {
        alert("플레이어 1이 이겼습니다.");
    }
    else if(msg == "p2") {
        alert("플레이어 2가 이겼습니다");
    }
    else {
        let res = JSON.parse(msg);
        let tmp = res.game;
        game.turn = tmp.turn;
        game.state = tmp.state;
        game.player1 = tmp.player1;
        game.player2 = tmp.player2;
        game.board = tmp.board;
        game.selected = tmp.selected;
        console.log(msg);

        //set player name
        turn = res.p1 === socket.id ? PLAYER1 : PLAYER2;

        $('#name1').text(res.p1_name); 
        $('#name2').text(res.p2_name); 
       

        refresh();
    }
});



$('document').ready(function () {
    game = new GAME();
    game.set_turn(turn);
    refresh();
});

function player1(x) {
    socket.emit('game input', JSON.stringify(
        new POS(PLAYER1, x, 0)
    ));
    game.button_click(PLAYER1, new POS(HAVING, x, 0));
    refresh();
}

function player2(x) {
    socket.emit('game input', JSON.stringify(
        new POS(PLAYER2, x, 0)
    ));
    game.button_click(PLAYER2, new POS(HAVING, x, 0));
    refresh();
}

function button_yx(y, x) {
    socket.emit('game input', JSON.stringify(
        new POS(BOARD, y, x)
    ));
    if(game.button_click(turn, new POS(BOARD, y, x)) == MOVED) {
        if(turn == PLAYER1) turn = PLAYER2;
        else if(turn == PLAYER2) turn = PLAYER1;
        game.set_turn(turn);
    }
    if(game.state == PLAYER1) {
        refresh();
        alert("플레이어 1 승리");
        game.init_game();
        turn = PLAYER1;
        
    }
    else if(game.state == PLAYER2) {
        refresh();
        alert("플레이어 2 승리");
        game.init_game();
        turn = PLAYER1;
    }
    refresh();
}

function refresh() {
    let p1 = game.get_having(PLAYER1);
    let p2 = game.get_having(PLAYER2);
    let bd = game.get_board();

    let screen_bd = $('#btn > img');
    let screen_p1 = $('#player1 > #sbtn > img');
    let screen_p2 = $('#player2 > #sbtn > img');

    for (let i = 0; i < 6; i++) {
        screen_p1[i].src = 'images/' + mal_str(p1[i]) + '.png';
        screen_p2[i].src = 'images/' + mal_str(p2[i]) + '.png';
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            screen_bd[i * 3 + j].src = 'images/' + mal_str(bd[i][j]) + '.png';
        }
    }

    //TODO turn color
    if(game.turn == PLAYER1) {
        $('#turn1').css('background', 'black');
        $('#turn2').css('background', 'white');
    }
    else {
        $('#turn1').css('background', 'white');
        $('#turn2').css('background', 'black');
    }
}

function mal_str(mal) {
    let ret = "";
    if (mal == null) return "빈칸";
    if (mal.player == NOTHING) {
        if (mal.pos.y == 0) ret = "빨빈";
        else if (mal.pos.y == 3) ret = "초빈";
        else {
            if(mal.highlighted) return "빈칸선";
            return "빈칸";
        }
    }
    else {
        if (mal.player == PLAYER1) ret = "초";
        else if (mal.player == PLAYER2) ret = "빨";

        if (mal.type == Ja) ret += "자";
        else if (mal.type == Jang) ret += "장";
        else if (mal.type == Sang) ret += "상";
        else if (mal.type == Wang) ret += "왕";
        else if (mal.type == Hu) ret += "후";
    }
    if (mal.highlighted) ret += "선";
    else ret += "무";
    return ret;
}