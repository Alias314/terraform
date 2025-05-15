import { useEffect, useRef, useState } from "react";

export default function App() {
  const spriteSize = 80;
  const spriteWidth = spriteSize;
  const spriteHeight = spriteSize;
  const gridSize = 12;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const mouseRef = useRef({ x: 0, y: 0 });

  const a = spriteWidth * 0.5;
  const b = spriteWidth * -0.5;
  const c = spriteHeight * 0.25;
  const d = spriteHeight * 0.25;

  const determinant = 1 / (a * d - b * c);
  const inverseMatrix = {
    a: determinant * d,
    b: determinant * -b,
    c: determinant * -c,
    d: determinant * a,
  };

  const [grid, setGrid] = useState([]);
  const offsetX = screenWidth / 2;
  const offsetY = screenHeight / 4;
  let count = 1;
  useEffect(() => {
    const interval = setInterval(() => {
      const { x: mouseX, y: mouseY } = mouseRef.current;
      const tempGrid = [];

      const x = Math.floor(inverseMatrix.a * mouseX + inverseMatrix.b * mouseY);
      const y = Math.floor(inverseMatrix.c * mouseX + inverseMatrix.d * mouseY);

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const coordinatesX = (i * a + j * b);
          const coordinatesY = i * c + j * d;
          // const coordinatesY = (i * c + j * d) - Math.sin(i + j + count) * 5;
          const highlightHeight = x === i && y === j ? 10 : 0;

          tempGrid.push({
            x: coordinatesX + offsetX,
            y: coordinatesY + offsetY - highlightHeight,
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

  return (
    <div
      onMouseMove={getMouseCoordinates}
      className="w-screen h-screen absolute bg-blue-300"
    >
      <h1 className="text-4xl">
        X:{mouseRef.current.x}
        <br />
        Y: {mouseRef.current.y}
      </h1>

      {grid.map((tile) => (
        <img
          key={`${tile.x}-${tile.y}`}
          className={`absolute`}
          style={{
            width: spriteWidth,
            height: spriteHeight,
            left: tile.x,
            top: tile.y,
          }}
          src={tile.type}
        />
      ))}
    </div>
  );
}
