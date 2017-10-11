var GF = function () {
    var frameCount = 0;
    var lastTime, fpsContainer, fps;
    
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
        
        //document.body.innerHTML = Math.random();
        requestAnimationFrame(mainLoop);
    }
    
    var start = function (time) {
        fpsContainer = document.createElement("div");
        let canvas = document.getElementById("myCanvas");
        document.body.insertBefore(fpsContainer, canvas);
        requestAnimationFrame(mainLoop);
    }
    
    return {
        start: start
    };
}

var game = new GF();
game.start();

var canvas, ctx, w, h;

window.onload = function init () {
    canvas = document.querySelector("#myCanvas");
    
    w = canvas.width;
    h = canvas.height;
    
    ctx = canvas.getContext("2d");
    
    drawMonster(10, 10);
}

function drawMonster (x, y) {
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