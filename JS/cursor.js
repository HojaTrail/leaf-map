const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.pageX + "px";
  cursor.style.top = e.pageY + "px";

  createLeaf(e.pageX, e.pageY);
});

function createLeaf(x, y) {
  const leaf = document.createElement("div");
  leaf.classList.add("leaf");

  leaf.style.left = x + "px";
  leaf.style.top = y + "px";

  document.body.appendChild(leaf);

  setTimeout(() => {
    leaf.remove();
  }, 1000);
}