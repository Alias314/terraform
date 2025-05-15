import { useEffect, useRef, useState } from "react";

export default function Grid() {
  const spriteSize = 80;
  const tileWidth = spriteSize;
  const tileHeight = spriteSize;
  const gridSize = 12;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const offsetX = screenWidth / 2;
  const offsetY = screenHeight / 4;
  const [grid, setGrid] = useState([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mouseTile, setMouseTile] = useState({ x: 0, y: 0 });

  const iX = 1;
  const iY = 0.5;
  const jX = -1;
  const jY = 0.5;

  useEffect(() => {
    let count = 1;

    const interval = setInterval(() => {
      const tempGrid = [];

      const gridCoordinates = toGridCoordinate();
      const x = Math.floor(gridCoordinates.x);
      const y = Math.floor(gridCoordinates.y);
      setMouseTile({ x: x, y: y });

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const coordinates = screenToCoordinate({ x: i, y: j });
          const highlightHeight = x === i && y === j ? 10 : 0;

          tempGrid.push({
            x: coordinates.x + offsetX,
            y: coordinates.y + offsetY - highlightHeight,
            type: "grass_block.png",
          });
        }
      }

      count += 0.1;
      setGrid(tempGrid);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const getMouseCoordinates = (event) => {
    const mouseCoordinates = {
      x: event.clientX - offsetX,
      y: event.clientY - offsetY,
    };

    mouseRef.current = mouseCoordinates;
  };

  const screenToCoordinate = (tile) => {
    return {
      x: (tile.x * iX * 0.5 * tileWidth + tile.y * jX * 0.5 * tileWidth) / 1.15,
      y: tile.x * iY * 0.5 * tileHeight + tile.y * jY * 0.5 * tileHeight,
    };
  };

  const invertMatrix = (a, b, c, d) => {
    const det = 1 / (a * d - b * c);

    return {
      a: det * d,
      b: det * -b,
      c: det * -c,
      d: det * a,
    };
  };

  const toGridCoordinate = () => {
    const a = iX * tileWidth * 0.5;
    const b = jX * tileWidth * 0.5;
    const c = iY * tileHeight * 0.5;
    const d = jY * tileHeight * 0.5;

    const inverseMatrix = invertMatrix(a, b, c, d);
    const mouseCoordinates = mouseRef.current;

    return {
      x:
        mouseCoordinates.x * 1.15 * inverseMatrix.a +
        mouseCoordinates.y * inverseMatrix.b,
      y:
        mouseCoordinates.x * 1.15 * inverseMatrix.c +
        mouseCoordinates.y * inverseMatrix.d +
        1,
    };
  };

  return (
    <div
      onMouseMove={getMouseCoordinates}
      className="w-full h-full"
    >
      <h1 className="text-4xl">
        X:{mouseRef.current.x} - {mouseTile.x}
        <br />
        Y: {mouseRef.current.y} - {mouseTile.y}
      </h1>

      {grid.map((tile) => (
        <img
          key={`${tile.x}-${tile.y}`}
          className={`absolute pointer-events-none`}
          style={{
            width: tileWidth,
            height: tileHeight,
            left: tile.x,
            top: tile.y,
            imageRendering: "pixelated",
          }}
          src={tile.type}
        />
      ))}
    </div>
  );
}
