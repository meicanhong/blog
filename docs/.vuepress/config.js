module.exports = {
    title: '...',
    description: '...',
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
                title: '欢迎学习',
                path: '/',
                collapsable: false, // 不折叠
                children: [
                    { title: "学前必读", path: "/" }
                ]
            },
            {
                title: "Flink",
                path: '/blog/Flink SQL 带你玩转实时数据.md',
                collapsable: false, // 不折叠
                // children: [
                //     { title: "条件类型", path: "/handbook/ConditionalTypes" },
                //     { title: "泛型", path: "/handbook/Generics" }
                // ],
            }
        ],
        subSideBar: 'auto'
    }
}