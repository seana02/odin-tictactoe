const boardController = (function() {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const getBoard = () => board;

    const placeO = (row, column) => {
        if (!board[row][column]) {
            board[row][column] = 'O';
            return true;
        }
        return false;
    };

    const placeX = (row, column) => {
        if (!board[row][column]) {
            board[row][column] = 'X';
            return true;
        }
        return false;
    }

    return { getBoard, placeO, placeX };

})();

const displayController = (function() {
    const updateBoard = () => {
        const row = ['top', 'mid', 'bottom'];
        const col = ['left', 'mid', 'right'];
        const board = boardController.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let cell = document.querySelector(`.${row[i]}-row.${col[j]}-column`);
                cell.textContent = board[i][j];
            }
        }
    }

    return { updateBoard };
})();

const Player = (n) => {
    let name = n;
    const getName = () => name;
    return { getName };
}

const gameController = (function() {
    let p1, p2;
    const status = document.querySelector('.status');
    const pOne = document.createElement('div')
    const pTwo = document.createElement('div');
    pOne.classList.add('message');
    pTwo.classList.add('message');
    let inGame = false;
    let current;

    const changeName = () => {
        p1 = Player(prompt("Enter Player 1's name"));
        p2 = Player(prompt("Enter player 2's name"));
        const players = document.querySelectorAll('.player');
        players[0].textContent = `O ${p1.getName()}`;
        players[1].textContent = `X ${p2.getName()}`;
        pOne.textContent = `${p1.getName()}'s turn`;
        pTwo.textContent = `${p2.getName()}'s turn`;
    };

    const startGame = () => {
        document.querySelector(".edit-names").addEventListener('click', () => {
            changeName();
        });

        let cells = document.querySelectorAll('.cell');
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                cells[3 * i + j].addEventListener('click', () => {
                    if (inGame && cells[3 * i + j].textContent === '') {
                        if (current === 1) {
                            boardController.placeO(i, j);
                            current = 2;
                            status.removeChild(pOne);
                        } else {
                            boardController.placeX(i, j);
                            current = 1;
                            status.removeChild(pTwo);
                        }
                        game();
                    }
                });
            }
        }
    };

    const setStartButton = () => {
        const startButton = document.createElement('div');
        startButton.classList.add('start');
        startButton.textContent = 'Start';
        startButton.addEventListener('click', () => {
            status.removeChild(startButton);
            inGame = true;
            current = 1;
            changeName();
            game();
        });
        status.appendChild(startButton);
    };

    const game = () => {
        if (current === 1) {
            status.appendChild(pOne);
        } else {
            status.appendChild(pTwo);
        }
        displayController.updateBoard();
        if (_checkWinner()) {
            // current updated before check
            inGame = false;
            if (current === 2) { // player 1 wins
                status.textContent = `${p1.getName()} wins!`;
            } else { // player 2 wins
                status.textContent = `${p2.getName()} wins!`;
            }
        }
    };

    const _checkWinner = () => {
        const cells = document.querySelectorAll('.cell');
        return _lineCheck(cells[0], cells[1], cells[2])
            || _lineCheck(cells[3], cells[4], cells[5])
            || _lineCheck(cells[6], cells[7], cells[8])
            || _lineCheck(cells[0], cells[3], cells[6])
            || _lineCheck(cells[1], cells[4], cells[7])
            || _lineCheck(cells[2], cells[5], cells[8])
            || _lineCheck(cells[0], cells[4], cells[8])
            || _lineCheck(cells[2], cells[4], cells[6]);
    };

    const _lineCheck = (a, b, c) => {
        return a.textContent !== ''
            && a.textContent === b.textContent
            && b.textContent === c.textContent;
    }

    return { setStartButton, startGame };
})();

gameController.startGame();
gameController.setStartButton();