// Textured Rasterization Demo
// nectarboy | 2021
// * This gonna be hard :( !!

// --- Scene
const CANV_W = 256;
const CANV_H = 256;

const SCENE = new Scene('canv', CANV_W, CANV_H);

// --- Resources
var data = null;
function loadImgIntoData(url) {
    const img = new Image();
    img.onload = function() {
        const tempCanv = document.createElement('canvas');
        const ctx = tempCanv.getContext('2d');
        tempCanv.width = img.width;
        tempCanv.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);
        data = ctx.getImageData(0, 0, img.width, img.height);

        demo(img);
        console.log('img loaded - demo time :D');
    };

    img.src = url;
}

// --- Execution
var running = false;
function demo(img) {
    if (running) return;
        running = true;

    document.body.appendChild(img);
}

loadImgIntoData('../../assets/tiles.png');