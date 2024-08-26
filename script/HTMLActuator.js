import { CELL_SIZE, GRID_GAP, GRID_SIZE } from "./Constant.js";

export default class HTMLActuator {
    constructor() {
        this.gridContainer = document.querySelector(".grid-container");
        this.tileContainer = document.querySelector(".tile-container");
        this.gameMessage = document.querySelector(".game-message");
    }

    renderGrid(size) {
        this.clearContainer(this.gridContainer);
        for (let i = 0; i < size * size; i++) {
            this.gridContainer.appendChild(HTMLFactory.createCell());
        }
    }

    renderTiles(grid) {
        window.requestAnimationFrame(() => {
            this.clearContainer(this.tileContainer);
            grid.forEachCell((tile) => {
                if (tile) {
                    if (tile.mergeFrom) {
                        tile.mergeFrom.forEach((e) => { this.addTile(e) });
                    }
                    this.addTile(tile);
                    tile.mergeFrom = null;
                    tile.previousPosition = tile.position;
                }
            });
        });
    }


    addTile(tile) {
        var tileHTML = HTMLFactory.createTile(tile);
        this.tileContainer.appendChild(tileHTML);
    }

    clearContainer(container) {
        container.innerHTML = '';
    }

    showMessage() {
        this.gameMessage.removeAttribute('style');
    }

    hideMessage() {
        this.gameMessage.setAttribute('style', 'display: none');
    }
}

class HTMLFactory {
    static createTile(tile) {
        var tileHTML = document.createElement('div');
        var tileInner = HTMLFactory.createTileInner(tile.value);
        var classes = ['tile', `tile-${tile.value}`];
        var transform = CSSFactory.transform(tile.position);
        if (tile.previousPosition) {
            transform = CSSFactory.transform(tile.previousPosition);
            window.requestAnimationFrame(() => {
                transform = CSSFactory.transform(tile.position);
                tileHTML.setAttribute('style', transform);
            });
        } else if (tile.mergeFrom) {
            classes.push('tile-merge');
        }
        else {
            classes.push('tile-new');
        }
        tileHTML.setAttribute('class', classes.join(' '));
        tileHTML.setAttribute('style', transform);
        tileHTML.appendChild(tileInner);
        return tileHTML;
    }

    static createCell() {
        var cellHTML = document.createElement('div');
        cellHTML.className = 'cell';
        return cellHTML;
    }

    static createTileInner(value) {
        var tileInner = document.createElement('div');
        tileInner.textContent = value;
        tileInner.className = 'tile-inner';
        return tileInner;
    }
}

class CSSFactory {
    static transform(position) {
        var translate = {
            x: `${position.col * (GRID_GAP + CELL_SIZE)}px`,
            y: `${position.row * (GRID_GAP + CELL_SIZE)}px`
        };
        return `transform: translate(${translate.x}, ${translate.y})`;
    }
}