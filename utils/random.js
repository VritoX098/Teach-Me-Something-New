export function randomInt(max) 
{
  return Math.floor(Math.random() * max);
}
export function pick(arr) 
{
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[randomInt(arr.length)];
}
export async function fetchJson(url, { timeoutMs = 6000, headers } = {}) 
{
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try 
  {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", ...(headers || {}) },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally 
  {
    clearTimeout(timer);
  }
}
