
export const profileConfig = {
  personal: {
    name: "N1ghtW1nd",
    chineseName: "XTxiaoting14332",
    avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=2125714976&spec=640&img_type=png",
    avatarFallback: "👨‍💻",
    title: "Dart & Flutter / Full-Stack Developer",
    bio: "你写下的每一个bug, 都是人类反抗被人工智能统治的一颗子弹！",
    location: "China",
    timezone: "Asia/Shanghai",
    devices: "Google Pixel 7 • AMD Ryzen 7730U",
  },

  social: {
    github: "https://github.com/XTxiaoting14332",
    blog: "https://blog.n1ghtw1nd.com",
    email: "2125714976@qq.com",
  },

  // GitHub Config
  github: {
    username: "XTxiaoting14332",
    stats: {
      totalStars: 48,
      totalCommits: 1420,
      publicRepos: 32,
      followers: 26,
    }
  },

  // WakaTime 统计配置 (通过 Vercel Serverless /api/wakatime 实时拉取，未配置或获取失败时自动隐藏该板块)
  wakatime: {
    username: "XTxiaoting14332",
    profileUrl: "https://wakatime.com/@XTxiaoting14332",
  },

  // 技术栈、系统与工具链
  techStack: [
    {
      category: "Languages & Frameworks",
      items: [
        { name: "Dart", icon: "dart" },
        { name: "Flutter", icon: "flutter" },
        { name: "Python", icon: "python" },
        { name: "Java", icon: "java" },
        { name: "Go", icon: "go" },
        { name: "Bash Shell", icon: "shell" },
      ]
    },
    {
      category: "Toolkits & IDEs",
      items: [
        { name: "Android Studio", icon: "androidstudio" },
        { name: "IntelliJ IDEA", icon: "intellij" },
        { name: "VS Code", icon: "vscode" },
        { name: "Zed Editor", icon: "zed" },
      ]
    },
    {
      category: "Systems & Devices",
      items: [
        { name: "Debian 13", icon: "debian" },
        { name: "Windows 11", icon: "windows" },
        { name: "Google Pixel 7", icon: "pixel" },
      ]
    }
  ],


  projectsConfig: {
    autoFetchGithub: true,

    // 【模式一】：在此处直接填入仓库完整路径 "owner/repo"（按填写的顺序在首页展示）：
    pinnedRepos: [
      "XTxiaoting14332/web-ai-proxy",
      "NonebotGUI/nonebot-flutter-gui",
      "NonebotGUI/nonebot-flutter-webui-dashboard",
      "NonebotGUI/nonebot-agent",
      "XTxiaoting14332/esp32-ai-backend",
      "XTxiaoting14332/kindle-linux-deploy",
      "XTxiaoting14332/profile-page"
    ],

    // 【模式二】：离线或关闭自动拉取时的自定义项目列表
    customProjects: [
      {
        title: "web-ai-proxy",
        description: "基于浏览器插件自动填充方案的 AI 网页反代玩具",
        tags: ["Dart", "⭐ 20"],
        repoUrl: "https://github.com/XTxiaoting14332/web-ai-proxy",
        demoUrl: "",
      },
      {
        title: "nonebot-flutter-gui",
        description: "现代化 NoneBot 客户端 Flutter 跨平台图形界面",
        tags: ["Flutter", "Dart"],
        repoUrl: "https://github.com/NonebotGUI/nonebot-flutter-gui",
        demoUrl: "",
      },
      {
        title: "nonebot-flutter-webui-dashboard",
        description: "基于 Flutter Web 的 NoneBot 仪表盘前端界面",
        tags: ["Flutter", "Web"],
        repoUrl: "https://github.com/NonebotGUI/nonebot-flutter-webui-dashboard",
        demoUrl: "",
      },
      {
        title: "nonebot-agent",
        description: "NoneBot 智能代理与服务协作框架组件",
        tags: ["Python", "NoneBot"],
        repoUrl: "https://github.com/NonebotGUI/nonebot-agent",
        demoUrl: "",
      },
      {
        title: "esp32-ai-backend",
        description: "ESP32 接入 AI 对话大模型的后端实现",
        tags: ["Python", "⭐ 5"],
        repoUrl: "https://github.com/XTxiaoting14332/esp32-ai-backend",
        demoUrl: "",
      },
      {
        title: "kindle-linux-deploy",
        description: "Deploy Linux on your Kindle (在 Kindle 上部署 Linux 系统)",
        tags: ["Shell", "⭐ 33"],
        repoUrl: "https://github.com/XTxiaoting14332/kindle-linux-deploy",
        demoUrl: "",
      },
      {
        title: "nonebot-plugin-llm-jade",
        description: "基于 LLM 的玉检测机器人扩展插件",
        tags: ["Python", "⭐ 12"],
        repoUrl: "https://github.com/XTxiaoting14332/nonebot-plugin-llm-jade",
        demoUrl: "",
      },
      {
        title: "dart-ai-agent",
        description: "使用 Dart 实现的现代化 AI Agent 探索工程",
        tags: ["Dart", "⭐ 1"],
        repoUrl: "https://github.com/XTxiaoting14332/dart-ai-agent",
        demoUrl: "",
      },
      {
        title: "profile-page",
        description: "现代 Material Design 3 风格便当盒个人主页",
        tags: ["JavaScript", "Vite", "Bento Grid"],
        repoUrl: "https://github.com/XTxiaoting14332/profile-page",
        demoUrl: "https://github.com/XTxiaoting14332/profile-page",
      }
    ]
  },

  // 个人博客配置 (blog.n1ghtw1nd.com)
  blog: {
    url: "https://blog.n1ghtw1nd.com",
    posts: [
      {
        title: "绕过25端口搭建自己的邮件服务器",
        date: "2025-12-15",
        link: "https://blog.n1ghtw1nd.com/20251215/email-server/",
        tag: "Server / Linux"
      },
      {
        title: "用http请求智谱清言api",
        date: "2024-03-30",
        link: "https://blog.n1ghtw1nd.com/20240330/%E7%94%A8http%E8%AF%B7%E6%B1%82%E6%99%BA%E8%B0%B1%E6%B8%85%E8%A8%80api/",
        tag: "AI / API"
      }
    ]
  },

  // 友情链接 (Friend Links / Blogroll，未配置或为空时自动隐藏该板块)
  friends: [
    {
      title: "NoneBot WebUI",
      intro: "新一代NoneBot Web管理界面",
      link: "https://webui.nbgui.top/",
      avatar: "/img/nbwebui.png"
    },
    {
      title: "雪碧博客",
      intro: "一个菜鸟的博客",
      link: "https://blog.myxuebi.top/",
      avatar: "http://q2.qlogo.cn/headimg_dl?dst_uin=1651930562&spec=100"
    },
    {
      title: "MC_DALIU",
      intro: "一个懒人的博客",
      link: "https://mc-daliu.github.io",
      avatar: "http://q2.qlogo.cn/headimg_dl?dst_uin=2263157943&spec=100"
    },
    {
      title: "柒拾兆字节",
      intro: "柒拾兆字节的博客",
      link: "https://7omb2006.github.io",
      avatar: "http://q2.qlogo.cn/headimg_dl?dst_uin=3311482378&spec=100"
    }
  ]
};

