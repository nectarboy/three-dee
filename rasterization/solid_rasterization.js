// Solid Rasterization
// nectarboy | 2021
// * Rasterization of basic solid triangles using vertices

// --- Rasterization
// @param 'scene' is a Scene object.
// @param 'verts' is an Array full of Objects containing 'x' and 'y' coordinates in Integers.
// @param 'color' is a Number representing the solid color in RGB-24.
function rasterizeSolid(scene, verts, color) {
    rasterize(scene, verts,
        function(x, y) {
            scene.putPx(x, y, color);
        }
    );
}