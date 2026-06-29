import inception from "@/assets/movies/inception.jpg";
import interstellar from "@/assets/movies/interstellar.jpg";
import dune from "@/assets/movies/dune.jpg";
import avengers from "@/assets/movies/avengers.jpg";
import johnwick from "@/assets/movies/johnwick.jpg";
import spiderman from "@/assets/movies/spiderman.jpg";

import fifa from "@/assets/games/fifa.jpg";
import cod from "@/assets/games/cod.jpg";
import gta from "@/assets/games/gta.jpg";
import valorant from "@/assets/games/valorant.jpg";
import tekken from "@/assets/games/tekken.jpg";
import minecraft from "@/assets/games/minecraft.jpg";
import pubg from "@/assets/games/pubg.jpg";
import nfs from "@/assets/games/nfs.jpg";

export const MOVIES = [
  { id: "inception", title: "Inception", img: inception, duration: "2h 28m", price: 180 },
  { id: "interstellar", title: "Interstellar", img: interstellar, duration: "2h 49m", price: 200 },
  { id: "dune", title: "Dune: Part Two", img: dune, duration: "2h 46m", price: 220 },
  { id: "avengers", title: "Avengers: Endgame", img: avengers, duration: "3h 01m", price: 200 },
  { id: "johnwick", title: "John Wick 4", img: johnwick, duration: "2h 49m", price: 180 },
  { id: "spiderman", title: "Spider-Verse", img: spiderman, duration: "2h 20m", price: 180 },
];

export const GAMES = [
  { id: "fifa", title: "FIFA 25", img: fifa, console: "PS5" },
  { id: "cod", title: "Call of Duty MW3", img: cod, console: "PS5" },
  { id: "gta", title: "GTA V", img: gta, console: "PS5" },
  { id: "valorant", title: "Valorant", img: valorant, console: "PC" },
  { id: "tekken", title: "Tekken 8", img: tekken, console: "PS5" },
  { id: "minecraft", title: "Minecraft", img: minecraft, console: "PC" },
  { id: "pubg", title: "PUBG", img: pubg, console: "PC" },
  { id: "nfs", title: "Need for Speed", img: nfs, console: "PS5" },
];

export const FOOD = [
  { name: "Loaded Nachos", price: 180 },
  { name: "Truffle Popcorn", price: 220 },
  { name: "Neon Burger Combo", price: 260 },
  { name: "Cold Brew", price: 140 },
  { name: "Wood-fired Pizza", price: 320 },
  { name: "Mocktail Tower", price: 180 },
];

export const SHOWTIMES = ["12:30 PM", "3:00 PM", "6:15 PM", "9:30 PM"];
export const GAMING_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
export const GAMING_DURATIONS = [
  { label: "1 Hour", value: "1h", price: 60 },
  { label: "2 Hours", value: "2h", price: 100 },
  { label: "3 Hours", value: "3h", price: 140 },
  { label: "4 Hours", value: "4h", price: 180 },
];
