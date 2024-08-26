import { GRID_SIZE, VECTOR } from "./Constant.js";
import Grid from "./Grid.js";
import HTMLActuator from "./HTMLActuator.js";
import EventListener from "./EventListener.js";
import Tile from "./Tile.js";

export default class GameManager {
    static #instance;
    constructor() {
        if (GameManager.#instance) {
            throw new Error("GameManager is SINGLETON (use 'GameManager.instance' instead)");
        }
        this.grid = new Grid(GRID_SIZE);
        this.htmlActuator = new HTMLActuator();
        this.eventListener = new EventListener(this);
        this.htmlActuator.renderGrid(GRID_SIZE);
    }

    static get instance() {
        if (!this.#instance) {
            this.#instance = new GameManager();
        }
        return this.#instance;
    }

    newGame() {
        this.grid = new Grid(GRID_SIZE);
        this.randomTile();
        this.randomTile();
        this.htmlActuator.renderTiles(this.grid);
        this.htmlActuator.hideMessage();
        this.eventListener.listen();
    }

    gameOver() {
        this.eventListener.off();
        this.htmlActuator.showMessage();
    }

    randomTile() {
        var cells = this.grid.getAvailableCells();
        var i = Math.floor(Math.random() * cells.length);
        var position = cells[i];
        var tile = new Tile(position, Math.random() <= 0.7 ? 2 : 4);
        this.grid.insertTile(tile);
    }

    slide(direction) {
        var tiles;
        var moved = false;
        let move = (tile) => { moved = this.move(tile, farthest.position()); }
        for (let i = 0; i < GRID_SIZE; i++) {
            switch (direction) {
                case 'left': tiles = this.grid.getTilesInRow(i); break;
                case 'right': tiles = this.grid.getTilesInRow(i).reverse(); break;
                case 'up': tiles = this.grid.getTilesInCol(i); break;
                case 'down': tiles = this.grid.getTilesInCol(i).reverse(); break;
            }
            if (tiles.length == 0) continue;
            var farthest = this.getFarthest(tiles[0], direction);
            tiles.forEach((tile) => {
                if (!this.equalsPosition(tile.position, farthest.position())) {
                    var target = this.grid.getTileAt(farthest.position());
                    if (target == null) {
                        move(tile);
                    }
                    else if (target.value == tile.value) {
                        var merge = new Tile(farthest.position(), tile.value * 2);
                        merge.mergeFrom = [tile, target];
                        move(tile);
                        this.grid.insertTile(merge, farthest);
                        farthest.next();
                    } else {
                        farthest.next();
                        if (!this.equalsPosition(tile.position, farthest.position())) {
                            move(tile);
                        }
                    }
                }
            });
        }
        if (moved) {
            this.randomTile();
            this.htmlActuator.renderTiles(this.grid);
            if (this.isGameOver()) {
                this.gameOver();
            }
        }
    }

    move(tile, position) {
        var target = this.grid.getTileAt(position);
        if (this.grid.isEmptyCell(position) || tile.value == target.value && !this.equalsPosition(tile.position, target.position)) {
            this.grid.removeTile(tile);
            tile.updatePosition(position);
            this.grid.insertTile(tile);
            return true;

        }
        return false;
    }

    getFarthest(tile, direction) {
        var position;
        switch (direction) {
            case 'left': position = { row: tile.position.row, col: 0 }; break;
            case 'right': position = { row: tile.position.row, col: GRID_SIZE - 1 }; break;
            case 'up': position = { row: 0, col: tile.position.col }; break;
            case 'down': position = { row: GRID_SIZE - 1, col: tile.position.col }; break;
        }

        position.next = () => {
            position.row -= VECTOR[direction].y;
            position.col -= VECTOR[direction].x;
        };

        position.position = () => { return { row: position.row, col: position.col }; }
        return position;
    }

    equalsPosition(p1, p2) {
        if (p1.row != p2.row) return false;
        if (p1.col != p2.col) return false;
        return true;
    }

    isGameOver() {
        for (let i = 0; i < GRID_SIZE; i++) {
            var row = this.grid.getTilesInRow(i);
            var col = this.grid.getTilesInCol(i);
            if (row.length + col.length < GRID_SIZE * 2) return false;
            if (this.hasConsecutiveValues(row) || this.hasConsecutiveValues(col)) return false;
        }
        return true;
    }

    hasConsecutiveValues(tiles) {
        var preValue = -1;
        for (let tile of tiles) {
            if (tile.value === preValue) return true;
            preValue = tile.value;
        }
        return false;
    }
}