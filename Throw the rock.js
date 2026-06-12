console.log("Running Throw the rock");

let bg, slingImg;
let rock1, rock2, rock3;//rocks 
let t1, t2, t3;//targets
let p1, p2, p3, p4, tnt;//platform that targets on//

let holding = false;
let curRock = null;
let rockNum = 0;

let slingX = 210, slingY = 620;
let forkLX = 178, forkLY = 578;
let forkRX = 238, forkRY = 572;

let score = 0;//score point 
let h1 = false, h2 = false, h3 = false;
let gameState = "start";
let restartBtn = {x:600, y:600, w:300, h:80};

let POWER = 0.16;
let GRAV = 0.018;
let MAX_PULL = 120;

let flyX = 0, flyY = 0, flyVX = 0, flyVY = 0, flyT = 0;
let startX = 0, startY = 0;
let isShooting = false;
let flyingRock = null;

// Preload the Images //
function preload() {
  bg = loadImage("../images/FlyBirds.png");
  slingImg = loadImage("../images/slingshot.png");
}

// Canvas//
function setup() {
  createCanvas(1500, 900);
  world.gravity.y = 4;
  setupGame();
}

//Game setup to the rocks and the blocks, all sprites in position //
function setupGame() {
  score = 0;
  rockNum = 0;
  holding = false;
  curRock = null;
  isShooting = false;
  flyingRock = null;
  h1 = false; h2 = false; h3 = false;

  let allSprites = [rock1,rock2,rock3,t1,t2,t3,p1,p2,p3,p4,tnt];
  for (let s of allSprites) { if(s) s.remove(); }
  t1=null; t2=null; t3=null;
  p1=null; p2=null; p3=null;

  rock1 = new Sprite(slingX, slingY, 25, 25);// rocks1 position
  rock1.color = "blue";
  rock1.collider = "static";

  rock2 = new Sprite(95, 780, 25, 25);// rocks2 position
  rock2.color = "blue";
  rock2.collider = "none";

  rock3 = new Sprite(130, 780, 25, 25);// rocks1 position
  rock3.color = "blue";
  rock3.collider = "none";

  let x1 = random(850,1100), x2 = random(1050,1300), x3 = random(1250,1450);// Random position every time when restart
  let y1 = random(120,250),  y2 = random(350,500),   y3 = random(450,650);

  t1 = new Sprite(x1, y1, 40, 40); t1.color = "red"; t1.collider = "static";//targets 
  t2 = new Sprite(x2, y2, 40, 40); t2.color = "red"; t2.collider = "static";
  t3 = new Sprite(x3, y3, 40, 40); t3.color = "red"; t3.collider = "static";

  p1 = new Sprite(x1, y1+25, 100, 10, "static"); p1.color = "green";// platforms for the targets
  p2 = new Sprite(x2, y2+25, 100, 10, "static"); p2.color = "green";
  p3 = new Sprite(x3, y3+25, 100, 10, "static"); p3.color = "green";



}
// Slingshot pull mechanisam //
function getPullPos() {
  let d = dist(mouseX, mouseY, slingX, slingY);
  if (d > MAX_PULL) {
    let a = atan2(mouseY-slingY, mouseX-slingX);
    return { x: slingX+cos(a)*MAX_PULL, y: slingY+sin(a)*MAX_PULL };
  }
  return { x: mouseX, y: mouseY };//return to normal after throw a rock 
}

//When hit start button game start,  when mouse pressed //
function mousePressed() {
  if (gameState == "start") { gameState = "playing"; return; }

  if (gameState == "end") {
    let b = restartBtn;
    if (mouseX>b.x && mouseX<b.x+b.w && mouseY>b.y && mouseY<b.y+b.h) {
      setupGame();
      gameState = "playing";
    }
    return;
  }

  if (isShooting) return;

  let r = [rock1, rock2, rock3][rockNum];
  if (r && dist(mouseX, mouseY, r.position.x, r.position.y) < 50) {
    curRock = r;
    holding = true;
    curRock.collider = "static";
    curRock.velocity.x = 0;
    curRock.velocity.y = 0;
  }
}
//When mouseresealed while pulling the rocks the rock will get thrown (also add time delay to fix a bug )//
function mouseReleased() {
  if (gameState != "playing" || !holding || !curRock) return;
  holding = false;

  let pos = getPullPos();
  startX = pos.x; startY = pos.y;
  flyX = startX; flyY = startY;
  flyVX = (slingX - pos.x) * POWER;
  flyVY = (slingY - pos.y) * POWER;
  flyT = 0;
  isShooting = true;
  flyingRock = curRock;
  flyingRock.collider = "none";
  curRock = null;
  rockNum++;

  if (rockNum == 1) setTimeout(() => {
    if(rock2) { rock2.position.x=slingX; rock2.position.y=slingY; rock2.collider="static"; }// add delay prevent a bug
  }, 600);

  if (rockNum == 2) setTimeout(() => {
    if(rock3) { rock3.position.x=slingX; rock3.position.y=slingY; rock3.collider="static"; }
  }, 600);
}
//This update Flying rock  from glicthing//
function updateFlyRock() {
  if (!isShooting || !flyingRock) return;
  flyT++;

  let px = flyX, py = flyY;
  flyX = startX + flyVX * flyT;
  flyY = startY + flyVY * flyT + 0.5 * GRAV * flyT * flyT;
  flyingRock.position.x = flyX;
  flyingRock.position.y = flyY;

  for (let s = 0; s <= 8; s++) {
    checkHit(lerp(px, flyX, s/8), lerp(py, flyY, s/8));
  }

  if (flyX > width || flyY > height || flyX < 0) {
    isShooting = false;
    flyingRock = null;
    if (rockNum >= 3) setTimeout(() => { gameState = "end"; }, 1500);
  }
}
//When hit the target it goes to dynamic so it will fall//
function hitTarget(t, p) {
  t.collider = "dynamic";
  t.color = color(255, 120, 0);
  t.velocity.x = 3;
  t.velocity.y = -4;
  if (p) { p.collider = "dynamic"; p.velocity.y = -2; }
  score++;
  if (h1 && h2 && h3) setTimeout(() => { gameState = "end"; }, 1500);
}
// this chck when it got hit by a rock
function checkHit(rx, ry) {
  if (!h1 && t1 && dist(rx,ry,t1.position.x,t1.position.y) < 42) { h1=true; hitTarget(t1,p1); }
  if (!h2 && t2 && dist(rx,ry,t2.position.x,t2.position.y) < 42) { h2=true; hitTarget(t2,p2); }
  if (!h3 && t3 && dist(rx,ry,t3.position.x,t3.position.y) < 42) { h3=true; hitTarget(t3,p3); }
}
// Draw the star screen at the first and end screen at end of each game //
function draw() {
  background(200);
  if (gameState == "start") { drawStartScreen(); return; }
  if (gameState == "end")   { drawEndScreen();   return; }

  image(bg, 0, 0, width, height);
  image(slingImg, 100, height-330, 220, 220);

  updateFlyRock();

  if (holding && curRock) {
    let pos = getPullPos();//pull by mouse

    curRock.position.x = pos.x;
    curRock.position.y = pos.y;
    stroke(80,40,10); strokeWeight(4);
    line(forkLX, forkLY, pos.x, pos.y);
    line(forkRX, forkRY, pos.x, pos.y);
    noStroke();
    drawDots(pos.x, pos.y);
  }

  fill(0); noStroke(); textSize(40);
  text("Score: " + score, 75, 30);
}
// THis function is basically to draw the dotline where the rock getting thrown//
function drawDots(rx, ry) {
  let vx = (slingX-rx)*POWER;
  let vy = (slingY-ry)*POWER;
  noStroke();
  for (let i = 1; i <= 500; i++) {
    let dx = rx + vx*i;
    let dy = ry + vy*i + 0.5*GRAV*i*i;
    if (dx>width || dy>height || dx<0) break;
    fill(255, 240, 60, 200);
    circle(dx, dy, 5);
  }
}
// Start background before game 
function drawStartScreen() {
  background(135, 206, 235);
  fill(255,220,0); noStroke(); circle(1300, 120, 140);
  fill(80,160,60); rect(0, 800, width, 100);
  fill(255,140,0); rect(width/2-320, 150, 640, 120, 20);
  fill(255); textAlign(CENTER); textSize(70); textStyle(BOLD);
  text("FLY BIRDS!", width/2, 240);
  fill(50); textSize(30); textStyle(NORMAL);

  text("Hit all 3 red targets to win!", width/2, 350);
  fill(80); textSize(22);
  text("Drag a blue rock back and release to shoot", width/2, 400);
  if (frameCount % 60 < 40) {
    fill(255,60,60); rect(width/2-200, 490, 400, 90, 15);
    fill(255); textSize(38); textStyle(BOLD);
    text("CLICK TO PLAY!", width/2, 549);
  }
  textStyle(NORMAL);
}
// End screen after game
function drawEndScreen() {
  background(30, 30, 60);

  fill(255,255,200); noStroke();
  for (let i = 0; i < 60; i++) circle((i*137)%width, (i*97)%500, 3);
  fill(200,50,50); rect(width/2-300, 150, 600, 110, 20);

  fill(255); textAlign(CENTER); textSize(65); textStyle(BOLD);

  text("GAME OVER", width/2, 230);// when all targets get hit or if u lose all your rocks it show game over and it show the your score there
  fill(255,200,0); rect(width/2-160, 290, 320, 80, 15);
  fill(30); textSize(36); textStyle(NORMAL);
  text("Score: " + score, width/2, 343);
  let stars = min(score, 3);

  textSize(55);// text size and color
  for (let i = 0; i < 3; i++) {
    fill(i < stars ? color(255,220,0) : color(100));
    text("★", width/2-70+i*70, 440);
  }
  fill(60,180,80); rect(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h, 15);
  fill(255); textSize(34); textStyle(BOLD);

  text("RESTART", width/2, restartBtn.y+52);// restart button  (restart the game)
  textStyle(NORMAL);
}