import { useEffect, useState } from "react";
import { screenToCoordinate } from "./gridUtils";

export default function Boar({ gridX, gridY, screenX, screenY, type }) {
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

  const directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextGridPos = getRandomGridPosition(gridPosition);

      setGridPosition(nextGridPos);

      const screenCoordinates = screenToCoordinate(nextGridPos);
      setScreenPosition({
        x: screenCoordinates.x + screenOffsetX,
        y: screenCoordinates.y + screenOffsetY,
      });
    }, 500);

    return () => clearInterval(interval);
  }, [gridPosition]);

  const getRandomGridPosition = (current) => {
    let count = 0;
    let newX = current.x;
    let newY = current.y;

    while (count < 20) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const candidateX = current.x + dir.x;
      const candidateY = current.y + dir.y;

      if (
        candidateX >= 0 &&
        candidateX < gridSize &&
        candidateY >= 0 &&
        candidateY < gridSize
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
    <img
      className={`absolute select-none`}
      style={{
        width: spriteWidth,
        height: spriteHeight,
        left: screenPosition.x + offsetX,
        top: screenPosition.y - offsetY,
        imageRendering: "pixelated",
      }}
      src={type}
    />
  );
}
