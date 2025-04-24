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

    let player1 = {
        mark : "x",
    }

    let player2 = {
        mark: "o",
    }

    let currentTurn = player1

    //Plays next turn only if spot is not taken
    const nextTurn = function (location) { 
        if(gameBoard.placeMark(currentTurn.mark, location ? location : random())){
            swtichTurn();
        }
        console.log(gameBoard.getGameBoard());
    }

    //swaps whos turn it is
    const swtichTurn = function (){
        currentTurn = (currentTurn === player1 ? player2 : player1)
    }

    //Random number between 1-9
    const random = () => Math.floor(Math.random() * 9);

    return { nextTurn }
})();