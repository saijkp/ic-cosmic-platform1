const cosmicMusic = document.getElementById("cosmic-music");
const stripe = Stripe("pk_test_51RdaCHGDkCdXR8JJG54DLa8NH4KqvXIg7GMpmWQAIokQY80tITYuHNesGqi0NiwIur533wlBkGQM9Cs0sayUiMGP00PnALJ8yY");

function hideAllScreens() {
  document.getElementById("welcome-screen").hidden = true;
  document.getElementById("quiz-screen").hidden = true;
  document.getElementById("result-screen").hidden = true;
}

function showScreen(screenId) {
  hideAllScreens();
  document.getElementById(screenId).hidden = false;
}

// On page load, check user status
window.addEventListener("DOMContentLoaded", () => {
  const paid = localStorage.getItem("iccoinPaid");
  const archetype = localStorage.getItem("userArchetype");

  if (paid === "true" && archetype) {
    fetch("archetype-reports.json")
      .then(res => res.json())
      .then(data => {
        showScreen("result-screen");
        document.getElementById("archetype-name").textContent = archetype;
        document.getElementById("archetype-description").textContent =
          data[archetype].fullReport;
        document.getElementById("unlock-btn").style.display = "none";
      });
  } else {
    showScreen("welcome-screen");
  }
});

// Begin quiz
document.getElementById("begin-quiz-btn").addEventListener("click", () => {
  showScreen("quiz-screen");

  if (cosmicMusic) {
    cosmicMusic.play().catch(() => {
      console.log("Audio blocked until user interaction");
    });
  }
});

// Quiz submission logic
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

// Show quiz result
function showResult(archetype) {
  fetch("archetype-reports.json")
    .then(res => res.json())
    .then(data => {
      showScreen("result-screen");
      document.getElementById("archetype-name").textContent = archetype;
      document.getElementById("archetype-description").textContent =
        data[archetype].shortDescription;

      localStorage.setItem("userArchetype", archetype);
      document.getElementById("unlock-btn").style.display = "inline-block";
    });
}

// Stripe payment
document.getElementById("unlock-btn").addEventListener("click", () => {
  fetch("/create-checkout-session", { method: "POST" })
    .then((res) => res.json())
    .then((session) => stripe.redirectToCheckout({ sessionId: session.id }));
});