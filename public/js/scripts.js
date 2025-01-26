document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle')
    const currentTheme = localStorage.getItem('theme') || 'light'
  
    document.documentElement.setAttribute('data-theme', currentTheme)
  
    themeToggle.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'
  
    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'light'
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
        themeToggle.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode'
    })
})