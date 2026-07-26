import { getRandomLesson } from "./services/sources.js";

const els = {
  idle: document.getElementById("state-idle"),
  loading: document.getElementById("state-loading"),
  result: document.getElementById("state-result"),
  error: document.getElementById("state-error"),
  teachBtn: document.getElementById("teach-btn"),
  againBtn: document.getElementById("again-btn"),
  openBtn: document.getElementById("open-btn"),
  retryBtn: document.getElementById("retry-btn"),
  category: document.getElementById("result-category"),
  title: document.getElementById("result-title"),
  description: document.getElementById("result-description"),
  errorText: document.getElementById("error-text"),
};

let currentResult = null;

function show(state) {
  for (const key of ["idle", "loading", "result", "error"]) {
    els[key].classList.toggle("hidden", key !== state);
  }
}

function renderResult(result) {
  currentResult = result;
  els.category.textContent = result.category;
  els.title.textContent = result.title;
  els.description.textContent = result.description;
  els.openBtn.disabled = !result.url;
  show("result");
}

async function loadLesson() {
  show("loading");
  try {
    const result = await getRandomLesson();
    renderResult(result);
  } catch (err) {
    console.error(err);
    els.errorText.textContent =
      "We couldn't fetch something new. Check your connection and try again.";
    show("error");
  }
}

els.teachBtn.addEventListener("click", loadLesson);
els.againBtn.addEventListener("click", loadLesson);
els.retryBtn.addEventListener("click", loadLesson);

els.openBtn.addEventListener("click", () => {
  if (currentResult?.url) {
    chrome.tabs.create({ url: currentResult.url });
  }
});

show("idle");
