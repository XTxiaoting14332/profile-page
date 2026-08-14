/**
 * Clean & Minimalist Bento Portfolio Logic (100% Real-Time Live Data)
 */
import { profileConfig } from './config.js';
import { icons } from './assets/icons.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClock();
  renderProfile();
  renderGitHubStatsAndHeatmap();
  renderWakaTime();
  renderTechStack();
  renderProjects();
  renderSocialAndBlog();
  initToastAndCopy();
});

/**
 * 1. Theme Management (Auto / Light / Dark & Accent Swatches)
 */
function initTheme() {
  const savedMode = localStorage.getItem('bento-theme-mode') || 'auto';
  const savedAccent = localStorage.getItem('bento-accent-color') || 'blue';

  applyThemeMode(savedMode);
  applyAccentColor(savedAccent);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem('bento-theme-mode') || 'auto') === 'auto') {
      applyThemeMode('auto');
    }
  });

  document.querySelectorAll('#theme-mode-segmented .theme-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      localStorage.setItem('bento-theme-mode', mode);
      applyThemeMode(mode);
    });
  });

  document.querySelectorAll('#accent-swatches .accent-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const color = dot.dataset.color;
      localStorage.setItem('bento-accent-color', color);
      applyAccentColor(color);
    });
  });
}

function applyThemeMode(mode) {
  const root = document.documentElement;
  document.querySelectorAll('#theme-mode-segmented .theme-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  if (mode === 'auto') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', mode);
  }
}

function applyAccentColor(accent) {
  document.documentElement.setAttribute('data-accent', accent);
  document.querySelectorAll('#accent-swatches .accent-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.color === accent);
  });
}

/**
 * 2. Clock
 */
function initClock() {
  const el = document.getElementById('user-clock');
  if (!el) return;
  function update() {
    el.textContent = new Date().toLocaleTimeString('en-US', {
      timeZone: profileConfig.personal.timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  update();
  setInterval(update, 1000);
}

/**
 * 3. Profile
 */
function renderProfile() {
  const p = profileConfig.personal;
  const avatar = document.getElementById('user-avatar');
  if (avatar) {
    avatar.src = p.avatar;
    avatar.onerror = () => {
      avatar.style.display = 'none';
      if (avatar.parentElement) {
        avatar.parentElement.innerHTML = `<div class="profile-avatar-fallback">${p.avatarFallback}</div>`;
      }
    };
  }

  setText('user-name', p.name);
  setText('user-chinese-name', p.chineseName);
  setText('user-title', p.title);
  setText('user-bio', p.bio);
  setText('user-location', p.location);
  if (p.devices) setText('user-devices', p.devices);
}

/**
 * 4. GitHub Stats & Real-Time Heatmap (Pure Live Data)
 */
async function renderGitHubStatsAndHeatmap() {
  const gh = profileConfig.github;
  const username = gh.username;

  const link = document.getElementById('github-profile-link');
  if (link) {
    link.href = `https://github.com/${username}`;
    link.textContent = `@${username} ↗`;
  }

  // 1. Fetch User Info & Repos for Live Numbers
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    ]);

    if (userRes.ok) {
      const uData = await userRes.json();
      if (uData.public_repos !== undefined) setText('stat-repos', uData.public_repos);
      if (uData.followers !== undefined) setText('stat-followers', uData.followers);
    }

    if (reposRes.ok) {
      const rData = await reposRes.json();
      if (Array.isArray(rData)) {
        const liveStars = rData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        setText('stat-stars', liveStars);
      }
    }
  } catch (e) {
    console.debug('GitHub User/Repos live stats error.', e);
  }

  // 2. Fetch Live GitHub Contributions Heatmap Data
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.contributions && Array.isArray(data.contributions)) {
        renderLiveHeatmap(data.contributions, data.total ? data.total.lastYear : 0);
        return;
      }
    }
  } catch (e) {
    console.debug('Live GitHub Contributions API error.', e);
  }

  // If live fetch fails, show clean error message without mock data
  const calendarContainer = document.getElementById('heatmap-calendar');
  if (calendarContainer) {
    calendarContainer.innerHTML = `<div style="padding: 24px; text-align: center; width: 100%; color: var(--text-subtle); font-size: 0.82rem;">无法加载 GitHub 活跃数据</div>`;
  }
}

function renderLiveHeatmap(contributions, totalLastYear) {
  const monthsContainer = document.getElementById('heatmap-months');
  const calendarContainer = document.getElementById('heatmap-calendar');
  const tooltip = document.getElementById('clean-tooltip');
  if (!monthsContainer || !calendarContainer || !tooltip) return;

  monthsContainer.innerHTML = '';
  calendarContainer.innerHTML = '';

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const startMonthIndex = (today.getMonth() + 1) % 12;

  let mHtml = '';
  for (let i = 0; i < 12; i++) {
    mHtml += `<span>${months[(startMonthIndex + i) % 12]}</span>`;
  }
  monthsContainer.innerHTML = mHtml;

  const numWeeks = Math.ceil(contributions.length / 7);
  let totalCount = totalLastYear || 0;

  for (let w = 0; w < numWeeks; w++) {
    const col = document.createElement('div');
    col.className = 'heatmap-col';

    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      if (idx >= contributions.length) break;

      const item = contributions[idx];
      const dot = document.createElement('div');
      dot.className = 'heatmap-dot';
      dot.setAttribute('data-level', item.level || 0);

      dot.addEventListener('mouseenter', (e) => {
        tooltip.textContent = `${item.count} contributions on ${item.date}`;
        tooltip.classList.add('show');
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY - 28}px`;
      });
      dot.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY - 28}px`;
      });
      dot.addEventListener('mouseleave', () => {
        tooltip.classList.remove('show');
      });

      col.appendChild(dot);
    }
    calendarContainer.appendChild(col);
  }

  setText('stat-commits', `${totalCount}+`);
}

/**
 * Format WakaTime human readable duration into clean compact representation (e.g. "733 hrs 55 mins" -> "733h 55m")
 */
function formatWakaDuration(str) {
  if (!str || typeof str !== 'string') return '0h';
  if (str === 'AI Included') return str;

  const hrMatch = str.match(/([\d,]+)\s*(?:hrs?|hours?|h\b)/i);
  const minMatch = str.match(/([\d,]+)\s*(?:mins?|minutes?|m\b)/i);

  if (hrMatch && minMatch) {
    return `${hrMatch[1]}h ${minMatch[1]}m`;
  }
  if (hrMatch) {
    return `${hrMatch[1]}h`;
  }
  if (minMatch) {
    return `${minMatch[1]}m`;
  }
  if (/secs?|seconds?/i.test(str)) {
    return '0h';
  }
  return str;
}

/**
 * 5. WakaTime Coding Insights (100% Real-Time Serverless, Auto-Hides if Not Available)
 */
async function renderWakaTime() {
  const card = document.getElementById('wakatime-card');
  if (!card) return;

  const waka = profileConfig.wakatime || {};

  // Fetch via Vercel Serverless Function (/api/wakatime)
  try {
    const apiRes = await fetch('/api/wakatime');
    if (apiRes.ok) {
      const serverlessData = await apiRes.json();
      if (serverlessData && serverlessData.ok && serverlessData.languages && serverlessData.languages.length > 0) {
        // Show card and render live data
        card.style.display = '';

        const profileLink = document.getElementById('waka-profile-link');
        if (profileLink && waka.username) {
          profileLink.href = waka.profileUrl || `https://wakatime.com/@${waka.username}`;
          profileLink.textContent = `@${waka.username} ↗`;
        }

        const codeTimeStr = serverlessData.totalTime || '0 hrs';
        const dailyAvgStr = serverlessData.dailyAverage || '0 hrs';
        const totalTimeStr = serverlessData.totalTime || '0 hrs';

        const codeTimeEl = document.getElementById('waka-code-time');
        if (codeTimeEl) {
          codeTimeEl.textContent = formatWakaDuration(codeTimeStr);
          codeTimeEl.title = `Code Time: ${codeTimeStr}`;
        }

        const aiTimeEl = document.getElementById('waka-ai-time');
        if (aiTimeEl) {
          aiTimeEl.textContent = 'AI Included';
          aiTimeEl.title = 'AI Assisted Coding Included';
        }

        const dailyAvgEl = document.getElementById('waka-daily-avg');
        if (dailyAvgEl) {
          dailyAvgEl.textContent = formatWakaDuration(dailyAvgStr);
          dailyAvgEl.title = `Daily Average: ${dailyAvgStr}`;
        }

        const totalTimeEl = document.getElementById('waka-total-time');
        if (totalTimeEl) {
          totalTimeEl.textContent = formatWakaDuration(totalTimeStr);
          totalTimeEl.title = `Total Recorded Time: ${totalTimeStr}`;
        }

        const bar = document.getElementById('waka-progress-bar');
        const list = document.getElementById('waka-lang-list');
        const tabs = document.querySelectorAll('#waka-view-tabs .tech-tab');

        function renderView(viewKey) {
          if (!bar || !list) return;
          bar.innerHTML = '';
          list.innerHTML = '';

          const items = serverlessData[viewKey] || serverlessData.languages || [];

          items.forEach(item => {
            const seg = document.createElement('div');
            seg.className = 'waka-seg';
            seg.style.width = `${item.percent}%`;
            seg.style.backgroundColor = item.color || 'var(--primary)';
            seg.title = `${item.name}: ${item.percent}% (${item.time || ''})`;
            bar.appendChild(seg);

            const itemCard = document.createElement('div');
            itemCard.className = 'waka-item-card';
            itemCard.innerHTML = `
              <div class="waka-item-header">
                <div class="waka-item-name-group">
                  <span class="waka-item-dot" style="background-color: ${item.color || 'var(--primary)'};"></span>
                  <span class="waka-item-name" title="${item.name}">${item.name}</span>
                </div>
                <span class="waka-item-badge">${item.percent}%</span>
              </div>
              <div class="waka-item-sub">
                <span>Recorded Time</span>
                <span>${item.time || (item.percent + '%')}</span>
              </div>
              <div class="waka-mini-track">
                <div class="waka-mini-fill" style="width: ${item.percent}%; background-color: ${item.color || 'var(--primary)'};"></div>
              </div>
            `;
            list.appendChild(itemCard);
          });
        }

        renderView('languages');

        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderView(tab.dataset.view);
          });
        });

        return;
      }
    }
  } catch (e) {
    console.debug('WakaTime live data unavailable, hiding card.', e);
  }

  // If live data is unavailable or not configured, hide the card completely
  card.style.display = 'none';
}

/**
 * 6. Tech Stack
 */
function renderTechStack() {
  const tabsContainer = document.getElementById('tech-category-tabs');
  const grid = document.getElementById('tech-items-grid');
  if (!tabsContainer || !grid) return;

  tabsContainer.innerHTML = '';
  
  const allTab = document.createElement('button');
  allTab.className = 'tech-tab active';
  allTab.dataset.category = 'all';
  allTab.textContent = 'All';
  tabsContainer.appendChild(allTab);

  profileConfig.techStack.forEach(c => {
    const tab = document.createElement('button');
    tab.className = 'tech-tab';
    tab.dataset.category = c.category;
    tab.textContent = c.category;
    tabsContainer.appendChild(tab);
  });

  function render(category) {
    grid.innerHTML = '';
    let items = [];
    if (category === 'all') {
      profileConfig.techStack.forEach(c => items.push(...c.items));
    } else {
      const found = profileConfig.techStack.find(c => c.category === category);
      if (found) items = found.items;
    }

    items.forEach(tech => {
      const pill = document.createElement('div');
      pill.className = 'tech-pill';
      const iconSvg = icons[tech.icon] || icons.code;
      pill.innerHTML = `
        <div class="tech-pill-icon">${iconSvg}</div>
        <span class="tech-pill-name">${tech.name}</span>
      `;
      grid.appendChild(pill);
    });
  }

  render('all');

  tabsContainer.querySelectorAll('.tech-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.tech-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.category);
    });
  });
}

/**
 * 7. Projects (Dynamically Fetches Repos by Full Path or User Repos, No Mock Data)
 */
async function renderProjects() {
  const list = document.getElementById('projects-list');
  if (!list) return;

  const cfg = profileConfig.projectsConfig || {};
  
  // If user disabled auto fetch, render custom projects
  if (cfg.autoFetchGithub === false) {
    renderProjectCards(cfg.customProjects || []);
    return;
  }

  const defaultUser = profileConfig.github.username;
  const pinned = cfg.pinnedRepos || [];

  try {
    if (pinned.length > 0) {
      const fetchPromises = pinned.map(async (repoItem) => {
        const fullPath = repoItem.includes('/') ? repoItem : `${defaultUser}/${repoItem}`;
        const res = await fetch(`https://api.github.com/repos/${fullPath}`);
        if (!res.ok) throw new Error(`Failed to fetch ${fullPath}`);
        return await res.json();
      });

      const results = await Promise.allSettled(fetchPromises);
      const fetchedProjects = [];

      results.forEach((res) => {
        if (res.status === 'fulfilled' && res.value) {
          const r = res.value;
          fetchedProjects.push({
            title: r.name,
            description: r.description || '开源代码仓库',
            tags: [r.language || 'Code', r.stargazers_count > 0 ? `⭐ ${r.stargazers_count}` : 'Git'],
            repoUrl: r.html_url,
            stars: r.stargazers_count,
            language: r.language
          });
        }
      });

      if (fetchedProjects.length > 0) {
        renderProjectCards(fetchedProjects);
        return;
      }
    }

    // Fallback: Fetch all public repos from user
    if (defaultUser) {
      const res = await fetch(`https://api.github.com/users/${defaultUser}/repos?sort=pushed&per_page=15`);
      if (res.ok) {
        const repos = await res.json();
        if (Array.isArray(repos) && repos.length > 0) {
          const formatted = repos
            .filter(r => !r.fork || r.stargazers_count > 0)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 6)
            .map(r => ({
              title: r.name,
              description: r.description || '开源代码仓库',
              tags: [r.language || 'Code', r.stargazers_count > 0 ? `⭐ ${r.stargazers_count}` : 'Git'],
              repoUrl: r.html_url,
              stars: r.stargazers_count,
              language: r.language
            }));

          if (formatted.length > 0) {
            renderProjectCards(formatted);
            return;
          }
        }
      }
    }
  } catch (e) {
    console.debug('GitHub Projects fetch error.', e);
  }

  list.innerHTML = `<div style="grid-column: 1 / -1; padding: 20px; color: var(--text-subtle); text-align: center; font-size: 0.82rem;">无法加载仓库列表</div>`;
}

function renderProjectCards(projects) {
  const list = document.getElementById('projects-list');
  if (!list) return;
  list.innerHTML = '';

  if (!projects || projects.length === 0) {
    list.innerHTML = `<div style="grid-column: 1 / -1; padding: 20px; color: var(--text-subtle); text-align: center; font-size: 0.82rem;">暂无项目</div>`;
    return;
  }

  projects.forEach(p => {
    const row = document.createElement('div');
    row.className = 'project-row';
    
    const tagsHtml = (p.tags || []).map(t => `<span style="font-size: 0.72rem; color: var(--primary-text); background: var(--primary-subtle); padding: 1px 6px; border-radius: var(--radius-sm);">${t}</span>`).join(' ');

    row.innerHTML = `
      <div class="project-info">
        <div class="project-heading">
          <span>${p.title}</span>
          <div style="display: flex; gap: 4px; align-items: center;">${tagsHtml}</div>
        </div>
        <div class="project-summary">${p.description}</div>
      </div>
      <div class="project-btn-group">
        ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-view btn-code">Code ↗</a>` : ''}
      </div>
    `;
    list.appendChild(row);
  });
}

/**
 * 8. Social & Blog (Pure Live Fetch from blog.n1ghtw1nd.com)
 */
async function renderSocialAndBlog() {
  const s = profileConfig.social;
  setText('email-text', s.email);

  const headingBlog = document.getElementById('blog-link-heading');
  if (headingBlog) headingBlog.href = s.blog;

  // Social Links
  const grid = document.getElementById('social-links-grid');
  if (grid) {
    grid.innerHTML = '';
    const links = [
      { name: 'GitHub', url: s.github, icon: icons.github },
      { name: 'Blog', url: s.blog, icon: icons.blog },
    ];
    links.forEach(item => {
      if (!item.url) return;
      const a = document.createElement('a');
      a.className = 'social-link';
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `${item.icon} <span>${item.name}</span>`;
      grid.appendChild(a);
    });
  }

  // Live fetch latest posts from blog.n1ghtw1nd.com
  const blogContainer = document.getElementById('blog-posts-mini');
  try {
    const res = await fetch(s.blog);
    if (res.ok) {
      const htmlText = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const articleLinks = doc.querySelectorAll('.index-header a');

      if (articleLinks && articleLinks.length > 0) {
        const fetchedPosts = [];
        for (let i = 0; i < Math.min(2, articleLinks.length); i++) {
          const a = articleLinks[i];
          let href = a.getAttribute('href');
          if (href && !href.startsWith('http')) {
            href = `${s.blog.replace(/\/$/, '')}${href.startsWith('/') ? '' : '/'}${href}`;
          }
          const title = a.textContent.trim();
          
          let dateStr = 'Recent Post';
          const match = href.match(/\/(\d{4})(\d{2})(\d{2})\//);
          if (match) {
            dateStr = `${match[1]}-${match[2]}-${match[3]}`;
          }

          fetchedPosts.push({
            title: title,
            date: dateStr,
            tag: 'Blog Post',
            link: href
          });
        }

        if (fetchedPosts.length > 0) {
          renderBlogPosts(fetchedPosts);
          return;
        }
      }
    }
  } catch (e) {
    console.debug('Blog fetch error.', e);
  }

  // Fallback to preset if fetch fails
  if (profileConfig.blog && profileConfig.blog.posts) {
    renderBlogPosts(profileConfig.blog.posts);
  } else if (blogContainer) {
    blogContainer.innerHTML = `<div style="padding: 10px; color: var(--text-subtle); font-size: 0.78rem; text-align: center;">暂无博客文章</div>`;
  }
}

function renderBlogPosts(posts) {
  const blogContainer = document.getElementById('blog-posts-mini');
  if (!blogContainer) return;
  blogContainer.innerHTML = '';
  
  posts.slice(0, 2).forEach(post => {
    const item = document.createElement('a');
    item.className = 'blog-item';
    item.href = post.link;
    item.target = '_blank';
    item.rel = 'noopener noreferrer';
    item.innerHTML = `
      <span class="blog-item-title">${post.title}</span>
      <span class="blog-item-date">${post.date} • ${post.tag}</span>
    `;
    blogContainer.appendChild(item);
  });
}

/**
 * 9. Toast & Copy
 */
function initToastAndCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('clean-toast');
  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', async () => {
    const email = profileConfig.social.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast('已复制邮箱地址到剪贴板');
    } catch (e) {
      showToast(`邮箱: ${email}`);
    }
  });

  let t = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(t);
    t = setTimeout(() => toast.classList.remove('show'), 2200);
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
