//MouseInteractor.js

function MouseInteractor(){};

var p = MouseInteractor.prototype;

p.init = function(camera, canvas){

    this.camera = camera;
    this.canvas = canvas;

    this.dragging = false;
    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;
    this.lastX = 0;
    this.lastY = 0;
    this.button = 0;
    this.shift = false;
    this.key = 0;

    this.SENSITIVITY = 0.7;
};

p.setup = function(){

    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
};

p._onMouseDown = function(e){

    this.dragging = true;
    this.x = e.clientX;
    this.y = e.clientY;
    this.button = e.button;

};

p._onMouseUp = function(e){
    this.dragging = false;

};

p._onMouseMove = function(e){

    this.lastX = this.x;
    this.lastY = this.y;
    this.x = e.clientX;
    this.y = e.clientY;

    if (!this.dragging) return;
    // this.shift = e.shiftKey;



    // if (this.button == 0) {
        // if(this.shift){
    var dx=this.mousePosX(this.x) -this.mousePosX(this.lastX)
    var dy=this.mousePosY(this.y) -this.mousePosY(this.lastY)

    this.rotate(dx,dy);
        // }
        // else{
        //     var dy = this.y - this.lastY;
        //     this.translate(dy);
        // }
    // }

};

p.mousePosX = function(x){

    return 2 * (x / this.canvas.width) - 1;

};

p.mousePosY = function(y){

    return 2 * (y / this.canvas.height) - 1;

};

p.rotate = function(dx, dy){

    var camera = this.camera;
    camera.yaw(this.SENSITIVITY*dx);
    camera.pitch(this.SENSITIVITY*dy);
};

module.exports = MouseInteractor;
