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

  const FPS = 12;
  const framesPerStep = Math.round(60 / FPS); // 5 frames per step at 60Hz

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

  // Draw 2-frame animation with cross-fade interpolation
  function drawTwoFrame(img1, img2, fps) {
    const fStep = fps ? Math.round(60 / fps) : framesPerStep;
    const step = Math.floor(currentFrame / fStep);
    const sub = currentFrame % fStep;
    const idx = step % 2;
    const cur = idx === 0 ? img1 : img2;
    const nxt = idx === 0 ? img2 : img1;

    if (sub < fStep - 2 || framesPerStep <= 2) {
      return [cur, null, 1];
    }
    const t = (sub - (fStep - 2)) / 2;
    return [cur, nxt, 1 - t];
  }

  // Draw N-frame animation with cross-fade (for jump)
  function drawMultiFrame(images, playCount) {
    const step = Math.floor(currentFrame / framesPerStep);
    const sub = currentFrame % framesPerStep;
    const total = images.length;
    const maxSteps = total * playCount;
    if (step >= maxSteps) return [null, null, 0]; // done
    const idx = step % total;
    const nxtIdx = (idx + 1) % total;
    const cur = images[idx];
    const nxt = images[nxtIdx];
    if (sub < framesPerStep - 2 || framesPerStep <= 2) {
      return [cur, null, 1];
    }
    const t = (sub - (framesPerStep - 2)) / 2;
    return [cur, nxt, 1 - t];
  }

  function draw(state) {
    ctx.clearRect(0, 0, size, size);
    currentFrame++;

    let imageToDraw = baseImg;
    let imageToDraw2 = null;
    let alpha = 1;
    let ox = 0;
    let oy = 0;
    let showBF = false;
    let bfImg1 = butterfly1;
    let bfImg2 = butterfly2;
    let bfAlpha = 1;
    let bfNext = null;
    let animationDone = false;

    switch (state) {
      case 'IDLE':
        imageToDraw = baseImg;
        break;

      case 'LICKING':
        [imageToDraw, imageToDraw2, alpha] = drawTwoFrame(tongueImg1, tongueImg2, 6);
        break;

      case 'LYING_DOWN':
        [imageToDraw, imageToDraw2, alpha] = drawTwoFrame(lieImg1, lieImg2);
        if (butterfly1 && butterfly2) {
          showBF = true;
          [bfImg1, bfNext, bfAlpha] = drawTwoFrame(butterfly1, butterfly2, 3);
          if (bfNext) bfImg2 = bfNext;
        }
        break;

      case 'BOUNCING':
        if (!animStartFrame) animStartFrame = currentFrame;
        const jumpFPS = 6;
        const jumpStep = Math.round(60 / jumpFPS);
        const elapsedStep = Math.floor((currentFrame - animStartFrame) / jumpStep);
        const totalSteps = jumpFrames.length * 4;
        if (elapsedStep < totalSteps && jumpFrames.length >= 6) {
          const step = elapsedStep;
          const sub = (currentFrame - animStartFrame) % jumpStep;
          const idx = step % jumpFrames.length;
          const nxtIdx = (idx + 1) % jumpFrames.length;
          imageToDraw = jumpFrames[idx];
          if (sub >= jumpStep - 2 && jumpStep > 2 && elapsedStep < totalSteps - 1) {
            imageToDraw2 = jumpFrames[nxtIdx];
            alpha = 1 - (sub - (jumpStep - 2)) / 2;
          }
        } else if (elapsedStep >= totalSteps) {
          animationDone = true;
          imageToDraw = baseImg;
        } else {
          imageToDraw = baseImg;
        }
        break;

      default:
        imageToDraw = baseImg;
    }

    if (state !== 'BOUNCING' || animationDone) animStartFrame = 0;

    // Draw main image
    if (imageToDraw2) {
      ctx.globalAlpha = 1;
      ctx.drawImage(imageToDraw, ox, oy, size, size);
      ctx.globalAlpha = 1 - alpha;
      ctx.drawImage(imageToDraw2, ox, oy, size, size);
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(imageToDraw, ox, oy, size, size);
    }

    // Butterfly overlay
    if (showBF) {
      const bx = 0;
      const by = 0;
      const bSize = size * 0.72;
      if (bfNext) {
        ctx.globalAlpha = bfAlpha;
        ctx.drawImage(bfImg1, bx, by, bSize, bSize);
        ctx.globalAlpha = 1 - bfAlpha;
        ctx.drawImage(bfImg2, bx, by, bSize, bSize);
        ctx.globalAlpha = 1;
      } else {
        ctx.drawImage(bfImg1, bx, by, bSize, bSize);
      }
    }
  }

  return { setImages, draw };
}
