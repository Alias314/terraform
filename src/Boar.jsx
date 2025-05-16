import { useEffect, useState } from "react";
import { screenToCoordinate, toGridCoordinate } from "./gridUtils";

export default function Boar({ grid, gridX, gridY, screenX, screenY, type }) {
  const spriteWidth = 46 * 1.5;
  const spriteHeight = 32 * 1.5;
  const offsetX = 10;
  const offsetY = 15;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenOffsetX = screenWidth / 2;
  const screenOffsetY = screenHeight / 4;
  const gridSize = 12;
  const [gridPosition, setGridPosition] = useState({ x: gridX, y: gridY });
  const [screenPosition, setScreenPosition] = useState({
    x: screenX,
    y: screenY,
  });

  useEffect(() => {
    const speed = Math.max(Math.random() * 1000, 500);
    const interval = setInterval(() => {
      const nextGridPos = getRandomGridPosition(gridPosition);
      console.log(nextGridPos);

      setGridPosition(nextGridPos);
      const screenCoordinates = screenToCoordinate(nextGridPos);

      setScreenPosition({
        x: screenCoordinates.x + screenOffsetX,
        y: screenCoordinates.y + screenOffsetY,
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gridPosition]);

  const getRandomGridPosition = (current) => {
    if (grid.length === 0) return;

    let count = 0;
    let newX = current.x;
    let newY = current.y;
    const directions = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    while (count < 20) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const candidateX = current.x + dir.x;
      const candidateY = current.y + dir.y;
      const index = candidateX * gridSize + candidateY;
      const tile = grid[index];

      if (
        candidateX >= 0 &&
        candidateX < gridSize &&
        candidateY >= 0 &&
        candidateY < gridSize &&
        tile &&
        tile.type !== "water_block.png"
      ) {
        newX = candidateX;
        newY = candidateY;
        break;
      }

      count++;
    }

    return { x: newX, y: newY };
  };

  return (
    <div
      className="absolute w-fit h-fit select-none transition-all duration-100 ease-in-out"
      style={{
        width: spriteWidth,
        height: spriteHeight,
        left: screenPosition.x + offsetX,
        top: screenPosition.y - offsetY,
        imageRendering: "pixelated",
      }}
    >
      <h1 className="absolute text-blue-100">Wandering</h1>
      <img width={spriteWidth} height={spriteHeight} src={type} />
    </div>
  );
}
