// Solid Rasterization Demo
// nectarboy | 2021
// * This isn't really real 3D i think :3

// --- Scene
const CANV_W = 256;
const CANV_H = 256;

const SCENE = new Scene('canv', CANV_W, CANV_H);

const MSG = document.getElementById('msg');
const MSG_TEXT = MSG.innerHTML;
    
// --- Execution
var currentRender = 0;
const renders = [
    // Scalene triangle
    {
        verts: [
            [
                {x: 10, y: 200},
                {x: 150, y: 10},
                {x: 200, y: 150}
            ]
        ],
        func() {}
    },

    // Smiley face
    {
        verts: [
            [
                {x: 20, y: 10},
                {x: 20, y: 20},
                {x: 10, y: 20},
            ],
            [
                {x: 30, y: 10},
                {x: 30, y: 20},
                {x: 40, y: 20},
            ],
            [
                {x: 10, y: 30},
                {x: 40, y: 30},
                {x: (10+40)/2, y: 40},
            ]
        ],
        func() {
            for (var i = 0; i < this.verts.length; i++) {
                for (var ii = 0; ii < this.verts[i].length; ii++) {
                    this.verts[i][ii].x += 2;
                    this.verts[i][ii].y += 2;
                }
            }
        }
    },

    // Expanding square
    {
        verts: [
            [
                {x: 0, y: CANV_H/2},
                {x: CANV_W/2, y: 0},
                {x: CANV_W, y: CANV_H/2},
            ],
            [
                {x: 0, y: CANV_H/2},
                {x: CANV_W, y: CANV_H/2},
                {x: CANV_W/2, y: CANV_H},
            ]
        ],
        func() {
            this.verts[0][1].y++;
            this.verts[1][2].y--;

            this.verts[0][0].x++;
            this.verts[0][2].x--;
            this.verts[1][0].x++;
            this.verts[1][1].x--;
        }
    }
];

document.addEventListener('keydown', e => {
    if (e.code === 'ArrowRight') {
        currentRender++;
        if (currentRender === renders.length)
            currentRender = 0;
    }
    else if (e.code === 'ArrowLeft') {
        if (currentRender === 0)
            currentRender = renders.length;
        currentRender--;
    }
    else return;

    MSG.innerHTML = MSG_TEXT + '\nrender demo: ' + (currentRender+1);
});

setInterval(() => {
    renders[currentRender].func();

    SCENE.clearScene();
    renders[currentRender].verts.forEach(v => rasterizeSolid(SCENE, v, SCENE.COL_FG));
    SCENE.renderScene();
}, 1000/20);