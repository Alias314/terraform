import { useEffect, useRef, useState } from "react";
import {
  screenToCoordinate,
  toGridCoordinate,
  getMouseCoordinates,
} from "./gridUtils";
import Boar from "./Boar";
import Bush from "./Bush";

export default function Grid() {
  const spriteSize = 80;
  const tileWidth = spriteSize;
  const tileHeight = spriteSize;
  const gridSize = 12;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const offsetX = screenWidth / 2;
  const offsetY = screenHeight / 4;
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mouseTile, setMouseTile] = useState({ x: 0, y: 0 });
  const [grid, setGrid] = useState([]);
  const [entities, setEntities] = useState([]);
  const [bushes, setBushes] = useState([]);
  const amountBoar = 9;
  const amountBushes = 10;

  useEffect(() => {
    const newGrid = [];
    const newEntities = [];
    const newBushes = [];
    const entityList = {};
    const bushList = {};

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const coordinates = screenToCoordinate({
          x: i,
          y: j,
        });

        newGrid.push({
          x: coordinates.x + offsetX,
          y: coordinates.y + offsetY,
          waveOffset: 0,
          type: "grass_block.png",
        });
      }
    }

    for (let i = 0; i < amountBoar; i++) {
      const randomCoordinateX = Math.floor(Math.random() * gridSize);
      const randomCoordinateY = Math.floor(Math.random() * gridSize);
      const coordinates = screenToCoordinate({
        x: randomCoordinateX,
        y: randomCoordinateY,
      });

      if (!entityList[`${randomCoordinateX}-${randomCoordinateY}`]) {
        entityList[`${randomCoordinateX}-${randomCoordinateY}`] = 1;
      } else {
        continue;
      }

      newEntities.push({
        gridX: randomCoordinateX,
        gridY: randomCoordinateY,
        screenX: coordinates.x + offsetX,
        screenY: coordinates.y + offsetY,
        type: "boar.png",
      });
    }

    for (let i = 0; i < amountBushes; i++) {
      const randomCoordinateX = Math.floor(Math.random() * gridSize);
      const randomCoordinateY = Math.floor(Math.random() * gridSize);
      const coordinates = screenToCoordinate({
        x: randomCoordinateX,
        y: randomCoordinateY,
      });

      if (!bushList[`${randomCoordinateX}-${randomCoordinateY}`]) {
        bushList[`${randomCoordinateX}-${randomCoordinateY}`] = 1;
      } else {
        continue;
      }

      newBushes.push({
        gridX: randomCoordinateX,
        gridY: randomCoordinateY,
        screenX: coordinates.x + offsetX,
        screenY: coordinates.y + offsetY,
        type: "bush.png",
      });
    }

    setGrid(newGrid);
    setEntities(newEntities);
    setBushes(newBushes);
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
          const waveOffset =
            tile.type === "water_block.png"
              ? Math.sin(i + j + animationSpeed) * 1.2
              : 0;

          return {
            ...tile,
            x: coordinates.x + offsetX,
            y: coordinates.y + offsetY - highlightHeight,
            waveOffset: waveOffset,
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
      const newGrid = [...grid];
      const newType =
        newGrid[index].type === "grass_block.png"
          ? "water_block.png"
          : "grass_block.png";

      newGrid[index] = {
        ...newGrid[index],
        type: newType,
      };

      setGrid([...newGrid]);
    };

    window.addEventListener("click", handleClick);

    return () => removeEventListener("click", handleClick);
  }, [grid]);

  return (
    <div onMouseMove={(event) => getMouseCoordinates(event, mouseRef)}>
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
            transform: `translateY(${tile.waveOffset}px)`,
            transition: "none",
            imageRendering: "pixelated",
          }}
          src={tile.type}
        />
      ))}
      {entities.map((entity) => (
        <Boar
          key={`${entity.gridX}-${entity.gridY}`}
          grid={grid}
          gridX={entity.gridX}
          gridY={entity.gridY}
          screenX={entity.screenX}
          screenY={entity.screenY}
          type={entity.type}
        />
      ))}

      {bushes.map((bush) => (
        <Bush
          key={`${bush.gridX}-${bush.gridY}`}
          grid={grid}
          gridX={bush.gridX}
          gridY={bush.gridY}
          screenX={bush.screenX}
          screenY={bush.screenY}
          type={bush.type}
        />
      ))}
    </div>
  );
}
