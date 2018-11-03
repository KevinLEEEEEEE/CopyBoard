import PixelBlock from "./pixelBlock";
import { computeArrayAverage, isArrayEqual } from "./utils";

onmessage = (event) => {
  const pixelBlock = new PixelBlock(event.data);
  const pixelBlockAmount = pixelBlock.getPixelBlockAmount();
  const pixelBlockSize = pixelBlock.getPixelBlockSize();

  for (let indexOfBlock = 0; indexOfBlock < pixelBlockAmount; indexOfBlock += 1) {
    const colorDataInPixelBlock = [];
    const pointsInPixelBlock = [];

    for (let indexInBlock = 0; indexInBlock < pixelBlockSize; indexInBlock += 1) {
      const [x, y] = pixelBlock.getPointByBlockIndex(indexOfBlock, indexInBlock);
      const rgb = pixelBlock.getRGBInPoint(x, y);

      if (!isArrayEqual(rgb, [])) {
        colorDataInPixelBlock.push(rgb);
        pointsInPixelBlock.push([x, y]);
      }
    }

    const combinedColorData = computeArrayAverage(colorDataInPixelBlock);

    pointsInPixelBlock.forEach((point) => {
      pixelBlock.setRGBInPoint(point[0], point[1], combinedColorData);
    });
  }

  postMessage({
    imageData: pixelBlock.imageData,
  });
};
