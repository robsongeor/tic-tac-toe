var events = {
    events: {},
    on: function (eventName, fn) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
    },
    off: function(eventName, fn) {
      if (this.events[eventName]) {
        for (var i = 0; i < this.events[eventName].length; i++) {
          if (this.events[eventName][i] === fn) {
            this.events[eventName].splice(i, 1);
            break;
          }
        };
      }
    },
    emit: function (eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(function(fn) {
          fn(data);
        });
      }
    }
  };

const gameBoard = (function () {
    let gameBoardArr = [];

    //Bind events
    events.on('changeMark', changeMark)

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

    const checkForDraw = function () {
        return gameBoardArr.every(cell => cell !== null);
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
    const checkIfSame = (a, b, c) => {
        return a === b && b === c && a != null
    };

    
    const changeMark = function (marks) {
        console.log(marks)

        gameBoardArr.forEach((cell, i, arr) => {
            if(cell === marks.old) arr[i] = marks.new;
        })

        console.log(gameBoardArr)
    }

    


    return { init, placeMark, getGameBoard, checkForWinner, checkForDraw }
})();

const Players = (function () {

    let players = {
        player1: createPlayer("Player1", "X", "human"),
        player2: createPlayer("Player2", "O", "cpu")
    }

    function createPlayer(name, mark, type) {
        let player = {
            name: name,
            mark: mark,
            type: type,
        }

        let changeName = (name) => { player.name = name }
        let getName = () => player.name;

        let changeMark = (mark) => {
            events.emit("changeMark", {old: player.mark, new: mark});
            player.mark = mark 
            
            }
        let getMark = () => player.mark;

        let toggleType = () => {
            player.type === "human" ? player.type = "cpu" : player.type = "human";
        }
        let getType = () => player.type;


        return { changeName, getName, changeMark, getMark, toggleType, getType }
    }

    return { players }

})();

const playGame = (function () {
    gameBoard.init();

    let players = Players.players;

    let currentPlayer = players.player1;

    //Plays next turn only if spot is not taken
    const nextTurn = function (location) {

        if (gameBoard.placeMark(currentPlayer.getMark(), location != null ? location : random())) {
            checkForWinner();
        }
        console.log(gameBoard.getGameBoard());

        checkForDraw()
    }

    const checkForWinner = function () {
        //CHECK FOR A WINNER CODE
        gameBoard.checkForWinner() ?
            gameOver(`${currentPlayer.getName()} wins!`) :
            swtichTurn();
    }

    const checkForDraw = function () {
        if (gameBoard.checkForDraw()) gameOver("Draw");
    }

    const gameOver = function (message) {
        console.log(message);

    }

    //swaps whos turn it is
    const swtichTurn = function () {
        currentPlayer = (currentPlayer === players.player1 ? players.player2 : players.player1)
    }

    //Random number between 1-9
    const random = () => Math.floor(Math.random() * 9);

    return { nextTurn }
})();



playGame.nextTurn(0)
playGame.nextTurn(2)
playGame.nextTurn(1)
playGame.nextTurn(3)
playGame.nextTurn(5)
playGame.nextTurn(4)
playGame.nextTurn(6)
playGame.nextTurn(7)
playGame.nextTurn(8)