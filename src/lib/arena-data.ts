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

export type Movie = {
  id: string;
  title: string;
  img: string;
  backdrop: string;
  duration: string;
  price: number;
  rating: number;
  category: "Latest" | "Action" | "Anime" | "Comedy" | "Thriller" | "Esports" | "Trending" | "Student Choice" | "Premium";
  language: string;
  year: number;
  seatsLeft: number;
  trailer: string; // youtube id
  section: ("featured" | "now" | "top" | "recommended" | "upcoming")[];
  synopsis: string;
};

export const MOVIES: Movie[] = [
  { id: "inception", title: "Inception", img: inception, backdrop: inception, duration: "2h 28m", price: 180, rating: 8.8, category: "Thriller", language: "English", year: 2010, seatsLeft: 42, trailer: "YoHD9XEInc0", section: ["featured", "top", "recommended"], synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea." },
  { id: "interstellar", title: "Interstellar", img: interstellar, backdrop: interstellar, duration: "2h 49m", price: 200, rating: 8.7, category: "Premium", language: "English", year: 2014, seatsLeft: 36, trailer: "zSWdZVtXT7E", section: ["featured", "top"], synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id: "dune", title: "Dune: Part Two", img: dune, backdrop: dune, duration: "2h 46m", price: 220, rating: 8.6, category: "Latest", language: "English", year: 2024, seatsLeft: 28, trailer: "Way9Dexny3w", section: ["featured", "now", "recommended"], synopsis: "Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family." },
  { id: "avengers", title: "Avengers: Endgame", img: avengers, backdrop: avengers, duration: "3h 01m", price: 200, rating: 8.4, category: "Action", language: "English", year: 2019, seatsLeft: 18, trailer: "TcMBFSGVi1c", section: ["now", "top"], synopsis: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions." },
  { id: "johnwick", title: "John Wick 4", img: johnwick, backdrop: johnwick, duration: "2h 49m", price: 180, rating: 7.7, category: "Action", language: "English", year: 2023, seatsLeft: 44, trailer: "qEVUtrk8_B4", section: ["now", "recommended"], synopsis: "John Wick uncovers a path to defeating The High Table — but must face a new enemy with powerful alliances." },
  { id: "spiderman", title: "Spider-Verse", img: spiderman, backdrop: spiderman, duration: "2h 20m", price: 180, rating: 8.6, category: "Student Choice", language: "English / Hindi", year: 2023, seatsLeft: 31, trailer: "cqGjhVJWtEg", section: ["now", "recommended", "top"], synopsis: "Miles Morales catapults across the multiverse, where he encounters a team of Spider-People." },
  { id: "jujutsu", title: "Jujutsu Kaisen 0", img: spiderman, backdrop: spiderman, duration: "1h 45m", price: 160, rating: 8.0, category: "Anime", language: "Japanese", year: 2022, seatsLeft: 22, trailer: "8UVNT4wvIGY", section: ["upcoming"], synopsis: "Yuta Okkotsu enrolls at the Tokyo Prefectural Jujutsu High School under the tutelage of Satoru Gojo." },
  { id: "barbie", title: "Comedy Night Live", img: spiderman, backdrop: spiderman, duration: "1h 54m", price: 150, rating: 7.2, category: "Comedy", language: "Hindi", year: 2024, seatsLeft: 39, trailer: "pBk4NYhWNMM", section: ["upcoming"], synopsis: "A laugh-out-loud anthology featuring India's top comedians on the big ArenaVerse screen." },
  { id: "esports-final", title: "Valorant World Final", img: valorant, backdrop: valorant, duration: "3h 30m", price: 250, rating: 9.1, category: "Esports", language: "English", year: 2025, seatsLeft: 12, trailer: "e_E9W2vsRbQ", section: ["featured", "upcoming"], synopsis: "Live screening of the Valorant Champions Grand Final in cinematic Dolby Atmos." },
  { id: "trending-thriller", title: "Midnight Protocol", img: cod, backdrop: cod, duration: "2h 12m", price: 190, rating: 8.1, category: "Trending", language: "English", year: 2025, seatsLeft: 47, trailer: "M7lc1UVf-VE", section: ["upcoming", "recommended"], synopsis: "A hacker stumbles upon a conspiracy that puts every connected device on the planet at risk." },
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

export type FoodItem = { name: string; price: number; category: string; emoji: string; tag?: string };

export const FOOD: FoodItem[] = [
  { name: "Truffle Popcorn", price: 220, category: "Popcorn", emoji: "🍿", tag: "Bestseller" },
  { name: "Caramel Popcorn", price: 180, category: "Popcorn", emoji: "🍿" },
  { name: "Cheese Popcorn", price: 200, category: "Popcorn", emoji: "🧀" },
  { name: "Wood-fired Pizza", price: 320, category: "Pizza", emoji: "🍕", tag: "Chef's pick" },
  { name: "Pepperoni Pizza", price: 360, category: "Pizza", emoji: "🍕" },
  { name: "Margherita Slice", price: 160, category: "Pizza", emoji: "🍕" },
  { name: "Neon Burger Combo", price: 260, category: "Burger", emoji: "🍔", tag: "Combo" },
  { name: "Smash Cheese Burger", price: 240, category: "Burger", emoji: "🍔" },
  { name: "Paneer Tikka Burger", price: 220, category: "Burger", emoji: "🍔" },
  { name: "Loaded Fries", price: 180, category: "French Fries", emoji: "🍟" },
  { name: "Peri Peri Fries", price: 160, category: "French Fries", emoji: "🍟" },
  { name: "Chicken Wrap", price: 200, category: "Wraps", emoji: "🌯" },
  { name: "Veg Shawarma Wrap", price: 180, category: "Wraps", emoji: "🌯" },
  { name: "Club Sandwich", price: 190, category: "Sandwiches", emoji: "🥪" },
  { name: "Grilled Sandwich", price: 150, category: "Sandwiches", emoji: "🥪" },
  { name: "Alfredo Pasta", price: 240, category: "Pasta", emoji: "🍝" },
  { name: "Arrabbiata Pasta", price: 220, category: "Pasta", emoji: "🍝" },
  { name: "Cold Coffee", price: 140, category: "Cold Coffee", emoji: "🥤", tag: "Bestseller" },
  { name: "Mocha Frappe", price: 180, category: "Cold Coffee", emoji: "☕" },
  { name: "Mocktail Tower", price: 180, category: "Mocktails", emoji: "🍹" },
  { name: "Blue Lagoon", price: 160, category: "Mocktails", emoji: "🍸" },
  { name: "Coke / Pepsi", price: 80, category: "Soft Drinks", emoji: "🥤" },
  { name: "Sprite", price: 80, category: "Soft Drinks", emoji: "🥤" },
  { name: "Chocolate Milkshake", price: 180, category: "Milkshakes", emoji: "🥛" },
  { name: "Oreo Milkshake", price: 200, category: "Milkshakes", emoji: "🥛" },
  { name: "Choco Lava Brownie", price: 160, category: "Brownies", emoji: "🍫", tag: "Hot" },
  { name: "Vanilla Sundae", price: 140, category: "Ice Cream", emoji: "🍨" },
  { name: "Belgian Chocolate Scoop", price: 180, category: "Ice Cream", emoji: "🍦" },
  { name: "Dark Chocolate Bar", price: 120, category: "Chocolate", emoji: "🍫" },
  { name: "Choco Chip Cookies", price: 120, category: "Cookies", emoji: "🍪" },
  { name: "Loaded Nachos", price: 180, category: "Nachos", emoji: "🌮" },
  { name: "Red Bull", price: 150, category: "Energy Drinks", emoji: "⚡", tag: "Gamer fuel" },
  { name: "Monster", price: 160, category: "Energy Drinks", emoji: "⚡" },
  { name: "Gaming Combo (Burger + Fries + Red Bull)", price: 420, category: "Gaming Combo", emoji: "🎮", tag: "Save ₹80" },
  { name: "Movie Combo (Popcorn + Coke + Nachos)", price: 380, category: "Movie Combo", emoji: "🎬", tag: "Save ₹100" },
  { name: "Family Combo (2 Pizza + 4 Drinks)", price: 780, category: "Family Combo", emoji: "👨‍👩‍👧", tag: "Best value" },
  { name: "Premium Combo (Pizza + Pasta + Mocktail + Brownie)", price: 920, category: "Premium Combo", emoji: "👑", tag: "Luxury" },
];

export const FOOD_CATEGORIES = Array.from(new Set(FOOD.map((f) => f.category)));

export const SHOWTIMES = ["12:30 PM", "3:00 PM", "6:15 PM", "9:30 PM"];
export const GAMING_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
export const GAMING_DURATIONS = [
  { label: "1 Hour", value: "1h", price: 60 },
  { label: "2 Hours", value: "2h", price: 100 },
  { label: "3 Hours", value: "3h", price: 140 },
  { label: "4 Hours", value: "4h", price: 180 },
];

export type Tournament = {
  id: string;
  title: string;
  game: string;
  banner: string;
  date: string;
  prize: number;
  entry: number;
  participants: number;
  status: "upcoming" | "live" | "completed" | "student" | "premium";
  rules: string[];
};

export const TOURNAMENTS: Tournament[] = [
  { id: "t1", title: "Valorant Campus Cup", game: "Valorant", banner: valorant, date: "2026-07-12", prize: 50000, entry: 200, participants: 64, status: "upcoming", rules: ["5v5 Bo3", "Patch 9.0", "No smurfs"] },
  { id: "t2", title: "FIFA 25 Knockout", game: "FIFA 25", banner: fifa, date: "2026-07-05", prize: 20000, entry: 100, participants: 32, status: "live", rules: ["1v1", "6 min halves", "Legendary AI"] },
  { id: "t3", title: "PUBG Mobile Squads", game: "PUBG", banner: pubg, date: "2026-06-28", prize: 30000, entry: 150, participants: 80, status: "completed", rules: ["4-player squads", "TPP Erangel", "Points system"] },
  { id: "t4", title: "UU Inter-College CoD", game: "Call of Duty", banner: cod, date: "2026-07-20", prize: 25000, entry: 0, participants: 48, status: "student", rules: ["UU students only", "5v5 SnD", "Free entry"] },
  { id: "t5", title: "Tekken 8 Premium Showdown", game: "Tekken 8", banner: tekken, date: "2026-08-02", prize: 75000, entry: 500, participants: 24, status: "premium", rules: ["1v1 Bo5", "Tournament rules", "Premium members"] },
  { id: "t6", title: "NFS Drift Night", game: "Need for Speed", banner: nfs, date: "2026-07-15", prize: 15000, entry: 100, participants: 28, status: "upcoming", rules: ["Time trial", "Drift scoring", "3 attempts"] },
];
