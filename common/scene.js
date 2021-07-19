// Scene
// nectarboy | 2021
// * Basically the framework that pretty much
//   all these demos will use for display.

class Scene {
    constructor(canvId, width, height) {
        // --- Canvas
        const canv = document.getElementById(canvId);
            canv.width = width;
            canv.height = height;

        const ctx = canv.getContext('2d');
        const buffer = ctx.createImageData(CANV_W, CANV_H);

        // --- Public properties
        this.COL_BG = 0x222222;
        this.COL_FG = 0x00ff00;
        this.COL_DEBUG = 0xff0000;

        // --- Public methods
        // @param 'x' and 'y' are Numbers representing the coordinates of the pixel
        // @param 'color' is a Number representing the pixel color in RGB-24
        this.putPx = function(x, y, color) {
            if (x < 0 || x >= CANV_W || y < 0 || y >= CANV_H)
                return;

            var ind = 4 * (0|(y * CANV_W + x));

            buffer.data[ind++]  = (color >> 16) & 0xff;
            buffer.data[ind++]  = (color >> 8) & 0xff;
            buffer.data[ind++]  = (color >> 0) & 0xff;
            buffer.data[ind]    = 0xff;
        };

        this.clearScene = function() {
            for (var i = 0; i < CANV_W; i++)
                for (var ii = 0; ii < CANV_H; ii++)
                    this.putPx(i, ii, this.COL_BG);
        };

        this.renderScene = function() {
            ctx.putImageData(buffer, 0, 0);
        };
    };
}