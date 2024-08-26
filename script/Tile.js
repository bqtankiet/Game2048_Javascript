export default class Tile {
    constructor(position, value) {
        this.position = position;
        this.value = value;
        this.previousPosition = null;
        this.mergeFrom = null;
    }

    updatePosition(position) {
        this.previousPosition = this.position;
        this.position = position;
    }
}