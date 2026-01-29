
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
        
        this.addAnimationClasses();

        
        this.setupObserver();

        
        this.addScrollProgress();

        
        this.setupSectionParallax();
    }

    addAnimationClasses() {
        
        const cards = document.querySelectorAll('.card, .team-card, .chart-container');
        cards.forEach((card, index) => {
            card.classList.add('scroll-animate');
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        
        const titles = document.querySelectorAll('h2, h3');
        titles.forEach(title => {
            title.classList.add('scroll-animate-title');
        });

        
        const paragraphs = document.querySelectorAll('section p, section ul');
        paragraphs.forEach((p, index) => {
            p.classList.add('scroll-animate-text');
            p.style.transitionDelay = `${index * 0.05}s`;
        });

        
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .filter-btn');
        buttons.forEach((btn, index) => {
            btn.classList.add('scroll-animate-button');
            btn.style.transitionDelay = `${index * 0.1}s`;
        });

        
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            stat.classList.add('scroll-animate-stat');
            stat.style.transitionDelay = `${index * 0.15}s`;
        });

        
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

        
        const animatedElements = document.querySelectorAll('[class*="scroll-animate"]');
        animatedElements.forEach(el => observer.observe(el));
    }

    addScrollProgress() {
        
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        
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

                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (scrolled - sectionTop + window.innerHeight) * 0.05;

                    
                    const content = section.querySelector('.container');
                    if (content) {
                        content.style.transform = `translateY(${offset}px)`;
                    }
                }
            });
        });
    }
}


new ScrollAnimations();
