const cosmicMusic = document.getElementById("cosmic-music");
const stripe = Stripe("pk_test_51RdaCHGDkCdXR8JJG54DLa8NH4KqvXIg7GMpmWQAIokQY80tITYuHNesGqi0NiwIur533wlBkGQM9Cs0sayUiMGP00PnALJ8yY");

document.getElementById("begin-quiz-btn").addEventListener("click", () => {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  cosmicMusic.play().catch(e => console.log("Audio play blocked"));
});
document.getElementById("quiz-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let counts = { Warrior: 0, Seeker: 0, Sage: 0, Creator: 0 };
  const answers = new FormData(e.target);
  for (let [_, value] of answers.entries()) {
    counts[value]++;
  }
  let topArchetype = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  );
  showResult(topArchetype);
});
function showResult(archetype) {
  fetch("archetype-reports.json")
    .then(res => res.json())
    .then(data => {
      document.getElementById("quiz-screen").classList.add("hidden");
      document.getElementById("result-screen").classList.remove("hidden");
      document.getElementById("archetype-name").textContent = archetype;
      document.getElementById("archetype-description").textContent =
        data[archetype].shortDescription;
      localStorage.setItem("userArchetype", archetype);
      document.getElementById("unlock-btn").classList.remove("hidden");
    });
}
document.getElementById("unlock-btn").addEventListener("click", () => {
  fetch("/create-checkout-session", { method: "POST" })
    .then((res) => res.json())
    .then((session) => stripe.redirectToCheckout({ sessionId: session.id }));
});
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("iccoinPaid") === "true") {
    const archetype = localStorage.getItem("userArchetype");
    fetch("archetype-reports.json")
      .then(res => res.json())
      .then(data => {
        document.getElementById("archetype-description").textContent =
          data[archetype].fullReport;
      });
  }
});
