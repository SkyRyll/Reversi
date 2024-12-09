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
    let currentTurn = "black";

    $("td").each(function (index) {
        var x = Math.floor(index / 8);
        var y = index % 8;
        $(this).attr("data-x", x);
        $(this).attr("data-y", y);

        $(this).click(function () {
            if (!$(this).hasClass("occupied")) {
                const flipped = attemptMove($(this), currentTurn);
                if (flipped) {
                    addPiece($(this), currentTurn);
                    currentTurn = currentTurn === "black" ? "white" : "black";
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
        { x: 4, y: 3, color: "black" },
        { x: 4, y: 4, color: "white" },
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
    cell.attr("data-color", color); // Store the color in the cell for later reference
}

function attemptMove(cell, color) {
    const x = parseInt(cell.attr("data-x"));
    const y = parseInt(cell.attr("data-y"));

    let flipped = false;

    directions.forEach((dir) => {
        if (checkAndFlip(x, y, dir.dx, dir.dy, color)) {
            flipped = true;
        }
    });

    return flipped;
}

function checkAndFlip(x, y, dx, dy, color) {
    let cellsToFlip = [];
    let opponentColor = color === "black" ? "white" : "black";

    let i = x + dx;
    let j = y + dy;

    while (isOnBoard(i, j)) {
        const nextCell = $(`td[data-x=${i}][data-y=${j}]`);

        if (!nextCell.hasClass("occupied")) {
            return false; // Empty cell, no pieces to flip
        }

        if (nextCell.attr("data-color") === opponentColor) {
            cellsToFlip.push(nextCell); // Collect opponent pieces
        } else if (nextCell.attr("data-color") === color) {
            // If we hit a piece of the same color, we need at least one opponent piece between
            if (cellsToFlip.length > 0) {
                cellsToFlip.forEach((cell) => {
                    flipPiece(cell, color);
                });
                return true;
            } else {
                return false; // No opponent pieces to flip between
            }
        } else {
            return false; // Hit an empty cell or invalid sequence
        }

        i += dx;
        j += dy;
    }

    return false; // No pieces were flipped in this direction
}

function isOnBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function flipPiece(cell, color) {
    var pieceImage = "/images/" + color + ".png";
    cell.html(`<img src="${pieceImage}" alt="${color} piece" />`);
    cell.attr("data-color", color); // Update the cell's color
}
