// The drifting ASCII field behind the hero. Adapted from the AsciiDitherMedia component on 21st.dev,
// without React, the image source or the cursor glow.
(() => {
    const canvas = document.querySelector('.hero-field');
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const RAMP = ' .:-=+*#%@';
    const CELL = 14;
    const SPEED = 0.6;   // noise time units per second; the original runs about 1.7
    const FPS = 15;      // a slow drift of discrete characters looks the same at higher rates
    const FONT = '"JetBrains Mono", ui-monospace, monospace';

    // A cheap flowing field from four sine waves, 0..1
    const noise = (x, y, t) => (
        Math.sin(x * 1.7 + t * 0.6) +
        Math.sin(y * 2.3 - t * 0.4) +
        Math.sin((x + y) * 1.1 + t * 0.25) +
        Math.sin(Math.hypot(x - 6, y - 4) * 1.9 - t * 0.7)
    ) / 8 + 0.5;

    const ink = getComputedStyle(canvas).color;
    // Each character is drawn once into a small tile at one fixed brightness. A cell then only needs
    // redrawing when its character changes, which at this speed is about 2% of cells per frame.
    let tiles = [];
    let shown = new Uint8Array(0);
    const NOTHING = 255;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let t = 3;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        ({ width, height } = canvas.getBoundingClientRect());
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        cols = Math.ceil(width / CELL);
        rows = Math.ceil(height / CELL);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        makeTiles(dpr);
        // Resizing clears the canvas, so every cell is drawn again
        shown = new Uint8Array(cols * rows).fill(NOTHING);
    }

    // One tile per character, at the brightness of the middle of its band
    function makeTiles(dpr) {
        const size = Math.ceil(CELL * dpr);
        tiles = [...RAMP].map((char, i) => {
            if (char === ' ') return null;
            const tile = document.createElement('canvas');
            tile.width = tile.height = size;
            const t = tile.getContext('2d');
            t.font = `${CELL * 0.85 * dpr}px ${FONT}`;
            t.textAlign = 'center';
            t.textBaseline = 'middle';
            t.fillStyle = ink;
            t.globalAlpha = Math.min(1, 0.25 + ((i + 0.5) / (RAMP.length - 1)) * 0.75);
            t.fillText(char, size / 2, size / 2);
            return tile;
        });
    }

    function draw() {
        for (let gy = 0; gy < rows; gy++) {
            for (let gx = 0; gx < cols; gx++) {
                // The power empties most of the field so only the crests show; the x term makes it travel
                const lum = Math.pow(noise(gx * 0.35 + t * 0.22, gy * 0.35, t), 1.7);
                const index = Math.floor(lum * (RAMP.length - 1));
                const cell = gy * cols + gx;
                if (shown[cell] === index) continue;
                shown[cell] = index;
                ctx.clearRect(gx * CELL, gy * CELL, CELL, CELL);
                if (tiles[index]) ctx.drawImage(tiles[index], gx * CELL, gy * CELL, CELL, CELL);
            }
        }
    }

    resize();
    draw();
    // The first tiles may use a fallback font; redraw them once JetBrains Mono is in
    document.fonts?.load(`${CELL}px ${FONT}`).then(() => { resize(); draw(); });

    let resizeTimer;
    new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); draw(); }, 150);
    }).observe(canvas);

    // People who turn off motion get the still frame
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = 0;
    let visible = true;

    function loop(now) {
        raf = requestAnimationFrame(loop);
        if (now - last < 1000 / FPS) return;
        // Time-based, so the drift is the same speed on 60 Hz and 120 Hz screens; long gaps don't jump
        t += Math.min(now - last, 100) / 1000 * SPEED;
        last = now;
        draw();
    }

    // Only runs while the hero is on screen and the tab is open
    function update() {
        const run = visible && !document.hidden;
        if (run && !raf) {
            last = performance.now();
            raf = requestAnimationFrame(loop);
        } else if (!run && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
        }
    }

    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        update();
    }).observe(canvas);
    document.addEventListener('visibilitychange', update);
    update();
})();
