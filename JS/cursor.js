const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", e => {
  cursor.style.left = e.pageX + "px";
  cursor.style.top = e.pageY + "px";

  const leaf = document.createElement("div");
  leaf.classList.add("leaf");
  leaf.style.left = e.pageX + "px";
  leaf.style.top = e.pageY + "px";

  document.body.appendChild(leaf);

  setTimeout(() => leaf.remove(), 800);
});