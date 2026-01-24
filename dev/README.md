# 🧠 SAE303 - Eye-Tracking & Autisme

## Site Web de Vulgarisation Scientifique

---

## 🎯 Questions & Réponses sur le Projet

### 📋 Questions Générales

**Q: Qu'est-ce que ce projet ?**  
R: Un site web de vulgarisation scientifique présentant une recherche INSERM sur l'eye-tracking chez les enfants avec troubles du spectre de l'autisme (TSA).

**Q: Qui est la cible ?**  
R: Le grand public, non-spécialiste, sensible aux sujets santé/enfance, avec une attention particulière à l'accessibilité TSA-friendly.

**Q: Quelles technologies sont utilisées ?**  
R: HTML5, CSS3, JavaScript, Bootstrap 5, Chart.js, SVG animés.

---

### 🎨 Questions sur le Design

**Q: Pourquoi le bleu comme couleur principale ?**  
R: Le bleu est la couleur associée à l'autisme, il est rassurant et évoque la science. Nous avons choisi un bleu doux et désaturé (#5B8FA3) pour être TSA-friendly.

**Q: Qu'est-ce que "TSA-friendly" ?**  
R: Un design qui évite :
- Les couleurs saturées ou agressives
- Les animations trop rapides ou clignotantes
- Les contrastes trop forts
- La sur-stimulation visuelle

**Q: Pourquoi la typographie Inter ?**  
R: Inter est une police sans-serif moderne, très lisible à l'écran, optimisée pour le web, et professionnelle tout en restant accessible.

**Q: Qu'est-ce que le glassmorphism ?**  
R: Un effet visuel moderne utilisant `backdrop-filter: blur()` qui donne un aspect de verre dépoli aux éléments, créant de la profondeur et de l'élégance.

---

### 📊 Questions sur la Datavisualisation

**Q: Combien de types de graphiques y a-t-il ?**  
R: 4 types :
1. **Barres** - Comparaison DT vs TSA
2. **Courbes** - Évolution sur les 4 visages
3. **Camembert** - Répartition par zone
4. **Combiné** - Barres + ligne de moyenne

**Q: Comment fonctionnent les filtres ?**  
R: 3 niveaux de filtrage :
- **Visage** : Sélection parmi 4 visages d'enfants
- **Zone** : Écran, Tête, Yeux, Bouche
- **Paramètre** : TF, NBF, TP, NBE, Latence

Les graphiques se mettent à jour automatiquement selon la sélection.

**Q: Que signifie "p ≤ 0.05" ?**  
R: C'est le seuil de significativité statistique. Quand p ≤ 0.05, cela signifie que la différence observée entre DT et TSA a moins de 5% de chances d'être due au hasard. Ces résultats sont mis en évidence avec la couleur jaune (#F4D35E).

**Q: D'où viennent les données ?**  
R: Les données proviennent du fichier Excel `Data_SAE3031_VF_OK.xlsx` fourni par l'unité de recherche INSERM.

---

### 🔬 Questions Scientifiques

**Q: Qu'est-ce que l'eye-tracking ?**  
R: L'oculométrie (eye-tracking) est une technologie qui permet de suivre et enregistrer les mouvements oculaires en temps réel grâce à un dispositif infrarouge.

**Q: Que mesure-t-on exactement ?**  
R: 6 paramètres principaux :
- **TTT** : Temps Total Tracké
- **TP** : Temps Passé dans la zone
- **TF** : Temps de Fixation
- **NBF** : Nombre de Fixations
- **NBE** : Nombre d'Entrées dans la zone
- **Lat** : Latence (temps avant première visite)

**Q: Qu'est-ce qu'une "zone d'intérêt" (AOI) ?**  
R: C'est une région spécifique du visage que nous analysons séparément : Écran complet, Tête, Yeux, Bouche.

**Q: Quelle est la différence entre DT et TSA ?**  
R: 
- **DT** (Développement Typique) : Enfants sans diagnostic de TSA
- **TSA** (Troubles du Spectre de l'Autisme) : Enfants ayant reçu un diagnostic clinique

**Q: Quels sont les résultats clés ?**  
R: Les enfants avec TSA présentent des patterns de regard différents, notamment :
- Plus de temps de fixation sur l'écran global
- Moins de fixations sur les yeux
- Des latences différentes pour explorer certaines zones

---

### 💻 Questions Techniques

**Q: Bootstrap est-il vraiment utilisé ?**  
R: **Oui absolument !** Bootstrap 5 est utilisé pour :
- **Grid system** : `container`, `row`, `col-lg-*`, `col-md-*`
- **Navbar** : Navigation responsive avec collapse
- **Accordion** : Section Contexte TSA/TND
- **Cards** : Composants card avec card-body, card-title
- **Utilities** : `mb-*`, `mt-*`, `text-center`, `g-*` (gap)
- **Responsive** : Breakpoints et classes responsive

**Q: Comment lancer le site localement ?**  
R: 
```bash
cd "/chemin/vers/dev"
python3 -m http.server 8000
```
Puis ouvrir `http://localhost:8000` dans le navigateur.

**Q: Le site est-il responsive ?**  
R: Oui ! Testé sur :
- Mobile (375px)
- Tablet (768px)
- Desktop (1920px+)

**Q: Quelles sont les animations utilisées ?**  
R: 
- Gradient animé dans le hero (`gradientShift`)
- Floating effect sur le pattern de fond
- Fade-in au scroll (Intersection Observer)
- Hover effects sur cards et team members
- Transitions douces sur tous les éléments interactifs

**Q: Le site est-il accessible ?**  
R: Oui, nous respectons :
- **WCAG AA** : Contraste ≥ 4.5:1
- **Keyboard navigation** : Focus states visibles
- **Reduced motion** : Support des préférences utilisateur
- **Sémantique HTML5** : Structure claire
- **Alt text** : Sur toutes les images

---

### 👥 Questions sur l'Équipe

**Q: Qui a réalisé ce site ?**  
R: Une équipe de 3 personnes :
- **Antoine Ozenne** - Développeur & Designer
- **Jean Fontaine** - Développeur & Data Viz
- **Ibtissam Bryek** - Développeuse & UX Designer

**Q: Dans quel cadre ?**  
R: Projet SAE303 - Datavisualisation (MMI)

---

### 🎨 Questions sur les Améliorations Esthétiques

**Q: Quelles améliorations esthétiques ont été apportées ?**  
R: 
1. **Hero animé** : Gradient qui se déplace en boucle
2. **Glassmorphism** : Effet verre dépoli sur cards et charts
3. **Shadows premium** : Ombres douces et élégantes
4. **Hover effects** : Transformations subtiles au survol
5. **Team cards** : Photos circulaires avec bordure animée
6. **Transitions fluides** : Animations douces partout

**Q: Pourquoi le glassmorphism ?**  
R: C'est une tendance moderne qui apporte :
- De la profondeur visuelle
- Une impression de légèreté
- Un aspect premium et professionnel
- Une meilleure hiérarchie visuelle

**Q: Comment les couleurs sont-elles utilisées ?**  
R: 
- **Bleu principal** (#5B8FA3) : Identité, navigation, titres
- **Jaune accent** (#F4D35E) : Résultats significatifs (p≤0.05)
- **Turquoise** (#83C5BE) : Groupe DT
- **Corail** (#E07A5F) : Groupe TSA
- **Neutres** : Textes et backgrounds

---

### 🚀 Questions de Déploiement

**Q: Comment déployer en production ?**  
R: 
1. Héberger sur un serveur web (Apache, Nginx, Netlify, Vercel)
2. Optimiser les images (compression)
3. Minifier CSS/JS (optionnel)
4. Configurer HTTPS
5. Tester sur différents navigateurs

**Q: Quelles sont les dépendances externes ?**  
R: 
- Bootstrap 5.3.2 (CDN)
- Chart.js 4.4.0 (CDN)
- Google Fonts - Inter (CDN)

**Q: Le site fonctionne-t-il hors ligne ?**  
R: Non, car il dépend de CDN externes. Pour une version offline, il faudrait héberger localement Bootstrap, Chart.js et les fonts.

---

### 📈 Questions sur les Performances

**Q: Le site est-il optimisé ?**  
R: Oui :
- CSS avec custom properties (réutilisables)
- JavaScript modulaire (4 fichiers séparés)
- SVG optimisés (légers)
- Fonts chargées avec `preconnect`
- Animations CSS (GPU accelerated)

**Q: Combien pèse le site ?**  
R: 
- HTML : ~26 KB
- CSS : ~15 KB
- JS : ~10 KB (total des 4 fichiers)
- SVG icons : ~2 KB chacun
- Images : Variables selon compression

---

### 🎓 Questions Pédagogiques

**Q: Comment la vulgarisation est-elle assurée ?**  
R: 
- Termes scientifiques expliqués
- Accordéon pour niveaux de lecture (curieux/initié)
- Visuels pédagogiques (animation eye-tracking)
- Pictogrammes pour chaque paramètre
- Graphiques interactifs et intuitifs

**Q: Le site est-il adapté aux enfants ?**  
R: Le contenu est destiné au grand public adulte, mais le design calme et les visuels clairs le rendent accessible à un public large.

---

## 🏆 Points Forts du Projet

✅ **Design TSA-friendly** : Couleurs douces, animations subtiles  
✅ **Datavisualisation riche** : 4 types de graphiques interactifs  
✅ **Accessibilité** : WCAG AA, keyboard navigation  
✅ **Responsive** : Mobile, tablet, desktop  
✅ **Performance** : Code optimisé, modulaire  
✅ **Esthétique premium** : Glassmorphism, animations fluides  
✅ **Pédagogie** : Vulgarisation claire et rigoureuse  

---

## 📞 Contact

Pour toute question sur ce projet, contactez l'équipe :
- Antoine Ozenne
- Jean Fontaine
- Ibtissam Bryek

**Projet SAE303 - Datavisualisation**  
**INSERM - Recherche sur l'Eye-Tracking et l'Autisme**

---

*Dernière mise à jour : Décembre 2024*
