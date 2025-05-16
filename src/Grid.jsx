import { useEffect, useRef, useState } from "react";
import {
  screenToCoordinate,
  toGridCoordinate,
  getMouseCoordinates,
} from "./gridUtils";
import Boar from "./Boar";

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
  const [mouseTile, setMouseTile] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const newEntities = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const coordinates = screenToCoordinate({ x: i, y: j });

        newEntities.push({
          gridX: i + 4,
          gridY: j + 4,
          screenX: coordinates.x + offsetX,
          screenY: coordinates.y + offsetY,
          type: "boar.png",
        });
      }
    }

    setEntities(newEntities);
  }, []);

  useEffect(() => {
    let newGrid = [];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const coordinates = screenToCoordinate({ x: i, y: j });

        newGrid.push({
          x: coordinates.x + offsetX,
          y: coordinates.y + offsetY,
          type: "grass_block.png",
        });
      }
    }

    setGrid(newGrid);
  }, []);

  useEffect(() => {
    let animationSpeed = 0;

    const interval = setInterval(() => {
      const { x, y } = toGridCoordinate(mouseRef);
      setMouseTile({ x: x, y: y });

      setGrid((prev) => {
        return prev.map((tile, index) => {
          const i = Math.floor(index / gridSize);
          const j = index % gridSize;
          const coordinates = screenToCoordinate({ x: i, y: j });
          const highlightHeight = i === x && j === y ? 10 : 0;

          if (tile.type === "water_block.png")
            coordinates.y = coordinates.y + Math.sin(i + j + animationSpeed);

          return {
            ...tile,
            x: coordinates.x + offsetX,
            y: coordinates.y + offsetY - highlightHeight,
          };
        });
      });

      animationSpeed += 0.1;
    }, 32);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      const { x, y } = toGridCoordinate(mouseRef);
      if (!(x >= 0 && x < gridSize && y >= 0 && y < gridSize)) return;

      const index = x * gridSize + y;
      console.log(x, y, index);
      const newGrid = [...grid];

      newGrid[index] = {
        ...newGrid[index],
        type: "water_block.png",
      };

      setGrid([...newGrid]);
    };

    window.addEventListener("click", handleClick);

    return () => removeEventListener("click", handleClick);
  }, [grid]);

  return (
    <div
      onMouseMove={(event) => getMouseCoordinates(event, mouseRef)}
      className="w-full h-full"
    >
      <h1 className="absolute min-w-24 m-6 px-10 py-2 text-4xl text-white font-semibold bg-blue-600 rounded-2xl select-none">
        x {mouseTile.x}
        <br />y {mouseTile.y}
      </h1>

      {grid.map((tile) => (
        <img
          key={`${tile.x}-${tile.y}`}
          className={`absolute select-none`}
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
      {entities.map((entity) => (
        <Boar
          key={`${entity.gridX}-${entity.gridY}`}
          gridX={entity.gridX}
          gridY={entity.gridY}
          screenX={entity.screenX}
          screenY={entity.screenY}
          type={entity.type}
        />
      ))}
    </div>
  );
}
