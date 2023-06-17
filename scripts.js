function createPokemonElement(pokemon) {
    const pokemonElement = document.createElement('div');
    pokemonElement.classList.add('pokemon');

    // Add the image element first
    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemon['Image link'];
    pokemonImage.style.width = '150px';
    pokemonImage.style.height = '150px';
    pokemonElement.appendChild(pokemonImage);

    // Create a new div to hold the name and other details
    const pokemonDetails = document.createElement('div');
    
    const pokemonName = document.createElement('h2');
    pokemonName.textContent = `#${pokemon['Pokédex number']} ${pokemon['Name']}`;
    pokemonDetails.appendChild(pokemonName);

    const typeContainer = document.createElement('div');
    typeContainer.classList.add('type-container');

    const type1 = document.createElement('span');
    type1.textContent = pokemon['Type 1'];
    type1.classList.add('type', `type-${pokemon['Type 1'].toLowerCase()}`);
    typeContainer.appendChild(type1);

    if (pokemon['Type 2']) {
        const type2 = document.createElement('span');
        type2.textContent = pokemon['Type 2'];
        type2.classList.add('type', `type-${pokemon['Type 2'].toLowerCase()}`);
        typeContainer.appendChild(type2);
    }

    pokemonDetails.appendChild(typeContainer);

    const abilities = document.createElement('p');
    abilities.textContent = `Abilities: ${pokemon['Ability 1']}${pokemon['Ability 2'] ? ', ' + pokemon['Ability 2'] : ''}`;
    pokemonDetails.appendChild(abilities);

    const statsTable = document.createElement('table');
    const statsHeader = document.createElement('tr');
    const statsHeaderLabels = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
    statsHeaderLabels.forEach(label => {
        const headerCell = document.createElement('th');
        headerCell.textContent = label;
        statsHeader.appendChild(headerCell);
    });
    statsTable.appendChild(statsHeader);

    const statsRow = document.createElement('tr');
    const statsValues = [pokemon['HP'], pokemon['Atk'], pokemon['Def'], pokemon['SpA'], pokemon['SpD'], pokemon['Spe']];
    statsValues.forEach(value => {
        const statCell = document.createElement('td');
        statCell.textContent = value;
        statsRow.appendChild(statCell);
    });
    statsTable.appendChild(statsRow);
    pokemonDetails.appendChild(statsTable);

    const overallRating = document.createElement('p');
    const formattedBSR = getFormattedBSR(pokemon['Overall Rating']);
    overallRating.innerHTML = `BSR: <span style="color: ${formattedBSR.color}">${formattedBSR.icon} ${formattedBSR.description} (${formattedBSR.value})</span>`;
    pokemonDetails.appendChild(overallRating);

    // Append the pokemonDetails div to the main pokemonElement
    pokemonElement.appendChild(pokemonDetails);

    pokemonElement.setAttribute('onclick', `redirectToDetails(${pokemon['Pokédex number']})`);

    return pokemonElement;
}


function redirectToDetails(pokedexNumber) {
    window.location.href = `pokemon-details.html?pokedexNumber=${pokedexNumber.toString()}`;
}

let pokemonArray = [];

function populatePokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokedexNumber = urlParams.get('pokedexNumber');
    const pokemon = getPokedexJsonData().find(pokemon => pokemon['Pokédex number'] === parseInt(pokedexNumber, 10));
    const type1Effectiveness = getTypeEffectiveness(pokemon['Type 1']);
    const type2Effectiveness = getTypeEffectiveness(pokemon['Type 2'] || '');
    const ability1Name = getPokemonAbility(pokemon['Ability 1']);
    const ability2Name = getPokemonAbility(pokemon['Ability 2'] || '');
    const maxStat = 200;

    if (pokemon) {
        document.getElementById('pokemon-name').textContent = pokemon['Name'];
        document.getElementById('pokemon-image').src = pokemon['Image link'];
        document.getElementById('type1').textContent = pokemon['Type 1'];
        document.getElementById('type1').classList.add(`type-${pokemon['Type 1'].toLowerCase()}`);
        
        document.getElementById('type1').setAttribute('data-effectiveness', JSON.stringify({ type1: type1Effectiveness, type2: type2Effectiveness }));
        //document.getElementById('type1').addEventListener('mouseover', showTooltip);
        //document.getElementById('type1').addEventListener('mouseout', hideTooltip);

        if (pokemon['Type 2']) {
            document.getElementById('type2').textContent = pokemon['Type 2'];
            document.getElementById('type2').classList.add(`type-${pokemon['Type 2'].toLowerCase()}`);
            document.getElementById('type2').setAttribute('data-effectiveness', JSON.stringify({ type1: type1Effectiveness, type2: type2Effectiveness }));
            //document.getElementById('type2').addEventListener('mouseover', showTooltip);
            //document.getElementById('type2').addEventListener('mouseout', hideTooltip);
        } else {
            document.getElementById('type2').style.display = 'none';
        }
        document.getElementById('type-container').setAttribute('data-effectiveness', JSON.stringify({ type1: type1Effectiveness, type2: type2Effectiveness }));
        document.getElementById('type-container').addEventListener('mouseover', showTooltip);
        document.getElementById('type-container').addEventListener('mouseout', hideTooltip);
        document.getElementById('abilities').innerHTML = `Abilities: <span class="ability" id="ability 1">${pokemon['Ability 1']}</span>${pokemon['Ability 2'] ? ', <span class="ability" id="ability 2">' + pokemon['Ability 2'] + '</span>' : ''}`;
        document.getElementById('ability 1').addEventListener('mouseover', showAbilityTooltip);
        document.getElementById('abilities').setAttribute('data-ability', JSON.stringify({ ability1: ability1Name, ability2: ability2Name }));
        document.getElementById('ability 1').setAttribute('data-ability', JSON.stringify({ ability1: ability1Name}));
        if (pokemon['Ability 2']){
            document.getElementById('ability 2').addEventListener('mouseover', showAbilityTooltip);
            document.getElementById('ability 2').setAttribute('data-ability', JSON.stringify({ ability2: ability2Name }));
        } 
        if (pokemon['Hidden Ability']) {
            document.getElementById('abilities').textContent += `, (Hidden) ${pokemon['Hidden Ability']}`;
        }

        
        document.getElementById('hp').textContent = pokemon['HP'];
        document.getElementById('atk').textContent = pokemon['Atk'];
        document.getElementById('def').textContent = pokemon['Def'];
        document.getElementById('spa').textContent = pokemon['SpA'];
        document.getElementById('spd').textContent = pokemon['SpD'];
        document.getElementById('spe').textContent = pokemon['Spe'];
    
        document.getElementById('hp-bar').style.width = (pokemon['HP'] / maxStat) * 100 + '%';
        document.getElementById('atk-bar').style.width = (pokemon['Atk'] / maxStat) * 100 + '%';
        document.getElementById('def-bar').style.width = (pokemon['Def'] / maxStat) * 100 + '%';
        document.getElementById('spa-bar').style.width = (pokemon['SpA'] / maxStat) * 100 + '%';
        document.getElementById('spd-bar').style.width = (pokemon['SpD'] / maxStat) * 100 + '%';
        document.getElementById('spe-bar').style.width = (pokemon['Spe'] / maxStat) * 100 + '%';
    
        document.getElementById('hp-bar').setAttribute('aria-valuenow', pokemon['HP']);
        document.getElementById('atk-bar').setAttribute('aria-valuenow', pokemon['Atk']);
        document.getElementById('def-bar').setAttribute('aria-valuenow',pokemon['Def']);
        document.getElementById('spa-bar').setAttribute('aria-valuenow',pokemon['SpA']);
        document.getElementById('spd-bar').setAttribute('aria-valuenow',pokemon['SpD']);
        document.getElementById('spe-bar').setAttribute('aria-valuenow',pokemon['Spe']);


        document.getElementById('hp-bar').className = getStatClass(pokemon['HP']);
        document.getElementById('atk-bar').className = getStatClass(pokemon['Atk']);
        document.getElementById('def-bar').className = getStatClass(pokemon['Def']);
        document.getElementById('spa-bar').className = getStatClass(pokemon['SpA']);
        document.getElementById('spd-bar').className = getStatClass(pokemon['SpD']);
        document.getElementById('spe-bar').className = getStatClass(pokemon['Spe']);
    

        document.getElementById('back-btn').addEventListener('click', () => {
            window.history.back();
        });


    }
}

        

function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const worksheet = workbook.Sheets["Pokedex"];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            localStorage.setItem('Pokedex', JSON.stringify(jsonData));
            resolve(jsonData);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsBinaryString(file);
    });
}

function getPokedexJsonData() {
    const jsonData = localStorage.getItem('Pokedex');
    return jsonData ? JSON.parse(jsonData) : null;
}


async function fetchPokemonData() {
    const response = await fetch('Pokémon TerraWave-CelestialStorm.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const dataFile = new File([arrayBuffer], 'Pokémon TerraWave-CelestialStorm.xlsx');
    const jsonData = await readExcelFile(dataFile);
    pokemonArray = jsonData ;
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        displayPokemonData();
        sortByPokedexNumber();
    } else if (window.location.pathname.endsWith('table.html')) {
        displayPokemonDataInTable();
        sortByPokedexNumber();
    } else if (window.location.pathname.endsWith('pokemon-details.html')) {
        populatePokemonDetails();
        
    } else {
        console.error('Unable to determine the current page. Please check the URL.');
    }
    
}

function displayPokemonDataInTable() {
    pokemonArray = getPokedexJsonData();
    const pokemonTableBody = document.querySelector('#pokemon-table tbody');
    pokemonData.forEach(pokemon => {
        const pokemonTableRow = createPokemonTableRow(pokemon);
        pokemonTableBody.appendChild(pokemonTableRow);
    });
}




function displayPokemonData() {
    pokemonArray = getPokedexJsonData();
    const pokemonList = document.getElementById('pokemon-list');
    pokemonArray.forEach(pokemon => {
        const pokemonElement = createPokemonElement(pokemon);
        pokemonList.appendChild(pokemonElement);
    });
}


const sortingOrders = {
    'Pokédex number': 'asc',
    'Name': 'asc',
    'Type 1': 'asc',
    'Type 2': 'asc',
    'HP': 'asc',
    'Atk': 'asc',
    'Def': 'asc',
    'SpA': 'asc',
    'SpD': 'asc',
    'Spe': 'asc',
    'Overall Rating': 'asc'
};


function sortPokemonArray(pokemonArray, sortBy, order = 'asc') {
    return pokemonArray.sort((a, b) => {
        let comparison = 0;
        if (!isNaN(a[sortBy]) && !isNaN(b[sortBy])) {
            comparison = parseInt(a[sortBy], 10) - parseInt(b[sortBy], 10);
        } else {
            comparison = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;
        }
        return order === 'asc' ? comparison : -comparison;
    });
}

function updateDisplayedPokemon(sortedArray) {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '';

    sortedArray.forEach(pokemon => {
        const pokemonElement = createPokemonElement(pokemon);
        pokemonList.appendChild(pokemonElement);
    });
}


function sortByPokedexNumber() {
    const sortBy = 'Pokédex number';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortByName() {
    const sortBy = 'Name';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortByType1() {
    const sortBy = 'Type 1';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortByType2() {
    const sortBy = 'Type 2';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortByHP() {
    const sortBy = 'HP';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}
function sortByAtk() {
    const sortBy = 'Atk';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortByDef() {
    const sortBy = 'Def';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortBySpA() {
    const sortBy = 'SpA';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortBySpD() {
    const sortBy = 'SpD';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortBySpe() {
    const sortBy = 'Spe';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function sortByBSR() {
    const sortBy = 'Overall Rating';
    const sortedArray = sortPokemonArray(pokemonArray, sortBy, sortingOrders[sortBy]);
    sortingOrders[sortBy] = sortingOrders[sortBy] === 'asc' ? 'desc' : 'asc';
    updateDisplayedPokemon(sortedArray);
}

function getFormattedBSR(bsr) {
    const roundedBSR = Math.floor(bsr);
    let color = '';
    let icon = '';
    let description = '';

    if (roundedBSR < 50) {
    color = 'red';
    icon = '❌';
    description = 'Horrible';
    } else if (roundedBSR < 100) {
    color = 'orange';
    icon = '⚠️';
    description = 'Bad';
    } else if (roundedBSR < 150) {
    color = 'yellow';
    icon = '😕';
    description = 'Poor';
    } else if (roundedBSR < 200) {
    color = 'green';
    icon = '✅';
    description = 'Below Average';
    } else if (roundedBSR < 250) {
    color = 'darkgreen';
    icon = '🌟';
    description = 'Above Average';
    } else if (roundedBSR < 300) {
    color = 'lightblue';
    icon = '🔽';
    description = 'Good';
    } else if (roundedBSR < 350) {
    color = 'blue';
    icon = '🔼';
    description = 'Very Good';
    } else if (roundedBSR < 400) {
    color = 'purple';
    icon = '💫';
    description = 'Excellent';
    } else if (roundedBSR < 450) {
    color = 'magenta';
    icon = '🌠';
    description = 'Fantastic';
    } else {
    color = 'pink';
    icon = '🤩';
    description = 'Amazing';
    }

    return { color, icon, description, value: roundedBSR };
}

function createPokemonTableRow(pokemon) {
    const pokemonRow = document.createElement('tr');

    const fields = [
        'Pokédex number',
        'Name',
        'Type 1',
        'Type 2',
        'HP',
        'Atk',
        'Def',
        'SpA',
        'SpD',
        'Spe',
        'Overall Rating'
    ];

    fields.forEach(field => {
        const cell = document.createElement('td');
        if (field === 'Overall Rating') {
            const formattedBSR = getFormattedBSR(pokemon[field]);
            cell.innerHTML = `<span style="color: ${formattedBSR.color}">${formattedBSR.icon} ${formattedBSR.description} (${formattedBSR.value})</span>`;
        } else {
            cell.textContent = pokemon[field];
        }
        pokemonRow.appendChild(cell);
    });

    return pokemonRow;
}

function displayCondensedPokemonData(pokemonData) {
    pokemonArray = pokemonData;

    const pokemonTable = document.createElement('table');
    pokemonTable.classList.add('table', 'table-condensed', 'table-hover');
    const pokemonTableHead = document.createElement('thead');
    const pokemonTableHeadRow = document.createElement('tr');

    const headers = [
        'Pokédex number',
        'Name',
        'Type 1',
        'Type 2',
        'HP',
        'Atk',
        'Def',
        'SpA',
        'SpD',
        'Spe',
        'BSR'
    ];

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        pokemonTableHeadRow.appendChild(th);
    });

    pokemonTableHead.appendChild(pokemonTableHeadRow);
    pokemonTable.appendChild(pokemonTableHead);

    const pokemonTableBody = document.createElement('tbody');
    pokemonData.forEach(pokemon => {
        const pokemonRow = createPokemonTableRow(pokemon);
        pokemonTableBody.appendChild(pokemonRow);
    });

    pokemonTable.appendChild(pokemonTableBody);

    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.appendChild(pokemonTable);
}

const typeEffectiveness = {
    normal: {
        fighting: 2,
        ghost: 0,
    },
    fighting: {
        flying: 2,
        psychic: 2,
        bug: 0.5,
        rock: 0.5,
        dark: 0.5,
    },
    flying: {
        electric: 2,
        rock: 2,
        bug: 0.5,
        fighting: 0.5,
        grass: 0.5,
        ground: 0,
    },
    poison: {
        ground: 2,
        psychic: 2,
        fighting: 0.5,
        poison: 0.5,
        bug: 0.5,
        grass: 0.5,
        fairy: 0.5,
    },
    ground: {
        water: 2,
        ice: 2,
        grass: 2,
        poison: 0.5,
        rock: 0.5,
        electric: 0,
    },
    rock: {
        fighting: 2,
        ground: 2,
        steel: 2,
        water: 2,
        grass: 2,
        normal: 0.5,
        flying: 0.5,
        poison: 0.5,
        fire: 0.5,
    },
    bug: {
        flying: 2,
        rock: 2,
        fire: 2,
        fighting: 0.5,
        ground: 0.5,
        grass: 0.5,
    },
    ghost: {
        ghost: 2,
        dark: 2,
        poison: 0.5,
        bug: 0.5,
        normal: 0,
        fighting: 0,
    },
    steel: {
        fighting: 2,
        ground: 2,
        fire: 2,
        normal: 0.5,
        flying: 0.5,
        rock: 0.5,
        bug: 0.5,
        steel: 0.5,
        grass: 0.5,
        psychic: 0.5,
        ice: 0.5,
        dragon: 0.5,
        fairy: 0.5,
        poison: 0,
    },
    fire: {
        ground: 2,
        rock: 2,
        water: 2,
        bug: 0.5,
        steel: 0.5,
        fire: 0.5,
        grass: 0.5,
        ice: 0.5,
        fairy: 0.5,
    },
    water: {
        electric: 2,
        grass: 2,
        steel: 0.5,
        fire: 0.5,
        water: 0.5,
        ice: 0.5,
    },
    grass: {
        flying: 2,
        poison: 2,
        bug: 2,
        fire: 2,
        ice: 2,
        ground: 0.5,
        water: 0.5,
        grass: 0.5,
        electric: 0.5,
    },
    electric: {
        ground: 2,
        flying: 0.5,
        steel: 0.5,
        electric: 0.5,
    },
    psychic: {
        bug: 2,
        ghost: 2,
        dark: 2,
        fighting: 0.5,
        psychic: 0.5,
    },
    ice: {
        fighting: 2,
        rock: 2,
        steel: 2,
        fire: 2,
        ice: 0.5,
    },
    dragon: {
        ice: 2,
        dragon: 2,
        fairy: 2,
        fire: 0.5,
        water: 0.5,
        grass: 0.5,
        electric: 0.5,
    },
    dark: {
        fighting: 2,
        bug: 2,
        fairy: 2,
        ghost: 0.5,
        dark: 0.5,
        psychic: 0,
    },
    fairy: {
        poison: 2,
        steel: 2,
        fighting: 0.5,
        bug: 0.5,
        dark: 0.5,
        dragon: 0,
    },

};

function getTypeEffectiveness(type) {
    return typeEffectiveness[type.toLowerCase()] || {};
}

function showTooltip(e) {
    const effectivenessData = JSON.parse(e.target.getAttribute('data-effectiveness'));
    const type1Effectiveness = effectivenessData.type1;
    const type2Effectiveness = effectivenessData.type2 || {};

    const combinedEffectiveness = {};
    for (const type in typeEffectiveness) {
        const type1Multiplier = type1Effectiveness[type] != null ? type1Effectiveness[type] : 1;
        const type2Multiplier = type2Effectiveness[type] != null ? type2Effectiveness[type] : 1;
        combinedEffectiveness[type] = type1Multiplier * type2Multiplier;
    }


    const weaknesses = [];
    const doubleWeaknesses = [];
    const resistances = [];
    const doubleResistances = [];
    const immunities = [];

    for (const type in combinedEffectiveness) {
        const multiplier = combinedEffectiveness[type];
        if (multiplier === 0) {
            immunities.push(type);
        } else if (multiplier > 1) {
            if (multiplier >= 4) {
                doubleWeaknesses.push(type);
            } else {
                weaknesses.push(type);
            }
        } else if (multiplier < 1) {
            if (multiplier <= 0.25) {
                doubleResistances.push(type);
            } else {
                resistances.push(type);
            }
        }
    }

    const tooltip = document.getElementById('tooltip');
    //document.getElementById('weaknesses').innerHTML = `Weaknesses: ${weaknesses.join(', ') || 'None'}`;
    //document.getElementById('resistances').innerHTML = `Resistances: ${resistances.join(', ') || 'None'}`;
    //document.getElementById('immunities').innerHTML = `Immunities: ${immunities.join(', ') || 'None'}`;
    
    const tooltipDoubleWeaknesses = document.getElementById('double-weaknesses');
    const tooltipWeaknesses = document.getElementById('weaknesses');
    const tooltipResistances = document.getElementById('resistances');
    const tooltipDoubleResistances = document.getElementById('double-resistances');
    const tooltipImmunities = document.getElementById('immunities');


    if (weaknesses.length > 0) {
        tooltipWeaknesses.textContent = 'Weak to  ' + weaknesses.join(', ');
        tooltipWeaknesses.style.display = 'block';
    } else {
        tooltipWeaknesses.style.display = 'none';
    }

    if (resistances.length > 0) {
        tooltipResistances.style.display = 'block';
    } else {
        tooltipResistances.style.display = 'none';
    }

    if (immunities.length > 0) {
        tooltipImmunities.style.display = 'block';
    } else {
        tooltipImmunities.style.display = 'none';
    }

    if (doubleWeaknesses.length > 0) {
        tooltipDoubleWeaknesses.style.display = 'block';
    } else {
        tooltipDoubleWeaknesses.style.display = 'none';
    }

    if (doubleResistances.length > 0) {
        tooltipDoubleResistances.style.display = 'block';
    } else {
        tooltipDoubleResistances.style.display = 'none';
    }

    const tooltipSections = document.querySelectorAll('.tooltip-section');
    tooltipSections.forEach(section => {
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    });

    // Add titles and type icons to each tooltip section
    const sectionTitles = {
    'double-weaknesses': 'Very weak to',
    'weaknesses': 'Weak to',
    'resistances': 'Resistant to',
    'double-resistances': 'Very resistant to',
    'immunities': 'Immune to',
    };

    for (const sectionId in sectionTitles) {
    const section = document.getElementById(sectionId);
    const title = document.createElement('strong');
    title.textContent = sectionTitles[sectionId] + ': ';
    section.appendChild(title);

    const lineBreak = document.createElement('br');
    section.appendChild(lineBreak);
    const types = {
        'double-weaknesses': doubleWeaknesses,
        'weaknesses': weaknesses,
        'resistances': resistances,
        'double-resistances': doubleResistances,
        'immunities': immunities,
    }[sectionId];

    types.forEach(type => section.appendChild(createTypeIcon(type)));
    }



    tooltip.style.display = 'block';
    const typeRect = e.target.getBoundingClientRect();
    const typeContainerRect = e.target.parentElement.getBoundingClientRect();
    //tooltip.style.left = (typeRect.left - typeContainerRect.left) -100 + 'px';
    //tooltip.style.top = (typeRect.top - typeContainerRect.top + typeRect.height + 5) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}


function toggleNightMode() {
    document.documentElement.classList.toggle('light-mode');
    const nightModeToggleBtn = document.querySelector('.night-mode-toggle');
    const sunIcon = nightModeToggleBtn.querySelector('.fa-sun');
    const moonIcon = nightModeToggleBtn.querySelector('.fa-moon');
    
    document.documentElement.classList.toggle('night-mode');
    if (document.documentElement.classList.contains('night-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline';
    } else {
        sunIcon.style.display = 'inline';
        moonIcon.style.display = 'none';
    }
}

function createTypeIcon(type) {
    const icon = document.createElement('i');
    icon.classList.add('type', `type-${type.toLowerCase()}`);
    icon.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    return icon;
}

function getStatClass(value) {
    if (value <= 49) {
        return "progress-bar red";
    } else if (value <= 74) {
        return "progress-bar orange";
    } else if (value <= 99) {
        return "progress-bar yellow";
    } else if (value <= 119) {
        return "progress-bar olive";
    } else if (value <= 149) {
        return "progress-bar green";
    } else if (value <= 199) {
        return "progress-bar teal";
    } else {
        return "progress-bar blue";
    }
}


//  async function getPokemonAbility(abilityName) {
//      const normalizedAbilityName = normalizeAbilityName(abilityName);
//      try {
//      const response = await fetch(`https://pokeapi.co/api/v2/ability/${normalizedAbilityName}`);
//      
//      if (!response.ok) {
//          throw new Error(`HTTP error! Status: ${response.status}`);
//      }
//      
//      const abilityData = await response.json();
//      return abilityData;
//      } catch (error) {
//      console.warn(`Error fetching ability data: ${error.message}`);
//      const pokedexNumber = parseInt(normalizedAbilityName, 10);
//      const pokemon = pokemonArray.find(pokemon => pokemon['Pokédex number'] === pokedexNumber);
//      
//      if (pokemon) {
//          return {
//          name: normalizedAbilityName,
//          description: pokemon['New Ability Description']
//          };
//      } else {
//          console.error(`Ability not found in local data: ${normalizedAbilityName}`);
//          return null;
//      }
//      }
//  }


function getOffensiveEffectiveness(attackingType) {
    const effectiveness = typeEffectiveness[attackingType.toLowerCase()];
    const offensiveEffectiveness = {};

    for (const defendingType in effectiveness) {
    const multiplier = effectiveness[defendingType];
    offensiveEffectiveness[defendingType] = multiplier;
    }

    return offensiveEffectiveness;
}

function getEffectivenessAgainstDefensiveTypes(attackingType, defensiveType1, defensiveType2) {
    const offensiveEffectiveness = getOffensiveEffectiveness(attackingType);
    const type1Multiplier = offensiveEffectiveness[defensiveType1.toLowerCase()] || 1;
    let type2Multiplier = 1;

    if (defensiveType2) {
    type2Multiplier = offensiveEffectiveness[defensiveType2.toLowerCase()] || 1;
    }

    const combinedEffectiveness = type1Multiplier * type2Multiplier;
    return combinedEffectiveness;
}

function normalizeAbilityName(abilityName) {
    return abilityName.trim().toLowerCase().replace(/\s+/g, '-');
}

async function getPokemonAbility(abilityName) {
    const normalizedAbilityName = normalizeAbilityName(abilityName);
    try {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${normalizedAbilityName}`);
    pokemonArray = getPokedexJsonData()
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const abilityData = await response.json();
    const englishEffectEntry = abilityData.effect_entries.find(
        entry => entry.language.name === "en"
    );

    if (englishEffectEntry) {
        return {
        id: abilityData.id,
        name: abilityData.name,
        short_effect: englishEffectEntry.short_effect,
        effect_entries: englishEffectEntry.effect,
        pokemon: abilityData.pokemon
        };
    } else {
        throw new Error(`No English effect entry found for ability: ${normalizedAbilityName}`);
    }
    } catch (error) {
    console.warn(`Error fetching ability data: ${error.message}`);
    const pokemon = pokemonArray.find(pokemon => normalizeAbilityName(pokemon['Ability 1']) === normalizedAbilityName);
    if (pokemon) {
        return {
        name: normalizedAbilityName,
        short_effect: pokemon['New Ability Description']
        };
    } else {
        console.error(`Ability not found in local data: ${normalizedAbilityName}`);
        return null;
    }
    }
}

async function showAbilityTooltip(event) {
    const abilityData = await getPokemonAbility(event.target.innerText);
    const tooltip = document.getElementById('abilityTooltip');
    const description = document.getElementById('description');
    description.textContent = abilityData.short_effect;
    description.style.display = 'block'

    tooltip.style.display = 'block';
    tooltip.style.width = "250%"
    tooltip.style.whiteSpace="normal";
    //tooltip.class = "tooltip"
    //tooltip.textContent = abilityData.short_effect;
    //tooltip.style.position = 'absolute';
    //tooltip.style.backgroundColor = 'white';
    //tooltip.style.border = '1px solid black';
    //tooltip.style.padding = '4px';
    //tooltip.style.borderRadius = '4px';
    //document.body.appendChild(tooltip);
    //tooltip.style.top = `${event.clientY + 10}px`;
    //tooltip.style.left = `${event.clientX + 10}px`;

    const hideTooltip = () => {
    tooltip.style.display = 'none';
    };

    event.target.addEventListener('mouseout', hideTooltip, { once: true });
}

document.querySelectorAll('.ability').forEach(abilityElement => {
    abilityElement.addEventListener('mouseover', event => {
    const abilityName = event.target.textContent;
    showAbilityTooltip(event, abilityName);
    });
});


async function getTypeRepresentation() {
    const statsBaseUrl = 'https://www.smogon.com/stats/';
    const pokeApiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const typeCount = {};

    try {
        // Get the latest usage file URL
        const statsPage = await fetch(statsBaseUrl).then(res => res.text());
        const latestFileUrl = statsPage.match(/https:\/\/www.smogon.com\/stats\/[\d\-]+\/chaos\/.+\.txt/g)[0];

        // Get the usage list
        const usageList = await fetch(latestFileUrl).then(res => res.text());
        const pokemons = usageList.match(/[A-Za-z0-9]+/g);

        // Get the type of each Pokemon and count the type representation
        for (const pokemon of pokemons) {
            const pokeData = await fetch(pokeApiBaseUrl + pokemon.toLowerCase()).then(res => res.json());
            for (const typeInfo of pokeData.types) {
                const type = typeInfo.type.name;
                if (typeCount[type]) {
                    typeCount[type]++;
                } else {
                    typeCount[type] = 1;
                }
            }
        }
        console.log(typeCount);
    } catch (error) {
        console.error('Error:', error);
    }
}

function filterPokemonArray(query) {
    return pokemonArray.filter(pokemon => pokemon.Name.toLowerCase().includes(query.toLowerCase()));
  }
  
  document.getElementById('search').addEventListener('input', (event) => {
    const query = event.target.value;
    const filteredArray = filterPokemonArray(query);
    updateDisplayedPokemon(filteredArray);
  });
  

getTypeRepresentation();

fetchPokemonData();
