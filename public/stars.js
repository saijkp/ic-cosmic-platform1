const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      velocity: Math.random() * 0.5 + 0.2
    });
  }
}
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
    ctx.fill();
    star.y += star.velocity;
    if (star.y > canvas.height) star.y = 0;
  });
  requestAnimationFrame(animateStars);
}
initStars();
animateStars();
