function polarToCartesian(r, a) {
  return {
    x: cos(a) * r,
    y: sin(a) * r,
  };
}
