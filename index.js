const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const fibonacci = (n) => {
  if (n < 0) return 0;
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
};

let myPokemons = [];

app.get("/catch", (req, res) => {
  const success = Math.random() < 0.5;
  res.json({ success });
});

app.get("/my-pokemons", (req, res) => {
  res.json(myPokemons);
});

app.post("/add-pokemon", (req, res) => {
  const { pokemon } = req.body;
  if (!pokemon || typeof pokemon !== "object") {
    return res.status(400).json({ error: "Invalid Pokémon data" });
  }
  myPokemons.push(pokemon);
  res.status(201).json(pokemon);
});

app.post("/release", (req, res) => {
  const { id } = req.body;
  if (typeof id !== "number" || isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID provided" });
  }

  const num = Math.floor(Math.random() * 1000);
  if (isPrime(num)) {
    myPokemons = myPokemons.filter((pokemon) => pokemon.id !== id);
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/rename", (req, res) => {
  const { id, newName } = req.body;
  if (typeof id !== "number" || isNaN(id) || typeof newName !== "string") {
    return res.status(400).json({ error: "Invalid data provided" });
  }

  const fibIndex = myPokemons.findIndex((pokemon) => pokemon.id === id);
  if (fibIndex === -1) {
    return res.status(404).json({ error: "Pokémon not found" });
  }

  const count = myPokemons[fibIndex].renameCount || 0;
  const fib = fibonacci(count);
  myPokemons[fibIndex].renameCount = count + 1;
  myPokemons[fibIndex].name = `${newName}-${fib}`;

  res.json({ newName: myPokemons[fibIndex].name });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
