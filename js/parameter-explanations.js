


const parameterDefinitions = {
    ttt: {
        name: "Temps Total Tracké",
        abbr: "TTT",
        icon: "assets/icons/ttt.svg",
        description: "Le Temps Total Tracké représente la durée totale pendant laquelle le regard de l'enfant a été enregistré par le système d'eye-tracking durant toute l'expérience.",
        explanation: "Ce paramètre mesure le temps global d'engagement visuel de l'enfant avec les stimuli présentés. Un TTT plus élevé indique que l'enfant a maintenu son attention sur l'écran pendant une plus longue période.",
        example: "Si l'expérience dure 60 secondes et que le TTT est de 45 secondes, cela signifie que le regard a été capté pendant 75% du temps total."
    },
    tp: {
        name: "Temps Passé",
        abbr: "TP",
        icon: "assets/icons/tp.svg",
        description: "Le Temps Passé mesure la durée totale pendant laquelle le regard s'est posé sur une zone d'intérêt spécifique (écran, tête, yeux, ou bouche).",
        explanation: "Ce paramètre permet d'identifier quelles zones du visage attirent le plus l'attention. Les différences de TP entre les groupes DT et TSA peuvent révéler des patterns d'exploration visuelle distincts.",
        example: "Si le TP sur la zone des yeux est de 8 secondes, cela signifie que l'enfant a regardé cette zone pendant 8 secondes au total durant l'observation du visage."
    },
    tf: {
        name: "Temps de Fixation",
        abbr: "TF",
        icon: "assets/icons/tf.svg",
        description: "Le Temps de Fixation correspond à la durée cumulée pendant laquelle le regard reste stable sur une zone d'intérêt, sans mouvement significatif.",
        explanation: "Les fixations indiquent un traitement actif de l'information visuelle. Un TF plus long suggère une analyse plus approfondie de la zone observée. Ce paramètre est crucial pour comprendre comment l'information est traitée.",
        example: "Un TF de 5 secondes sur la bouche signifie que l'enfant a fixé cette zone pendant 5 secondes au total, réparties en plusieurs fixations."
    },
    nbf: {
        name: "Nombre de Fixations",
        abbr: "NBF",
        icon: "assets/icons/nbf.svg",
        description: "Le Nombre de Fixations compte combien de fois le regard s'est stabilisé sur une zone d'intérêt donnée.",
        explanation: "Un NBF élevé peut indiquer soit un grand intérêt pour la zone, soit une difficulté à extraire l'information. Combiné avec le TF, il permet de comprendre la stratégie d'exploration visuelle.",
        example: "Si NBF = 12 pour les yeux, cela signifie que l'enfant a fixé cette zone 12 fois différentes pendant l'observation."
    },
    nbe: {
        name: "Nombre d'Entrées",
        abbr: "NBE",
        icon: "assets/icons/nbz.svg",
        description: "Le Nombre d'Entrées compte combien de fois le regard est entré dans une zone d'intérêt, quelle que soit la durée.",
        explanation: "Ce paramètre mesure la fréquence des visites dans une zone. Un NBE élevé suggère que l'enfant revient souvent à cette zone, ce qui peut indiquer son importance dans le traitement de l'information sociale.",
        example: "Un NBE de 8 pour la zone de la tête signifie que le regard est entré 8 fois dans cette zone durant l'observation."
    },
    latence: {
        name: "Latence",
        abbr: "Lat",
        icon: "assets/icons/latence.svg",
        description: "La Latence mesure le temps écoulé entre le début de la présentation du stimulus et la première fixation sur une zone d'intérêt.",
        explanation: "Une latence courte indique que la zone attire rapidement l'attention. Les différences de latence entre groupes peuvent révéler des priorités attentionnelles différentes dans le traitement des visages.",
        example: "Une latence de 0.5 seconde pour les yeux signifie que l'enfant a regardé cette zone pour la première fois 0.5 seconde après l'apparition du visage."
    }
};


function createParameterModal() {
    const modal = document.createElement('div');
    modal.className = 'parameter-modal';
    modal.id = 'parameterModal';
    modal.innerHTML = `
    <div class="parameter-modal-content">
      <button class="parameter-modal-close" onclick="closeParameterModal()">&times;</button>
      <div class="parameter-modal-header">
        <div class="parameter-modal-icon">
          <img src="" alt="" id="modalIcon">
        </div>
        <div class="parameter-modal-title">
          <h3 id="modalTitle"></h3>
          <div class="parameter-abbr" id="modalAbbr"></div>
        </div>
      </div>
      <div class="parameter-modal-body">
        <p id="modalDescription"></p>
        <p id="modalExplanation"></p>
        <div class="parameter-example">
          <div class="parameter-example-title">Exemple</div>
          <p id="modalExample" style="margin: 0;"></p>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
}


function showParameterExplanation(paramKey) {
    const param = parameterDefinitions[paramKey];
    if (!param) return;

    const modal = document.getElementById('parameterModal');
    if (!modal) {
        createParameterModal();
    }

    
    document.getElementById('modalIcon').src = param.icon;
    document.getElementById('modalIcon').alt = param.abbr;
    document.getElementById('modalTitle').textContent = param.name;
    document.getElementById('modalAbbr').textContent = `(${param.abbr})`;
    document.getElementById('modalDescription').textContent = param.description;
    document.getElementById('modalExplanation').textContent = param.explanation;
    document.getElementById('modalExample').textContent = param.example;

    
    document.getElementById('parameterModal').classList.add('active');
}


function closeParameterModal() {
    const modal = document.getElementById('parameterModal');
    if (modal) {
        modal.classList.remove('active');
    }
}


document.addEventListener('click', (e) => {
    const modal = document.getElementById('parameterModal');
    if (modal && e.target === modal) {
        closeParameterModal();
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeParameterModal();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    
    createParameterModal();

    
    const parameterCards = document.querySelectorAll('.parameter-card');
    parameterCards.forEach(card => {
        
        const nameElement = card.querySelector('.parameter-name');
        if (!nameElement) return;

        const name = nameElement.textContent.trim().toLowerCase();
        let paramKey = null;

        if (name.includes('temps total tracké') || name.includes('ttt')) {
            paramKey = 'ttt';
        } else if (name.includes('temps passé') || name.includes('tp')) {
            paramKey = 'tp';
        } else if (name.includes('temps de fixation') || name.includes('tf')) {
            paramKey = 'tf';
        } else if (name.includes('nombre de fixations') || name.includes('nbf')) {
            paramKey = 'nbf';
        } else if (name.includes('nombre d\'entrées') || name.includes('nbe')) {
            paramKey = 'nbe';
        } else if (name.includes('latence') || name.includes('lat')) {
            paramKey = 'latence';
        }

        if (paramKey) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => showParameterExplanation(paramKey));

            
            card.setAttribute('title', 'Cliquez pour en savoir plus');
        }
    });
});
