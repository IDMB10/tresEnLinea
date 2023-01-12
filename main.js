const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let turn = 0; //0 = user, 1= pc

const boardContainer = document.querySelector('#board');
const playerDiv = document.querySelector('#player');

startGame();

function startGame() {
    renderBoard();
    turn = Math.random() <= 0.5 ? 0 : 1; //generar turno aleatorio

    renderCurrentPlayer();

    if (turn === 0) {
        playerPlays();
    } else {
        pcPlays();
    }

}

function playerPlays() {
    const cells = document.querySelectorAll('.cell')

    cells.forEach((cell, i) => {

        const row = parseInt(i / 3);
        const column = i % 3;

        if (board[row][column] === '') {//Solo las celdas vacias tienen activo el listener
            cell.addEventListener('click', e => {
                board[row][column] = 'O';
                cell.textContent = board[row][column];

                turn = 1;

                const won = checkIfWinner();

                if (won === 'None') {
                    pcPlays();
                    return;
                }

                if (won === 'Draw') {
                    renderDraw();
                    cell.removeEventListener('click', this);
                    return;
                }
            });
        }
    });
}

function pcPlays() {
    renderCurrentPlayer();

    setTimeout(() => {
        let played = false;
        const options = checkIfCanWin();

        if (options.length > 0) {
            const bestOption = options[0];
            for (let i = 0; i < bestOption.length; i++) {
                if (bestOption[i].value === 0) {
                    const posi = bestOption[i].i;
                    const posj = bestOption[i].j;
                    board[posi][posj] = 'X';
                    played = true;
                    break
                }
            }
        } else {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    if (board[i][j] === '' && !played) {
                        board[i][j] = 'X';
                        played = true;
                    }
                }
            }
        }

        turn = 0;
        renderBoard();
        renderCurrentPlayer();

        const won = checkIfWinner();

        if (won === 'None') {
            playerPlays();
            return;
        }

        if (won === 'Draw') {
            renderDraw();
            return;
        }
    }, 1500);
}

function renderDraw() {
    playerDiv.textContent = 'DRAW';
}

function checkIfCanWin() {
    const arr = JSON.parse(JSON.stringify(board)) //Copia profunda de un arreglo 2D

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (arr[i][j] === "X") {
                arr[i][j] = { value: 1, i, j };
            }
            if (arr[i][j] === "") {
                arr[i][j] = { value: 0, i, j }
            }
            if (arr[i][j] === "O") {
                arr[i][j] = { value: -2, i, j }
            }
        }
    }

    const p1 = arr[0][0];
    const p2 = arr[0][1];
    const p3 = arr[0][2];
    const p4 = arr[1][0];
    const p5 = arr[1][1];
    const p6 = arr[1][2];
    const p7 = arr[2][0];
    const p8 = arr[2][1];
    const p9 = arr[2][2];

    //Posibilidades en la que se puede ganar
    const s1 = [p1, p2, p3];
    const s2 = [p4, p5, p6];
    const s3 = [p7, p8, p9];
    const s4 = [p1, p4, p7];
    const s5 = [p2, p5, p8];
    const s6 = [p3, p6, p9];
    const s7 = [p1, p5, p9];
    const s8 = [p3, p5, p7];

    const res = [s1, s2, s3, s4, s5, s6, s7, s8].filter((line) => {
        return (
            line[0].value + line[1].value + line[2].value === 2 ||
            line[0].value + line[1].value + line[2].value === -4
        );
    });
    return res;
}

function checkIfWinner() {
    const p1 = board[0][0];
    const p2 = board[0][1];
    const p3 = board[0][2];
    const p4 = board[1][0];
    const p5 = board[1][1];
    const p6 = board[1][2];
    const p7 = board[2][0];
    const p8 = board[2][1];
    const p9 = board[2][2];

    const s1 = [p1, p2, p3];
    const s2 = [p4, p5, p6];
    const s3 = [p7, p8, p9];
    const s4 = [p1, p4, p7];
    const s5 = [p2, p5, p8];
    const s6 = [p3, p6, p9];
    const s7 = [p1, p5, p9];
    const s8 = [p3, p5, p7];

    const res = [s1, s2, s3, s4, s5, s6, s7, s8].filter((line) => {
        return (line[0] + line[1] + line[2] === 'XXX' ||
            line[0] + line[1] + line[2] === 'OOO'
        );
    });
    if (res.length > 0) {  //hay ganador
        if (res[0][0] === 'X') {
            playerDiv.textContent = 'PC WINS';
            return 'pcwon';
        } else {
            playerDiv.textContent = 'PLAYER WINS';
            return 'userwon';
        }
    } else {
        let draw = true;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] === '') {
                    draw = false;
                }
            }
        }
        return draw ? 'Draw' : 'None';
    }
}

function renderCurrentPlayer() {
    playerDiv.textContent = `${turn === 0 ? 'Player turn' : 'PC Turn'}`;
}

function renderBoard() {
    const html = board.map(row => {
        const cells = row.map(cell => {
            return `
                <button class="cell">${cell}</button>
            `;
        })
        return `<div class='row'>${cells.join('')} </div>`
    });
    boardContainer.innerHTML = html.join('');
}