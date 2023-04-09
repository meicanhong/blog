module.exports = {
    title: 'Danny Blog',
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
        nav: [
            {
                text: 'Github',
                link: 'https://github.com/meicanhong'
            }
        ]
    }
}