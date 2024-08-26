export default class EventListener {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.keydownHandler = (e) => {
            switch (e.key) {
                case 'ArrowLeft': this.gameManager.slide('left'); break;
                case 'ArrowRight': this.gameManager.slide('right'); break;
                case 'ArrowUp': this.gameManager.slide('up'); break;
                case 'ArrowDown': this.gameManager.slide('down'); break;
            }
        }
        this.listen();

        var newGameButton = document.querySelector(".btn-new-game");
        newGameButton.addEventListener('click', e => {
            this.gameManager.newGame();
        });
    }

    listen() {
        document.addEventListener('keydown', this.keydownHandler);
    }

    off() {
        document.removeEventListener('keydown', this.keydownHandler);
    }
}