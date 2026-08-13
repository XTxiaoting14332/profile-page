<div align="center">

# 🍱 Material Bento Profile

**基于 Bento Grid（便当盒）布局的现代开发者个人主页**

一个为开发者打造的 Material Design 3 风格个人主页，实时驱动、开箱即用。内置 GitHub 活跃热力图、开源项目与博客自动抓取、Material You 主题配色切换，以及可选的 WakaTime 编码统计，支持一键部署到 Vercel。

</div>

---

## 📖 目录

- [✨ 特性](#-特性)
- [🚀 快速开始](#-快速开始)
  - [本地开发](#本地开发)
  - [项目结构](#项目结构)
- [⚙️ 自定义配置](#️-自定义配置)
  - [1. 基础信息与社交链接](#1-基础信息与社交链接)
  - [2. GitHub 数据](#2-github-数据)
  - [3. 精选项目 (Featured Projects)](#3-精选项目-featured-projects)
  - [4. 技术栈与工具链](#4-技术栈与工具链)
  - [5. 博客文章](#5-博客文章)
  - [6. WakaTime 统计（可选）](#6-wakatime-统计可选)
- [☁️ 部署到 Vercel](#️-部署到-vercel)
- [📄 许可证](#-许可证)

---

## ✨ 特性

| 模块 | 说明 |
| --- | --- |
| 🎨 **Material Design 3** | 支持 **自动 / 浅色 / 深色** 三档主题切换（跟随系统或手动），内置 **6 种低饱和度 Accent 配色**（Blue / Indigo / Emerald / Amber / Rose / Slate），选择持久化到本地。 |
| 📊 **GitHub 实时数据** | 自动拉取过去 **365 天** 的真实 Commit 热力图；实时统计公开仓库数、Followers 及所有开源项目累计获得的 Star 总数（数据自动拉取，拉取失败时回退到本地配置）。 |
| 📌 **开源项目展示** | 支持在 `pinnedRepos` 中直接填写仓库路径（如 `username/reponame`），自动并发拉取最新 Star 数、主语言标签与项目简介；也支持完全手动的 `customProjects` 配置。 |
| 📝 **博客与联系方式** | 自动抓取并解析个人博客（如 Hexo 等静态博客）最新发表的文章；支持一键复制邮箱、直达 GitHub / Blog。 |
| ⏱️ **可选 WakaTime 统计** | 内置 Vercel Serverless 代理（`/api/wakatime`），仅需配置 `WAKATIME_API_KEY` 即可安全获取实时编码统计（总时长、日均、语言 / 编辑器 / 系统占比）；未配置时该模块自动隐藏，不破坏网格布局。 |
| 📱 **全端响应式** | 针对手机、平板与桌面端完整适配的 Bento Grid 布局。 |
| 🕐 **本地时钟** | 顶部实时显示基于 `personal.timezone` 的本地时间。 |

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/XTxiaoting14332/profile-page.git
cd profile-page

# 安装依赖
npm install

# 启动本地开发服务（默认端口 3000，自动监听局域网）
npm run dev

# 构建生产产物（输出到 dist/）
npm run build

# 本地预览生产构建
npm run preview
```

### 项目结构

```
profile-page/
├── index.html            # 页面入口（含全部 UI 骨架）
├── vite.config.js        # Vite 配置（端口、构建选项）
├── vercel.json           # Vercel 部署配置（安全响应头、缓存策略）
├── .env.example          # 环境变量示例（WAKATIME_API_KEY）
├── src/
│   ├── main.js           # 全部页面逻辑（主题 / 时钟 / 数据渲染）
│   ├── config.js         # ⭐ 所有个人信息集中配置处
│   ├── assets/
│   │   └── icons.js      # 内置技术栈图标定义
│   └── styles/
│       ├── theme.css     # Material You 主题与 6 种 Accent 配色
│       ├── bento.css     # Bento Grid 布局
│       └── components.css
└── api/
    └── wakatime.js       # WakaTime Serverless 代理函数
```

---

## ⚙️ 自定义配置

所有个人信息均统一维护在 [`src/config.js`](src/config.js) 中，修改后保存即可实时生效。

### 1. 基础信息与社交链接

```javascript
personal: {
  name: "YourName",                                       // 显示名
  chineseName: "你的中文名",                               // 中文名（可选）
  avatar: "https://avatars.githubusercontent.com/u/xxxx", // 头像地址
  avatarFallback: "👨‍💻",                                 // 头像加载失败时的兜底 emoji
  title: "Full-Stack Developer",                          // 职位 / 头衔
  bio: "个性签名或个人介绍",
  location: "China",
  timezone: "Asia/Shanghai",                              // 顶部时钟时区
  devices: "Google Pixel 7 • Debian 13",
},
social: {
  github: "https://github.com/your_username",
  blog: "https://your_blog.com",
  email: "your_email@example.com",
}
```

### 2. GitHub 数据

```javascript
github: {
  username: "your_username",
  stats: {
    totalStars: 48,     // 累计 Star 数（实时拉取失败时的回退值）
    totalCommits: 1420, // 累计 Commit 数
    publicRepos: 32,    // 公开仓库数
    followers: 26,      // Followers 数
  }
}
```

> 💡 热力图与统计数据优先通过 GitHub API 实时拉取；仅当拉取失败时才会回退到这里的本地数值，因此不会因 API 限流导致页面数据缺失。

### 3. 精选项目 (Featured Projects)

支持直接在 `pinnedRepos` 中按展示顺序列出你的 GitHub 仓库全路径（自动拉取 Star 数、语言与简介），或完全手动配置：

```javascript
projectsConfig: {
  autoFetchGithub: true, // 开启 GitHub 实时拉取
  pinnedRepos: [         // 模式一：仓库完整路径 "owner/repo"
    "username/repo-a",
    "username/repo-b",
    "owner/repo-c"
  ],
  // 模式二：autoFetchGithub 为 false（离线 / 关闭自动拉取）时的自定义列表
  customProjects: [
    {
      title: "Project Name",
      description: "Project description...",
      tags: ["Dart", "⭐ 10"],          // 支持 emoji 与自定义标签
      repoUrl: "https://github.com/...",
      demoUrl: "",                      // 可选：在线演示地址
    }
  ]
}
```

### 4. 技术栈与工具链

```javascript
techStack: [
  {
    category: "Languages & Frameworks", // 分类标题
    items: [
      { name: "Dart", icon: "dart" },   // icon 需与内置图标定义匹配
      { name: "Python", icon: "python" },
    ]
  },
  // 可自由增减分类与技术项
]
```

内置图标定义位于 [`src/assets/icons.js`](src/assets/icons.js)，如需要新增图标，在 `icons` 对象中补充对应的 SVG path 即可。

### 5. 博客文章

```javascript
blog: {
  url: "https://your_blog.com",
  posts: [  // 按时间倒序排列，展示在博客板块
    {
      title: "文章标题",
      date: "2025-12-15",
      link: "https://your_blog.com/post-url/",
      tag: "Server / Linux",  // 文章分类标签
    }
  ]
}
```

### 6. WakaTime 统计（可选）

```javascript
wakatime: {
  username: "your_username",
  profileUrl: "https://wakatime.com/@your_username",
}
```

数据由 Vercel Serverless 函数 `/api/wakatime` 代理拉取（含 30 分钟缓存，规避 API 频控）。**未在 Vercel 配置 `WAKATIME_API_KEY` 时，该板块会自动隐藏**，不影响页面布局。本地调试可参考 [`.env.example`](.env.example) 配置。

---

## ☁️ 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/XTxiaoting14332/profile-page)

本项目针对 Vercel 进行了原生优化（`vercel.json` 已内置安全响应头与静态资源缓存策略），零配置即可部署：

1. **推送代码**：将项目推送到你的 GitHub 仓库。
2. **导入项目**：登录 [Vercel](https://vercel.com)，点击 **Add New... → Project** 导入该仓库。
3. **配置环境变量（可选）**：若希望展示 WakaTime 实时统计：
   - 进入项目 **Settings → Environment Variables**；
   - 添加变量 `WAKATIME_API_KEY`，值为你的 [WakaTime Secret API Key](https://wakatime.com/settings/account)。
4. **部署**：点击 **Deploy** 即可完成发布，之后每次推送都会自动触发重新部署。

---

## 📄 许可证

本项目基于 [GNU General Public License v3.0](LICENSE) 开源。你可以自由使用、修改与再分发，但基于本项目的衍生作品同样必须遵循 GPL-3.0 以开源形式发布。
