var GF = function () {
    var frameCount = 0;
    var lastTime, fpsContainer, fps;
    var canvas, ctx, w, h;
    
    // vars for handling inputs
    var inputStates = {};
    
    var measureFps = function (newTime) {
        if (lastTime == undefined) {
            lastTime = newTime;
            return;
        }
        
        // calculate the delta between last & current frame
        var diffTime = newTime - lastTime;
        
        if (diffTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }
        
        fpsContainer.innerHTML = "FPS " + fps;
        frameCount++;
    }
    
    var mainLoop = function (time) {
        measureFps(time);
        
        // clear canvas
        clearCanvas();
        
        // draw a monster
        drawMonster(10 + Math.random() * 10, 10 + Math.random() * 10);
        
        // check inputStates
        if (inputStates.left) {
            ctx.fillText("left", 150, 20);
        }
        
        if (inputStates.up) {
            ctx.fillText("up", 150, 50);
        }
        
        if (inputStates.right) {
            ctx.fillText("right", 150, 80);
        }
        
        if (inputStates.down) {
            ctx.fillText("down", 150, 120);
        }
        
        if (inputStates.space) {
            ctx.fillText("space bar", 140, 150);
        }
        
        if (inputStates.mousePos) {
            ctx.fillText("x = " + inputStates.mousePos.x + " y = " + inputStates.mousePos.y, 5, 150);
        }
        
        if (inputStates.mousedown) {
            ctx.fillText("mousedown  b" + inputStates.mouseButton, 5, 180);
        }
        
        requestAnimationFrame(mainLoop);
    }
    
    function getMousePos (evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    
    var start = function (time) {
        canvas = document.querySelector("#myCanvas");

        w = canvas.width;
        h = canvas.height;

        ctx = canvas.getContext("2d");
        ctx.font = "20px Arial";
        
        fpsContainer = document.createElement("div");
        document.body.insertBefore(fpsContainer, canvas);
        
        // add the listener to the main, window object, and update the states
        window.addEventListener("keydown", (event) => {
            if (event.keyCode === 37) {
                inputStates.left = true;
            } else if (event.keyCode === 38) {
                inputStates.up = true;
            } else if (event.keyCode === 39) {
                inputStates.right = true;
            } else if (event.keyCode === 40) {
                inputStates.down = true;
            } else if (event.keyCode === 32) {
                inputStates.space = true;
            }
        }, false);
        
        // if the key is released, change the states object
        window.addEventListener("keyup", (event) => {
            if (event.keyCode === 37) {
                inputStates.left = false;
            } else if (event.keyCode === 38) {
                inputStates.up = false;
            } else if (event.keyCode === 39) {
                inputStates.right = false;
            } else if (event.keyCode === 40) {
                inputStates.down = false;
            } else if (event.keyCode === 32) {
                inputStates.space = false;
            }
        }, false);
        
        // mouse event listeners
        canvas.addEventListener("mousemove", (evt) => {
            inputStates.mousePos = getMousePos(evt);
        }, false);
        
        canvas.addEventListener("mousedown", (evt) => {
            inputStates.mousedown = true;
            inputStates.mouseButton = evt.button;
        }, false);
        
        canvas.addEventListener("mouseup", (evt) => {
            inputStates.mousedown = false;
        }, false);
        
        requestAnimationFrame(mainLoop);
    }
    
    function clearCanvas() {
        ctx.clearRect(0, 0, w, h);
    }
    
    function drawMonster(x, y) {
        ctx.save();
        ctx.translate(x, y);

        ctx.strokeRect(0, 0, 100, 100);

        // eyes
        ctx.fillRect(20, 20, 10, 10);
        ctx.fillRect(65, 20, 10, 10);

        // nose
        ctx.strokeRect(45, 40, 10, 40);

        // mouth
        ctx.strokeRect(35, 84, 30, 10);

        // teeth 
        ctx.fillRect(38, 84, 10, 10);
        ctx.fillRect(52, 84, 10, 10);

        ctx.restore();
    }
    
    return {
        start: start
    };
}

window.onload = function init () {
    var game = new GF();
    game.start();
}