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
            highlightActiveLink();
            initNavigationSystem(); // unified system
        });

    /* ---------------------------
       ACTIVE LINK HIGHLIGHTING
    ---------------------------- */
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

    /* ---------------------------
       UNIFIED NAVIGATION SYSTEM
    ---------------------------- */
    function initNavigationSystem() {
        const CONFIG = {
            BREAKPOINTS: { MOBILE: 1023.5 },
            SELECTORS: {
                body: "body",
                navigation: "#cs-navigation",
                hamburger: "#cs-navigation .cs-toggle",
                menuWrapper: "#cs-ul-wrapper",
                dropdownToggle: ".cs-dropdown-toggle",
                dropdown: ".cs-dropdown",
                dropdownMenu: ".cs-drop-ul",
                topBar: ".cs-top-bar",
            },
            CLASSES: {
                active: "cs-active",
                menuOpen: "cs-open",
                scroll: "scroll",
            },
        };

        const elements = {
            body: document.querySelector(CONFIG.SELECTORS.body),
            navigation: document.querySelector(CONFIG.SELECTORS.navigation),
            hamburger: document.querySelector(CONFIG.SELECTORS.hamburger),
            menuWrapper: document.querySelector(CONFIG.SELECTORS.menuWrapper),
            topBar: document.querySelector(CONFIG.SELECTORS.topBar),
            darkToggle: document.getElementById('dark-mode-toggle'),
        };

        const isMobile = () => window.matchMedia(`(max-width: ${CONFIG.BREAKPOINTS.MOBILE}px)`).matches;

        const toggleAttribute = (el, attr, v1 = "true", v2 = "false") => {
            if (!el) return;
            const current = el.getAttribute(attr);
            el.setAttribute(attr, current === v1 ? v2 : v1);
        };

        const toggleInert = (el) => el && (el.inert = !el.inert);

        /* ---------------------------
           DROPDOWN MANAGER
        ---------------------------- */
        const dropdownManager = {
            close(dropdown, shouldFocus = false) {
                if (!dropdown || !dropdown.classList.contains(CONFIG.CLASSES.active)) return false;

                dropdown.classList.remove(CONFIG.CLASSES.active);
                const button = dropdown.querySelector(CONFIG.SELECTORS.dropdownToggle);
                const menu = dropdown.querySelector(CONFIG.SELECTORS.dropdownMenu);

                if (button) {
                    button.setAttribute("aria-expanded", "false");
                    shouldFocus && button.focus();
                }

                if (menu) menu.inert = true;

                return true;
            },

            toggle(dropdown) {
                dropdown.classList.toggle(CONFIG.CLASSES.active);
                const button = dropdown.querySelector(CONFIG.SELECTORS.dropdownToggle);
                const menu = dropdown.querySelector(CONFIG.SELECTORS.dropdownMenu);

                button && toggleAttribute(button, "aria-expanded");
                menu && toggleInert(menu);
            },

            closeAll() {
                let closed = false;
                elements.navigation.querySelectorAll(`${CONFIG.SELECTORS.dropdown}.${CONFIG.CLASSES.active}`)
                    .forEach(drop => {
                        this.close(drop, true);
                        closed = true;
                    });
                return closed;
            },
        };

        /* ---------------------------
           MENU MANAGER
        ---------------------------- */
        const menuManager = {
            toggle() {
                const isClosing = elements.navigation.classList.contains(CONFIG.CLASSES.active);

                [elements.hamburger, elements.navigation].forEach(el => el.classList.toggle(CONFIG.CLASSES.active));
                elements.body.classList.toggle(CONFIG.CLASSES.menuOpen);
                toggleAttribute(elements.hamburger, "aria-expanded");

                if (elements.menuWrapper && isMobile()) toggleInert(elements.menuWrapper);

                if (isClosing) dropdownManager.closeAll();
            },
        };

        /* ---------------------------
           KEYBOARD ESCAPE
        ---------------------------- */
        const keyboardManager = {
            handleEscape() {
                const dropdownsClosed = dropdownManager.closeAll();
                if (dropdownsClosed) return;

                if (elements.hamburger.classList.contains(CONFIG.CLASSES.active)) {
                    menuManager.toggle();
                    elements.hamburger.focus();
                }
            },
        };

        /* ---------------------------
           EVENT MANAGER
        ---------------------------- */
        const eventManager = {
            handleDropdownClick(e) {
                if (!isMobile()) return;
                const button = e.target.closest(CONFIG.SELECTORS.dropdownToggle);
                if (!button) return;

                e.preventDefault();
                const dropdown = button.closest(CONFIG.SELECTORS.dropdown);
                dropdown && dropdownManager.toggle(dropdown);
            },

            handleDropdownKeydown(e) {
                if (e.key !== "Enter" && e.key !== " ") return;
                const button = e.target.closest(CONFIG.SELECTORS.dropdownToggle);
                if (!button) return;

                e.preventDefault();
                const dropdown = button.closest(CONFIG.SELECTORS.dropdown);
                dropdown && dropdownManager.toggle(dropdown);
            },

            handleFocusOut(e) {
                setTimeout(() => {
                    if (!e.relatedTarget) return;
                    const dropdown = e.target.closest(CONFIG.SELECTORS.dropdown);
                    if (dropdown?.classList.contains(CONFIG.CLASSES.active) &&
                        !dropdown.contains(e.relatedTarget)) {
                        dropdownManager.close(dropdown);
                    }
                }, 10);
            },

            handleDropdownHover(e) {
                if (isMobile()) return;

                const dropdown = e.target.closest(CONFIG.SELECTORS.dropdown);
                if (!dropdown) return;

                const menu = dropdown.querySelector(CONFIG.SELECTORS.dropdownMenu);
                if (!menu) return;

                if (e.type === "mouseenter") {
                    menu.inert = false;
                } else {
                    setTimeout(() => {
                        if (!dropdown.matches(':hover')) menu.inert = true;
                    }, 1);
                }
            },
        };

        /* ---------------------------
           SCROLL EFFECTS
        ---------------------------- */
        const scrollManager = {
            handleScrollEffects() {
                const scrollPosition = document.documentElement.scrollTop;
                const isScrolled = scrollPosition >= 100;

                elements.body.classList.toggle(CONFIG.CLASSES.scroll, isScrolled);
                if (elements.topBar) elements.topBar.inert = isScrolled;
            },
        };

        /* ---------------------------
           INITIALIZATION
        ---------------------------- */
        const init = {
            inertState() {
                if (elements.menuWrapper) elements.menuWrapper.inert = isMobile();

                elements.navigation.querySelectorAll(CONFIG.SELECTORS.dropdownMenu)
                    .forEach(menu => menu.inert = true);
            },

            eventListeners() {
                elements.hamburger.addEventListener("click", menuManager.toggle);
                elements.navigation.addEventListener("click", eventManager.handleDropdownClick);
                elements.navigation.addEventListener("keydown", eventManager.handleDropdownKeydown);
                elements.navigation.addEventListener("focusout", eventManager.handleFocusOut);

                elements.navigation.addEventListener("mouseenter", eventManager.handleDropdownHover, true);
                elements.navigation.addEventListener("mouseleave", eventManager.handleDropdownHover, true);

                document.addEventListener("keydown", e => e.key === "Escape" && keyboardManager.handleEscape());
                document.addEventListener("scroll", scrollManager.handleScrollEffects);

                window.addEventListener("resize", () => {
                    this.inertState();
                    if (!isMobile() && elements.navigation.classList.contains(CONFIG.CLASSES.active)) {
                        menuManager.toggle();
                    }
                });

                if (elements.darkToggle) {
                    elements.darkToggle.addEventListener("click", () => {
                        isDarkEnabled = !isDarkEnabled;
                        CSbody.classList.toggle('dark-mode', isDarkEnabled);
                        localStorage.setItem(storageKey, isDarkEnabled ? 'true' : 'false');
                    });
                }
            },
        };

        init.inertState();
        init.eventListeners();
    }
});
