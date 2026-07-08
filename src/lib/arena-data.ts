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
  category: string;
  language: string;
  year: number;
  seatsLeft: number;
  trailer: string;
  section: ("featured" | "now" | "top" | "recommended" | "upcoming")[];
  synopsis: string;
};

export const MOVIES: Movie[] = [
  // Hollywood
  { id: "inception", title: "Inception", img: inception, backdrop: inception, duration: "2h 28m", price: 180, rating: 8.8, category: "Thriller", language: "English", year: 2010, seatsLeft: 42, trailer: "YoHD9XEInc0", section: ["featured", "top", "recommended"], synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea." },
  { id: "interstellar", title: "Interstellar", img: interstellar, backdrop: interstellar, duration: "2h 49m", price: 200, rating: 8.7, category: "Sci-Fi", language: "English", year: 2014, seatsLeft: 36, trailer: "zSWdZVtXT7E", section: ["featured", "top"], synopsis: "Explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id: "dune", title: "Dune: Part Two", img: dune, backdrop: dune, duration: "2h 46m", price: 220, rating: 8.6, category: "Sci-Fi", language: "English", year: 2024, seatsLeft: 28, trailer: "Way9Dexny3w", section: ["featured", "now", "recommended"], synopsis: "Paul Atreides unites with the Fremen while seeking revenge against the conspirators." },
  { id: "avengers", title: "Avengers: Endgame", img: avengers, backdrop: avengers, duration: "3h 01m", price: 200, rating: 8.4, category: "Action", language: "English", year: 2019, seatsLeft: 18, trailer: "TcMBFSGVi1c", section: ["now", "top"], synopsis: "The Avengers assemble once more to reverse Thanos' actions." },
  { id: "johnwick", title: "John Wick 4", img: johnwick, backdrop: johnwick, duration: "2h 49m", price: 180, rating: 7.7, category: "Action", language: "English", year: 2023, seatsLeft: 44, trailer: "qEVUtrk8_B4", section: ["now", "recommended"], synopsis: "John Wick uncovers a path to defeating The High Table." },
  { id: "spiderman", title: "Spider-Verse", img: spiderman, backdrop: spiderman, duration: "2h 20m", price: 180, rating: 8.6, category: "Animation", language: "English / Hindi", year: 2023, seatsLeft: 31, trailer: "cqGjhVJWtEg", section: ["now", "recommended", "top"], synopsis: "Miles Morales catapults across the multiverse." },
  { id: "jujutsu", title: "Jujutsu Kaisen 0", img: spiderman, backdrop: spiderman, duration: "1h 45m", price: 160, rating: 8.0, category: "Anime", language: "Japanese", year: 2022, seatsLeft: 22, trailer: "8UVNT4wvIGY", section: ["upcoming"], synopsis: "Yuta Okkotsu enrolls at Tokyo Jujutsu High under Satoru Gojo." },
  { id: "esports-final", title: "Valorant World Final", img: valorant, backdrop: valorant, duration: "3h 30m", price: 250, rating: 9.1, category: "Esports", language: "English", year: 2025, seatsLeft: 12, trailer: "e_E9W2vsRbQ", section: ["featured", "upcoming"], synopsis: "Live screening of the Valorant Champions Grand Final in Dolby Atmos." },
  { id: "trending-thriller", title: "Midnight Protocol", img: cod, backdrop: cod, duration: "2h 12m", price: 190, rating: 8.1, category: "Thriller", language: "English", year: 2025, seatsLeft: 47, trailer: "M7lc1UVf-VE", section: ["upcoming", "recommended"], synopsis: "A hacker stumbles upon a global conspiracy." },
  { id: "horror-veil", title: "The Veil", img: johnwick, backdrop: johnwick, duration: "1h 58m", price: 170, rating: 7.4, category: "Horror", language: "English", year: 2025, seatsLeft: 34, trailer: "M7lc1UVf-VE", section: ["upcoming"], synopsis: "A found-footage horror set inside an abandoned observatory." },

  // Bollywood
  { id: "rockstar", title: "Rockstar", img: spiderman, backdrop: spiderman, duration: "2h 39m", price: 170, rating: 7.7, category: "Bollywood", language: "Hindi", year: 2011, seatsLeft: 40, trailer: "OVfoccVSWpc", section: ["top", "recommended"], synopsis: "An aspiring musician discovers heartbreak fuels the fire of his art." },
  { id: "prdp", title: "Prem Ratan Dhan Payo", img: avengers, backdrop: avengers, duration: "2h 44m", price: 160, rating: 5.2, category: "Bollywood", language: "Hindi", year: 2015, seatsLeft: 30, trailer: "cvcO7s-YnFY", section: ["recommended"], synopsis: "A theatre artist impersonates a prince amid a royal conspiracy." },
  { id: "3idiots", title: "3 Idiots", img: interstellar, backdrop: interstellar, duration: "2h 50m", price: 170, rating: 8.4, category: "Comedy", language: "Hindi", year: 2009, seatsLeft: 44, trailer: "K0eDlFX9GMc", section: ["top", "recommended"], synopsis: "Two friends search for their long-lost college buddy who redefined success." },
  { id: "znmd", title: "Zindagi Na Milegi Dobara", img: dune, backdrop: dune, duration: "2h 35m", price: 170, rating: 8.2, category: "Bollywood", language: "Hindi", year: 2011, seatsLeft: 38, trailer: "FJrpcDgC3zU", section: ["recommended", "top"], synopsis: "Three friends embark on a bachelor road trip through Spain." },
  { id: "yjhd", title: "Yeh Jawaani Hai Deewani", img: spiderman, backdrop: spiderman, duration: "2h 40m", price: 170, rating: 7.2, category: "Romance", language: "Hindi", year: 2013, seatsLeft: 36, trailer: "AJcmi_YoNqA", section: ["recommended"], synopsis: "A carefree traveler meets a studious young woman on a Himalayan trek." },
  { id: "dangal", title: "Dangal", img: inception, backdrop: inception, duration: "2h 41m", price: 180, rating: 8.4, category: "Family", language: "Hindi", year: 2016, seatsLeft: 42, trailer: "x_7YlGv9u1g", section: ["top"], synopsis: "A former wrestler trains his daughters to become world-class athletes." },
  { id: "bhoolb", title: "Bhool Bhulaiyaa", img: johnwick, backdrop: johnwick, duration: "2h 39m", price: 160, rating: 7.4, category: "Horror", language: "Hindi", year: 2007, seatsLeft: 30, trailer: "AVLwsMxwvUE", section: ["recommended"], synopsis: "A psychiatrist unravels a haunting in an ancestral mansion." },
  { id: "war", title: "War", img: cod, backdrop: cod, duration: "2h 34m", price: 190, rating: 6.5, category: "Action", language: "Hindi", year: 2019, seatsLeft: 28, trailer: "pJZ8sf-nJdM", section: ["now"], synopsis: "An Indian agent hunts down his own rogue mentor." },
  { id: "animal", title: "Animal", img: johnwick, backdrop: johnwick, duration: "3h 21m", price: 200, rating: 6.6, category: "Thriller", language: "Hindi", year: 2023, seatsLeft: 22, trailer: "Dydmpfo68DA", section: ["now", "recommended"], synopsis: "A son's obsessive devotion turns violent as he protects his father." },
  { id: "chhaava", title: "Chhaava", img: avengers, backdrop: avengers, duration: "2h 41m", price: 200, rating: 8.1, category: "Bollywood", language: "Hindi", year: 2025, seatsLeft: 18, trailer: "cWq0i9Uu49U", section: ["featured", "upcoming"], synopsis: "The saga of Chhatrapati Sambhaji Maharaj's valour and legacy." },
];

export type Game = {
  id: string;
  title: string;
  img?: string;
  emoji: string;
  hue: string;
  console: "PS5" | "Xbox" | "PC" | "VR" | "Racing Sim";
  genre: string;
  rating: number;
  price: number;
  trailer: string;
  comingSoon?: boolean;
  releaseDate?: string;
};

export const GAMES: Game[] = [
  { id: "gta6", title: "GTA VI", emoji: "🌴", hue: "from-pink-500 to-rose-900", console: "PS5", genre: "Open World", rating: 0, price: 0, trailer: "QdBZY2fkU-0", comingSoon: true, releaseDate: "2026-05-26" },
  { id: "fifa", title: "EA FC 25", img: fifa, emoji: "⚽", hue: "from-green-500 to-emerald-900", console: "PS5", genre: "Sports", rating: 8.2, price: 100, trailer: "o-elC-EMS4Y" },
  { id: "cod", title: "Call of Duty MW3", img: cod, emoji: "🔫", hue: "from-orange-600 to-red-900", console: "PS5", genre: "FPS", rating: 8.0, price: 120, trailer: "eOKf8Aajers" },
  { id: "gta", title: "GTA V", img: gta, emoji: "🏙️", hue: "from-yellow-500 to-orange-800", console: "PS5", genre: "Open World", rating: 9.4, price: 100, trailer: "QkkoHAzjnUs" },
  { id: "valorant", title: "Valorant", img: valorant, emoji: "🎯", hue: "from-red-600 to-fuchsia-900", console: "PC", genre: "FPS", rating: 8.5, price: 80, trailer: "e_E9W2vsRbQ" },
  { id: "tekken", title: "Tekken 8", img: tekken, emoji: "🥋", hue: "from-slate-700 to-black", console: "PS5", genre: "Fighting", rating: 8.6, price: 120, trailer: "GtF5AzWq3Zw" },
  { id: "minecraft", title: "Minecraft", img: minecraft, emoji: "🧱", hue: "from-lime-600 to-green-900", console: "PC", genre: "Sandbox", rating: 9.2, price: 80, trailer: "MmB9b5njVbA" },
  { id: "pubg", title: "PUBG", img: pubg, emoji: "🪂", hue: "from-yellow-600 to-amber-900", console: "PC", genre: "Battle Royale", rating: 7.9, price: 80, trailer: "P44EOeAY55w" },
  { id: "nfs", title: "Need For Speed", img: nfs, emoji: "🏎️", hue: "from-red-500 to-orange-800", console: "Racing Sim", genre: "Racing", rating: 8.1, price: 140, trailer: "AKvvpZUdVHc" },
  { id: "wwe", title: "WWE 2K24", emoji: "🤼", hue: "from-red-700 to-yellow-800", console: "PS5", genre: "Sports", rating: 8.3, price: 120, trailer: "GKk3nEt4X68" },
  { id: "fortnite", title: "Fortnite", emoji: "🌈", hue: "from-fuchsia-500 to-purple-900", console: "PC", genre: "Battle Royale", rating: 8.4, price: 80, trailer: "2gUtfBmw86Y" },
  { id: "rocketleague", title: "Rocket League", emoji: "🚗", hue: "from-blue-600 to-orange-700", console: "PS5", genre: "Sports", rating: 8.7, price: 100, trailer: "yyc57ilNKuc" },
  { id: "mk", title: "Mortal Kombat 1", emoji: "🐉", hue: "from-red-900 to-black", console: "PS5", genre: "Fighting", rating: 8.2, price: 120, trailer: "6iy8jVFujmk" },
  { id: "rdr2", title: "Red Dead Redemption 2", emoji: "🤠", hue: "from-amber-800 to-stone-900", console: "PS5", genre: "Open World", rating: 9.6, price: 120, trailer: "gmA6MrX81z4" },
  { id: "ac", title: "Assassin's Creed Shadows", emoji: "🥷", hue: "from-slate-800 to-red-900", console: "PS5", genre: "Action RPG", rating: 8.4, price: 120, trailer: "PWJRW03Xn78" },
  { id: "forza", title: "Forza Horizon 5", emoji: "🏁", hue: "from-cyan-600 to-blue-900", console: "Xbox", genre: "Racing", rating: 9.0, price: 140, trailer: "FYH9n37B7Yw" },
  { id: "spiderman-g", title: "Spider-Man 2", emoji: "🕷️", hue: "from-red-600 to-blue-900", console: "PS5", genre: "Action", rating: 9.1, price: 120, trailer: "qAcLxCTB_hs" },
  { id: "gow", title: "God of War Ragnarök", emoji: "🪓", hue: "from-blue-900 to-slate-900", console: "PS5", genre: "Action RPG", rating: 9.4, price: 120, trailer: "EE-4GvjKcfs" },
  { id: "elden", title: "Elden Ring", emoji: "⚔️", hue: "from-yellow-700 to-amber-900", console: "PC", genre: "Souls-like", rating: 9.5, price: 120, trailer: "E3Huy2cdih0" },
  { id: "vr", title: "VR Experience", emoji: "🥽", hue: "from-violet-600 to-indigo-900", console: "VR", genre: "Immersive", rating: 8.9, price: 200, trailer: "aa_QzYyxlNw" },
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
  { name: "Loaded Fries", price: 180, category: "Fries", emoji: "🍟" },
  { name: "Peri Peri Fries", price: 160, category: "Fries", emoji: "🍟" },
  { name: "Club Sandwich", price: 190, category: "Sandwich", emoji: "🥪" },
  { name: "Grilled Sandwich", price: 150, category: "Sandwich", emoji: "🥪" },
  { name: "Alfredo Pasta", price: 240, category: "Pasta", emoji: "🍝" },
  { name: "Arrabbiata Pasta", price: 220, category: "Pasta", emoji: "🍝" },
  { name: "Loaded Nachos", price: 180, category: "Nachos", emoji: "🌮" },
  { name: "Cheesy Nachos", price: 200, category: "Nachos", emoji: "🌮" },
  { name: "Cold Coffee", price: 140, category: "Cold Coffee", emoji: "🥤", tag: "Bestseller" },
  { name: "Mocha Frappe", price: 180, category: "Cold Coffee", emoji: "☕" },
  { name: "Coke / Pepsi", price: 80, category: "Soft Drinks", emoji: "🥤" },
  { name: "Sprite", price: 80, category: "Soft Drinks", emoji: "🥤" },
  { name: "Chocolate Milkshake", price: 180, category: "Milkshakes", emoji: "🥛" },
  { name: "Oreo Milkshake", price: 200, category: "Milkshakes", emoji: "🥛" },
  { name: "Vanilla Sundae", price: 140, category: "Ice Cream", emoji: "🍨" },
  { name: "Belgian Chocolate Scoop", price: 180, category: "Ice Cream", emoji: "🍦" },
  { name: "Choco Lava Brownie", price: 160, category: "Brownies", emoji: "🍫", tag: "Hot" },
  { name: "Walnut Brownie", price: 180, category: "Brownies", emoji: "🍫" },
  { name: "Gaming Combo (Burger + Fries + Red Bull)", price: 420, category: "Gaming Combo", emoji: "🎮", tag: "Save ₹80" },
  { name: "Movie Combo (Popcorn + Coke + Nachos)", price: 380, category: "Movie Combo", emoji: "🎬", tag: "Save ₹100" },
];

export const FOOD_CATEGORIES = ["Popcorn","Pizza","Burger","Fries","Sandwich","Pasta","Nachos","Cold Coffee","Soft Drinks","Milkshakes","Ice Cream","Brownies","Gaming Combo","Movie Combo"];

export const SHOWTIMES = ["12:30 PM", "3:00 PM", "6:15 PM", "9:30 PM"];
export const GAMING_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
export const GAMING_DURATIONS = [
  { label: "1 Hour", value: "1h", price: 60 },
  { label: "2 Hours", value: "2h", price: 100 },
  { label: "3 Hours", value: "3h", price: 140 },
  { label: "4 Hours", value: "4h", price: 180 },
];

// Rewards catalogue — redeem ArenaCoins
export const REWARDS = [
  { id: "r1", title: "1 Hour Gaming", cost: 800, category: "Gaming", emoji: "🎮" },
  { id: "r2", title: "Movie Ticket", cost: 1200, category: "Movies", emoji: "🎬" },
  { id: "r3", title: "Movie Combo Snack", cost: 600, category: "Snacks", emoji: "🍿" },
  { id: "r4", title: "Gaming Combo Snack", cost: 700, category: "Snacks", emoji: "🍔" },
  { id: "r5", title: "Premium Membership 1 Month", cost: 5000, category: "Membership", emoji: "👑" },
  { id: "r6", title: "Tournament Entry", cost: 1500, category: "Tournaments", emoji: "🏆" },
  { id: "r7", title: "VR Session 30min", cost: 2000, category: "Gaming", emoji: "🥽" },
  { id: "r8", title: "Free Popcorn", cost: 400, category: "Snacks", emoji: "🍿" },
];

// Daily Spin prizes
export const SPIN_PRIZES = [
  { label: "50 Coins", coins: 50, color: "#a855f7" },
  { label: "100 XP", xp: 100, color: "#06b6d4" },
  { label: "10 Coins", coins: 10, color: "#f59e0b" },
  { label: "200 Coins", coins: 200, color: "#ec4899" },
  { label: "50 XP", xp: 50, color: "#22d3ee" },
  { label: "500 Coins!", coins: 500, color: "#facc15" },
  { label: "25 Coins", coins: 25, color: "#8b5cf6" },
  { label: "Free Snack", coins: 100, xp: 50, color: "#f43f5e" },
];

export const DAILY_CHALLENGES = [
  { id: "c1", title: "Play any online game", reward: 50, emoji: "🕹️" },
  { id: "c2", title: "Book a session or movie", reward: 150, emoji: "🎟️" },
  { id: "c3", title: "Order a snack", reward: 75, emoji: "🍿" },
  { id: "c4", title: "Invite a friend to a room", reward: 100, emoji: "👥" },
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
