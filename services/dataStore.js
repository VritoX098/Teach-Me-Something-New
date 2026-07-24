let cache = null;

export async function getData() {
  if (cache) return cache;
  const url = chrome.runtime.getURL("data/facts.json");
  const res = await fetch(url);
  cache = await res.json();
  return cache;
}
