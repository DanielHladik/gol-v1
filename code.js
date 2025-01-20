let rows = 15;
let cols = 15;
let playing = false;

let timer;
let reproductionTime = 500;

let grid = new Array(rows);
let nextGrid = new Array(rows);

document.addEventListener('DOMContentLoaded', () => {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
});

function resetGrids() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function initializeGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

// lay out the board
function createTable() {
    let gridContainer = document.getElementById("gridContainer");
    if (!gridContainer) {
        console.error("Problem: no div for the grid table!");
        return;
    }
    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    let [row, col] = this.id.split("_").map(Number);
    let classes = this.getAttribute('class');
    if (classes.includes('live')) {
        this.setAttribute('class', 'dead');
        grid[row][col] = 0;
    } else {
        this.setAttribute('class', 'live');
        grid[row][col] = 1;
    }
}

function setupControlButtons() {
    let startButton = document.querySelector('#start');
    let clearButton = document.querySelector('#clear');
    let randomButton = document.querySelector('#random');
    let speedInput = document.querySelector('#speed');

    startButton.onclick = () => {
        if (playing) {
            playing = false;
            startButton.innerHTML = 'Start';
        } else {
            playing = true;
            startButton.innerHTML = 'Pause';
            play();
        }
    };

    clearButton.onclick = () => {
        playing = false;
        startButton.innerHTML = "Start";
        resetGrids();
        updateView();
    };

    randomButton.onclick = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.random() < 0.3 ? 1 : 0; // Higher chance for live cells
                let cell = document.getElementById(i + '_' + j);
                cell.setAttribute('class', grid[i][j] === 1 ? 'live' : 'dead');
            }
        }
    };

    speedInput.oninput = (e) => {
        reproductionTime = Number(e.target.value);
    };
}

function play() {
    computeNextGen();
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + '_' + j);
            cell.setAttribute('class', grid[i][j] === 0 ? 'dead' : 'live');
        }
    }
}

function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);
    if (grid[row][col] === 1) {
        nextGrid[row][col] = numNeighbors === 2 || numNeighbors === 3 ? 1 : 0;
    } else if (grid[row][col] === 0) {
        if (numNeighbors === 3) {
            nextGrid[row][col] = 1;
        }
    }
}

function countNeighbors(row, col) {
    let neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    return neighbors.reduce((count, [dx, dy]) => {
        let newRow = row + dx, newCol = col + dy;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && grid[newRow][newCol] === 1) {
            count++;
        }
        return count;
    }, 0);
}
