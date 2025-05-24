/**
 * Agent class for particle system simulation
 */
export class Agent {
  /**
   * Create a new Agent
   * @param {number} width Canvas width
   * @param {number} height Canvas height
   */
  constructor(width, height) {
    this.reset(width, height);
  }

  /**
   * Reset agent to a random position
   * @param {number} width Canvas width
   * @param {number} height Canvas height
   */
  reset(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5);
    this.vy = (Math.random() - 0.5);
  }

  /**
   * Update agent position
   * @param {number} width Canvas width
   * @param {number} height Canvas height
   */
  update(width, height) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  /**
   * Draw agent on canvas
   * @param {CanvasRenderingContext2D} ctx Canvas context
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
} 