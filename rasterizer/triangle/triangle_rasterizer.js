// Triangle Rasterizer
// nectarboy | 2021
// * This isn't really real 3D i think :3

// --- Constants
const CANV_W = 256;
const CANV_H = 256;

const COL_FG = 0xffff66;
const COL_BG = 0x222222;

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

    // Find height of rasterization
    var upmost = 0;
    var downmost = 0;
    switch (Math.min(verts[0].y, verts[1].y, verts[2].y)) {
        case verts[0].y: upmost = 0; break;
        case verts[1].y: upmost = 1; break;
        case verts[2].y: upmost = 2; break;
    }
    switch (Math.max(verts[0].y, verts[1].y, verts[2].y)) {
        case verts[0].y: downmost = 0; break;
        case verts[1].y: downmost = 1; break;
        case verts[2].y: downmost = 2; break;
    }

    var midmost = ((((upmost+1) ^ (downmost+1)) - 1) & 3) % 3; // Ugly ass formula i came up with :>

    console.log(verts[upmost].y, verts[midmost].y, verts[downmost].y);
    // Draw vertices
    for (var i = 0; i < 3; i++)
        putPx(verts[i].x, verts[i].y, COL_FG);

    // Rasterize
    for (var i = verts[upmost].y; i < verts[downmost].y; i++) {

    }
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