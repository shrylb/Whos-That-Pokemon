const canvas = document.getElementById('poke-canvas');
const ctx = canvas.getContext('2d');
const wordDiv = document.getElementById('word');
const lettersDiv = document.getElementById('letters');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const hintDiv = document.getElementById('hint');

const MAX_WRONG = 6;
let pokemon = {};
let displayWord = [];
let guessed = [];
let wrongGuesses = 0;

async function fetchPokemon() {
  let id = Math.floor(Math.random() * 1010) + 1;
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  let data = await res.json();
  let name = data.name.replace(/[^a-z]/gi, '').toUpperCase();
  let sprite = data.sprites.front_default || data.sprites.other['official-artwork'].front_default;
  if (!sprite) return fetchPokemon();

  // Fetch flavor text (hint) from species endpoint
  let speciesRes = await fetch(data.species.url);
  let speciesData = await speciesRes.json();
  // Find an English flavor text entry
  let flavorText = "";
  if (speciesData.flavor_text_entries) {
    let entry = speciesData.flavor_text_entries.find(e => e.language.name === "en");
    if (entry) flavorText = entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
  }

  return {
    name,
    sprite,
    id,
    type: data.types.map(t => t.type.name).join(', '),
    flavorText
  };
}

function drawPixelSprite(url) {
  const img = new window.Image();
  img.onload = function () {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, 192, 192);
  };
  img.crossOrigin = "anonymous";
  img.src = url;
}

function setupWord(name) {
  displayWord = name.split('').map(c => (c === '-' ? '-' : '_'));
  guessed = [];
  wrongGuesses = 0;
  updateWordDisplay();
  updateLetters();
  statusDiv.textContent = `Guesses left: ${MAX_WRONG - wrongGuesses}`;
}

function updateWordDisplay() {
  wordDiv.textContent = displayWord.join(' ');
}

function updateLetters() {
  lettersDiv.innerHTML = '';
  for (let i = 65; i <= 90; i++) {
    let letter = String.fromCharCode(i);
    let btn = document.createElement('button');
    btn.textContent = letter;
    btn.className = 'letter-btn';
    btn.disabled = guessed.includes(letter) || displayWord.join('') === pokemon.name;
    btn.onclick = () => handleGuess(letter);
    lettersDiv.appendChild(btn);
  }
}

function handleGuess(letter) {
  if (guessed.includes(letter)) return;
  guessed.push(letter);
  if (pokemon.name.includes(letter)) {
    for (let i = 0; i < pokemon.name.length; i++) {
      if (pokemon.name[i] === letter) displayWord[i] = letter;
    }
  } else {
    wrongGuesses++;
  }
  updateWordDisplay();
  updateLetters();
  checkGameStatus();
}

function checkGameStatus() {
  if (displayWord.join('') === pokemon.name) {
    statusDiv.textContent = "You win! It's " + pokemon.name + "!";
    lettersDiv.querySelectorAll('button').forEach(btn => btn.disabled = true);
  } else if (wrongGuesses >= MAX_WRONG) {
    statusDiv.textContent = `Game over! The answer was ${pokemon.name}.`;
    for (let i = 0; i < pokemon.name.length; i++) displayWord[i] = pokemon.name[i];
    updateWordDisplay();
    lettersDiv.querySelectorAll('button').forEach(btn => btn.disabled = true);
  } else {
    statusDiv.textContent = `Guesses left: ${MAX_WRONG - wrongGuesses}`;
  }
}


async function startGame() {
  statusDiv.textContent = 'Loading Pokémon...';
  wordDiv.textContent = '';
  hintDiv.textContent = '';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pokemon = await fetchPokemon();
  drawPixelSprite(pokemon.sprite);
  setupWord(pokemon.name);

  // Show type and flavor text as hints
  hintDiv.innerHTML = `
    <div><strong>Type:</strong> ${pokemon.type}</div>
    <div style="margin-top:8px;"><strong>Hint:</strong> ${pokemon.flavorText || 'No hint available.'}</div>
  `;
}

restartBtn.onclick = startGame;
startGame();