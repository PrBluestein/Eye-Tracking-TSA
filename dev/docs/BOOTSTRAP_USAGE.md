# ✅ Utilisation de Bootstrap 5 dans le Projet

## Confirmation : Bootstrap est BIEN utilisé !

Ce document détaille toutes les utilisations de Bootstrap 5.3.2 dans le projet SAE303.

---

## 📦 Inclusion de Bootstrap

```html
<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap 5 JS Bundle (avec Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 🎯 Composants Bootstrap Utilisés

### 1. **Grid System** (Layout Responsive)

#### Container
```html
<div class="container">
  <!-- Contenu centré avec max-width responsive -->
</div>
```
**Utilisé dans** : Toutes les sections (hero, contexte, experience, etc.)

#### Rows & Columns
```html
<div class="row">
  <div class="col-lg-6 col-md-12">...</div>
  <div class="col-lg-6 col-md-12">...</div>
</div>
```
**Utilisé dans** :
- Section Expérience (méthodologie + paramètres)
- Section Résultats (filtres + graphiques)
- Section Conclusions (cards)
- Section Équipe (team cards)

#### Gutters (Spacing)
```html
<div class="row g-4">  <!-- gap de 1.5rem -->
<div class="row g-2">  <!-- gap de 0.5rem -->
```
**Utilisé dans** : Grilles de paramètres, team cards

---

### 2. **Navbar** (Navigation Responsive)

```html
<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
  <div class="container">
    <a class="navbar-brand">...</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link">...</a></li>
      </ul>
    </div>
  </div>
</nav>
```

**Classes Bootstrap utilisées** :
- `navbar`, `navbar-expand-lg`, `navbar-light`
- `bg-white`, `sticky-top`, `shadow-sm`
- `navbar-brand`, `navbar-toggler`, `navbar-toggler-icon`
- `collapse`, `navbar-collapse`
- `navbar-nav`, `nav-item`, `nav-link`
- `ms-auto` (margin-start auto pour aligner à droite)

---

### 3. **Accordion** (Section Contexte)

```html
<div class="accordion" id="accordionContexte">
  <div class="accordion-item">
    <h3 class="accordion-header">
      <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapse1">
        Titre
      </button>
    </h3>
    <div id="collapse1" class="accordion-collapse collapse show" data-bs-parent="#accordionContexte">
      <div class="accordion-body">
        Contenu...
      </div>
    </div>
  </div>
</div>
```

**Classes Bootstrap utilisées** :
- `accordion`, `accordion-item`
- `accordion-header`, `accordion-button`
- `accordion-collapse`, `collapse`, `show`
- `accordion-body`

**Fonctionnalité** : Collapse/expand automatique avec JavaScript Bootstrap

---

### 4. **Cards**

```html
<div class="card">
  <div class="card-body">
    <h4 class="card-title">Titre</h4>
    <p>Contenu...</p>
  </div>
</div>
```

**Classes Bootstrap utilisées** :
- `card`, `card-body`, `card-title`

**Utilisé dans** :
- Section Contexte (DT vs TSA)
- Section Expérience (paramètres mesurés)
- Section Conclusions (observations, implications)

---

### 5. **Utilities Classes**

#### Spacing
```html
<h2 class="mb-5">  <!-- margin-bottom: 3rem -->
<div class="mt-4"> <!-- margin-top: 1.5rem -->
<div class="mb-3"> <!-- margin-bottom: 1rem -->
```

**Utilisé partout** : Tous les titres et sections

#### Text Alignment
```html
<h2 class="text-center">  <!-- text-align: center -->
<p class="text-muted">     <!-- color: #6c757d -->
```

#### Display & Alignment
```html
<div class="row align-items-center">  <!-- vertical center -->
<div class="row justify-content-center"> <!-- horizontal center -->
```

---

### 6. **Form Controls**

```html
<select class="form-select" id="parameterSelect">
  <option value="tf">Temps de Fixation (TF)</option>
  ...
</select>
```

**Classes Bootstrap utilisées** :
- `form-select`

**Utilisé dans** : Filtre de sélection des paramètres

---

### 7. **Responsive Columns**

```html
<!-- Desktop: 4 colonnes, Tablet: 2 colonnes, Mobile: 1 colonne -->
<div class="col-lg-3 col-md-6 col-12">...</div>

<!-- Desktop: 2 colonnes, Tablet: 1 colonne -->
<div class="col-lg-6 col-md-12">...</div>

<!-- Desktop: 3 colonnes égales -->
<div class="col-lg-4">...</div>
```

**Breakpoints Bootstrap** :
- `col-lg-*` : ≥ 992px (desktop)
- `col-md-*` : ≥ 768px (tablet)
- `col-*` : < 768px (mobile)

---

## 📊 Tableau Récapitulatif

| Composant | Classe Bootstrap | Localisation |
|-----------|------------------|--------------|
| **Container** | `container` | Toutes les sections |
| **Grid** | `row`, `col-*` | Partout |
| **Navbar** | `navbar`, `navbar-expand-lg` | Header |
| **Accordion** | `accordion`, `accordion-item` | Section Contexte |
| **Cards** | `card`, `card-body` | Contexte, Expérience, Conclusions |
| **Form** | `form-select` | Filtres |
| **Spacing** | `mb-*`, `mt-*`, `g-*` | Partout |
| **Text** | `text-center`, `text-muted` | Titres, paragraphes |
| **Alignment** | `align-items-center`, `justify-content-center` | Grids |
| **Display** | `d-*` | Responsive visibility |

---

## 🎨 Personnalisation Bootstrap

Nous avons **conservé** Bootstrap pour :
- ✅ Structure et layout (grid, container)
- ✅ Composants interactifs (navbar, accordion)
- ✅ Utilities (spacing, text)

Nous avons **personnalisé** avec CSS custom :
- 🎨 Couleurs (palette TSA-friendly)
- 🎨 Typographie (Inter)
- 🎨 Effets visuels (glassmorphism, shadows)
- 🎨 Animations (gradient, hover)

---

## ✅ Preuve d'Utilisation

### Dans le HTML (index.html)

**Ligne 19-20** : Inclusion Bootstrap CSS
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
```

**Ligne 38-56** : Navbar Bootstrap
```html
<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
```

**Ligne 67-109** : Accordion Bootstrap
```html
<div class="accordion" id="accordionContexte">
```

**Ligne 501** : Bootstrap JS
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 🚀 Avantages de Bootstrap dans ce Projet

1. **Responsive Design** : Grid system adaptatif automatique
2. **Composants Prêts** : Navbar, accordion fonctionnels sans JS custom
3. **Utilities** : Spacing, alignment rapides
4. **Cross-browser** : Compatibilité assurée
5. **Maintenance** : Code standardisé et documenté
6. **Accessibilité** : ARIA attributes inclus

---

## 📝 Conclusion

**Bootstrap 5 est BIEN utilisé** dans ce projet, de manière :
- ✅ **Structurée** : Grid system pour layout
- ✅ **Fonctionnelle** : Navbar et accordion interactifs
- ✅ **Optimisée** : Utilities pour spacing et alignment
- ✅ **Responsive** : Breakpoints pour mobile/tablet/desktop
- ✅ **Personnalisée** : CSS custom pour l'identité visuelle

Le projet combine **Bootstrap pour la structure** et **CSS custom pour l'esthétique**, créant un équilibre parfait entre efficacité et originalité.

---

*Document créé pour SAE303 - Eye-Tracking & Autisme*
