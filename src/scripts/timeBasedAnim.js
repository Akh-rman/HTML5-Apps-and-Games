var delta, oldTime = 0;

function timer(currentTime) {
    var delta = currentTime - oldTime;
    oldTime = currentTime;
    return delta;
}

var calcDistanceToMove = (delta, speed) => {
    return (speed * delta) / 1000;
};