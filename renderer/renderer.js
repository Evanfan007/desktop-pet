function createRenderer(ctx, size) {
  let baseImg = null;
  let tongueImg1 = null;
  let tongueImg2 = null;
  let lieImg = null;
  let currentFrame = 0;
  let bounceOffset = 0;
  let wagAngle = 0;
  let animStartFrame = 0;

  function setImages(base, tongue1, tongue2, lie) {
    baseImg = base;
    tongueImg1 = tongue1;
    tongueImg2 = tongue2;
    lieImg = lie;
  }

  function draw(state) {
    ctx.clearRect(0, 0, size, size);
    currentFrame++;

    let imageToDraw = baseImg;
    let ox = 0;
    let oy = 0;
    let rotation = 0;

    switch (state) {
      case 'IDLE':
        imageToDraw = baseImg;
        break;

      case 'LICKING':
        // Alternate between two tongue frames every 12 frames (~5 fps)
        const tongueFrame = Math.floor(currentFrame / 12) % 2;
        imageToDraw = tongueFrame === 0 ? tongueImg1 : tongueImg2;
        break;

      case 'LYING_DOWN':
        imageToDraw = lieImg;
        if (!animStartFrame) animStartFrame = currentFrame;
        break;

      case 'BOUNCING':
        if (!animStartFrame) animStartFrame = currentFrame;
        const elapsed = currentFrame - animStartFrame;
        const totalFrames = 120; // ~2s at 60fps
        const bounceCount = 3;
        const progress = Math.min(elapsed / totalFrames, 1);
        bounceOffset = Math.sin(progress * bounceCount * Math.PI * 2) * 12 * (1 - progress);
        if (progress >= 1) {
          bounceOffset = 0;
          animStartFrame = 0;
        }
        imageToDraw = baseImg;
        oy = bounceOffset;
        break;

      default:
        imageToDraw = baseImg;
    }

    if (state !== 'BOUNCING') animStartFrame = 0;
    if (state !== 'LICKING') wagAngle = 0;

    ctx.save();
    if (rotation !== 0) {
      ctx.translate(size / 2 + ox, size / 2 + oy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(imageToDraw, -size / 2, -size / 2, size, size);
    } else {
      ctx.drawImage(imageToDraw, ox, oy, size, size);
    }
    ctx.restore();
  }

  return { setImages, draw };
}
