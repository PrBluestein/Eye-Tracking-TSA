

const Mascot = (() => {
    const messages = {
        index: [
            { id: 'hero', msg: "Bienvenue ! Je suis le Professeur Bluestein. Prêt pour une exploration scientifique ?" },
            { id: 'contexte', msg: "Ici, nous expliquons pourquoi l'INSERM s'intéresse au regard des enfants." },
            { id: 'experience', msg: "L'eye-tracking suit l'oeil à une vitesse incroyable pour capter chaque détail." },
            { id: 'resultats', msg: "Comparez les groupes ! Les enfants TSA explorent souvent moins les yeux." },
            { id: 'conclusions', msg: "Merci d'avoir exploré ces données avec moi. À bientôt !" }
        ],
        soutenance: [
            { slide: 1, msg: "Bonjour au jury ! Voici la présentation de notre projet SAE 303." },
            { slide: 3, msg: "Nous avons choisi une palette douce pour respecter la sensibilité TSA." },
            { slide: 5, msg: "Nos visages vectoriels permettent une interaction zone par zone." },
            { slide: 7, msg: "L'analyse vidéo confirme les tendances observées dans les données." },
            { slide: 9, msg: "C'est l'heure de conclure. Des questions ?" }
        ],
        analyse: [
            { id: 'video-grid', msg: "Bonjour ! Le Professeur Bluestein vous accompagne pour l'analyse des vidéos." },
            { id: 'insights', msg: "Bonne nouvelle ! Nos choix de design sont validés par ces observations." },
            { id: 'methodologie', msg: "Le protocole de test garantit la pertinence de nos analyses UX." }
        ]
    };

    let bubble, img;
    const paths = {
        closed: 'assets/prof/profbouchefermé.png',
        open: 'assets/prof/profboucheouverte.png'
    };

    const init = () => {
        bubble = document.getElementById('mascotBubble');
        img = document.getElementById('mascotImg');

        if (!bubble || !img) return;

        
        const path = window.location.pathname;
        let page = 'index';
        if (path.includes('soutenance')) page = 'soutenance';
        else if (path.includes('analyse')) page = 'analyse';

        if (page === 'index') {
            setupScrollListener(messages.index);
        } else if (page === 'analyse') {
            setupScrollListener(messages.analyse);
        } else {
            setupSlideListener(messages.soutenance);
        }

        
        setTimeout(() => {
            const firstMsg = page === 'soutenance' ? messages.soutenance[0].msg : (page === 'analyse' ? messages.analyse[0].msg : messages.index[0].msg);
            talk(firstMsg);
        }, 2000);
    };

    const talk = (message) => {
        if (!bubble || !img) return;

        bubble.classList.remove('show');

        setTimeout(() => {
            bubble.innerText = message;
            bubble.classList.add('show');

            
            let count = 0;
            const interval = setInterval(() => {
                img.src = count % 2 === 0 ? paths.open : paths.closed;
                count++;
                if (count > 7) {
                    clearInterval(interval);
                    img.src = paths.closed;
                }
            }, 120);
        }, 300);
    };

    const setupScrollListener = (msgs) => {
        let lastId = '';
        window.addEventListener('scroll', () => {
            let current = '';
            msgs.forEach(m => {
                const el = document.getElementById(m.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                        current = m.id;
                    }
                }
            });

            if (current && current !== lastId) {
                lastId = current;
                const match = msgs.find(m => m.id === current);
                talk(match.msg);
            }
        });
    };

    const setupSlideListener = (msgs) => {
        
        
        
        window.addEventListener('hashchange', () => {
            const slideNum = parseInt(window.location.hash.split('-')[1]);
            const match = msgs.find(m => m.slide === slideNum);
            if (match) talk(match.msg);
        });
    };

    return { init, talk };
})();

document.addEventListener('DOMContentLoaded', Mascot.init);
