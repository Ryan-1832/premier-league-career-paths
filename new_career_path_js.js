let allFootballers = [];
let currentFootballer = {};
let selectedTeam = '';

function setTeam(team) {
    selectedTeam = team;
    showRandomFootballer();
}

function setRoundOver() {
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('btn-reveal').disabled = true;
}

function resetButtons() {
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('btn-reveal').disabled = false;
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-result').innerText = '';
}

async function fetchAllPlayers() {
    try {
        let continueToken = null;
        const categoryMembers = [];
        do {
            const url = new URL('https://en.wikipedia.org/w/api.php');
            url.search = new URLSearchParams({
                action: 'query',
                list: 'categorymembers',
                cmtitle: 'Category:Premier_League_players',
                cmlimit: '500',
                format: 'json',
                origin: '*',
                cmcontinue: continueToken || ''
            });
            const response = await fetch(url);
            const data = await response.json();
            categoryMembers.push(...data.query.categorymembers);
            continueToken = data.continue ? data.continue.cmcontinue : null;
        } while (continueToken);
        return categoryMembers;
    } catch (error) {
        console.error('Error fetching footballers:', error);
        return [];
    }
}

async function fetchInfoboxHTML(footballerName) {
    try {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(footballerName)}&format=json&origin=*`);
        const data = await response.json();
        if (data.error) return null;
        return data.parse.text['*'];
    } catch (error) {
        console.error('Error fetching infobox:', error);
        return null;
    }
}

function extractInfoboxHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const infobox = doc.querySelector('.infobox.vcard');
    if (infobox) {
        const nameRow = infobox.querySelector('caption');
        if (nameRow) nameRow.classList.add('hidden');
        hideElementsExceptSeniorAndInternationalCareer(infobox);
        infobox.querySelectorAll('a').forEach(a => a.replaceWith(a.textContent));
        return infobox.outerHTML;
    }
    return null;
}

function hideElementsExceptSeniorAndInternationalCareer(infobox) {
    const rows = infobox.querySelectorAll('tr');
    let showContent = false;
    rows.forEach(row => {
        const header = row.querySelector('th');
        if (header) {
            const text = header.textContent.trim();
            if (text.includes('Senior career') || text.includes('International career')) {
                showContent = true;
            } else if (text.includes('Personal information') || text.includes('Managerial career') || text.includes('Medal record')) {
                showContent = false;
            }
        }
        row.classList.toggle('hidden', !showContent);
    });
}

function matchesTeam(html) {
    if (!selectedTeam) return true;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const infobox = doc.querySelector('.infobox.vcard');
    if (!infobox) return false;
    let inSeniorCareer = false;
    const rows = infobox.querySelectorAll('tr');
    for (const row of rows) {
        const header = row.querySelector('th');
        if (header) {
            const text = header.textContent.trim();
            if (text.includes('Senior career')) inSeniorCareer = true;
            if (text.includes('International career') || text.includes('Managerial career')) inSeniorCareer = false;
        }
        if (inSeniorCareer && row.textContent.includes(selectedTeam)) return true;
    }
    return false;
}

async function showRandomFootballer() {
    resetButtons();
    document.getElementById('wiki-infobox').innerHTML = 'Loading...';

    if (allFootballers.length === 0) {
        allFootballers = await fetchAllPlayers();
        populateFootballerList();
    }

    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
        attempts++;
        const randomPlayer = allFootballers[Math.floor(Math.random() * allFootballers.length)];
        const html = await fetchInfoboxHTML(randomPlayer.title);
        if (!html) continue;
        if (!matchesTeam(html)) continue;
        const extracted = extractInfoboxHTML(html);
        if (!extracted) continue;

        currentFootballer = {
            name: randomPlayer.title,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(randomPlayer.title)}`
        };

        document.getElementById('wiki-infobox').innerHTML = extracted;
        return;
    }

    document.getElementById('wiki-infobox').innerHTML = 'No player found for this team. Please try another.';
}

function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function mapSpecialCharacters(text) {
    const charMap = {
        'ø': 'o', 'å': 'a', 'ä': 'a', 'ö': 'o', 'ü': 'u',
        'é': 'e', 'è': 'e', 'ê': 'e', 'á': 'a', 'í': 'i',
        'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ç': 'c'
    };
    return text.split('').map(char => charMap[char] || char).join('');
}

function checkGuess() {
    const guess = document.getElementById('guess-input').value.trim();
    if (normalizeText(mapSpecialCharacters(guess)) === normalizeText(mapSpecialCharacters(currentFootballer.name))) {
        document.getElementById('guess-result').innerText = 'Correct!';
        setRoundOver();
    } else {
        document.getElementById('guess-result').innerText = 'Incorrect, try again.';
    }
}

function revealAnswer() {
    document.getElementById('guess-result').innerText = `The correct answer is ${currentFootballer.name}.`;
    setRoundOver();
}

function populateFootballerList() {
    const dataList = document.getElementById('footballer-list');
    dataList.innerHTML = '';
    allFootballers.forEach(player => {
        const option = document.createElement('option');
        option.value = mapSpecialCharacters(normalizeText(player.title));
        dataList.appendChild(option);
    });
}

function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Check out this page!',
            url: window.location.href
        }).catch(error => console.error('Error sharing:', error));
    } else {
        const shareText = `Check out this page: ${window.location.href}`;
        window.location.href = `mailto:?subject=Check%20out%20this%20page&body=${encodeURIComponent(shareText)}`;
    }
}

window.onload = showRandomFootballer;