// Decorative Elements Generator
// Adds interactive decorative elements throughout the page

class DecorativeElements {
    constructor() {
        this.scrollY = 0;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.addDecorations());
        } else {
            this.addDecorations();
        }

        // Track scroll
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
    }

    addDecorations() {
        this.addClouds();
        this.addBubbles();
        this.addHoverZones();
        this.setupParallax();
        this.setupScrollAnimations();
    }

    addClouds() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (index % 2 === 0) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud-decoration parallax-decoration scroll-reactive';
                cloud.style.cssText = `
                    top: ${20 + Math.random() * 30}%;
                    left: ${10 + Math.random() * 20}%;
                    transition: all 0.5s ease;
                `;
                cloud.dataset.speed = '0.3';
                cloud.dataset.scrollSpeed = '0.1';

                // Hover effect
                cloud.addEventListener('mouseenter', () => {
                    cloud.style.transform = 'scale(1.1)';
                    cloud.style.opacity = '0.9';
                });

                cloud.addEventListener('mouseleave', () => {
                    cloud.style.transform = 'scale(1)';
                    cloud.style.opacity = '0.7';
                });

                section.style.position = 'relative';
                section.appendChild(cloud);
            }
        });
    }

    addBubbles() {
        const sections = document.querySelectorAll('section');
        const colors = [
            'rgba(0, 157, 193, 0.15)',
            'rgba(0, 82, 145, 0.15)',
            'rgba(255, 88, 82, 0.12)',
            'rgba(51, 177, 209, 0.15)'
        ];

        sections.forEach((section, sectionIndex) => {
            const bubbleCount = 2;

            for (let i = 0; i < bubbleCount; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble-decoration parallax-decoration scroll-reactive';
                const size = 40 + Math.random() * 40;

                bubble.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    top: ${Math.random() * 80}%;
                    right: ${Math.random() * 30}%;
                    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), ${colors[sectionIndex % colors.length]});
                    animation-delay: ${Math.random() * 5}s;
                    transition: all 0.4s ease;
                `;
                bubble.dataset.speed = '0.2';
                bubble.dataset.scrollSpeed = '0.15';

                // Hover effect
                bubble.addEventListener('mouseenter', () => {
                    bubble.style.transform = 'scale(1.3)';
                    const newColor = colors[sectionIndex % colors.length].replace(/0\.\d+/, '0.25');
                    bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), ${newColor})`;
                });

                bubble.addEventListener('mouseleave', () => {
                    bubble.style.transform = 'scale(1)';
                    bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), ${colors[sectionIndex % colors.length]})`;
                });

                // Click to pop
                bubble.addEventListener('click', function () {
                    this.style.transition = 'all 1s ease';
                    this.style.transform = 'scale(1.5)';
                    this.style.opacity = '0';
                    setTimeout(() => {
                        this.style.transition = '';
                        this.style.transform = '';
                        this.style.opacity = '';
                    }, 1000);
                });

                section.appendChild(bubble);
            }
        });
    }

    addHoverZones() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (index % 4 === 0) {
                const zone = document.createElement('div');
                zone.className = 'hover-zone scroll-reactive';
                const size = 80 + Math.random() * 60;
                zone.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    top: ${Math.random() * 70}%;
                    left: ${Math.random() * 70}%;
                    transition: all 0.3s ease;
                `;
                zone.dataset.scrollSpeed = '0.08';

                // Hover effect
                zone.addEventListener('mouseenter', () => {
                    zone.style.transform = 'scale(1.5)';
                    zone.style.background = 'radial-gradient(circle, rgba(0, 157, 193, 0.2) 0%, transparent 70%)';
                });

                zone.addEventListener('mouseleave', () => {
                    zone.style.transform = 'scale(1)';
                    zone.style.background = 'radial-gradient(circle, rgba(255, 88, 82, 0.1) 0%, transparent 70%)';
                });

                zone.addEventListener('click', function () {
                    // Gentle ripple effect
                    const ripple = document.createElement('div');
                    ripple.style.cssText = `
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        border: 2px solid rgba(0, 157, 193, 0.3);
                        animation: ripple 2s ease-out;
                        pointer-events: none;
                    `;
                    this.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 2000);
                });

                section.appendChild(zone);
            }
        });

        // Add gentle ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                0% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(2.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupScrollAnimations() {
        const scrollReactiveElements = document.querySelectorAll('.scroll-reactive');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            scrollReactiveElements.forEach(el => {
                const scrollSpeed = parseFloat(el.dataset.scrollSpeed) || 0.1;
                const movement = Math.sin(scrollY * 0.003) * 30 * scrollSpeed;
                el.style.transform = `translateY(${movement}px)`;
            });
        });
    }

    setupParallax() {
        let ticking = false;

        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const parallaxElements = document.querySelectorAll('.parallax-decoration');
                    const mouseX = e.clientX / window.innerWidth;
                    const mouseY = e.clientY / window.innerHeight;

                    parallaxElements.forEach(el => {
                        const speed = parseFloat(el.dataset.speed) || 0.2;
                        const x = (mouseX - 0.5) * 20 * speed;
                        const y = (mouseY - 0.5) * 20 * speed;

                        el.style.transform = `translate(${x}px, ${y}px)`;
                    });

                    ticking = false;
                });

                ticking = true;
            }
        });
    }
}

// Initialize
new DecorativeElements();
