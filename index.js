const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Helper function to check if a number is prime
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Helper function to calculate Fibonacci number
const fibonacci = (n) => {
  if (n < 0) return 0; // Handle invalid input
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
};

// Temporary in-memory storage for caught Pokémon
let myPokemons = [];

// API to return probability of 50% when catching Pokémon
app.get("/catch", (req, res) => {
  const success = Math.random() < 0.5;
  res.json({ success });
});

// API to get all caught Pokémon
app.get("/my-pokemons", (req, res) => {
  res.json(myPokemons);
});

// API to add a Pokémon to the list
app.post("/add-pokemon", (req, res) => {
  const { pokemon } = req.body;
  if (!pokemon || typeof pokemon !== "object") {
    return res.status(400).json({ error: "Invalid Pokémon data" });
  }
  myPokemons.push(pokemon);
  res.status(201).json(pokemon);
});

// API to release Pokémon
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

// API to rename Pokémon
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
