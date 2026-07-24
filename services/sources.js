import { pick, fetchJson } from "../utils/random.js";


async function wikipedia() {
  try {
    const data = await fetchJson(
      "https://en.wikipedia.org/api/rest_v1/page/random/summary"
    );
    return {
      category: "Wikipedia Article"
      title: data.title,
      description:
        data.extract || "Open the article to read the full summary.",
      url:
        data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
    };
  } 
  }
}

async function githubRepo() {
  try {
    const page = 1 + Math.floor(Math.random() * 10);
    const data = await fetchJson(
      `https://api.github.com/search/repositories?q=stars:%3E10000&sort=stars&order=desc&per_page=30&page=${page}`
    );
    const repo = pick(data.items || []);
    if (!repo) throw new Error("no repos");
    return {
      category: "GitHub Repository",
      title: repo.full_name,
      description:
        repo.description || "Explore this popular open source project.",
      url: repo.html_url,
    };
  } 
}

async function scienceFact() {
  const store = await getData();
  const fact = pick(store.scienceFacts);
  return {
    category: "Science Fact",
    title: fact.title,
    description: fact.description,
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(fact.title)}`,
  };
}

async function historicalEvent() {
  const store = await getData();
  const item = pick(store.historicalEvents)
  return {
    category: "Historical Event",
    title: item.title,
    description: item.description,
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(item.title)}`,
  };
}

async function englishWord() {
  const store = await getData();
  const local = pick(store.words);
  try {
    const data = await fetchJson("https://random-word-api.herokuapp.com/word");
    const word = Array.isArray(data) ? data[0] : null;
    if (!word) throw new Error("no word");
    const defs = await fetchJson(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    const entry = defs?.[0];
    const meaning = entry?.meanings?.[0];
    const def = meaning?.definitions?.[0]?.definition;
    if (!def) throw new Error("no definition");
    return {
      category: "English Word",
      title: `${word} (${meaning.partOfSpeech || "word"})`
      url: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(word)}`,
    };
  } catch {
    return {
      category: "English Word",
      title: `${local.word} (${local.partOfSpeech})`,
      description: local.definition,
      url: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(local.word.toLowerCase())}`,
    };
  }
}


async function aiTool() {
  const store = await getData();
  const tool = pick(store.aiTools);
  return { category: "AI Tool", ...tool }
}

async function programmingConcept() {
  const store = await getData();
  const item = pick(store.programmingConcepts);
  return {
    category: "Programming Concept",
    title: item.title,
    description: item.description,
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(item.title)}`,
  };
}

const sources = [
  wikipedia,
  githubRepo,
  scienceFact,
  historicalEvent,
  englishWord,
  productivityTip,
  aiTool,
  programmingConcept
];

}
