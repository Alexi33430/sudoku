const resultat = document.getElementById("affichageResultat");
function generateSudokuGrid(difficulty = 40) {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    // fonction pour vérifier si un nombre peut être placé dans une case
    function canPlaceNumber(grid, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num || grid[i][col] === num) {
                return false;
            }
            const startRow = 3 * Math.floor(row / 3);
            const startCol = 3 * Math.floor(col / 3);
            if (grid[startRow + Math.floor(i / 3)][startCol + i % 3] === num) {
                return false;
            }
        }
        return true;
    }
    //fonction pour remplir la grille de sudoku
    function fillGrid(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (let num of numbers) {
                        if (canPlaceNumber(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (fillGrid(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    //fonction pour enlever des chiffres aléatoires de la grille complète
    function removeNumbers(grid, difficulty = 40) {
        const puzzleGrid = grid.map(row => row.slice());
        let count = difficulty;
        while (count > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (puzzleGrid[row][col] !== 0) {
                puzzleGrid[row][col] = 0;
                count--;
            }
        }
        return puzzleGrid;
    }
    // remplir la grille
    fillGrid(grid);

    //generer le puzzle en supprimant des chiffres en fonction de la difficulté
    const puzzle = removeNumbers(grid, difficulty);
    return puzzle;
}
function createSudokuGrid() {
    const sudokuGrid = document.getElementById("sudoku-grid");
    sudokuGrid.innerHTML = "";// Effacer la grille précédente, s' il y en a une

    const difficulty = document.getElementById("difficulty").value; // Récupère la difficulté sélectionnée
    const grid = generateSudokuGrid(difficulty); // passer la  difficulté à la fonction

    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1; // limite la saisie a un chiffre
            if (cell !== 0) {
                input.value = cell;
                input.disabled = true; // empêche la modification des cellules déjà remplies
            }
            sudokuGrid.appendChild(input);
        });
    });
}
window.onload = createSudokuGrid;
//fonction pour vérifier si la grille est correcte
function checkSudoku() {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    let grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    // remplir la grille avec les valeurs des inputs
    inputs.forEach((input, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        grid[row][col] = input.value ? parseInt(input.value) : 0;
    });
    // verifier si une ligne est valide
    function isRowValid(grid, row) {
        const seen = new Set();
        for (let col = 0; col < 9; col++) {
            const num = grid[row][col];
            if (num !== 0) {
                if (seen.has(num)) return false;
                seen.add(num);
            }
        }
        return true;
    }
    /* en résumé, cette fonction vérifie si une ligne spécifique d'une grille de sudoku est valide en
    s'assurant qu'il n'y a pas de nombres dupliques, a l'exception des zéros elle utilise un ensemble
    pour suivre les nombres déjà rencontrés et retourne false si un doublon est trouvé. */


    // vérifier si une colonne est valide
    function isColValid(grid, col) {
        const seen = new Set();
        for (let row = 0; row < 9; row++) {
            const num = grid[row][col];
            if (num !== 0) {
                if (seen.has(num)) return false;
                seen.add(num);
            }
        }
        return true;
    }
    /* Cette fonction vérifie si une colonne spécifique d'une grille de sudoku est valide en s'assurant 
    qu'il n'y a pas de nombres dupliqués, à l'exception des zéros. Elle utilise un ensemble pour suivre
    les nombres déjà rencontrés et retourne false dès qu'un doublon est détecté */

    //vérifier si un bloc 3*3 est valide
    function isBlockValid(grid, startRow, startCol) {
        const seen = new Set();
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const num = grid[startRow + row][startCol + col];
                if (num === 0) return false; // Si une cellule est vide, le bloc est invalide
                if (seen.has(num)) return false;
                seen.add(num);
            }
        }
        return true;
    }
    //vérification globale
    for (let i = 0; i < 9; i++) {
        if (!isRowValid(grid, i) || !isColValid(grid, i)) {
            resultat.innerHTML = ("la grille de sudoku est incorrecte ou incomplète !");
            return false;
        }
    }

    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            if (!isBlockValid(grid, row, col)) {
                resultat.innerHTML = ("la grille de sudoku est incorrecte ou incomplète !");
                return false;
            }
        }
    }

    resultat.innerHTML = "Bravo ! La grille de Sudoku est correcte.";
    return true;
}