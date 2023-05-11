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