const player = (sign, defaultName) => {
    let name = defaultName;

    const getSign = () => sign;
    const getName = () => name;
    const setName = (newName) => {
        name = newName.trim() || defaultName;
    };

    return { getSign, getName, setName };
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
    const player1 = player("X", "Player X");
    const player2 = player("O", "Player O");

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
        setNames: (x, o) => {
            player1.setName(x);
            player2.setName(o);
        },
        getField: game.getField,
        getCurrentPlayer: () => currentPlayer.getSign(),
        getCurrentName: () => currentPlayer.getName(),
        getName: (sign) => (sign === "X" ? player1 : player2).getName(),
        getWinner: () => winner,
        getIsOver: () => isOver
    };
})();

const displayController = (() => {
    const boardEl = document.getElementById("board");
    const statusEl = document.getElementById("status");
    const startEl = document.getElementById("start");
    const xInput = document.getElementById("x-name");
    const oInput = document.getElementById("o-name");

    let started = false;

    const cells = Array.from({ length: 9 }, (_, i) => {
        const cell = document.createElement("button");
        cell.setAttribute("aria-label", `row ${Math.floor(i / 3) + 1} column ${(i % 3) + 1}`);
        cell.addEventListener("click", () => {
            gameController.playRound(i);
            render();
        });
        boardEl.append(cell);
        return cell;
    });

    const render = () => {
        cells.forEach((cell, i) => {
            const sign = gameController.getField(i);
            cell.textContent = sign;
            cell.dataset.sign = sign;
            cell.disabled = !started || sign !== "" || gameController.getIsOver();
        });

        const over = gameController.getIsOver();
        const winner = gameController.getWinner();

        statusEl.classList.toggle("over", over);

        if (!started) {
            statusEl.textContent = "Press start to duel";
        } else if (over) {
            statusEl.textContent = winner
                ? `${gameController.getName(winner)} wins ${winner}`
                : "A draw";
        } else {
            statusEl.textContent = `${gameController.getCurrentName()} plays ${gameController.getCurrentPlayer()}`;
        }

        startEl.textContent = started ? "Play again" : "Start duel";
    };

    startEl.addEventListener("click", () => {
        gameController.setNames(xInput.value, oInput.value);
        gameController.reset();
        started = true;
        render();
    });

    render();
})();

for (let i = 0; i < 16; i++) {
    const petal = document.createElement("i");
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${7 + Math.random() * 9}s`;
    petal.style.animationDelay = `${-Math.random() * 16}s`;
    petal.style.opacity = 0.55 + Math.random() * 0.45;
    document.querySelector(".petals").append(petal);
}
