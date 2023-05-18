export function drawRect(x: number, y: number, w: number, h: number, color: string, ctx: CanvasRenderingContext2D | null) {
    ctx!.fillStyle = color;
    ctx!.fillRect(x, y, w, h);
}
  
export function drawCircle(x: number, y: number, r: number, color: string, ctx: CanvasRenderingContext2D | null) {
    ctx!.fillStyle = color;
    ctx!.beginPath();
    ctx!.arc(x, y, r, 0, Math.PI * 2, false);
    ctx!.closePath();
    ctx!.fill();
}

export function drawText(text: number, x: number, y: number, color: string, ctx: CanvasRenderingContext2D | null) {
    ctx!.fillStyle = color;
    ctx!.font = "35px fantasy";
    ctx!.fillText(text.toString(), x, y);
}

export function drawCircleBall(gameMode: number, ball: any, ctx: CanvasRenderingContext2D | null) { // :TODO any... by hena
    // A variable representing the degree of flicker
    const ballBlinkRate = 50;

    // Ball drawing logic according to mode
    if (gameMode === 0) {         // normal mode
        drawCircle(ball.x, ball.y, ball.radius, 'WHITE', ctx);
    } else if (gameMode === 1) {  // extended mode
        if (Math.floor(ball.x / ballBlinkRate) % 2 === 0) {
            drawCircle(ball.x, ball.y, ball.radius, "WHITE", ctx);
        }
        else if (Math.floor(ball.x / ballBlinkRate) % 2 === 1) {
            drawCircle(ball.x, ball.y, ball.radius, "BLACK", ctx);
        }
    } else {                      // Error Detected!!!
        //console.log("drawCircle_extension function Error value Detected");
    }
}
