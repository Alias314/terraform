const gridSize = 12;

export const getRandomGridPosition = (current, grid) => {
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

  while (count < 10) {
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
