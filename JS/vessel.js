// Represents a moving vessel on a 2D plane

export class Vessel {
  constructor(id, x, y, speed, headingDeg, isOwnShip = false) {
    this.id = id;
    this.x = x;                    // position X
    this.y = y;                    // position Y
    this.speed = speed;            // units per second
    this.headingDeg = headingDeg;  // heading in degrees
    this.isOwnShip = isOwnShip;

    this.radius = isOwnShip ? 8 : 6; // for rendering
  }

  // Convert heading to radians
  get headingRad() {
    return (this.headingDeg * Math.PI) / 180;
  }

  // Velocity components
  get velocity() {
    return {
      vx: this.speed * Math.cos(this.headingRad),
      vy: this.speed * Math.sin(this.headingRad)
    };
  }

  // Update vessel position based on delta time (seconds)
  update(dt) {
    this.x += this.velocity.vx * dt;
    this.y += this.velocity.vy * dt;
  }

  // Change speed safely
  setSpeed(newSpeed) {
    this.speed = Math.max(0, newSpeed);
  }

  // Change heading safely (0–360)
  setHeading(newHeadingDeg) {
    this.headingDeg = ((newHeadingDeg % 360) + 360) % 360;
  }
}
