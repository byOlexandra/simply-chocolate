export function toggleTheme() {
    const toggleThemeBtn = document.querySelectorAll('.theme-toggle-input');
    const currentTheme = localStorage.getItem('theme');
    const syncToggles = (isDark) => {
        toggleThemeBtn.forEach(el => {
            el.checked = isDark;
        })
    }
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleThemeBtn.checked = true;
            syncToggles(true);
        } else {
            toggleThemeBtn.checked = false;
        }
    }
    toggleThemeBtn.forEach(btn => {
        btn.addEventListener('change', () => {
            const isDark = btn.checked;
            if(btn.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
            syncToggles(isDark);
        })
    })
}

export function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled'); 
        } else {
            header.classList.remove('header-scrolled');
        }
    })
}