export const GRID_SIZE = 4;
export const CELL_SIZE = 100;
export const GRID_GAP = 12;
export const VECTOR = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 }
}

window.onload = () => {
    configCSS();
}

function configCSS() {
    const stylesheet = document.styleSheets[0];

    stylesheet.insertRule(`
        :root {
            --grid-size: ${GRID_SIZE};
            --cell-size: ${CELL_SIZE}px;
            --gap: ${GRID_GAP}px;
        }`, stylesheet.cssRules.length);
}