/**
 * ============================================
 * VDOX - Main JavaScript
 * Handles: Navigation, Scroll Animations, Mobile Menu, Interactions
 * ============================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for glassmorphism effect
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOpen = false;

    mobileMenuBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', menuOpen);
        
        // Change icon based on state
        const svg = mobileMenuBtn.querySelector('svg');
        if (menuOpen) {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
        } else {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
        }
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false;
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
        });
    });

    // ==========================================
    // SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after reveal:
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // SHOWREEL PLAY BUTTON (Placeholder functionality)
    // ==========================================
    const showreelPlay = document.getElementById('showreel-play');
    if (showreelPlay) {
        showreelPlay.addEventListener('click', () => {
            // Replace this with your actual video embed logic
            // For now, shows a nice alert - replace with lightbox or video player
            alert('Showreel video coming soon! Replace the placeholder with your actual video embed (YouTube, Vimeo, or self-hosted).');
            
            // Example: Open a modal with video
            // openVideoModal('your-video-url.mp4');
        });
    }

    // ==========================================
    // ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-accent-primary');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('text-accent-primary');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ==========================================
    // PARALLAX EFFECT FOR HERO BACKGROUND (Subtle)
    // ==========================================
    const heroSection = document.getElementById('home');
    const heroBgElements = heroSection.querySelectorAll('.absolute');

    function parallaxHero() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        heroBgElements.forEach((el, index) => {
            if (index < 3) { // Only affect the glow orbs
                el.style.transform = `translateY(${rate * (0.1 + index * 0.05)}px)`;
            }
        });
    }

    // Only run parallax on non-touch devices for performance
    if (!window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', parallaxHero, { passive: true });
    }

    // ==========================================
    // NAVBAR HIDE/SHOW ON SCROLL DIRECTION
    // ==========================================
    let scrollDirection = 'up';
    let scrollTimeout;

    function handleNavVisibility() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll >