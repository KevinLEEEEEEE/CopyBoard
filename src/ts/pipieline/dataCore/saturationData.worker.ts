
onmessage = (event) => {
  const { imageData, params } = event.data;
  const { value } = params;
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const [h, s, l] = rgbToHsl(r, g, b);
    const [rr, gg, bb] = hslToRgb(h, s + value / 400, l);

    data[i] = rr;
    data[i + 1] = gg;
    data[i + 2] = bb;
  }

  postMessage(imageData);
};
