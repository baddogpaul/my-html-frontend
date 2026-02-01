async function loadPage() {
  const res = await fetch("/api/page?slug=home");
  const data = await res.json();

  document.getElementById("title").innerText = data.title;
  document.getElementById("content").innerHTML = data.body;
}

loadPage();
