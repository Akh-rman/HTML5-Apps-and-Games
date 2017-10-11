var GF = function () {
    var frameCount = 0;
    var lastTime, fpsContainer, fps;
    var canvas, ctx, w, h;
    
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
        
        //document.body.innerHTML = Math.random();
        requestAnimationFrame(mainLoop);
    }
    
    var start = function (time) {
        canvas = document.querySelector("#myCanvas");

        w = canvas.width;
        h = canvas.height;

        ctx = canvas.getContext("2d");
        
        fpsContainer = document.createElement("div");
        document.body.insertBefore(fpsContainer, canvas);
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