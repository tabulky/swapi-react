export const fetchJSON = async (url: string | URL) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} (${url})`);
  }
  return response.json();
};
