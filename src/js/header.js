const header = document.getElementById('header');
const theme = document.getElementById('theme-toggle');

export function toggleTheme() {
  const toggleThemeBtn = document.querySelectorAll('.theme-toggle-input');
  const currentTheme = localStorage.getItem('theme');
  const syncToggles = isDark => {
    toggleThemeBtn.forEach(el => {
      el.checked = isDark;
    });
  };

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

      if (btn.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }

      syncToggles(isDark);
    });
  });
}

theme.addEventListener('keydown', e => {
  if (e.code === 'Enter') {
    theme.click();
  }
});

export function initHeaderScroll() {
  window.addEventListener('scroll', checkScroll);

  window.addEventListener('DOMContentLoaded', checkScroll);

  window.addEventListener('load', checkScroll);
}

function checkScroll() {
  if (window.scrollY > 0) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }
}

export function initIntersecting() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav__list-a-item');

  const options = {
    root: null,
    threshold: 0.5,
    rootMargin: "-10% 0px -40% 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          link.classList.remove('active')
          if (link.dataset.section === sectionId) {
            link.classList.add('active')
          }
        })

      }
    })
  }, options)

  sections.forEach((section) => observer.observe(section))
}

