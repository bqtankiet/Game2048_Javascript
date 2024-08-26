import { GRID_SIZE } from "./Constant.js";

export default class Grid {
    constructor(size, cells) {
        this.size = size;
        this.cells = cells || this.initCells();
    }

    initCells() {
        var cells = new Array(this.size).fill(null);
        cells = cells.map(e => e = new Array(this.size).fill(null));
        return cells;
    }

    insertTile(tile) {
        var r = tile.position.row;
        var c = tile.position.col;
        this.cells[r][c] = tile;
    }

    removeTile(tile) {
        var r = tile.position.row;
        var c = tile.position.col;
        this.cells[r][c] = null;
    }

    isEmptyCell(position) {
        return !this.cells[position.row][position.col];
    }

    isValidPosition(position) {
        var isValidRow = position.row >= 0 && position.row < this.size;
        var isValidCol = position.col >= 0 && position.col < this.size;
        return isValidRow && isValidCol;
    }

    getAvailableCells() {
        var cells = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (!this.cells[r][c]) {
                    cells.push({ row: r, col: c });
                }
            }
        }
        return cells;
    }

    forEachCell(callback) {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                callback(this.cells[r][c]);
            }
        }
    }

    getTileAt(position) {
        return this.cells[position.row][position.col];
    }

    getTilesInRow(n) {
        return this.cells[n].filter(e => e != null);
    }

    getTilesInCol(n) {
        var tiles = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            var tile = this.cells[i][n];
            if (tile) { tiles.push(tile); }
        }
        return tiles;
    }
}