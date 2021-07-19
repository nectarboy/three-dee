// Rasterization Engine
// nectarboy | 2021
// * The basis / framework of rasterization, equipped with a callback for general use.

// --- Rasterization
var curr_verts = [
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0}
];

// @param 'scene' is a Scene object.
// @param 'verts' is an Array full of Objects containing 'x' and 'y' coordinates in Integers.
// @param 'callback' is a Function called with parameters 'x' and y' coordinates for each rasterized pixel.
function rasterize(scene, verts, callback) {
    // Check for invalid input
    if (typeof callback !== 'function')
        throw 'rasterization engine :: invalid Callback !';

    if (typeof scene !== 'object')
        throw 'rasterization engine :: invalid Scene !';
    if (typeof verts !== 'object')
        throw 'rasterization engine :: invalid Verts !';

    if (verts.length !== 3)
        throw 'rasterization engine :: insufficient vertices in Verts !';

    // Fit vertices to ints for the naughty boys
    curr_verts[0].x = 0|verts[0].x; curr_verts[0].y = 0|verts[0].y;
    curr_verts[1].x = 0|verts[1].x; curr_verts[1].y = 0|verts[1].y;
    curr_verts[2].x = 0|verts[2].x; curr_verts[2].y = 0|verts[2].y;

    // Find main points of the vertices
    var top = 0;
    var bot = 0;
    switch (Math.min(curr_verts[0].y, curr_verts[1].y, curr_verts[2].y)) {
        case curr_verts[0].y: top = 0; break;
        case curr_verts[1].y: top = 1; break;
        case curr_verts[2].y: top = 2; break;
    }
    switch (Math.max(curr_verts[0].y, curr_verts[1].y, curr_verts[2].y)) {
        case curr_verts[0].y: bot = 0; break;
        case curr_verts[1].y: bot = 1; break;
        case curr_verts[2].y: bot = 2; break;
    }

    const mid = ((((top+1) ^ (bot+1)) - 1) >>> 0) % 3; // Ugly ass formula i came up with :>
    // console.log(curr_verts[top].y, curr_verts[mid].y, curr_verts[bot].y); // Should be in (lo-mid-hi) order !

    // Calculate slopes ...
    const slopeTB = (-curr_verts[bot].y + curr_verts[top].y) / (curr_verts[bot].x - curr_verts[top].x);
    const slopeTM = (-curr_verts[mid].y + curr_verts[top].y) / (curr_verts[mid].x - curr_verts[top].x);
    const slopeBM = (-curr_verts[mid].y + curr_verts[bot].y) / (curr_verts[mid].x - curr_verts[bot].x);
    // console.log(slopeTB, slopeTM, slopeBM);

    // Rasterize from top to bottom !
    const height = (curr_verts[bot].y - curr_verts[top].y)+1;
    for (var i = 0; i < height; i++) {
        const y = curr_verts[top].y + i;

        // Calculating line
        const start = Math.floor(curr_verts[top].x - (i * (1/slopeTB)));
        const width = Math.ceil((y > curr_verts[mid].y) // (Are we below the middle vert ?)
            ? (curr_verts[mid].x + ((height - i) * (1/slopeBM))) - start - (curr_verts[mid].x - curr_verts[bot].x)
            : (curr_verts[mid].x - (i * (1/slopeTM))) - start - (curr_verts[mid].x - curr_verts[top].x)
        );

        // Drawing line
        if (width < 0) {
            for (var ii = -width; ii >= 0; ii--)
                callback(0|(start - ii), 0|y);
        }
        else {
            for (var ii = 0; ii < width; ii++)
                callback(0|(start + ii), 0|y);
        }
    }

    // Debug vertices uwu
    for (var i = 0; i < 3; i++)
        scene.putPx(curr_verts[i].x, curr_verts[i].y, scene.COL_DEBUG);
}