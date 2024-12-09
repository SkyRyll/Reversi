// Variables
const directions = [
    { dx: -1, dy: 0 }, // Up
    { dx: 1, dy: 0 }, // Down
    { dx: 0, dy: -1 }, // Left
    { dx: 0, dy: 1 }, // Right
    { dx: -1, dy: -1 }, // Diagonal Up-Left
    { dx: -1, dy: 1 }, // Diagonal Up-Right
    { dx: 1, dy: -1 }, // Diagonal Down-Left
    { dx: 1, dy: 1 }, // Diagonal Down-Right
];

$(document).ready(function () {
    let currentTurn = Math.random() < 0.5 ? "black" : "white";
    let gameOver = false;

    $(".gameover").text(`${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)} player's turn`);

    $("td").each(function (index) {
        var x = Math.floor(index / 8);
        var y = index % 8;
        $(this).attr("data-x", x);
        $(this).attr("data-y", y);

        $(this).click(function () {
            if (gameOver) {
                return;
            }

            if (!$(this).hasClass("occupied")) {
                const flipped = attemptMove($(this), currentTurn);
                if (flipped) {
                    addPiece($(this), currentTurn);
                    currentTurn = currentTurn === "black" ? "white" : "black";

                    if (!hasValidMoves(currentTurn)) {
                        $(".gameover").text(`${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)} player has no valid moves. Game Over!`);
                        gameOver = true;
                    } else {
                        $(".gameover").text(`${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)} player's turn`);
                    }
                } else {
                    alert("Invalid move! You must flip at least one opponent piece.");
                }
            } else {
                alert("This cell is already occupied!");
            }
        });
    });

    initializeBoard();
});

function initializeBoard() {
    const middlePositions = [
        { x: 3, y: 3, color: "white" },
        { x: 3, y: 4, color: "black" },
        //{ x: 4, y: 3, color: "black" },
        //{ x: 4, y: 4, color: "white" },
    ];

    middlePositions.forEach((pos) => {
        const cell = $(`td[data-x=${pos.x}][data-y=${pos.y}]`);
        addPiece(cell, pos.color);
    });
}

function addPiece(cell, color) {
    var pieceImage = "/images/" + color + ".png";
    cell.html(`<img src="${pieceImage}" alt="${color} piece" />`);
    cell.addClass("occupied");
    cell.attr("data-color", color);
}

function attemptMove(cell, color) {
    const x = parseInt(cell.attr("data-x"));
    const y = parseInt(cell.attr("data-y"));

    let flipped = false;

    directions.forEach((dir) => {
        const cellsToFlip = isValidMove(x, y, dir.dx, dir.dy, color);
        if (cellsToFlip.length > 0) {
            flipPieces(cellsToFlip, color);
            flipped = true;
        }
    });

    return flipped;
}

function isValidMove(x, y, dx, dy, color) {
    let opponentColor = color === "black" ? "white" : "black";
    let cellsToFlip = [];

    let i = x + dx;
    let j = y + dy;

    while (isOnBoard(i, j)) {
        const nextCell = $(`td[data-x=${i}][data-y=${j}]`);

        if (!nextCell.hasClass("occupied")) {
            return [];
        }

        if (nextCell.attr("data-color") === opponentColor) {
            cellsToFlip.push(nextCell);
        } else if (nextCell.attr("data-color") === color) {
            if (cellsToFlip.length > 0) {
                return cellsToFlip;
            } else {
                return [];
            }
        } else {
            return [];
        }

        i += dx;
        j += dy;
    }

    return [];
}

function flipPieces(cellsToFlip, color) {
    cellsToFlip.forEach((cell) => {
        var pieceImage = "/images/" + color + ".png";
        cell.html(`<img src="${pieceImage}" alt="${color} piece" />`);
        cell.attr("data-color", color);
    });
}

function isOnBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function hasValidMoves(color) {
    let validMoveFound = false;

    $("td").each(function () {
        if (!$(this).hasClass("occupied")) {
            const x = parseInt($(this).attr("data-x"));
            const y = parseInt($(this).attr("data-y"));

            directions.forEach((dir) => {
                const cellsToFlip = isValidMove(x, y, dir.dx, dir.dy, color);
                if (cellsToFlip.length > 0) {
                    validMoveFound = true;
                }
            });
        }

        if (validMoveFound) return false;
    });

    return validMoveFound;
}
