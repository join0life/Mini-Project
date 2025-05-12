export async function getTxtData() {
  const res = await fetch("./data.txt");

  if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다.");

  const data = await res.text();
  return data;
}

export async function getJsonData() {
  const res = await fetch("./data.json");

  if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다.");

  const data = await res.json();
  return data;
}
