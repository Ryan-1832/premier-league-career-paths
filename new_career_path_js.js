// ─── STATE ───────────────────────────────────────────────────────────────────
let allFootballers   = [];
let currentMode      = 'home';
let fpSelectedTeam   = '';
let fpCurrentPlayer  = {};
let fpRoundOver      = false;

let dailyPlayer      = {};
let dailyGuessNum    = 0;
let dailyRoundOver   = false;
let dailyHintsLeft   = 3;

let chCurrentPlayer  = {};
let chLives          = 3;
let chStreak         = 0;
let chGuessNum       = 1;
let chRoundOver      = false;
let chHintsLeft      = 3;

// ─── CURATED PLAYERS: verified 100+ Premier League appearances ────────────────
// Sources: myfootballfacts.com, wikipedia.org — appearances count verified
const CURATED_PLAYERS = [
  // 500+ PL appearances
  "James Milner","Gareth Barry","Ryan Giggs","Frank Lampard","David James",
  "Gary Speed","Emile Heskey","Mark Schwarzer","Jamie Carragher","Phil Neville",
  "Rio Ferdinand","Steven Gerrard","Sol Campbell","Paul Scholes","Jermain Defoe",
  "John Terry","Wayne Rooney","Ashley Young","Michael Carrick","Sylvain Distin",
  "Peter Crouch","Jordan Henderson","Aaron Hughes","Shay Given","Brad Friedel",
  "Kyle Walker","John O'Shea","Kevin Davies","Petr Čech","Alan Shearer",
  "Jussi Jääskeläinen","Richard Dunne","Gareth Southgate","James Ward-Prowse",
  "Leighton Baines","Teddy Sheringham","Danny Murphy","Aaron Lennon","David de Gea",
  "Andy Cole","Mark Noble","Robbie Keane","Gary Neville","Tim Howard",
  // 300-499 PL appearances
  "Paul Robinson","Robbie Fowler","Wilfried Zaha","Phil Jagielka","Rob Lee",
  "Jamie Redknapp","Michael Owen","Joe Hart","Harry Kane","Scott Parker",
  "Leon Osman","Tony Adams","Nicky Butt","David Seaman","Gary Pallister",
  "Les Ferdinand","Peter Schmeichel","Hugo Lloris","Darren Anderton","Roy Keane",
  "Nicolas Anelka","Lee Dixon","Nigel Winterburn","Martin Keown","Craig Bellamy",
  "Dietmar Hamann","Kieron Dyer","Jermaine Jenas","Gary Cahill","Ray Parlour",
  "Paul Merson","Matthew Le Tissier","Dwight Yorke","Denis Irwin","Glen Johnson",
  "Ledley King","Vincent Kompany","Sergio Agüero","Jan Vertonghen","Luke Young",
  "Nolberto Solano","David Batty","Lee Bowyer","Alan Smith","Kevin Nolan",
  "Michael Dawson","Ugo Ehiogu","Joleon Lescott","David Silva","César Azpilicueta",
  "Son Heung-min","Theo Walcott","Patrice Evra","Scott Dann","Eric Dier",
  // 200-299 PL appearances
  "Thierry Henry","Dennis Bergkamp","Bacary Sagna","Mousa Dembélé","Stephen Carr",
  "Andros Townsend","Aaron Cresswell","Jamie Vardy","Dimitar Berbatov","Willian",
  "Yaya Touré","Pablo Zabaleta","Mikael Silvestre","Gianfranco Zola","Wes Brown",
  "Ole Gunnar Solskjær","Christian Eriksen","Fernandinho","Aaron Ramsey",
  "Roberto Firmino","Freddie Ljungberg","James McArthur","Chris Brunt",
  "Brian McClair","Ian Wright","Kolo Touré","William Gallas","Damien Duff",
  "Warren Barton","Shaun Wright-Phillips","Didier Drogba","Mohamed Salah",
  "Ross Barkley","Danny Welbeck","Cesc Fàbregas","Nemanja Vidić","Paul Ince",
  "Thomas Sørensen","Niall Quinn","Duncan Ferguson","Romelu Lukaku","James Beattie",
  "Andy Johnson","Kevin Phillips","Marouane Fellaini","John Stones","Robert Huth",
  "Ben Foster","Scott Carson","Laurent Koscielny","Robin van Persie","Gael Clichy",
  "Michael Essien","Joe Cole","Branislav Ivanović","Eden Hazard","Dele Alli",
  "Toby Alderweireld","Mark Viduka","Ian Harte","Fabricio Coloccini","Kevin De Bruyne",
  "Raheem Sterling","Bernardo Silva","Trent Alexander-Arnold","Andrew Robertson",
  "Virgil van Dijk","Martin Škrtel","Steed Malbranque","Mikel Arteta","Fabian Delph",
  "Callum Wilson","Stuart Pearce","Peter Beardsley","Yakubu Aiyegbeni","Cristiano Ronaldo",
  "Roberto Di Matteo","Wayne Bridge","Shola Ameobi","Michael Brown","Danny Simpson",
  // 100-199 PL appearances
  "Robert Pires","Nacho Monreal","Per Mertesacker","Mesut Özil",
  "Alexis Sánchez","Jack Wilshere","Santi Cazorla","Olivier Giroud","Emmanuel Adebayor",
  "Samir Nasri","Claude Makélélé","Arjen Robben","N'Golo Kanté","Marcos Alonso",
  "David Luiz","John Mikel Obi","Nemanja Matić","Victor Moses","Pedro",
  "Kurt Zouma","Thibaut Courtois","Danny Rose","Kieran Trippier","Victor Wanyama",
  "Gareth Bale","Luka Modrić","Edin Džeko","Ilkay Gündogan","Riyad Mahrez",
  "Gabriel Jesus","Aymeric Laporte","Fernando Torres","Xabi Alonso","Pepe Reina",
  "Daniel Agger","José Enrique","Luis Suárez","Philippe Coutinho","Sadio Mané",
  "Fabinho","Georginio Wijnaldum","Wayne Hennessey","Chris Kirkland","Cheikh Tioté",
  "Yohan Cabaye","Jonas Gutierrez","Moussa Sissoko","Charles N'Zogbia","Steven Taylor",
  "Hatem Ben Arfa","Mike Williamson","James Perch","Tim Krul","Papiss Cissé",
  "Demba Ba","Loic Remy","Joseph Yobo","Ji-sung Park","Kevin Mirallas",
  "Steven Pienaar","Darren Fletcher","Patrick Bamford","Matt Ritchie","Brede Hangeland",
  "Clint Dempsey","Louis Saha","Zoltán Gera","Simon Davies","Cheikhou Kouyaté",
  "Winston Reid","Andy Carroll","Luka Milivojević","Marcel Desailly","Gustavo Poyet",
  "Jimmy Floyd Hasselbaink","Eidur Gudjohnsen","Eric Cantona","Mark Hughes",
  "Ruud van Nistelrooy","Gavin McCann","Julio Arca","David Ginola",
  "Tony Hibbert","Alan Stubbs","Warren Barton","Sami Hyypiä","Tim Cahill",
  "Nicky Shorey","Danny Mills","Dominic Matteo","Stephane Henchoz","Ben Davies",
  "Abel Xavier","Bolo Zenden","Salif Diao","Bernard Mendy","Emerson Thome",
  "Peter Beardsley","Dean Whitehead","Matthew Etherington","Karl Darlow"
];

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function startMode(mode) {
  currentMode = mode;
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('gameover-screen').classList.remove('active');
  ['freeplay','daily','challenge'].forEach(m => {
    document.getElementById(m + '-screen').classList.toggle('active', m === mode);
  });
  document.body.className = 'mode-' + mode;
  if (mode === 'freeplay')  fpInit();
  if (mode === 'daily')     dailyInit();
  if (mode === 'challenge') chInit();
}

function goHome() {
  currentMode = 'home';
  document.body.className = 'mode-home';
  document.getElementById('home-screen').style.display = 'flex';
  document.getElementById('gameover-screen').classList.remove('active');
  ['freeplay','daily','challenge'].forEach(m =>
    document.getElementById(m + '-screen').classList.remove('active')
  );
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function mapSpecialCharacters(text) {
  const m = {'ø':'o','å':'a','ä':'a','ö':'o','ü':'u','é':'e','è':'e','ê':'e',
              'á':'a','í':'i','ó':'o','ú':'u','ñ':'n','ç':'c'};
  return text.split('').map(c => m[c] || c).join('');
}

function normalize(text) {
  return normalizeText(mapSpecialCharacters(text.trim()));
}

function getInitials(name) {
  // Strip disambiguation suffixes like "(footballer)", "(soccer)", "(born 1980)" etc.
  const cleaned = name.replace(/\s*\(.*?\)/g, '').trim();
  return cleaned.split(' ').map(w => w[0].toUpperCase() + '.').join(' ');
}

async function fetchAllPlayers() {
  try {
    let continueToken = null;
    const members = [];
    do {
      const url = new URL('https://en.wikipedia.org/w/api.php');
      url.search = new URLSearchParams({
        action: 'query', list: 'categorymembers',
        cmtitle: 'Category:Premier_League_players',
        cmlimit: '500', format: 'json', origin: '*',
        cmcontinue: continueToken || ''
      });
      const res  = await fetch(url);
      const data = await res.json();
      members.push(...data.query.categorymembers);
      continueToken = data.continue?.cmcontinue ?? null;
    } while (continueToken);
    return members;
  } catch(e) {
    console.error('fetchAllPlayers:', e);
    return [];
  }
}

async function fetchInfoboxHTML(name) {
  try {
    const res  = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(name)}&format=json&origin=*`);
    const data = await res.json();
    if (data.error) return null;
    return data.parse.text['*'];
  } catch(e) {
    return null;
  }
}

function extractInfoboxHTML(html) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(html, 'text/html');
  const box    = doc.querySelector('.infobox.vcard');
  if (!box) return null;
  const cap = box.querySelector('caption');
  if (cap) cap.classList.add('hidden');
  hideCareerRows(box);
  box.querySelectorAll('a').forEach(a => a.replaceWith(a.textContent));
  return box.outerHTML;
}

function hideCareerRows(infobox) {
  let show = false;
  infobox.querySelectorAll('tr').forEach(row => {
    const th = row.querySelector('th');
    if (th) {
      const t = th.textContent.trim();
      if (t.includes('Senior career') || t.includes('International career')) show = true;
      if (t.includes('Personal information') || t.includes('Managerial career') || t.includes('Medal record')) show = false;
    }
    row.classList.toggle('hidden', !show);
  });
}

function matchesTeam(html, team) {
  if (!team) return true;
  const parser = new DOMParser();
  const doc    = parser.parseFromString(html, 'text/html');
  const box    = doc.querySelector('.infobox.vcard');
  if (!box) return false;
  let inSenior = false;
  for (const row of box.querySelectorAll('tr')) {
    const th = row.querySelector('th');
    if (th) {
      const t = th.textContent.trim();
      if (t.includes('Senior career'))   inSenior = true;
      if (t.includes('International career') || t.includes('Managerial career')) inSenior = false;
    }
    if (inSenior && row.textContent.includes(team)) return true;
  }
  return false;
}

function populateDatalist(listId, players) {
  const dl = document.getElementById(listId);
  dl.innerHTML = '';
  players.forEach(p => {
    const opt = document.createElement('option');
    opt.value = mapSpecialCharacters(normalizeText(p.title || p.name || p));
    dl.appendChild(opt);
  });
}

// ─── FREE PLAY ────────────────────────────────────────────────────────────────
async function fpInit() {
  if (allFootballers.length === 0) {
    document.getElementById('fp-infobox').innerHTML = 'Loading player list...';
    allFootballers = await fetchAllPlayers();
    populateDatalist('fp-footballer-list', allFootballers);
  }
  fpNext();
}

function fpSetTeam(team) {
  fpSelectedTeam = team;
  fpNext();
}

async function fpNext() {
  fpRoundOver = false;
  document.getElementById('fp-btn-submit').disabled = false;
  document.getElementById('fp-btn-reveal').disabled = false;
  document.getElementById('fp-guess-input').value   = '';
  document.getElementById('fp-result').innerText    = '';
  document.getElementById('fp-infobox').innerHTML   = 'Loading...';

  let attempts = 0;
  while (attempts++ < 60) {
    const p    = allFootballers[Math.floor(Math.random() * allFootballers.length)];
    const html = await fetchInfoboxHTML(p.title);
    if (!html) continue;
    if (!matchesTeam(html, fpSelectedTeam)) continue;
    const extracted = extractInfoboxHTML(html);
    if (!extracted) continue;
    fpCurrentPlayer = { name: p.title };
    document.getElementById('fp-infobox').innerHTML = extracted;
    return;
  }
  document.getElementById('fp-infobox').innerHTML = 'No player found for this team. Try another.';
}

function fpCheckGuess() {
  if (fpRoundOver) return;
  const guess = document.getElementById('fp-guess-input').value;
  if (normalize(guess) === normalize(fpCurrentPlayer.name)) {
    document.getElementById('fp-result').innerText = '✅ Correct!';
    fpRoundOver = true;
    document.getElementById('fp-btn-submit').disabled = true;
    document.getElementById('fp-btn-reveal').disabled = true;
  } else {
    document.getElementById('fp-result').innerText = '❌ Incorrect, try again.';
  }
}

function fpReveal() {
  document.getElementById('fp-result').innerText = `The answer was: ${fpCurrentPlayer.name}`;
  fpRoundOver = true;
  document.getElementById('fp-btn-submit').disabled = true;
  document.getElementById('fp-btn-reveal').disabled = true;
}

// ─── DAILY CHALLENGE ──────────────────────────────────────────────────────────
function getDailyPlayer() {
  const start = new Date('2024-01-01');
  const today = new Date();
  const days  = Math.floor((today - start) / 86400000);
  return CURATED_PLAYERS[days % CURATED_PLAYERS.length];
}

function getDailyDateStr() {
  return new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric' });
}

function getDailyStorageKey() {
  return 'daily_' + new Date().toISOString().slice(0, 10);
}

async function dailyInit() {
  document.getElementById('daily-date').innerText = getDailyDateStr();


  const saved = localStorage.getItem(getDailyStorageKey());
  if (saved) {
    const state = JSON.parse(saved);
    dailyRoundOver = true;
    document.getElementById('daily-btn-submit').disabled = true;
    document.getElementById('daily-btn-reveal').disabled = true;
    document.getElementById('daily-btn-share').style.display = 'block';
    document.getElementById('daily-result').innerText = state.won
      ? `✅ You already got today's player: ${state.name}`
      : `You already played today. The answer was: ${state.name}`;
    renderDailyDots(state.guesses);
  }

  const name = getDailyPlayer();
  dailyPlayer    = { name };
  dailyGuessNum  = saved ? JSON.parse(saved).guesses.length : 0;
  dailyHintsLeft = 3;
  document.getElementById('daily-hints-left').innerText = 3;
  document.getElementById('daily-hint-text').innerText  = '';

  const html = await fetchInfoboxHTML(name);
  document.getElementById('daily-infobox').innerHTML = html ? extractInfoboxHTML(html) : 'Could not load player.';

  if (allFootballers.length === 0) allFootballers = await fetchAllPlayers();
  populateDatalist('daily-footballer-list', allFootballers);
  if (!saved) renderDailyDots([]);
}

function renderDailyDots(guesses) {
  const container = document.getElementById('daily-guess-dots');
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'guess-dot';
    if (i < guesses.length) {
      dot.classList.add(guesses[i] ? 'correct' : 'wrong');
      dot.innerText = guesses[i] ? '✓' : '✗';
    } else if (i === guesses.length) {
      dot.classList.add('current');
      dot.innerText = i + 1;
    } else {
      dot.innerText = i + 1;
    }
    container.appendChild(dot);
  }
}

function dailyUseHint() {
  if (dailyHintsLeft <= 0 || dailyRoundOver) return;
  dailyHintsLeft--;
  document.getElementById('daily-hints-left').innerText = dailyHintsLeft;
  document.getElementById('daily-hint-text').innerText  = getInitials(dailyPlayer.name);
  if (dailyHintsLeft === 0) document.getElementById('daily-hint-btn').disabled = true;
}

function dailyCheckGuess() {
  if (dailyRoundOver) return;
  const guess   = document.getElementById('daily-guess-input').value;
  const correct = normalize(guess) === normalize(dailyPlayer.name);
  const saved   = JSON.parse(localStorage.getItem(getDailyStorageKey()) || '{"guesses":[]}');
  saved.guesses.push(correct);

  if (correct) {
    saved.won  = true;
    saved.name = dailyPlayer.name;
    localStorage.setItem(getDailyStorageKey(), JSON.stringify(saved));
    document.getElementById('daily-result').innerText = `✅ Correct! ${dailyPlayer.name}`;
    dailyRoundOver = true;
    document.getElementById('daily-btn-submit').disabled = true;
    document.getElementById('daily-btn-reveal').disabled = true;
    document.getElementById('daily-btn-share').style.display = 'block';
    renderDailyDots(saved.guesses);
  } else {
    dailyGuessNum = saved.guesses.length;
    renderDailyDots(saved.guesses);
    document.getElementById('daily-guess-input').value = '';
    if (saved.guesses.length >= 3) {
      saved.won  = false;
      saved.name = dailyPlayer.name;
      localStorage.setItem(getDailyStorageKey(), JSON.stringify(saved));
      document.getElementById('daily-result').innerText = `The answer was: ${dailyPlayer.name}`;
      dailyRoundOver = true;
      document.getElementById('daily-btn-submit').disabled = true;
      document.getElementById('daily-btn-reveal').disabled = true;
      document.getElementById('daily-btn-share').style.display = 'block';
    } else {
      document.getElementById('daily-result').innerText = '❌ Incorrect, try again.';
      localStorage.setItem(getDailyStorageKey(), JSON.stringify(saved));
    }
  }
}

function dailyReveal() {
  const saved = JSON.parse(localStorage.getItem(getDailyStorageKey()) || '{"guesses":[]}');
  saved.won  = false;
  saved.name = dailyPlayer.name;
  localStorage.setItem(getDailyStorageKey(), JSON.stringify(saved));
  document.getElementById('daily-result').innerText = `The answer was: ${dailyPlayer.name}`;
  dailyRoundOver = true;
  document.getElementById('daily-btn-submit').disabled = true;
  document.getElementById('daily-btn-reveal').disabled = true;
  document.getElementById('daily-btn-share').style.display = 'block';
  renderDailyDots(saved.guesses);
}

function dailyShare() {
  const saved    = JSON.parse(localStorage.getItem(getDailyStorageKey()) || '{"guesses":[]}');
  const dots     = (saved.guesses || []).map(g => g ? '🟩' : '🟥').join('');
  const attempts = saved.won ? `${saved.guesses.length}/3` : 'X/3';
  const text = `⚽ PL Career Paths - Daily Challenge ${getDailyDateStr()}\nI guessed the Premier League career path in ${attempts}\n${dots}\nCan you beat me? https://ryan-1832.github.io/premier-league-career-paths`;
  shareText(text);
}

// ─── CHALLENGE MODE ───────────────────────────────────────────────────────────
let chPlayerQueue = [];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function chInit() {
  chLives    = 3;
  chStreak   = 0;
  chGuessNum = 1;
  chRoundOver  = false;
  chHintsLeft  = 3;
  chPlayerQueue = shuffleArray(CURATED_PLAYERS);
  updateChHUD();
  document.getElementById('ch-hint-text').innerText   = 'Use a hint to reveal initials';
  document.getElementById('ch-hints-left').innerText  = 3;
  document.getElementById('ch-hint-btn').disabled     = false;
  document.getElementById('ch-result').innerText      = '';
  document.getElementById('ch-btn-submit').disabled   = false;
  document.getElementById('ch-btn-reveal').disabled   = false;

  // Populate datalist directly from curated list — no Wikipedia fetch needed
  populateDatalist('ch-footballer-list', CURATED_PLAYERS.map(name => ({ name })));

  await chLoadPlayer();
}

async function chLoadPlayer() {
  chGuessNum  = 1;
  chRoundOver = false;
  chHintsLeft = 3;
  document.getElementById('ch-hint-text').innerText  = 'Use a hint to reveal initials';
  document.getElementById('ch-hints-left').innerText = 3;
  document.getElementById('ch-hint-btn').disabled    = false;
  document.getElementById('ch-guess-input').value    = '';
  document.getElementById('ch-result').innerText     = '';
  document.getElementById('ch-btn-submit').disabled  = false;
  document.getElementById('ch-btn-reveal').disabled  = false;
  updateChHUD();
  document.getElementById('ch-infobox').innerHTML = 'Loading...';

  // Work through shuffled queue so every player appears before any repeats
  while (chPlayerQueue.length > 0) {
    const name = chPlayerQueue.shift();
    const html = await fetchInfoboxHTML(name);
    if (!html) continue;
    const extracted = extractInfoboxHTML(html);
    if (!extracted) continue;
    chCurrentPlayer = { name };
    document.getElementById('ch-infobox').innerHTML = extracted;
    if (chPlayerQueue.length === 0) chPlayerQueue = shuffleArray(CURATED_PLAYERS);
    return;
  }
  document.getElementById('ch-infobox').innerHTML = 'Could not load player, skipping...';
  setTimeout(chLoadPlayer, 1500);
}

function updateChHUD() {
  document.getElementById('ch-lives').innerText     = '❤️'.repeat(chLives) + '🖤'.repeat(3 - chLives);
  document.getElementById('ch-streak').innerText    = chStreak;
  document.getElementById('ch-guess-num').innerText = chGuessNum;
}

function chUseHint() {
  if (chHintsLeft <= 0 || chRoundOver) return;
  chHintsLeft--;
  document.getElementById('ch-hints-left').innerText = chHintsLeft;
  document.getElementById('ch-hint-text').innerText  = `Initials: ${getInitials(chCurrentPlayer.name)}`;
  if (chHintsLeft === 0) document.getElementById('ch-hint-btn').disabled = true;
}

function chCheckGuess() {
  if (chRoundOver) return;
  const guess   = document.getElementById('ch-guess-input').value;
  const correct = normalize(guess) === normalize(chCurrentPlayer.name);

  if (correct) {
    chStreak++;
    chRoundOver = true;
    document.getElementById('ch-result').innerText    = `✅ Correct! ${chCurrentPlayer.name}`;
    document.getElementById('ch-btn-submit').disabled  = true;
    document.getElementById('ch-btn-reveal').disabled  = true;
    updateChHUD();
    setTimeout(chLoadPlayer, 1800);
  } else {
    chGuessNum++;
    document.getElementById('ch-guess-input').value = '';
    updateChHUD();
    if (chGuessNum > 3) {
      chLoseLife(`Out of guesses! The answer was: ${chCurrentPlayer.name}`);
    } else {
      document.getElementById('ch-result').innerText = `❌ Incorrect. ${4 - chGuessNum} guess${4 - chGuessNum === 1 ? '' : 'es'} left.`;
    }
  }
}

function chReveal() {
  chLoseLife(`The answer was: ${chCurrentPlayer.name}`);
}

function chLoseLife(msg) {
  chLives--;
  chStreak    = 0;
  chRoundOver = true;
  document.getElementById('ch-result').innerText    = msg;
  document.getElementById('ch-btn-submit').disabled  = true;
  document.getElementById('ch-btn-reveal').disabled  = true;
  updateChHUD();
  if (chLives <= 0) {
    setTimeout(chGameOver, 1600);
  } else {
    setTimeout(chLoadPlayer, 2000);
  }
}

function chGameOver() {
  document.getElementById('challenge-screen').classList.remove('active');
  const go = document.getElementById('gameover-screen');
  go.classList.add('active');
  document.getElementById('gameover-score').innerText = chStreak;
  document.getElementById('gameover-msg').innerText   =
    chStreak === 0 ? 'Better luck next time!' :
    chStreak < 5   ? 'Not bad — keep practising!' :
    chStreak < 10  ? 'Great run! 🔥' : 'Legendary! 🏆';
}

function chRestart() {
  document.getElementById('gameover-screen').classList.remove('active');
  startMode('challenge');
}

function chShare() {
  const text = `⚽ PL Career Paths - Challenge Mode\n🔥 I got ${chStreak} consecutive correct guesses!\nCan you beat me? https://ryan-1832.github.io/premier-league-career-paths`;
  shareText(text);
}

// ─── SHARE ────────────────────────────────────────────────────────────────────
function shareText(text) {
  if (navigator.share) {
    navigator.share({ title: 'PL Career Paths', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => alert('Result copied to clipboard!'));
  }
}

function sharePage() {
  shareText('Check out PL Career Paths! https://ryan-1832.github.io/premier-league-career-paths');
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────
window.onload = () => {
  document.getElementById('home-screen').style.display = 'flex';
};
