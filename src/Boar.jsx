import { useEffect, useState } from "react";
import { screenToCoordinate, toGridCoordinate } from "./gridUtils";
import { getRandomGridPosition } from "./entityUtils";

export default function Boar({ grid, gridX, gridY, screenX, screenY, type }) {
  const spriteWidth = 46 * 1.5;
  const spriteHeight = 32 * 1.5;
  const offsetX = 10;
  const offsetY = 15;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenOffsetX = screenWidth / 2;
  const screenOffsetY = screenHeight / 4;
  const [gridPosition, setGridPosition] = useState({ x: gridX, y: gridY });
  const [screenPosition, setScreenPosition] = useState({
    x: screenX,
    y: screenY,
  });

  useEffect(() => {
    const speed = Math.max(Math.random() * 1000, 500);
    const interval = setInterval(() => {
      const nextGridPos = getRandomGridPosition(gridPosition, grid);

      setGridPosition(nextGridPos);
      const screenCoordinates = screenToCoordinate(nextGridPos);

      setScreenPosition({
        x: screenCoordinates.x + screenOffsetX,
        y: screenCoordinates.y + screenOffsetY,
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gridPosition]);

  return (
    <div
      className="absolute w-fit h-fit select-none transition-all duration-100 ease-in-out"
      style={{
        width: spriteWidth,
        height: spriteHeight,
        left: screenPosition.x + offsetX,
        top: screenPosition.y - offsetY,
        zIndex: gridPosition.x + gridPosition.y,
        imageRendering: "pixelated",
      }}
    >
      <h1 className="absolute text-blue-100">Wandering</h1>
      <img width={spriteWidth} height={spriteHeight} src={type} />
    </div>
  );
}
