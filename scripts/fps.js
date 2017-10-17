var frameCount = 0;
var lastTime, fpsContainer, fps;

var initFPSCounter = (canvas) => {
    fpsContainer = document.createElement("div");
    document.body.insertBefore(fpsContainer, canvas);
    //document.body.appendChild(fpsContainer);
};
var measureFps = (newTime) => {
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
};