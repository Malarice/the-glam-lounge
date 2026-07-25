document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'isDarkModeEnabled';
    const CSbody = document.body;
    let isDarkEnabled = localStorage.getItem(storageKey) === 'true';

    // Initial dark mode update
    CSbody.classList.toggle('dark-mode', isDarkEnabled);

    // Load and inject the navbar
    fetch('/nav.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('navbar').innerHTML = html;
            highlightActiveLink(); // 🔥 Add this
            initNavFeatures();     // Attach all listeners after injection
        });

function highlightActiveLink() {
    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';

    document.querySelectorAll('#navbar a.cs-li-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        const normalizedHref = '/' + href.toLowerCase().replace(/^\//, '').replace(/\/$/, '');

        const isHome =
            normalizedHref === '/index.html' &&
            (currentPath === '/' || currentPath === '/index.html' || currentPath === '');

        if (currentPath === normalizedHref || isHome) {
            link.classList.add('cs-active');
        } else {
            link.classList.remove('cs-active');
        }
    });
}




    // Core function to activate interactivity
    function initNavFeatures() {
        const CSnavbarMenu = document.querySelector("#cs-navigation");
        const CShamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");
        const darkToggle = document.getElementById('dark-mode-toggle');

        // 🟡 Mobile Nav Toggle
        if (CShamburgerMenu && CSnavbarMenu) {
            CShamburgerMenu.addEventListener('click', () => {
                CShamburgerMenu.classList.toggle("cs-active");
                CSnavbarMenu.classList.toggle("cs-active");
                CSbody.classList.toggle("cs-open");
                toggleAriaExpanded();
            });
        }

        // 🟡 Dropdown Toggles
        const dropDowns = document.querySelectorAll('#cs-navigation .cs-dropdown');
        dropDowns.forEach(drop => {
            drop.addEventListener('click', () => {
                drop.classList.toggle('cs-active');
            });
        });

        // 🟡 Scroll-triggered styling
        document.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            CSbody.classList.toggle('scroll', scrollTop >= 100);
        });

        // 🟡 Dark Mode Toggle
        if (darkToggle) {
            darkToggle.addEventListener('click', () => {
                isDarkEnabled = !isDarkEnabled;
                CSbody.classList.toggle('dark-mode', isDarkEnabled);
                localStorage.setItem(storageKey, isDarkEnabled ? 'true' : 'false');
            });
        }
    }

    // Aria expanded toggle helper
    function toggleAriaExpanded() {
        const csUL = document.querySelector('#cs-expanded');
        const expanded = csUL?.getAttribute('aria-expanded');
        if (csUL) csUL.setAttribute('aria-expanded', expanded === 'false' ? 'true' : 'false');
    }
});
