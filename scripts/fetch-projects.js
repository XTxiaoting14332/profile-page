import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { profileConfig } from '../src/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'projects.json');

async function fetchRepoStats() {
  console.log('[build-prefetch] Starting pre-fetching repository stats for build-time fallback...');

  const cfg = profileConfig.projectsConfig || {};
  const defaultUser = profileConfig.github?.username || '';
  const pinned = cfg.pinnedRepos || [];
  const customProjects = cfg.customProjects || [];

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'profile-page-build-agent'
  };

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token.trim()}`;
    console.log('[build-prefetch] Using GITHUB_TOKEN for authenticated API requests.');
  }

  const projects = [];

  for (const repoItem of pinned) {
    const fullPath = repoItem.includes('/') ? repoItem : `${defaultUser}/${repoItem}`;
    try {
      console.log(`[build-prefetch] Fetching ${fullPath}...`);
      const res = await fetch(`https://api.github.com/repos/${fullPath}`, { 
        headers, 
        signal: AbortSignal.timeout(3000) 
      });

      if (res.ok) {
        const r = await res.json();
        projects.push({
          title: r.name,
          description: r.description || '开源代码仓库',
          tags: [r.language || 'Code', r.stargazers_count > 0 ? `⭐ ${r.stargazers_count}` : 'Git'],
          repoUrl: r.html_url,
          stars: r.stargazers_count || 0,
          language: r.language || 'Code'
        });
        continue;
      } else {
        console.warn(`[build-prefetch] Warning: GitHub API returned status ${res.status} for ${fullPath}`);
      }
    } catch (err) {
      console.warn(`[build-prefetch] Warning: Failed to fetch ${fullPath}:`, err.message);
    }

    // Fallback to customProjects if matched by repo name
    const customMatch = customProjects.find(cp => 
      cp.repoUrl?.endsWith(`/${fullPath}`) || 
      cp.repoUrl?.endsWith(`/${repoItem}`) || 
      cp.title === repoItem.split('/')[1] || 
      cp.title === repoItem
    );

    if (customMatch) {
      projects.push(customMatch);
    } else {
      const repoName = repoItem.includes('/') ? repoItem.split('/')[1] : repoItem;
      projects.push({
        title: repoName,
        description: '开源代码仓库',
        tags: ['Git'],
        repoUrl: `https://github.com/${fullPath}`,
        stars: 0,
        language: 'Code'
      });
    }
  }

  // If no pinned repos or all failed, use customProjects
  const finalProjects = projects.length > 0 ? projects : customProjects;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(finalProjects, null, 2), 'utf-8');
  console.log(`[build-prefetch] Successfully pre-rendered ${finalProjects.length} projects to ${outputFile}`);
}

fetchRepoStats().catch(err => {
  console.error('[build-prefetch] Error during prefetch:', err);
  // Ensure build does not fail: write customProjects fallback if file does not exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const fallback = profileConfig.projectsConfig?.customProjects || [];
  fs.writeFileSync(outputFile, JSON.stringify(fallback, null, 2), 'utf-8');
  process.exit(0);
});
