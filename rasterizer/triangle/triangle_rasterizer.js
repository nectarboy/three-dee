// Triangle Rasterizer
// nectarboy | 2021
// * This isn't really real 3D i think :3

// --- Constants
const CANV_W = 256;
const CANV_H = 256;

const COL_FG = 0xffff66;
const COL_BG = 0x222222;
const COL_DEBUG = 0xff0000;

// --- Canvas
const canv = document.getElementById('canv');
    canv.width = CANV_W;
    canv.height = CANV_H;

const ctx = canv.getContext('2d');
const buffer = ctx.createImageData(CANV_W, CANV_H);

// --- Methods
function putPx(x, y, color) {
    if (x < 0 || x >= CANV_W || y < 0 || y >= CANV_H)
        return;

    var ind = 4 * (0|(y * CANV_W + x));

    buffer.data[ind++]  = (color >> 16) & 0xff;
    buffer.data[ind++]  = (color >> 8) & 0xff;
    buffer.data[ind++]  = (color >> 0) & 0xff;
    buffer.data[ind]    = 0xff;
}

function clearBg() {
    for (var i = 0; i < CANV_W; i++)
        for (var ii = 0; ii < CANV_H; ii++)
            putPx(i, ii, COL_BG);
}

function render() {
    ctx.putImageData(buffer, 0, 0);
}

// --- Rasterization
// @param 'vertices' is an Array full of Objects containing 'x' and 'y' coordinates in Integers.
function rasterizeVerts(verts) {
    // Convert vertices to ints
    verts[0].x |= 0; verts[0].y |= 0;
    verts[1].x |= 0; verts[1].y |= 0;
    verts[2].x |= 0; verts[2].y |= 0;

    // Find points of rasterization
    var top = 0;
    var bot = 0;
    switch (Math.min(verts[0].y, verts[1].y, verts[2].y)) {
        case verts[0].y: top = 0; break;
        case verts[1].y: top = 1; break;
        case verts[2].y: top = 2; break;
    }
    switch (Math.max(verts[0].y, verts[1].y, verts[2].y)) {
        case verts[0].y: bot = 0; break;
        case verts[1].y: bot = 1; break;
        case verts[2].y: bot = 2; break;
    }

    var mid = ((((top+1) ^ (bot+1)) - 1) >>> 0) % 3; // Ugly ass formula i came up with :>
    console.log(verts[top].y, verts[mid].y, verts[bot].y); // Should be in (lo-mid-hi) order !

    // Extra properties ...
    const slopeTB = ((CANV_H - verts[bot].y) - (CANV_H - verts[top].y)) / ((CANV_W - verts[bot].x) - (CANV_W - verts[top].x));
    console.log(slopeTB);

    // Rasterize
    for (var i = 0; i < verts[bot].y - verts[top].y; i++) {
        const y = verts[top].y + i;
        const belowMid = (y > verts[mid].y);

        var start = 0;
        var width = 10;

        start = verts[top].x - (i * slopeTB);

        for (var ii = 0; ii < width; ii++)
            putPx(start + ii, y, COL_FG);
    }

    // Debug vertices
    for (var i = 0; i < 3; i++)
        putPx(verts[i].x, verts[i].y, COL_DEBUG);
}

// --- Execution
const defaultVerts = [
    {x: 10, y: 200},
    {x: 150, y: 10},
    {x: 200, y: 150}
];

function init() {
    clearBg();
    render();
}

init();

rasterizeVerts(defaultVerts);
render();