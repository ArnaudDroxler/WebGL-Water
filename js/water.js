
var canvas = null;
var gl = null;

var camera = null;
var skybox = null;
var grid = null;

window.onload = function() {
    canvas = document.getElementById('glcanvas');
    try {
        gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl", {antialias: true}));
        let uint = gl.getExtension("OES_element_index_uint");
        let displayWidth = document.getElementById('container').clientWidth;
        let displayHeight = document.getElementById('container').clientHeight;
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewportWidth = displayWidth;
        gl.viewportHeight = displayHeight;
    }
    catch(e) {
    }
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    init();

};

function init(){

    camera =  new Camera([0.0, 1.0, 2.0],[0.0, 1.0, 0.0],[0.0, 0.0, -1.0]);
    grid = new Grid("textures/waternormal1.jpg",gl);
    skybox = new Skybox("textures/skybox/mountain/",gl);

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    tick();
}

function tick() {
    requestAnimFrame(tick);
    resizeCanvas();
    animate();
    drawScene();
}


function drawScene(){

        var projection = mat4.create();
        mat4.perspective(projection, degToRad(70),gl.viewportWidth / gl.viewportHeight, 0.01, 1000.0);

        var view = mat4.create();//camera.getViewMatrix();
        mat4.translate(view, view, [0.0, -50.0, -20.0]);
        mat4.rotateX(view, view, degToRad(20));

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT);

        grid.draw(view,projection,skybox);

        skybox.draw(view,projection);

}

function animate() {
    grid.animate();
}

function resizeCanvas() {
    var displayWidth = document.getElementById('container').clientWidth;
    var displayHeight = document.getElementById('container').clientHeight;

    if (gl.viewportWidth != displayWidth || gl.viewportHeight != displayHeight) {
        gl.viewportWidth = displayWidth;
        gl.viewportHeight = displayHeight;
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

function degToRad(degrees) {
    return (degrees * Math.PI / 180.0);
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 87) { //w
        camera.processKeyboard(0,)
    }
    else if(event.keyCode == 39) {

    }
});


