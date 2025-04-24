const gameBoard = (function () {
    let gameBoardArr = [];

    const init = function () {
        gameBoardArr = [];
        for (let i = 0; i < 9; i++) {
            gameBoardArr.push(null);
        }
        return gameBoardArr;
    };

    const placeMark = function (mark, location) {

        if (isSpotEmpty(location)) {
            gameBoardArr[location] = mark;
            return true;
        } else {
            console.log(`spot taken, cannot place ${mark} at ${location}`)
            return false;
        }
    }

    const getGameBoard = () => { return gameBoardArr };
    const isSpotEmpty = (location) => { return (gameBoardArr[location] == null); }


    return { init, placeMark, getGameBoard }
})();

const playGame = (function () {
    gameBoard.init();

    let player1Mark = "X";
    let player2Mark = "O";

    let currentPlayersTurn = 1;

    const nextTurn = function (location) {

        if (currentPlayersTurn == 1) {
            if (gameBoard.placeMark(player1Mark, Math.floor(Math.random() * 9))) {
                currentPlayersTurn = 2;
            };

        } else {
            if (gameBoard.placeMark(player2Mark, Math.floor(Math.random() * 9))) {
                currentPlayersTurn = 1;
            }

        }

        console.log(gameBoard.getGameBoard());
    }


    return { nextTurn }
})();