/// <reference types="p5/global" />
const MODEL_NAME = 'udnie';
const VIDEO_NAME = 'Genuary-2024-12.mov';

const style = ml5.styleTransfer(`public/assets/models/${MODEL_NAME}/`, modelLoaded);
let isModelLoaded = true;
// When the model is loaded
function modelLoaded() {
  isModelLoaded = true;
  log('Model Loaded!');
}

let pg;
let loaded = false;
let time = 0;
let img;
function setup() {
  createCanvas(600, 600);
  stroke(255);
  rectMode(CENTER);
  noLoop();
  pg = createGraphics(width, height);

  pg.rectMode(CENTER);
  pg.pixelDensity(1);
  pg.background(0);
  video = createVideo(`public/${VIDEO_NAME}`, () => {
    loaded = true;
    video.hide();

    drawNextFrame();
  });
}

let shouldStop = false;
const drawNextFrame = () => {
  // Only draw the image to the screen when the video
  // seek has completed
  const onSeek = () => {
    // draw();
    video.elt.removeEventListener('seeked', onSeek);
    pg.image(video, 0, 0, pg.width, pg.height);

    // Wait a half second and draw the next frame
    // setTimeout(drawNextFrame, 1000);
    ctx = pg.canvas.getContext('2d');
    imgData = ctx.getImageData(0, 0, width, height);
    style.transfer(imgData, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      img = createImg(result.src).hide();
      loop();
      // setTimeout(drawNextFrame, 1000);
    });
  };
  video.elt.addEventListener('seeked', onSeek);

  // Start seeking ahead
  video.time(time); // Seek ahead to the new time
  time += 1 / 60;

  if (time >= video.duration()) {
    shouldStop = true;
  }
};

function draw() {
  if (!loaded || !img) return;
  image(img, 0, 0, width, height);
  // fill('#F00');
  // noStroke();
  // textAlign(LEFT, TOP);
  // textSize(20);
  // text(round(time * 60), 20, 20);
  const paddedFrameCount = `${frameCount}`.padStart(5, '0');
  saveCanvas(`frame_${paddedFrameCount}`, 'png');

  noLoop();
  if (!shouldStop) {
    drawNextFrame();
  }
  // console.log(frameCount);
}

let isLooping = true;
function mouseClicked() {
  if (isLooping) {
    noLoop();
  } else {
    loop();
  }

  isLooping = !isLooping;
}

P5Capture.setDefaultOptions({
  disableUi: true,
  format: 'mp4',
  quality: 1,
  framerate: 60,
});
