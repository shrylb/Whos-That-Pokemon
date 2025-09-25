# Who's That ??

**Who's That??** is a fun, interactive word-guessing game inspired by the classic Hangman — but with a Pokémon twist! Using the [PokéAPI](https://pokeapi.co/), this game randomly selects a Pokémon, hides its name, and challenges the player to guess it one letter at a time.

Try it here: *(shrylb.github.io/Whos-That-Pokemon/)*

---

## Gameplay

- A random Pokémon is fetched using the PokéAPI.
- The name of the Pokémon is hidden using underscores (e.g., `P_I__CH_`).
- The player guesses letters one at a time.
- Correct letters are revealed in their positions.
- Incorrect guesses reduce the number of allowed tries.
- The game ends when the player:
  - Correctly guesses all the letters (win 🏆)
  - Runs out of guesses (lose 💀)

---

## Tech Stack

| Tech       | Description                          |
|------------|--------------------------------------|
| **HTML**   | Structure of the game interface      |
| **CSS**    | Styling and layout of the UI         |
| **JavaScript** | Game logic, API integration, and interactivity |
| **PokéAPI** | External API for fetching Pokémon data |

---
