var events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
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
            this.events[eventName].forEach(function (fn) {
                fn(data);
            });
        }
    }
};

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
        gameBoardArr[location] = mark;
        events.emit("placeMark", { mark, location });
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

    const getEmptySpots = function () {
        let arr = [];

        gameBoardArr.forEach((element, index) => {
            if (element === null) arr.push(index);
        });

        return arr;
    }

    const changeMark = function (marks) {
        console.log(marks)

        gameBoardArr.forEach((cell, i, arr) => {
            if (cell === marks.old) arr[i] = marks.new;
        })

        console.log(gameBoardArr)
    }

    const displayAsBoard = function () {
        let arr = [];

        for (let y = 0; y < 3; y++) {
            arr.push([])
            for (let x = 0; x < 3; x++) {
                let index = y * 3 + x;
                arr[y][x] = gameBoardArr[index];
            }
        }

        return arr;

    }


    //Bind events
    events.on('changeMark', changeMark)

    return { init, placeMark, getGameBoard, checkForWinner, checkForDraw, getEmptySpots, displayAsBoard }
})();

const Players = (function () {

    let players = {
        player1: createPlayer("Player1", "X", "human"),
        player2: createPlayer("Player2", "O", "human")
    }

    function createPlayer(name, mark, type) {
        let player = {
            name: name,
            mark: mark,
            type: type,
        }

        let changeName = (name) => {
            console.log(name)
            player.name = name
        }
        let getName = () => player.name;

        let changeMark = (mark) => {
            events.emit("changeMark", { old: player.mark, new: mark });
            console.log(mark)
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

    let players = Players.players;
    let currentPlayer = players.player1;
    let isGameOver = false;

    const startGame = function () {
        gameBoard.init();
        isGameOver = false;
    }

    const nextTurn = function (location) {
        //Place a mark
        if (!isGameOver) {

            gameBoard.placeMark(currentPlayer.getMark(), location)
            //if game not over, switch turn
            if (!checkGameover()) {
                swtichTurn();
            }

            console.table(gameBoard.displayAsBoard());
        } else {
            events.emit("invalidInput", location);
        }
    }

    const playHumanMove = function (location) {
        if (gameBoard.getGameBoard()[location] !== null) {
            events.emit("invalidInput", location)
        } else {
            nextTurn(location)
        }
    }


    const getCpuMove = function () {
        //only generates a turn in a empty spot
        let emptySpots = gameBoard.getEmptySpots();
        let randomIndex = random(emptySpots.length);
        return emptySpots[randomIndex];
    }

    const checkGameover = function () {
        //If winner or draw, game is over. else game is not over
        if (gameBoard.checkForWinner()) {
            return gameOver(`${currentPlayer.getName()} wins!`);
        } else if (gameBoard.checkForDraw()) {
            return gameOver(`draw!`);;
        } else {
            return false;
        }
    }

    const gameOver = function (message) {
        console.log(message);
        isGameOver = true;
        return true;
    }

    //swaps whos turn it is
    const swtichTurn = function () {
        currentPlayer = (currentPlayer === players.player1 ? players.player2 : players.player1);
    }

    //Random number between 1-max
    const random = (max) => Math.floor(Math.random() * max);

    events.on("playHumanMove", playHumanMove)
    events.on("startNewGame", () => startGame())

    startGame();

    return {}
})();

const screenController = (function () {
    let gameboardContainer = document.getElementById("gameboard");
    let cells = Array.from(gameboardContainer.children);

    const addCellEventListeners = function () {
        cells.forEach((cell, index) =>
            cell.addEventListener("click", () => placeMark(index)))
    }()

    const reRenderBoard = function () {
        cells.forEach((cell, index) =>
            cell.textContent = gameBoard.getGameBoard()[index]
        )
    }

    events.on("changeMark", reRenderBoard)

    const placeMark = function (index) {
        events.emit("playHumanMove", index);
    }

    const updateGameboard = function (ml) {
        let spot = gameboardContainer.children.item(ml.location);
        spot.textContent = (ml.mark)
    }

    const invalidSpotSelection = function (cell) {
        let bg = window.getComputedStyle(cells[cell]).getPropertyValue("background-color")

        const errorAnimation = [
            { backgroundColor: "red" },
            { backgroundColor: bg }
        ];

        const errorTiming = {
            duration: 100,
            iterations: 1
        };

        cells[cell].animate(errorAnimation, errorTiming)
    }

    const displayPlayers = function () {
        let playersContainer = document.querySelector(".players-container")

        Object.entries(Players.players).forEach(player => {
            let name = document.querySelector(`#${player[0]}-name`)
            let mark = document.querySelector(`#${player[0]}-mark`)
            name.value = player[1].getName();
            mark.value = player[1].getMark();

            name.addEventListener("change", () => player[1].changeName(name.value))
            mark.addEventListener("change", () => player[1].changeMark(mark.value))
        })
    }();

    const restartGame = function (){
        let restartButton = document.querySelector(".restart-btn");

        restartButton.addEventListener("click", () => events.emit("startNewGame", ""))
    }();

    events.on("placeMark", updateGameboard)
    events.on("invalidInput", invalidSpotSelection)
    events.on("startNewGame", reRenderBoard)

})();


// playGame.nextTurn(0)
// playGame.nextTurn(2)
// playGame.nextTurn(1)
// playGame.nextTurn(3)
// playGame.nextTurn(5)
// playGame.nextTurn(4)
// playGame.nextTurn(6)
// playGame.nextTurn(7)
// playGame.nextTurn(8)