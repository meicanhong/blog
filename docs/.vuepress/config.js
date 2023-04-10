module.exports = {
    title: "Danny Blog",
    description: '看见 思考 行动',
    theme: 'reco',
    base: '/blog/',
    dest: './site',
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
                text: 'TimeLine',
                link: '/timeline/',
                icon: 'reco-date',
            },
            {
                text: 'About Me',
                link: '/myself/about_me.md'
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
        }
    }
}