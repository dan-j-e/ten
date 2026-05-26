const car = document.getElementById("car");
const nodes = document.querySelectorAll(".node");

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

// HTML entities used for all non-ASCII so encoding never matters
const nodeData = {
  '1':      { title: 'Month 1',   note: 'Our story begins here. &#10024;',         audio: 'audio/month1.mp3'  },
  '2':      { title: 'Month 2',   note: 'Something new every single day.',          audio: 'audio/month2.mp3'  },
  '3':      { title: 'Month 3',   note: 'Getting closer, little by little.',        audio: 'audio/month3.mp3'  },
  '4':      { title: 'Month 4',   note: 'I knew I was in trouble.',                 audio: 'audio/month4.mp3'  },
  '5':      { title: 'Month 5',   note: 'Halfway, and already full.',               audio: 'audio/month5.mp3'  },
  '6':      { title: 'Month 6',   note: 'The most perfect ordinary day.',           audio: 'audio/month6.mp3'  },
  '7':      { title: 'Month 7',   note: 'Learning all your little things.',         audio: 'audio/month7.mp3'  },
  '8':      { title: 'Month 8',   note: 'Still in awe of you.',                    audio: 'audio/month8.mp3'  },
  '9':      { title: 'Month 9',   note: 'Almost there &mdash; not ready to stop.', audio: 'audio/month9.mp3'  },
  '10':     { title: 'Month 10',  note: 'Ten months. Here we are. &#9825;',        audio: 'audio/month10.mp3' },
  'center': { title: '&#9825;',   note: 'Home. Where it all started.',             audio: 'audio/home.mp3'    },
};

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

car.style.transition = 'none';
placeCar('center');
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
    driveAlongPath(path);
  });
});

function driveAlongPath(path) {
  isMoving = true;
  let step = 1;

  function moveNext() {
    if (step >= path.length) {
      isMoving = false;
      showPopup(currentNodeId);
      return;
    }
    placeCar(path[step]);
    step++;
    setTimeout(moveNext, 950);
  }

  moveNext();
}

function showPopup(nodeId) {
  const data = nodeData[nodeId] || {};
  document.getElementById('popup-title').innerHTML = data.title || nodeId;
  document.getElementById('popup-note').innerHTML  = data.note  || '...';

  const audio = document.getElementById('popup-audio');
  audio.src = data.audio || '';
  audio.load();

  document.getElementById('play-btn').innerHTML = '&#9834; play';
  document.getElementById('popup').classList.remove('hidden');
}

function closePopup() {
  const audio = document.getElementById('popup-audio');
  audio.pause();
  audio.currentTime = 0;
  document.getElementById('play-btn').innerHTML = '&#9834; play';
  document.getElementById('popup').classList.add('hidden');
}

function toggleAudio() {
  const audio = document.getElementById('popup-audio');
  const btn   = document.getElementById('play-btn');
  if (audio.paused) {
    audio.play().catch(() => {});
    btn.innerHTML = '&#9208; pause';
  } else {
    audio.pause();
    btn.innerHTML = '&#9834; play';
  }
}
