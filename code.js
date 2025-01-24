let rows = 15;
let cols = 15;
let playing = false;
let timer;
let reproductionTime = 500;
let grid = [];
let nextGrid = [];

document.addEventListener('DOMContentLoaded', () => {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
    setupGridSizeSelector();
    setupRuleForm();
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
    grid = new Array(rows);
    nextGrid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function createTable() {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = ''; // Clear existing grid
    const table = document.createElement('table');
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', i + '_' + j);
            cell.setAttribute('class', 'dead');
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    const [row, col] = this.id.split('_').map(Number);
    if (grid[row][col] === 1) {
        grid[row][col] = 0;
        this.setAttribute('class', 'dead');
    } else {
        grid[row][col] = 1;
        this.setAttribute('class', 'live');
    }
}

function setupControlButtons() {
    document.getElementById('start').onclick = () => {
        playing = !playing;
        document.getElementById('start').innerHTML = playing ? 'Pause' : 'Start';
        if (playing) play();
    };

    document.getElementById('clear').onclick = () => {
        playing = false;
        document.getElementById('start').innerHTML = 'Start';
        resetGrids();
        updateView();
    };

    document.getElementById('random').onclick = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.random() < 0.3 ? 1 : 0;
                document.getElementById(`${i}_${j}`).setAttribute('class', grid[i][j] === 1 ? 'live' : 'dead');
            }
        }
    };
}

function setupGridSizeSelector() {
    const gridSizeSelector = document.getElementById('gridSize');
    gridSizeSelector.onchange = (e) => {
        const size = e.target.value;
        if (size === 'small') {
            rows = cols = 10;
        } else if (size === 'medium') {
            rows = cols = 15;
        } else if (size === 'large') {
            rows = cols = 20;
        }
        resetGrids();
        createTable();
    };
}

function setupRuleForm() {
    document.querySelectorAll('#rulesForm input').forEach((input) => {
        input.onchange = () => computeNextGen();
    });
}

function play() {
    if (playing) {
        computeNextGen();
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

function applyRules(row, col) {
    const numNeighbors = countNeighbors(row, col);
    const survive2 = document.getElementById('ruleSurvive2').checked;
    const survive3 = document.getElementById('ruleSurvive3').checked;
    const reproduce3 = document.getElementById('ruleReproduce3').checked;

    if (grid[row][col] === 1) {
        nextGrid[row][col] = (numNeighbors === 2 && survive2) || (numNeighbors === 3 && survive3) ? 1 : 0;
    } else {
        nextGrid[row][col] = numNeighbors === 3 && reproduce3 ? 1 : 0;
    }
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function countNeighbors(row, col) {
    const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    return neighbors.reduce((count, [dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        return count + (grid[newRow] && grid[newRow][newCol] === 1 ? 1 : 0);
    }, 0);
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.getElementById(`${i}_${j}`);
            cell.setAttribute('class', grid[i][j] === 1 ? 'live' : 'dead');
        }
    }
}
