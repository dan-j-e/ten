const car = document.getElementById("car");
const nodes = document.querySelectorAll(".node");

// Center of each node (left+20, top+20 since nodes are 40x40)
const nodePositions = {
  '1':      { x: 400, y: 270 },
  '2':      { x: 490, y: 190 },
  '3':      { x: 580, y: 265 },
  '4':      { x: 555, y: 400 },
  '5':      { x: 470, y: 510 },
  '6':      { x: 400, y: 580 },
  '7':      { x: 330, y: 510 },
  '8':      { x: 245, y: 400 },
  '9':      { x: 220, y: 265 },
  '10':     { x: 310, y: 190 },
  'center': { x: 400, y: 403 }
};

// Clockwise-first adjacency so BFS prefers the shorter clockwise route
const adjacency = {
  '1':      ['2', '10', 'center'],
  '2':      ['3', '1'],
  '3':      ['4', '2'],
  '4':      ['5', '3'],
  '5':      ['6', '4'],
  '6':      ['7', '5'],
  '7':      ['8', '6'],
  '8':      ['9', '7'],
  '9':      ['10', '8'],
  '10':     ['1', '9'],
  'center': ['1']
};

function nodeIdFromTitle(title) {
  if (title === 'Center') return 'center';
  return title.replace('Month ', '');
}

function findPath(from, to) {
  if (from === to) return [from];
  const queue = [[from, [from]]];
  const visited = new Set([from]);
  while (queue.length > 0) {
    const [node, path] = queue.shift();
    for (const neighbor of adjacency[node]) {
      if (!visited.has(neighbor)) {
        const newPath = [...path, neighbor];
        if (neighbor === to) return newPath;
        visited.add(neighbor);
        queue.push([neighbor, newPath]);
      }
    }
  }
  return null;
}

function placeCar(nodeId) {
  const pos = nodePositions[nodeId];
  car.style.left = (pos.x - 10) + 'px';
  car.style.top  = (pos.y - 10) + 'px';
}

let currentNodeId = 'center';
let isMoving = false;

// Start at center, no transition on initial placement
car.style.transition = 'none';
placeCar('center');
// Re-enable transition after placement
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    car.style.transition = 'left 0.9s linear, top 0.9s linear';
  });
});

nodes.forEach(node => {
  node.addEventListener("click", () => {
    if (isMoving) return;
    const targetId = nodeIdFromTitle(node.dataset.title);
    if (targetId === currentNodeId) return;

    const path = findPath(currentNodeId, targetId);
    if (!path) return;

    currentNodeId = targetId;
    driveAlongPath(path, node.dataset.title);
  });
});

function driveAlongPath(path, finalTitle) {
  isMoving = true;
  let step = 1;

  function moveNext() {
    if (step >= path.length) {
      isMoving = false;
      showPopup(finalTitle);
      return;
    }
    placeCar(path[step]);
    step++;
    setTimeout(moveNext, 950);
  }

  moveNext();
}

function showPopup(title) {
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}
