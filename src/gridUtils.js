const spriteSize = 80;
const tileWidth = spriteSize;
const tileHeight = spriteSize;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const offsetX = screenWidth / 2;
const offsetY = screenHeight / 4;
const iX = 1;
const iY = 0.5;
const jX = -1;
const jY = 0.5;

export const screenToCoordinate = (tile) => {
  return {
    x: (tile.x * iX * 0.5 * tileWidth + tile.y * jX * 0.5 * tileWidth) / 1.15,
    y: tile.x * iY * 0.5 * tileHeight + tile.y * jY * 0.5 * tileHeight,
  };
};

export const invertMatrix = (a, b, c, d) => {
  const det = 1 / (a * d - b * c);

  return {
    a: det * d,
    b: det * -b,
    c: det * -c,
    d: det * a,
  };
};

export const toGridCoordinate = (mouseRef) => {
  const a = iX * tileWidth * 0.5;
  const b = jX * tileWidth * 0.5;
  const c = iY * tileHeight * 0.5;
  const d = jY * tileHeight * 0.5;

  const inverseMatrix = invertMatrix(a, b, c, d);
  const mouseCoordinates = mouseRef.current;

  return {
    x: Math.floor(
      mouseCoordinates.x * 1.15 * inverseMatrix.a +
        mouseCoordinates.y * inverseMatrix.b
    ),
    y: Math.floor(
      mouseCoordinates.x * 1.15 * inverseMatrix.c +
        mouseCoordinates.y * inverseMatrix.d +
        1
    ),
  };
};

export const getMouseCoordinates = (event, mouseRef) => {
  const mouseCoordinates = {
    x: event.clientX - offsetX,
    y: event.clientY - offsetY,
  };

  mouseRef.current = mouseCoordinates;
};
