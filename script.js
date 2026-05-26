const car = document.getElementById("car");
const nodes = document.querySelectorAll(".node");

let currentX = 50;
let currentY = 50;

nodes.forEach(node => {
  node.addEventListener("click", () => {
    const rect = node.getBoundingClientRect();

    const targetX = rect.left;
    const targetY = rect.top;

    moveCar(targetX, targetY, node.dataset.title);
  });
});

function moveCar(x, y, title) {
  car.style.left = x + "px";
  car.style.top = y + "px";

  setTimeout(() => {
    showPopup(title);
  }, 1000);
}

function showPopup(title) {
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}