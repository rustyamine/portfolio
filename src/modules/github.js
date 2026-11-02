export async function getRepos(user, hide = []) {
  const res = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=12`);
  if (!res.ok) throw new Error(`github answered ${res.status}`);
  const repos = await res.json();
  return repos.filter((repo) => !repo.fork && !hide.includes(repo.name));
}
