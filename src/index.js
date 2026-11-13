import "./styles.css";
import { config } from "./modules/config.js";
import { projects } from "./modules/projects.js";
import { getRepos } from "./modules/github.js";
import { initTheme } from "./modules/theme.js";
import { contactIcons } from "./modules/icons.js";
import { el, createProjectCard, createRepoCard, createSkillTile } from "./modules/dom.js";
import { playIntro, pageIn, gridEffects, typeHero, marquee, headings, showCards, tilt, magnet, tileHover } from "./modules/animations.js";

const $ = (selector) => document.querySelector(selector);

document.querySelectorAll("[data-link]").forEach((a) => {
  a.href = config.links[a.dataset.link];
  a.insertAdjacentHTML("afterbegin", contactIcons[a.dataset.link]);
});

projects.forEach((p) => $("#project-list").append(createProjectCard(p)));

config.skills.forEach((group) => {
  const box = el("div", "group");
  const tiles = el("div", "tiles");
  group.items.forEach((s) => tiles.append(createSkillTile(s)));
  box.append(el("h3", "", group.title), tiles);
  $("#skill-list").append(box);
});

const names = config.skills.flatMap((g) => g.items.map((s) => s.name));
[...names, ...names].forEach((n) => $("#marquee").append(el("span", "", n)));

async function loadRepos() {
  const status = $("#repo-status");
  status.textContent = "loading repos...";
  try {
    const repos = await getRepos(config.githubUser, config.hideRepos);
    status.textContent = repos.length ? "" : "no public repos yet.";
    repos.forEach((r) => $("#repo-list").append(createRepoCard(r)));
    showCards("#repo-list");
    tilt("#repo-list .card");
  } catch (err) {
    status.textContent = `couldn't load repos (${err.message}). refresh to try again.`;
  }
}

initTheme($("#theme-btn"));
const hero = typeHero();
gridEffects();
marquee();
headings();
showCards("#project-list");
showCards("#skill-list", ".tile");
tilt("#project-list .card");
tileHover();
magnet(".links a");
loadRepos();

playIntro(() => {
  pageIn();
  if (hero) hero.play();
});
