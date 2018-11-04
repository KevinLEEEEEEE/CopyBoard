import PixelCalc from "./pixelCalc";

onmessage = (event) => {
  const pixelBlock = new PixelCalc(event.data);
  const pixelatedImageData = pixelBlock.calcPixelatedImageData();

  postMessage({
    imageData: pixelatedImageData,
  });
};
