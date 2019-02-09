const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(28, 28);

const matrix = [
  [0, 0, 0],
  [1, 1, 0],
  [0, 1, 1],
];

//function detecting a collision
function collide(arena, player) {
  //breaking out player matrix and position
  const [m, o] = [player.matrix, player.pos];
  //we iterate over the player
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
        //we check if arena row exists (o is offset)
          (arena[y + o.y] &&
            //and check if column exists
           arena[y + o.y][x + o.x]) !== 0) {
        //returning true because collision happened
           return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  //while height is not zero we decrease it by one
  while (h--) {
    //we push a new width array filled with zeros (empty line)
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

//draw function
function draw() {
  context.fillStyle = '#3B1B2B';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'purple';
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}

//function to copy the values of the player and merge it into arena at correct positions
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    //if collision occured - set player back to top
    player.pos.y--;
    merge(arena, player);
    player.pos.y = 0;
  }
  dropCounter = 0;
}

let dropCounter = 0;
//drops every 1 second
let dropInterval = 1000;

let lastTime = 0;
//update function to draw continuously
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

//arena - the whole canvas area where we set width  with 12 units and hight with 20 units
const arena = createMatrix(12, 20);

//player structure that has a position and matrix
const player = {
  pos: {x: 2, y: 2},
  matrix: matrix,
};

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    //goes left if press left arrow
    player.pos.x--;
  } else if (event.keyCode === 39) {
    player.pos.x++;
  } else if (event.keyCode === 40) {
    playerDrop();
  }
})

update();



















