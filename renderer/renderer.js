function createRenderer(ctx, size) {
  let baseImg = null;
  let tongueImg1 = null;
  let tongueImg2 = null;
  let lieImg = null;
  let jumpFrames = [];
  let currentFrame = 0;
  let animStartFrame = 0;

  function setImages(base, tongue1, tongue2, lie, jumpImgs) {
    baseImg = base;
    tongueImg1 = tongue1;
    tongueImg2 = tongue2;
    lieImg = lie;
    jumpFrames = jumpImgs || [];
  }

  function draw(state) {
    ctx.clearRect(0, 0, size, size);
    currentFrame++;

    let imageToDraw = baseImg;
    let ox = 0;
    let oy = 0;

    switch (state) {
      case 'IDLE':
        imageToDraw = baseImg;
        break;

      case 'LICKING':
        const tongueFrame = Math.floor(currentFrame / 12) % 2;
        imageToDraw = tongueFrame === 0 ? tongueImg1 : tongueImg2;
        break;

      case 'LYING_DOWN':
        imageToDraw = lieImg;
        break;

      case 'BOUNCING':
        if (!animStartFrame) animStartFrame = currentFrame;
        const elapsed = currentFrame - animStartFrame;
        const framesPerImage = 8;
        const totalImages = 6;
        const playCount = 2;
        const maxFrames = framesPerImage * totalImages * playCount;
        if (elapsed < maxFrames && jumpFrames.length >= totalImages) {
          const idx = Math.min(
            Math.floor(elapsed / framesPerImage) % totalImages,
            totalImages - 1
          );
          imageToDraw = jumpFrames[idx];
        } else {
          animStartFrame = 0;
          imageToDraw = baseImg;
        }
        break;

      default:
        imageToDraw = baseImg;
    }

    if (state !== 'BOUNCING') animStartFrame = 0;

    ctx.drawImage(imageToDraw, ox, oy, size, size);
  }

  return { setImages, draw };
}
