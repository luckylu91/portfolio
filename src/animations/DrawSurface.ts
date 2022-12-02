export class DrawSurface {
  ctx: CanvasRenderingContext2D;
  offset!: number[];
  scale!: number;
  size!: number;

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.update();
  }

  update() {
    this.size = this.canvas.width;
    this.canvas.height = this.size;
    this.offset = [this.size / 2, this.size / 2];
    this.scale = this.size / (2 * Math.sqrt(3));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
  }
}
