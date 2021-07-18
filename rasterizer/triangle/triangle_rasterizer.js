// Triangle Rasterizer
// nectarboy | 2021
// * This isn't really real 3D i think :3

// --- Constants
const CANV_W = 256;
const CANV_H = 256;

const COL_FG = 0x00ff00;
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

function renderScene() {
    ctx.putImageData(buffer, 0, 0);
}

// --- Rasterization
// @param 'vertices' is an Array full of Objects containing 'x' and 'y' coordinates in Integers.
function rasterizeVerts(verts) {
    if (verts.length !== 3)
        throw 'rasterizeVerts :: invalid \'verts\' array !';

    // Convert vertices to ints for the naughty boys
    verts[0].x |= 0; verts[0].y |= 0;
    verts[1].x |= 0; verts[1].y |= 0;
    verts[2].x |= 0; verts[2].y |= 0;

    // Find main points of the vertices
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

    const mid = ((((top+1) ^ (bot+1)) - 1) >>> 0) % 3; // Ugly ass formula i came up with :>
    // console.log(verts[top].y, verts[mid].y, verts[bot].y); // Should be in (lo-mid-hi) order !

    // Extra properties ...
    const slopeTB = (-verts[bot].y + verts[top].y) / (verts[bot].x - verts[top].x);
    const slopeTM = (-verts[mid].y + verts[top].y) / (verts[mid].x - verts[top].x);
    const slopeBM = (-verts[mid].y + verts[bot].y) / (verts[mid].x - verts[bot].x);
    // console.log(slopeTB, slopeTM, slopeBM);

    // Rasterize from top to bottom
    const height = (verts[bot].y - verts[top].y)+1;
    for (var i = 0; i < height; i++) {
        const y = verts[top].y + i;

        // Calculating line
        const start = verts[top].x - (i * (1/slopeTB));
        const width = Math.round((y > verts[mid].y) // (Are we below the middle vert ?)
            ? (verts[mid].x + ((height - i) * (1/slopeBM))) - start - (verts[mid].x - verts[bot].x)
            : (verts[mid].x - (i * (1/slopeTM))) - start - (verts[mid].x - verts[top].x)
        );

        // Drawing line
        if (width < 0) {
            for (var ii = -width; ii >= 0; ii--)
                putPx(start - ii, y, COL_FG);
        }
        else {
            for (var ii = 0; ii < width; ii++)
                putPx(start + ii, y, COL_FG);
        }

        for (var ii = 0; ii < width; ii++)
            putPx(start + ii, y, COL_FG);
    }

    // Debug vertices
    for (var i = 0; i < 3; i++)
        putPx(verts[i].x, verts[i].y, COL_DEBUG);
}

// --- Execution
function resetScene() {
    clearBg();
    renderScene();
}
resetScene();

const defaultVerts = [
    // [
    //     {x: 10, y: 200},
    //     {x: 150, y: 10},
    //     {x: 200, y: 150}
    // ],

    // [
    //     {x: 20, y: 10},
    //     {x: 20, y: 20},
    //     {x: 10, y: 20},
    // ],
    // [
    //     {x: 30, y: 10},
    //     {x: 30, y: 20},
    //     {x: 40, y: 20},
    // ],
    // [
    //     {x: 10, y: 30},
    //     {x: 40, y: 30},
    //     {x: (10+40)/2, y: 40},
    // ],

    [
        {x: 0, y: CANV_H/2},
        {x: CANV_W/2, y: 0},
        {x: CANV_W, y: CANV_H/2},
    ],
    [
        {x: 0, y: CANV_H/2},
        {x: CANV_W, y: CANV_H/2},
        {x: CANV_W/2, y: CANV_H},
    ],
];

setInterval(() => {
    defaultVerts[0][1].y++;
    defaultVerts[1][2].y--;

    defaultVerts[0][0].x++;
    defaultVerts[0][2].x--;
    defaultVerts[1][0].x++;
    defaultVerts[1][1].x--;

    resetScene();
    defaultVerts.forEach(v => rasterizeVerts(v));
    renderScene();
}, 1000/60);