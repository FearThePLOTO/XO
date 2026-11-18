const player = (sign) => {
    const getSign = () => sign;

    return { getSign };
};

const gameBoard = () => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const setField = (i, sign) => {
        board[i] = sign;
    };

    const getField = (i) => board[i];

    const resetBoard = () => {
        board = Array(9).fill("");
    };

    return { setField, getField, resetBoard };
};

const gameController = (() => {
    const player1 = player("X");
    const player2 = player("O");

    let rounds = 0;
    let isOver = false;
    let winner = "";
    let currentPlayer = player1;

    const game = gameBoard();

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const checkWinner = () => {
        for (const [a, b, c] of winningConditions) {
            const sign = game.getField(a);
            if (sign !== "" && sign === game.getField(b) && sign === game.getField(c)) {
                return sign;
            }
        }
        return "";
    };

    const playRound = (i) => {
        if (isOver || !Number.isInteger(i) || i < 0 || i > 8 || game.getField(i) !== "") return;

        game.setField(i, currentPlayer.getSign());
        rounds++;

        winner = checkWinner();
        if (winner !== "") {
            isOver = true;
            return;
        }
        if (rounds === 9) {
            isOver = true;
            return;
        }

        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const reset = () => {
        rounds = 0;
        isOver = false;
        winner = "";
        currentPlayer = player1;
        game.resetBoard();
    };

    return {
        playRound,
        reset,
        getField: game.getField,
        getCurrentPlayer: () => currentPlayer.getSign(),
        getWinner: () => winner,
        getIsOver: () => isOver
    };
})();


(() => {
    const printBoard = () => {
        for (let i = 0; i < 9; i += 3) {
            console.log(`${gameController.getField(i) || "."} ${gameController.getField(i + 1) || "."} ${gameController.getField(i + 2) || "."}`);
        }
        console.log("");
    };

    while (true) {
        printBoard();

        while (!gameController.getIsOver()) {
            const input = prompt("Enter the index for your move [0, ..., 8]: ");
            if (input === null) return;
            gameController.playRound(Number(input));
            printBoard();
        }

        console.log(gameController.getWinner() ? `The winner is: ${gameController.getWinner()}` : "It's a draw");
        if (!confirm("Play again?")) return;
        gameController.reset();
    }
})();
