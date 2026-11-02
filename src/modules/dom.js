export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function makeTags(list) {
  const ul = el("ul", "tags");
  list.forEach((t) => ul.append(el("li", "", t)));
  return ul;
}

export function createProjectCard(project) {
  const card = el("article", "card");
  const bar = el("div", "bar");
  bar.append(el("i"), el("i"), el("i"));
  const frame = el("div", "frame");

  if (project.link) {
    const iframe = el("iframe");
    iframe.src = project.link;
    iframe.loading = "lazy";
    iframe.title = `${project.name} preview`;
    iframe.tabIndex = -1;
    frame.append(iframe);
    new ResizeObserver(() => { iframe.style.transform = `scale(${frame.clientWidth / 1280})`; }).observe(frame);
  } else {
    frame.classList.add("term");
    frame.append(el("span", "prompt", "$ "), el("span", "typing", project.cmd));
  }

  card.append(bar, frame, el("h3", "", project.name), el("p", "", project.about));
  if (project.tags) card.append(makeTags(project.tags));
  const url = project.link || project.repo;
  if (url) {
    const visit = el("a", "visit", project.link ? "visit the site" : "see the code");
    visit.href = url;
    visit.target = "_blank";
    visit.rel = "noopener";
    card.append(visit);
  }
  return card;
}

export function createRepoCard(repo) {
  const card = el("a", "card");
  card.href = repo.html_url;
  card.target = "_blank";
  card.rel = "noopener";
  const meta = [repo.language || "no language", `${repo.stargazers_count} stars`];
  card.append(el("h3", "", repo.name), el("p", "", repo.description || "no description yet."), makeTags(meta));
  return card;
}

export function createSkillTile(skill) {
  const tile = el("div", "tile");
  if (skill.icon) tile.append(el("i", skill.icon));
  else tile.append(el("span", "fallback", skill.name[0]));
  tile.append(el("span", "", skill.name));
  return tile;
}
