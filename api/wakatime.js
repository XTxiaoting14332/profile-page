export default async function handler(req, res) {
  // 设置 CORS 和轻量缓存（缓存 30 分钟，减少 WakaTime API 频控）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      ok: false,
      message: 'WAKATIME_API_KEY environment variable is not configured on Vercel.',
      data: null
    });
  }

  try {
    // 采用 HTTP Basic Auth 格式进行鉴权请求
    const authHeader = `Basic ${Buffer.from(apiKey.trim()).toString('base64')}`;

    // 优先请求 all_time 统计，若受限则自动降级请求 last_30_days
    let wakaRes = await fetch('https://wakatime.com/api/v1/users/current/stats/all_time', {
      headers: { Authorization: authHeader }
    });

    if (!wakaRes.ok) {
      wakaRes = await fetch('https://wakatime.com/api/v1/users/current/stats/last_30_days', {
        headers: { Authorization: authHeader }
      });
    }

    if (!wakaRes.ok) {
      const errText = await wakaRes.text();
      return res.status(wakaRes.status).json({
        ok: false,
        message: `WakaTime API returned status ${wakaRes.status}`,
        details: errText
      });
    }

    const json = await wakaRes.json();
    const d = json.data || {};

    // 规范化返回给前端的数据结构
    const formattedData = {
      ok: true,
      totalTime: d.human_readable_total || d.human_readable_total_including_other_language || '0 hrs',
      dailyAverage: d.human_readable_daily_average || '0 hrs',
      range: d.human_readable_range || 'All Time',
      languages: (d.languages || []).slice(0, 8).map(l => ({
        name: l.name,
        percent: parseFloat(l.percent.toFixed(1)) || 0,
        time: l.text || '',
        color: getColorForLanguage(l.name)
      })),
      editors: (d.editors || []).slice(0, 6).map(e => ({
        name: e.name,
        percent: parseFloat(e.percent.toFixed(1)) || 0,
        time: e.text || '',
        color: '#3DDC84'
      })),
      operatingSystems: (d.operating_systems || []).slice(0, 4).map(os => ({
        name: os.name,
        percent: parseFloat(os.percent.toFixed(1)) || 0,
        time: os.text || '',
        color: '#0078D4'
      }))
    };

    return res.status(200).json(formattedData);

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Failed to proxy request to WakaTime API',
      error: error.message
    });
  }
}

// 常用编程语言的品牌色映射
function getColorForLanguage(langName) {
  const map = {
    'Dart': '#0175C2',
    'Flutter': '#02569B',
    'Python': '#387EB8',
    'Java': '#E76F00',
    'JavaScript': '#F7DF1E',
    'TypeScript': '#3178C6',
    'Go': '#00ADD8',
    'Bash': '#49D868',
    'Shell': '#49D868',
    'HTML': '#E34F26',
    'CSS': '#1572B6',
    'Vue.js': '#4FC08D',
    'React': '#61DAFB',
    'C++': '#00599C',
    'C': '#555555',
    'Rust': '#DEA584'
  };
  return map[langName] || '#6366F1';
}
