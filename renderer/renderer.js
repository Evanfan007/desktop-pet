function createRenderer(ctx, size) {
  let baseImg = null;
  let tongueImg1 = null;
  let tongueImg2 = null;
  let lieImg1 = null;
  let lieImg2 = null;
  let jumpFrames = [];
  let butterfly1 = null;
  let butterfly2 = null;
  let currentFrame = 0;
  let animStartFrame = 0;

  function setImages(base, tongue1, tongue2, lie1, lie2, jumpImgs, bf1, bf2) {
    baseImg = base;
    tongueImg1 = tongue1;
    tongueImg2 = tongue2;
    lieImg1 = lie1;
    lieImg2 = lie2;
    jumpFrames = jumpImgs || [];
    butterfly1 = bf1 || null;
    butterfly2 = bf2 || null;
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
        const lieFrame = Math.floor(currentFrame / 24) % 2;
        imageToDraw = lieFrame === 0 ? lieImg1 : lieImg2;
        break;

      case 'BOUNCING':
        if (!animStartFrame) animStartFrame = currentFrame;
        const elapsed = currentFrame - animStartFrame;
        const framesPerImage = 8;
        const totalImages = 6;
        const playCount = 4;
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

    // Butterfly overlay during lying down (above dog's head)
    if (state === 'LYING_DOWN' && butterfly1 && butterfly2) {
      const bfFrame = Math.floor(currentFrame / 10) % 2;
      const bfImg = bfFrame === 0 ? butterfly1 : butterfly2;
      const bx = size * 0.38;
      const by = size * 0.08;
      const bSize = size * 0.18;
      ctx.drawImage(bfImg, bx, by, bSize, bSize);
    }
  }

  return { setImages, draw };
}
