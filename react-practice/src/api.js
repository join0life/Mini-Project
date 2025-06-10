export async function getRandomUser() {
  const res = await fetch("https://randomuser.me/api/");

  if (!res.ok) {
    throw new Error("리퀘스트 실패" + res.status);
  }

  const data = await res.json();
  return data.results[0];
}
