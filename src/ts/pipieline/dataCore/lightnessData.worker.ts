onmessage = (event) => {
  const { imageData, params } = event.data;

  imageData.data[0] += params.lightness;

  postMessage(imageData);
};
