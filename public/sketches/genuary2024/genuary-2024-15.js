/// <reference types="p5/global" />
// module aliases

// constants

// locals
let Engine = Matter.Engine,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  World = Matter.World,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Events = Matter.Events,
  Body = Matter.Body,
  Constraint = Matter.Constraint;
let engine = Engine.create();
let world = engine.world;
let tx, ty;
let maxTx = 0;
framesSinceLastMaxTx = 0;
let velocity = 0.5;

let bodies = [];
let car;

class Rect {
  constructor(x, y, w, h, a, isStatic = true, c = 255) {
    this.body = Bodies.rectangle(x, y, w, h, {
      angle: a,
      isStatic,
    });
    this.w = w;
    this.h = h;
    this.c = c;
    World.add(engine.world, this.body);
  }

  draw() {
    fill(this.c);
    noStroke();
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x - tx, pos.y - ty);
    rotate(angle);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

class Car {
  constructor(x, y, w, h, wheelSize, bodyColor, wheelColor) {
    this.group = Body.nextGroup(true);
    let wheelBase = 20;
    let wheelAOffset = -w * 0.5 + wheelBase;
    let wheelBOffset = w * 0.5 - wheelBase;
    let wheelYOffset = 0;
    this.bodyColor = bodyColor;
    this.wheelColor = wheelColor;
    this.w = w;
    this.h = h;
    this.wheelSize = wheelSize;
    this.car = Composite.create({ label: 'Car' });
    this.body = Bodies.rectangle(x, y, w, h, {
      collisionFilter: {
        group: this.group,
      },
      chamfer: {
        radius: h * 0.5,
      },
      density: 0.0002,
    });

    this.wheelA = Bodies.circle(x + wheelAOffset, y + wheelYOffset, wheelSize, {
      collisionFilter: {
        group: this.group,
      },
      friction: 0.8,
    });

    this.wheelB = Bodies.circle(x + wheelBOffset, y + wheelYOffset, wheelSize, {
      collisionFilter: {
        group: this.group,
      },
      friction: 0.8,
    });

    this.axelA = Constraint.create({
      bodyB: this.body,
      pointB: { x: wheelAOffset, y: wheelYOffset },
      bodyA: this.wheelA,
      stiffness: 1,
      length: 0,
    });

    this.axelB = Constraint.create({
      bodyB: this.body,
      pointB: { x: wheelBOffset, y: wheelYOffset },
      bodyA: this.wheelB,
      stiffness: 1,
      length: 0,
    });

    // World.add(engine.world, this.body);
    Composite.addBody(this.car, this.body);
    Composite.addBody(this.car, this.wheelA);
    Composite.addBody(this.car, this.wheelB);
    Composite.addConstraint(this.car, this.axelA);
    Composite.addConstraint(this.car, this.axelB);

    Composite.add(world, this.car);
  }

  draw() {
    [this.wheelA, this.wheelB].forEach((wheel) => {
      Body.setAngularVelocity(wheel, velocity);
    });
    const pos = this.body.position;
    const angle = this.body.angle;
    fill(this.bodyColor);
    push();
    translate(pos.x - tx, pos.y - ty);
    rotate(angle);
    rect(0, 0, this.w, this.h);
    pop();

    fill(this.wheelColor);
    noStroke();
    [this.wheelA, this.wheelB].forEach((wheel) => {
      push();
      translate(wheel.position.x - tx, wheel.position.y - ty);
      rotate(wheel.angle);
      stroke(0);
      // circle(0, 0, wheel.circleRadius);
      circle(0, 0, wheel.circleRadius * 2);
      //draw spokes
      for (let a = 0; a < TWO_PI; a += TWO_PI / 4) {
        const { x, y } = polarToCartesian(this.wheelSize, a);
        line(0, 0, x, y);
      }
      // ellipse(wheel.position.x, wheel.position.y, wheel.circleRadius * 2);
      pop();
    });
  }
}

function setup() {
  const canvas = createCanvas(700, 700);
  stroke(255);
  rectMode(CENTER);
  setPalette('1115');
  bodies.push(new Rect(width / 2, height * 0.95, width, 20, 0, true, random(PALETTE)));
  car = new Car(width * 0.25, height * 0.5, 150, 25, 25, 255, 255);
  bodies.push(car);
  noLoop();
  // add mouse control
  // const mouse = Mouse.create(canvas.elt),
  //   mouseConstraint = MouseConstraint.create(engine, {
  //     mouse,
  //     constraint: {
  //       stiffness: 0.2,
  //     },
  //   });
  // mouse.pixelRatio = pixelDensity();
  // Composite.add(world, mouseConstraint);
  tx = 0;
  ty = 0;
}

function draw() {
  // translate(tx, ty);
  background(0);
  Engine.update(engine);
  for (let i = bodies.length - 1; i >= 0; i--) {
    bodies[i].draw();
  }
  if (car.body.position.x > tx + width * 0.25) {
    tx = car.body.position.x - width * 0.25;
  } else if (car.body.position.x < tx + width * 0.25) {
    tx = car.body.position.x - width * 0.25;
  }
  if (car.body.position.y > ty + height * 0.25) {
    ty = car.body.position.y - height * 0.25;
  } else if (car.body.position.y < ty + height * 0.25) {
    ty = car.body.position.y - height * 0.25;
  }

  if (frameCount % 30 === 0) {
    for (let i = 0; i < 10; i++) {
      const rect = new Rect(
        tx + random(-width * 2, width * 2),
        ty + random(height * 1.5, 3 * height),
        random(0.1 * width, width),
        20,
        random(-PI / 3, PI / 3),
        true,
        random(PALETTE)
      );
      bodies.push(rect);
    }
  }

  if (tx > maxTx) {
    maxTx = tx;
    framesSinceLastMaxTx = 0;
  } else {
    framesSinceLastMaxTx++;
  }

  if (framesSinceLastMaxTx >= 120) {
    velocity *= -1;
    framesSinceLastMaxTx = 0;
  }
}

let isLooping = false;
function mouseClicked() {
  if (isLooping) {
    noLoop();
  } else {
    loop();
  }

  isLooping = !isLooping;
}

P5Capture.setDefaultOptions({
  // disableUi: true,
  format: 'mp4',
  quality: 1,
  framerate: 60,
});
