module.exports = {
    title: "Danny Blog",
    description: '看见 思考 行动',
    theme: 'reco',
    base: '/blog/',
    dest: './site',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
    ],
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    themeConfig: {
        type: 'blog',
        author: 'Danny',
        authorAvatar: '/avatar.jpg',
        subSidebar: 'auto',
        nav: [
            {
                text: 'Philosophy',
                link: 'https://meicanhong.github.io/blog/categories/Philosophy/',
                icon: 'reco-date',
            },
            {
                text: 'TimeLine',
                link: '/timeline/',
                icon: 'reco-date',
            },
            {
                text: 'About Me',
                link: '/mythink/about_me.md'
            },
            {
                text: 'My GPT',
                link: 'http://117.50.185.73/'
            },
            {
                text: 'Github',
                link: 'https://github.com/meicanhong'
            }
        ],
        blogConfig: {
            category: {
                location: 1,     // 在导航栏菜单中所占的位置，默认2
                text: 'Category' // 默认文案 “分类”
            },
            tag: {
                location: 2,     // 在导航栏菜单中所占的位置，默认3
                text: 'Tag'      // 默认文案 “标签”
            },
        },
        friendLink: [
            {
                title: 'Dedsec2z Blog',
                desc: '',
                logo: "https://p3-tt-ipv6.byteimg.com/origin/pgc-image/10d1842054d0455d894e5289d3d81c91",
                link: 'https://dedsec2z.top/'
            }
        ]
    }
}