module.exports = {
    title: 'Danny Blog',
    description: '看到、想到、见到',
    theme: 'reco',
    base: '/blog/',
    dest: './site',
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            {
                text: 'Github',
                link: 'https://github.com/meicanhong'
            }
        ],
        sidebar: [
            {
                title: 'Big Data',
                collapsable: true,
                sidebarDepth: 3,
                children: [
                    '/big-data/Flink SQL 带你玩转实时数据.md',
                    '/big-data/Trino Master OOM 排查记录',
                    '/big-data/Iceberg 数据治理及查询加速',
                    '/big-data/Trino Worker 规避 OOM 思路',
                ]
            },
        ],
    }
}