export default function Bush({ grid, gridX, gridY, screenX, screenY, type }) {
  const tileWidth = 70;
  const tileHeight = 70;
  const offsetX = 5;
  const offsetY = 25;

  return (
    <div
      className="absolute w-fit h-fit"
      style={{
        left: screenX + offsetX,
        top: screenY - offsetY,
        zIndex: gridX + gridY,
        imageRendering: "pixelated",
      }}
    >
      <img width={tileWidth} height={tileHeight} src={type} />
    </div>
  );
}
