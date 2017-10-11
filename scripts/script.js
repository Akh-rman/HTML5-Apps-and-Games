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
        document.body.appendChild(fpsContainer);
        
        requestAnimationFrame(mainLoop);
    }
    
    return {
        start: start
    };
}

var game = new GF();
game.start();