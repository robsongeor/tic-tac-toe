const gameBoard = (function () {
    let gameBoardArr = [];

    //reset gameboard and fill with 9xEmpty Slots
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

    const checkForWinner = function () {
        let arr = gameBoardArr;
        // Go through each winner combination
        // and return true if gameboard has spots that match a winning sequence
        return foundWinner =
            winnerSequences.some(wi => checkIfSame(
                arr[wi[0]],
                arr[wi[1]],
                arr[wi[2]]
            ))
    };


    const winnerSequences = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const getGameBoard = () => { return gameBoardArr };
    const isSpotEmpty = (location) => { return (gameBoardArr[location] == null); }
    const checkIfSame = (a, b, c) => {return a === b && b === c && a != null};
    
    return { init, placeMark, getGameBoard, checkForWinner }
})();

const playGame = (function () {
    gameBoard.init();

    let player1 = {
        name: "player1",
        mark: "x",
    }

    let player2 = {
        name: "player2",
        mark: "o",
    }

    let currentPlayer = player1

    //Plays next turn only if spot is not taken
    const nextTurn = function (location) {
        if (gameBoard.placeMark(currentPlayer.mark, location != null ? location : random())) {
            checkForWinner();
        }
        console.log(gameBoard.getGameBoard());
    }

    const checkForWinner = function () {
        //CHECK FOR A WINNER CODE
        gameBoard.checkForWinner() ?
            console.log(`${currentPlayer.name} wins!`) :
            swtichTurn();
    }

    //swaps whos turn it is
    const swtichTurn = function () {
        currentPlayer = (currentPlayer === player1 ? player2 : player1)
    }

    //Random number between 1-9
    const random = () => Math.floor(Math.random() * 9);

    return { nextTurn }
})();