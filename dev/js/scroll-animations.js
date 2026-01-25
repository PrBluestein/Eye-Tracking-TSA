// Scroll Animations - Fade in and slide up effects for page elements
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Add animation classes to elements
        this.addAnimationClasses();

        // Setup Intersection Observer
        this.setupObserver();

        // Add scroll progress indicator
        this.addScrollProgress();

        // Add parallax to sections
        this.setupSectionParallax();
    }

    addAnimationClasses() {
        // Animate cards
        const cards = document.querySelectorAll('.card, .team-card, .chart-container');
        cards.forEach((card, index) => {
            card.classList.add('scroll-animate');
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        // Animate section titles
        const titles = document.querySelectorAll('h2, h3');
        titles.forEach(title => {
            title.classList.add('scroll-animate-title');
        });

        // Animate paragraphs
        const paragraphs = document.querySelectorAll('section p, section ul');
        paragraphs.forEach((p, index) => {
            p.classList.add('scroll-animate-text');
            p.style.transitionDelay = `${index * 0.05}s`;
        });

        // Animate buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .filter-btn');
        buttons.forEach((btn, index) => {
            btn.classList.add('scroll-animate-button');
            btn.style.transitionDelay = `${index * 0.1}s`;
        });

        // Animate stats
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            stat.classList.add('scroll-animate-stat');
            stat.style.transitionDelay = `${index * 0.15}s`;
        });

        // Animate face cards
        const faces = document.querySelectorAll('.face-card');
        faces.forEach((face, index) => {
            face.classList.add('scroll-animate-face');
            face.style.transitionDelay = `${index * 0.2}s`;
        });
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, this.observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('[class*="scroll-animate"]');
        animatedElements.forEach(el => observer.observe(el));
    }

    addScrollProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            document.querySelector('.scroll-progress-bar').style.width = scrolled + '%';
        });
    }

    setupSectionParallax() {
        const sections = document.querySelectorAll('section');

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrolled;
                const sectionHeight = rect.height;

                // Calculate parallax offset
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (scrolled - sectionTop + window.innerHeight) * 0.05;

                    // Apply subtle transform to section content
                    const content = section.querySelector('.container');
                    if (content) {
                        content.style.transform = `translateY(${offset}px)`;
                    }
                }
            });
        });
    }
}

// Initialize
new ScrollAnimations();
