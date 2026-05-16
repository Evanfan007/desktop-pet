(function () {
  const canvas = document.getElementById('pet-canvas');
  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const size = 200;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const stateMachine = createStateMachine();
  const renderer = createRenderer(ctx, size);
  const bubble = createBubble(document.getElementById('bubble-container'));

  createInteractions(canvas, stateMachine, renderer, bubble);

  loadImages(['assets/base.png', 'assets/tongue.png', 'assets/lie.png'])
    .then(images => {
      renderer.setImages(images[0], images[1], images[2]);
      stateMachine.transition('IDLE');
      startLoop();
    });

  function startLoop() {
    function loop() {
      renderer.draw(stateMachine.getState());
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function loadImages(paths) {
    return Promise.all(paths.map(p => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Fallback: create a colored placeholder
          const c = document.createElement('canvas');
          c.width = 200; c.height = 200;
          const cx = c.getContext('2d');
          cx.fillStyle = '#f4c542';
          cx.fillRect(0, 0, 200, 200);
          cx.fillStyle = '#333';
          cx.font = '14px sans-serif';
          cx.fillText(p, 10, 100);
          resolve(c);
        };
        img.src = p;
      });
    }));
  }
})();
