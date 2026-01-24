// Interactive Playground - Background elements with drag, scroll, and hover interactions
class InteractivePlayground {
    constructor() {
        this.floatingElements = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollY = 0;
        this.draggedElement = null;
        this.init();
    }

    init() {
        this.createFloatingElements();
        this.setupMouseTracking();
        this.setupScrollTracking();
        this.animate();
    }

    createFloatingElements() {
        const container = document.createElement('div');
        container.id = 'floating-playground';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(container);

        // Create simple geometric shapes - calm and minimal (reduced to 8 total for accessibility)
        const elements = [
            { type: 'circle', color: 'rgba(0, 157, 193, 0.15)', count: 3, speed: 0.008, size: 40 },
            { type: 'circle', color: 'rgba(0, 82, 145, 0.12)', count: 2, speed: 0.006, size: 30 },
            { type: 'circle', color: 'rgba(255, 88, 82, 0.1)', count: 2, speed: 0.007, size: 35 },
            { type: 'square', color: 'rgba(51, 177, 209, 0.1)', count: 1, speed: 0.005, size: 25 }
        ];

        elements.forEach(type => {
            for (let i = 0; i < type.count; i++) {
                this.createFloatingElement(container, type, type.speed, type.size);
            }
        });
    }

    createFloatingElement(container, shapeConfig, speed, size) {
        const element = document.createElement('div');
        element.className = 'floating-element';

        // Create geometric shape with CSS
        const isCircle = shapeConfig.type === 'circle';
        element.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${shapeConfig.color};
            border-radius: ${isCircle ? '50%' : '8px'};
            pointer-events: auto;
            cursor: grab;
            transition: all 0.3s ease;
            user-select: none;
            backdrop-filter: blur(2px);
        `;

        // Random starting position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        element.style.left = x + 'px';
        element.style.top = y + 'px';

        // Hover effect
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.3)';
            element.style.background = shapeConfig.color.replace(/0\.\d+/, '0.25');
        });

        element.addEventListener('mouseleave', () => {
            if (!this.draggedElement) {
                element.style.transform = 'scale(1)';
                element.style.background = shapeConfig.color;
            }
        });

        // Drag functionality
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.draggedElement = element;
            element.style.cursor = 'grabbing';
            element.style.zIndex = '1000';

            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && this.draggedElement === element) {
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;

                element.style.left = newX + 'px';
                element.style.top = newY + 'px';

                // Update base position
                const item = this.floatingElements.find(el => el.element === element);
                if (item) {
                    item.x = newX;
                    item.y = newY;
                    item.baseX = newX;
                    item.baseY = newY;
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging && this.draggedElement === element) {
                isDragging = false;
                this.draggedElement = null;
                element.style.cursor = 'grab';
                element.style.zIndex = '';
            }
        });

        container.appendChild(element);

        this.floatingElements.push({
            element,
            x,
            y,
            baseX: x,
            baseY: y,
            speed,
            angle: Math.random() * Math.PI * 2,
            radius: 30 + Math.random() * 60,
            scrollOffset: Math.random() * 100
        });
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    setupScrollTracking() {
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
    }

    animate() {
        this.floatingElements.forEach(item => {
            // Skip animation if being dragged
            if (this.draggedElement === item.element) {
                return;
            }

            // Very gentle floating motion
            item.angle += item.speed;
            const offsetX = Math.cos(item.angle) * item.radius;
            const offsetY = Math.sin(item.angle) * item.radius;

            // Scroll-based movement
            const scrollEffect = Math.sin((this.scrollY + item.scrollOffset) * 0.002) * 20;

            // Very subtle mouse attraction - calm effect
            const dx = this.mouseX - item.x;
            const dy = this.mouseY - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                item.x += (dx / distance) * force * 0.5;
                item.y += (dy / distance) * force * 0.5;
            } else {
                // Slowly return to base position
                item.x += (item.baseX - item.x) * 0.005;
                item.y += (item.baseY - item.y) * 0.005;
            }

            item.element.style.left = (item.x + offsetX) + 'px';
            item.element.style.top = (item.y + offsetY + scrollEffect) + 'px';
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new InteractivePlayground();
    });
} else {
    new InteractivePlayground();
}
