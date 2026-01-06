export default ({ router }) => {
  if (typeof window !== 'undefined') {
    const applyGitHubColors = () => {
      const root = document.documentElement
      root.style.setProperty('--background-color', '#282C34')
      root.style.setProperty('--text-color', '#c9d1d9')
      root.style.setProperty('--text-color-sub', '#8b949e')
      root.style.setProperty('--border-color', '#30363d')
      root.style.setProperty('--code-color', '#161b22')
      root.style.setProperty('--box-shadow', '0 1px 8px 0 rgba(0, 0, 0, 0.5)')
      root.style.setProperty('--box-shadow-hover', '0 2px 16px 0 rgba(0, 0, 0, 0.6)')
    }

    // 初始加载
    setTimeout(applyGitHubColors, 100)

    // 路由变化时
    router.afterEach(() => {
      setTimeout(applyGitHubColors, 100)
    })
  }
}

