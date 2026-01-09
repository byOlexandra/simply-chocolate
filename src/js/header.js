export default function toggleTheme() {
    const toggleThemeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleThemeBtn.checked = true;
        } else {
            toggleThemeBtn.checked = false;
        }
    }
    toggleThemeBtn.addEventListener('change', () => {
        if (toggleThemeBtn.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        
    })
}