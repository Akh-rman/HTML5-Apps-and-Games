// class for balls
class Ball {
    constructor(x, y, angle, v, diametr) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.v = v;
        this.radius = diametr / 2;
        this.dead = false;
    }

    draw(ctx) {
        ctx.save()
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        this.color = "black";
    }

    move() {
        // add horizontal increment to the x pos
        var incX = this.v * Math.cos(this.angle);
        // add vertical increment to the y pos
        var incY = this.v * Math.sin(this.angle);

        this.x += calcDistanceToMove(delta, incX);
        this.y += calcDistanceToMove(delta, incY);
    }
}