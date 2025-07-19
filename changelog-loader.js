// Lista dei changelog disponibili (accessibile globalmente)
window.changelogList = [


// Post Rilasciati
    {
        title: 'Redstonecraft',
        date: '29.10.2021',
        image: 'images/posts/Voidblock/7.0.1.png',
        file: 'prototype/redstonecraft.md',
        tags: ['stable','maintenance'],
        visible: true
    },
    {
        title: 'JE-1.20.6-5.3.X-Skyblock_Classic_Edition:5.3.X_LTS Maintenance Update - LTS',
        date: '29.12.2024',
        image: 'images/posts/Voidblock/LTS_latest.png',
        file: 'Voidblock/LTS_5.3.X/5.3.X_LTS.md',
        tags: ['lts','stable','maintenance'],
        visible: false,
        maintenanceVersions: [
            {
                version: '5.3.2_LTS???',
                date: '',
                file: 'Voidblock/LTS_5.3.X/5.3.2_LTS.md',
                visible: false
            },
            {
                version: '5.3.3_LTS???',
                date: '',
                file: 'Voidblock/LTS_5.3.X/5.3.3_LTS.md',
                visible: false
            }
        ]
    },

// Drafts Template

    {
        title: 'Draft',
        date: '???',
        image: 'images/drafts/draft.png',
        file: 'drafts/draft.md',
        tags: ['drafts'],
        visible: false
    },

// Changelog Template
    {
        file: 'changelog-template.md', // Nome del file markdown
        date: '03.10.2000',         // Formato data
        title: 'Changelog Template', // Titolo visualizzato
        image: 'images/posts/changelog.png',  // URL immagine
        description: 'Template per i changelog', // Aggiunto campo description
        tags: ['lts','stable','maintenance','release-candidate','pre-release','building','website','minecraft-news','changelog-doc','drafts'], // Aggiunti i tag
        visible: true,
        maintenanceVersions: [
            {
                version: 'Test Changelog',
                date: '04.10.2000',
                file: 'drafts/test.md',
                visible: false
            }
        ]
    }
];

// Funzione per caricare la lista dei changelog nella griglia
function loadChangelogList() {
    const changelogGrid = document.getElementById('changelog-grid');
    changelogGrid.innerHTML = ''; // Pulisci la griglia
    
    // Filtra i changelog visibili
    const visibleChangelogs = window.changelogList.filter(changelog => changelog.visible);
    
    // Crea una card per ogni changelog visibile
    visibleChangelogs.forEach(changelog => {
        const card = createChangelogCard(changelog);
        changelogGrid.appendChild(card);
    });

    // Inizializza i filtri tag
    initializeTagFilters();
    
    // Genera il calendario
    generateChangelogCalendar();
}

// Funzione per troncare il testo
function truncateText(text, maxLength = 60) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

// Funzione per creare una singola card del changelog
function createChangelogCard(changelog) {
    const card = document.createElement('a');
    card.href = `view-changelog.html?file=${changelog.file}`; // Link alla pagina del changelog
    card.className = 'changelog-card';
    
    const defaultImage = 'https://placehold.co/600x400/1a1a1a/ffffff/png?text=No+Image';
    
    // Limita i tag mostrati a 3 e aggiungi un indicatore se ce ne sono di più
    const tagsHtml = changelog.tags ? 
        `<div class="changelog-tags">
            ${changelog.tags.slice(0, 3).map(tag => `<span class="tag ${tag}">${tag}</span>`).join('')}
            ${changelog.tags.length > 3 ? `<span class="tag more-tags">+${changelog.tags.length - 3}</span>` : ''}
         </div>` : '';

    // Limita le versioni di manutenzione mostrate a 2 e aggiungi un indicatore se ce ne sono di più
    let maintenanceHtml = '';
    if (changelog.maintenanceVersions && changelog.maintenanceVersions.length > 0) {
        const versionsToShow = changelog.maintenanceVersions.slice(0, 2);
        maintenanceHtml = `
            <div class="maintenance-versions">
                <div class="maintenance-header">Versioni di manutenzione:</div>
                <div class="maintenance-list">
                    ${versionsToShow.map(v => 
                        `<div class="maintenance-item">
                            <span class="version">${v.version}</span>
                            <span class="date">${v.date}</span>
                         </div>`
                    ).join('')}
                    ${changelog.maintenanceVersions.length > 2 ? 
                        `<div class="maintenance-item more-versions">
                            <span>+${changelog.maintenanceVersions.length - 2} altre versioni</span>
                         </div>` : ''}
                </div>
            </div>`;
    }

    card.innerHTML = `
        <div class="changelog-image">
            <img src="${changelog.image || defaultImage}" 
                 alt="${changelog.title}"
                 onerror="this.src='${defaultImage}'">
        </div>
        ${tagsHtml}
        <h3 title="${changelog.title}">${truncateText(changelog.title)}</h3>
        <p class="date">\u{1F4C5} ${changelog.date}</p>
        ${changelog.description ? `<p class="description">${truncateText(changelog.description, 100)}</p>` : ''}
        ${maintenanceHtml}
    `;
    return card;
}

// Funzione per filtrare i changelog per versione
function filterChangelogsByVersion(version) {
    return window.changelogList.filter(changelog => 
        changelog.title.toLowerCase().includes(version.toLowerCase())
    );
}

// Funzione per cercare nei changelog
function searchChangelogs(searchTerm) {
    const activeTag = document.querySelector('.tag-filter.active').dataset.tag;
    let results = window.changelogList.filter(changelog => changelog.visible); // Filtra prima per visibilità
    
    // Applica prima il filtro per tag se non è "all"
    if (activeTag !== 'all') {
        results = results.filter(changelog => 
            changelog.tags && changelog.tags.includes(activeTag)
        );
    }
    
    // Poi applica il filtro di ricerca
    results = results.filter(changelog => 
        changelog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        changelog.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    refreshChangelogGrid(results);
}

// Funzione per aggiornare la griglia dei changelog
function refreshChangelogGrid(changelogs) {
    const grid = document.getElementById('changelog-grid');
    grid.innerHTML = '';
    changelogs.forEach(changelog => {
        const card = createChangelogCard(changelog);
        grid.appendChild(card);
    });
}

// Funzione per copiare il link del changelog
function copyChangelogLink(file) {
    const url = `${window.location.origin}/view-changelog.html?file=${file}`;
    navigator.clipboard.writeText(url)
        .then(() => alert('Link copiato negli appunti!'));
}

// Funzione per filtrare i changelog per tag
function filterChangelogsByTag(tag) {
    const results = window.changelogList
        .filter(changelog => changelog.visible) // Filtra prima per visibilità
        .filter(changelog => 
            changelog.tags && changelog.tags.includes(tag)
        );
    refreshChangelogGrid(results);
}

// Funzione per inizializzare i filtri tag
function initializeTagFilters() {
    const tagFilters = document.querySelectorAll('.tag-filter');
    tagFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Rimuovi la classe active da tutti i filtri
            tagFilters.forEach(f => f.classList.remove('active'));
            // Aggiungi la classe active al filtro cliccato
            filter.classList.add('active');
            
            const tag = filter.dataset.tag;
            if (tag === 'all') {
                refreshChangelogGrid(window.changelogList.filter(changelog => changelog.visible));
            } else {
                filterChangelogsByTag(tag);
            }
        });
    });
}

// Funzione aggiornata per generare il calendario
function generateChangelogCalendar() {
    const calendarContainer = document.querySelector('.changelog-calendar');
    if (!calendarContainer) return;

    const groupedChangelogs = groupChangelogsByYearMonth(window.changelogList);
    calendarContainer.innerHTML = '';

    // Ordina gli anni in ordine decrescente
    const years = Object.keys(groupedChangelogs).sort((a, b) => b - a);

    years.forEach(year => {
        const yearSection = document.createElement('div');
        yearSection.className = 'calendar-year';
        yearSection.innerHTML = `<h3 class="year-title">${year}</h3>`;

        // Ordina i mesi in ordine decrescente
        const months = Object.keys(groupedChangelogs[year]).sort((a, b) => b - a);

        months.forEach(monthIndex => {
            const monthLogs = groupedChangelogs[year][monthIndex];
            const monthSection = document.createElement('div');
            monthSection.className = 'calendar-month';

            // Ordina i changelog per giorno in ordine decrescente
            monthLogs.sort((a, b) => {
                const dayA = parseInt(a.date.split('.')[0]);
                const dayB = parseInt(b.date.split('.')[0]);
                return dayB - dayA;
            });

            monthSection.innerHTML = `
                <h4 class="month-title">${getMonthName(parseInt(monthIndex))}</h4>
                <ul>
                    ${monthLogs.map(log => {
                        const day = log.date.split('.')[0].padStart(2, '0');
                        return `
                            <li>
                                <span class="date">${day}</span>
                                <a href="view-changelog.html?file=${log.file}" 
                                   title="${log.title}">
                                    ${truncateText(log.title, 40)}
                                </a>
                            </li>
                        `;
                    }).join('')}
                </ul>
            `;
            
            yearSection.appendChild(monthSection);
        });
        
        calendarContainer.appendChild(yearSection);
    });
}

// Funzione aggiornata per raggruppare i changelog
function groupChangelogsByYearMonth(changelogs) {
    return changelogs
        .filter(changelog => changelog.visible) // Filtra prima per visibilità
        .reduce((groups, log) => {
        // Parsing della data (formato: "DD.MM.YYYY")
        const [day, month, year] = log.date.split('.');
        
        // Converte mese da numero a indice (sottrae 1 perché i mesi partono da 0)
        const monthIndex = parseInt(month) - 1;
        
        // Crea gli oggetti anno e mese se non esistono
        if (!groups[year]) {
            groups[year] = {};
        }
        if (!groups[year][monthIndex]) {
            groups[year][monthIndex] = [];
        }
        
        // Aggiungi il changelog al gruppo appropriato
        groups[year][monthIndex].push({
            ...log,
            dayNum: parseInt(day)
        });

        // Ordina i changelog del mese per data decrescente
        groups[year][monthIndex].sort((a, b) => b.dayNum - a.dayNum);
        
        return groups;
    }, {});
}

// Funzione di utilità per ottenere il nome del mese
function getMonthName(monthIndex) {
    const months = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile',
        'Maggio', 'Giugno', 'Luglio', 'Agosto',
        'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    return months[monthIndex];
}

// Funzione di utilità per ottenere l'indice del mese
function getMonthIndex(monthName) {
    const months = {
        'Gennaio': 0, 'Febbraio': 1, 'Marzo': 2, 'Aprile': 3,
        'Maggio': 4, 'Giugno': 5, 'Luglio': 6, 'Agosto': 7,
        'Settembre': 8, 'Ottobre': 9, 'Novembre': 10, 'Dicembre': 11
    };
    return months[monthName];
}

// Inizializza il caricamento quando il DOM è pronto
document.addEventListener('DOMContentLoaded', loadChangelogList);