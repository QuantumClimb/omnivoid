/**
 * Agent class for particle system simulation
 */
export class Agent {
  /**
   * Create a new Agent
   * @param {number} width Canvas width
   * @param {number} height Canvas height
   * @param {number} index Agent index for frequency mapping
   */
  constructor(width, height, index = 0) {
    this.index = index;
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
   * @param {number} speedMultiplier Speed multiplier for audio reactivity (default: 1)
   */
  update(width, height, speedMultiplier = 1) {
    this.x += this.vx * speedMultiplier;
    this.y += this.vy * speedMultiplier;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  /**
   * Draw agent on canvas
   * @param {CanvasRenderingContext2D} ctx Canvas context
   * @param {number} size Size of the agent (default: 2)
   */
  draw(ctx, size = 2) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
} 