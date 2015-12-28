//KeyboardInteractor.js

function KeyboardInteractor(){};

var p = KeyboardInteractor.prototype;

p.init = function(camera, canvas){

    this.cam = camera;
    this.canvas = canvas;
};

p.setup = function(){

    var self=this;
    document.onkeydown = function(event) {

        self.handleKeys(event);
    }
};

p.handleKeys = function(event){



    if(event.shiftKey) {
        switch(event.keyCode) {//determine the key pressed
            case 65://a key
                this.cam.roll(-Math.PI * 0.025);//tilt to the left
                break;
            case 37://left arrow
                this.cam.yaw(Math.PI * 0.025);//rotate to the left
                break;
            case 68://d key
                this.cam.roll(Math.PI * 0.025);//tilt to the right
                break;
            case 39://right arrow
                this.cam.yaw(-Math.PI * 0.025);//rotate to the right
                break;
            case 83://s key
            case 40://down arrow
                this.cam.pitch(Math.PI * 0.025);//look down
                break;
            case 87://w key
            case 38://up arrow
                this.cam.pitch(-Math.PI * 0.025);//look up
                break;
        }
    }
    else {
        var pos = this.cam.getPosition();
        
        switch(event.keyCode) {//deterime the key pressed
            case 65://a key
                this.cam.yaw(Math.PI * 0.025);//rotate to the left
                break;
            // case 37://left arrow
            //     this.cam.setPosition([pos[0]-.3,pos[1],pos[2]]);//move - along the X axis
            //     break;
            case 68://d key
                this.cam.yaw(-Math.PI * 0.025);//rotate to the left
                break;
            // case 39://right arrow
            //     this.cam.setPosition([pos[0]+.3,pos[1],pos[2]]);//more + along the X axis
            //     break;
            // case 83://s key
            //     this.cam.setPosition([pos[0],pos[1]-.3,pos[2]]);//move - along the Y axis (down)
            //     break;
            case 40://down arrow
            case 83:
                this.cam.moveForward(.3);//move + on the Z axis
                break;
            // case 87://w key
            //     this.cam.setPosition([pos[0],pos[1]+.3,pos[2]]);//move + on the Y axis (up)
            //     break;
            case 38://up arrow
            case 87:
                this.cam.moveForward(-.3);//move - on the Z axis
                break;
        }

        
    }
};

    //this.cam.setPosition([pos[0],pos[1],pos[2]-.3]);//move - on the Z axis

module.exports = KeyboardInteractor;