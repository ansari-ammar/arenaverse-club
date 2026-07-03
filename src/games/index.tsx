import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Shared UI                                                          */
/* ------------------------------------------------------------------ */

export function GameFrame({
  score,
  status,
  onRestart,
  children,
  footer,
}: {
  score?: string | number;
  status?: string;
  onRestart: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground mb-3">
        <span>Score: <b className="text-neon-cyan">{score ?? 0}</b></span>
        <span className="text-neon-gold">{status}</span>
        <button onClick={onRestart} className="rounded-lg border border-neon-purple/50 px-3 py-1 text-neon-cyan hover:bg-neon-purple/20">↻ Restart</button>
      </div>
      <div className="rounded-2xl border border-border bg-black/60 p-3 sm:p-4 grid place-items-center">
        {children}
      </div>
      {footer && <div className="mt-3 text-center text-xs text-muted-foreground">{footer}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. 2048                                                             */
/* ------------------------------------------------------------------ */

function newBoard(): number[][] {
  const b = Array.from({ length: 4 }, () => Array(4).fill(0));
  return addTile(addTile(b));
}
function addTile(b: number[][]): number[][] {
  const empty: [number, number][] = [];
  b.forEach((r, i) => r.forEach((v, j) => v === 0 && empty.push([i, j])));
  if (!empty.length) return b;
  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  const nb = b.map((r) => r.slice());
  nb[i][j] = Math.random() < 0.9 ? 2 : 4;
  return nb;
}
function slide(row: number[]): [number[], number] {
  const f = row.filter((v) => v);
  let gained = 0;
  for (let i = 0; i < f.length - 1; i++) {
    if (f[i] === f[i + 1]) { f[i] *= 2; gained += f[i]; f.splice(i + 1, 1); }
  }
  while (f.length < 4) f.push(0);
  return [f, gained];
}
function move(b: number[][], dir: "L" | "R" | "U" | "D"): { b: number[][]; gained: number; moved: boolean } {
  let nb = b.map((r) => r.slice());
  let gained = 0;
  const rotate = (m: number[][]) => m[0].map((_, i) => m.map((r) => r[i]).reverse());
  const rot = dir === "U" ? 1 : dir === "R" ? 2 : dir === "D" ? 3 : 0;
  for (let i = 0; i < rot; i++) nb = rotate(nb);
  nb = nb.map((r) => { const [nr, g] = slide(r); gained += g; return nr; });
  for (let i = 0; i < (4 - rot) % 4; i++) nb = rotate(nb);
  const moved = JSON.stringify(nb) !== JSON.stringify(b);
  return { b: nb, gained, moved };
}

export function Game2048({ onGameOver }: { onGameOver?: (s: number) => void }) {
  const [b, setB] = useState<number[][]>(() => newBoard());
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const over = useMemo(() => {
    if (b.flat().includes(0)) return false;
    for (const d of ["L", "R", "U", "D"] as const) if (move(b, d).moved) return false;
    return true;
  }, [b]);

  const doMove = useCallback((d: "L" | "R" | "U" | "D") => {
    setB((prev) => {
      const r = move(prev, d);
      if (!r.moved) return prev;
      setScore((s) => s + r.gained);
      if (r.b.flat().some((v) => v >= 2048)) setWon(true);
      return addTile(r.b);
    });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const map: Record<string, "L" | "R" | "U" | "D"> = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "U", ArrowDown: "D" };
      if (map[e.key]) { e.preventDefault(); doMove(map[e.key]); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [doMove]);

  useEffect(() => { if (over && onGameOver) onGameOver(score); }, [over, score, onGameOver]);

  const restart = () => { setB(newBoard()); setScore(0); setWon(false); };
  const colors: Record<number, string> = { 0: "bg-white/5", 2: "bg-slate-600", 4: "bg-slate-500", 8: "bg-amber-600", 16: "bg-amber-500", 32: "bg-orange-500", 64: "bg-orange-600", 128: "bg-yellow-500", 256: "bg-yellow-400", 512: "bg-red-500", 1024: "bg-red-600", 2048: "bg-fuchsia-600" };

  return (
    <GameFrame score={score} status={won ? "🏆 2048!" : over ? "Game Over" : "Playing"} onRestart={restart} footer="Arrow keys / swipe on touch buttons below">
      <div
        className="grid grid-cols-4 gap-2 w-full max-w-[320px]"
        onTouchStart={(e) => { const t = e.touches[0]; (e.currentTarget as any)._sx = t.clientX; (e.currentTarget as any)._sy = t.clientY; }}
        onTouchEnd={(e) => { const el: any = e.currentTarget; const t = e.changedTouches[0]; const dx = t.clientX - el._sx, dy = t.clientY - el._sy; if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "R" : "L"); else doMove(dy > 0 ? "D" : "U"); }}
      >
        {b.flat().map((v, i) => (
          <div key={i} className={`aspect-square rounded-lg grid place-items-center font-black text-lg ${colors[v] ?? "bg-fuchsia-700"} ${v ? "text-white" : ""}`}>{v || ""}</div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 w-40 sm:hidden">
        <div /><button onClick={() => doMove("U")} className="rounded-lg bg-neon-purple/30 py-2">↑</button><div />
        <button onClick={() => doMove("L")} className="rounded-lg bg-neon-purple/30 py-2">←</button>
        <button onClick={() => doMove("D")} className="rounded-lg bg-neon-purple/30 py-2">↓</button>
        <button onClick={() => doMove("R")} className="rounded-lg bg-neon-purple/30 py-2">→</button>
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Snake                                                            */
/* ------------------------------------------------------------------ */

export function SnakeGame() {
  const SIZE = 15;
  const [snake, setSnake] = useState<[number, number][]>([[7, 7]]);
  const [dir, setDir] = useState<[number, number]>([1, 0]);
  const dirRef = useRef(dir);
  const [food, setFood] = useState<[number, number]>([3, 3]);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(true);

  useEffect(() => { dirRef.current = dir; }, [dir]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      const nd = m[e.key];
      if (!nd) return;
      e.preventDefault();
      const [dx, dy] = dirRef.current;
      if (nd[0] === -dx && nd[1] === -dy) return;
      setDir(nd);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (over || !running) return;
    const t = setInterval(() => {
      setSnake((s) => {
        const [dx, dy] = dirRef.current;
        const head: [number, number] = [s[0][0] + dx, s[0][1] + dy];
        if (head[0] < 0 || head[1] < 0 || head[0] >= SIZE || head[1] >= SIZE || s.some(([x, y]) => x === head[0] && y === head[1])) {
          setOver(true); return s;
        }
        const ns: [number, number][] = [head, ...s];
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((sc) => sc + 10);
          let nf: [number, number];
          do { nf = [Math.floor(Math.random() * SIZE), Math.floor(Math.random() * SIZE)]; } while (ns.some(([x, y]) => x === nf[0] && y === nf[1]));
          setFood(nf);
        } else ns.pop();
        return ns;
      });
    }, 140);
    return () => clearInterval(t);
  }, [over, running, food]);

  const restart = () => { setSnake([[7, 7]]); setDir([1, 0]); setFood([3, 3]); setScore(0); setOver(false); setRunning(true); };
  const move = (d: [number, number]) => { const [dx, dy] = dirRef.current; if (d[0] !== -dx || d[1] !== -dy) setDir(d); };

  return (
    <GameFrame score={score} status={over ? "Game Over" : "Playing"} onRestart={restart} footer="Arrow keys or buttons">
      <div className="grid gap-px bg-black rounded-lg overflow-hidden" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, width: "min(320px, 80vw)" }}>
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE, y = Math.floor(i / SIZE);
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isHead = snake[0][0] === x && snake[0][1] === y;
          const isFood = food[0] === x && food[1] === y;
          return <div key={i} className={`aspect-square ${isHead ? "bg-neon-cyan" : isSnake ? "bg-emerald-500" : isFood ? "bg-red-500" : "bg-white/5"}`} />;
        })}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 w-40 sm:hidden">
        <div /><button onClick={() => move([0, -1])} className="rounded-lg bg-neon-purple/30 py-2">↑</button><div />
        <button onClick={() => move([-1, 0])} className="rounded-lg bg-neon-purple/30 py-2">←</button>
        <button onClick={() => move([0, 1])} className="rounded-lg bg-neon-purple/30 py-2">↓</button>
        <button onClick={() => move([1, 0])} className="rounded-lg bg-neon-purple/30 py-2">→</button>
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Tic Tac Toe (vs AI)                                              */
/* ------------------------------------------------------------------ */

function ticWinner(b: (string | null)[]): string | null {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a, b2, c] of lines) if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a];
  return null;
}
function aiMove(b: (string | null)[]): number {
  const empty = b.map((v, i) => v ? -1 : i).filter((i) => i >= 0);
  for (const i of empty) { const nb = [...b]; nb[i] = "O"; if (ticWinner(nb) === "O") return i; }
  for (const i of empty) { const nb = [...b]; nb[i] = "X"; if (ticWinner(nb) === "X") return i; }
  if (b[4] === null) return 4;
  return empty[Math.floor(Math.random() * empty.length)];
}

export function TicTacToe() {
  const [b, setB] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [score, setScore] = useState({ X: 0, O: 0 });
  const w = ticWinner(b);
  const draw = !w && !b.includes(null);

  useEffect(() => {
    if (turn === "O" && !w && !draw) {
      const t = setTimeout(() => { const i = aiMove(b); const nb = [...b]; nb[i] = "O"; setB(nb); setTurn("X"); }, 400);
      return () => clearTimeout(t);
    }
  }, [turn, b, w, draw]);

  useEffect(() => { if (w) setScore((s) => ({ ...s, [w]: (s as any)[w] + 1 })); }, [w]);

  const click = (i: number) => { if (b[i] || w || turn !== "X") return; const nb = [...b]; nb[i] = "X"; setB(nb); setTurn("O"); };
  const restart = () => { setB(Array(9).fill(null)); setTurn("X"); };

  return (
    <GameFrame score={`You ${score.X} - ${score.O} AI`} status={w ? (w === "X" ? "You win!" : "AI wins") : draw ? "Draw" : turn === "X" ? "Your turn" : "AI…"} onRestart={restart}>
      <div className="grid grid-cols-3 gap-2 w-64">
        {b.map((v, i) => (
          <button key={i} onClick={() => click(i)} className="aspect-square rounded-xl bg-white/5 border border-white/10 text-4xl font-black hover:bg-neon-purple/20 transition">
            <span className={v === "X" ? "text-neon-cyan" : "text-neon-gold"}>{v}</span>
          </button>
        ))}
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Sudoku (easy fixed puzzle)                                       */
/* ------------------------------------------------------------------ */

const SUDOKU_PUZZLE = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const SUDOKU_SOL   = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

export function SudokuGame() {
  const [cells, setCells] = useState<string[]>(SUDOKU_PUZZLE.split("").map((c) => c === "0" ? "" : c));
  const [sel, setSel] = useState<number | null>(null);
  const fixed = SUDOKU_PUZZLE.split("").map((c) => c !== "0");
  const correct = cells.every((c, i) => c === SUDOKU_SOL[i]);
  const filled = cells.filter((c) => c).length;

  const setCell = (n: string) => {
    if (sel === null || fixed[sel]) return;
    const nc = [...cells]; nc[sel] = n; setCells(nc);
  };
  const restart = () => { setCells(SUDOKU_PUZZLE.split("").map((c) => c === "0" ? "" : c)); setSel(null); };

  return (
    <GameFrame score={`${filled}/81`} status={correct ? "🏆 Solved!" : "In progress"} onRestart={restart} footer="Tap a cell then a number">
      <div className="grid grid-cols-9 gap-px bg-black p-1 rounded-lg" style={{ width: "min(360px, 85vw)" }}>
        {cells.map((c, i) => {
          const wrong = c && c !== SUDOKU_SOL[i];
          return (
            <button key={i} onClick={() => setSel(i)}
              className={`aspect-square text-sm font-bold grid place-items-center
                ${(Math.floor(i / 9) < 3 || (Math.floor(i / 9) >= 6)) ? "" : ""}
                ${(Math.floor(i / 27) + Math.floor((i % 9) / 3)) % 2 === 0 ? "bg-white/5" : "bg-white/10"}
                ${sel === i ? "ring-2 ring-neon-cyan" : ""}
                ${fixed[i] ? "text-foreground" : wrong ? "text-red-400" : "text-neon-cyan"}`}
            >{c}</button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 justify-center max-w-[360px]">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <button key={n} onClick={() => setCell(String(n))} className="h-10 w-10 rounded-lg bg-neon-purple/30 font-bold hover:bg-neon-purple/50">{n}</button>
        ))}
        <button onClick={() => setCell("")} className="h-10 px-3 rounded-lg bg-red-500/30 text-sm">Clear</button>
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Memory Match                                                     */
/* ------------------------------------------------------------------ */

export function MemoryGame() {
  const emojis = ["🎮","🎬","🍕","🏆","⚡","🎯","🚀","🎲"];
  const shuffle = () => [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  const [cards, setCards] = useState<string[]>(shuffle);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = flipped;
      if (cards[a] === cards[b]) setMatched((m) => [...m, a, b]);
      const t = setTimeout(() => setFlipped([]), 700);
      return () => clearTimeout(t);
    }
  }, [flipped, cards]);

  const won = matched.length === cards.length;
  const click = (i: number) => { if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return; setFlipped([...flipped, i]); };
  const restart = () => { setCards(shuffle()); setFlipped([]); setMatched([]); setMoves(0); };

  return (
    <GameFrame score={moves} status={won ? "🏆 Won!" : `${matched.length / 2}/8 pairs`} onRestart={restart} footer="Match all pairs">
      <div className="grid grid-cols-4 gap-2" style={{ width: "min(320px, 85vw)" }}>
        {cards.map((c, i) => {
          const show = flipped.includes(i) || matched.includes(i);
          return (
            <button key={i} onClick={() => click(i)} className={`aspect-square rounded-xl text-3xl grid place-items-center transition ${show ? "bg-neon-purple/40" : "bg-white/5 hover:bg-white/10"}`}>
              {show ? c : "❓"}
            </button>
          );
        })}
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Bubble Shooter (simple match-3 clicker)                          */
/* ------------------------------------------------------------------ */

export function BubbleShooter() {
  const COLS = 8, ROWS = 8, COLORS = ["red","blue","green","yellow","purple"];
  const gen = () => Array.from({ length: ROWS * COLS }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
  const [grid, setGrid] = useState<string[]>(gen);
  const [score, setScore] = useState(0);

  const idx = (r: number, c: number) => r * COLS + c;
  const findGroup = (r: number, c: number, color: string, seen: Set<number>): number[] => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return [];
    const k = idx(r, c);
    if (seen.has(k) || grid[k] !== color) return [];
    seen.add(k);
    return [k, ...findGroup(r+1,c,color,seen), ...findGroup(r-1,c,color,seen), ...findGroup(r,c+1,color,seen), ...findGroup(r,c-1,color,seen)];
  };
  const pop = (i: number) => {
    const r = Math.floor(i / COLS), c = i % COLS;
    const group = findGroup(r, c, grid[i], new Set());
    if (group.length < 2) return;
    const ng = grid.slice();
    group.forEach((k) => (ng[k] = ""));
    // gravity
    for (let col = 0; col < COLS; col++) {
      const stack: string[] = [];
      for (let row = ROWS - 1; row >= 0; row--) if (ng[idx(row, col)]) stack.push(ng[idx(row, col)]);
      for (let row = ROWS - 1; row >= 0; row--) ng[idx(row, col)] = stack.shift() ?? COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    setGrid(ng);
    setScore((s) => s + group.length * group.length);
  };
  const restart = () => { setGrid(gen()); setScore(0); };
  const bg: Record<string, string> = { red: "bg-red-500", blue: "bg-blue-500", green: "bg-green-500", yellow: "bg-yellow-400", purple: "bg-purple-500" };

  return (
    <GameFrame score={score} status="Pop groups of 2+" onRestart={restart}>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, width: "min(320px, 85vw)" }}>
        {grid.map((c, i) => (
          <button key={i} onClick={() => pop(i)} className={`aspect-square rounded-full ${bg[c] ?? "bg-transparent"} hover:scale-110 transition`} />
        ))}
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Tetris (compact)                                                 */
/* ------------------------------------------------------------------ */

const TETROMINOS = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
];

export function TetrisGame() {
  const W = 10, H = 16;
  const [board, setBoard] = useState<number[][]>(() => Array.from({ length: H }, () => Array(W).fill(0)));
  const [piece, setPiece] = useState(() => ({ s: TETROMINOS[Math.floor(Math.random() * 7)], x: 3, y: 0 }));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const pieceRef = useRef(piece);
  const boardRef = useRef(board);
  useEffect(() => { pieceRef.current = piece; }, [piece]);
  useEffect(() => { boardRef.current = board; }, [board]);

  const collide = (b: number[][], s: number[][], x: number, y: number) => {
    for (let r = 0; r < s.length; r++) for (let c = 0; c < s[0].length; c++) {
      if (!s[r][c]) continue;
      const nx = x + c, ny = y + r;
      if (nx < 0 || nx >= W || ny >= H) return true;
      if (ny >= 0 && b[ny][nx]) return true;
    }
    return false;
  };
  const merge = (b: number[][], s: number[][], x: number, y: number) => {
    const nb = b.map((r) => r.slice());
    s.forEach((row, r) => row.forEach((v, c) => { if (v && y + r >= 0) nb[y + r][x + c] = 1; }));
    return nb;
  };
  const clearLines = (b: number[][]) => {
    const kept = b.filter((r) => r.some((v) => !v));
    const cleared = H - kept.length;
    while (kept.length < H) kept.unshift(Array(W).fill(0));
    return { b: kept, cleared };
  };
  const spawn = () => ({ s: TETROMINOS[Math.floor(Math.random() * 7)], x: 3, y: 0 });

  const tick = useCallback(() => {
    const p = pieceRef.current, b = boardRef.current;
    if (!collide(b, p.s, p.x, p.y + 1)) setPiece({ ...p, y: p.y + 1 });
    else {
      const nb = merge(b, p.s, p.x, p.y);
      const { b: cb, cleared } = clearLines(nb);
      setBoard(cb);
      setScore((s) => s + cleared * 100);
      const np = spawn();
      if (collide(cb, np.s, np.x, np.y)) setOver(true);
      else setPiece(np);
    }
  }, []);

  useEffect(() => {
    if (over) return;
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [over, tick]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const p = pieceRef.current, b = boardRef.current;
      if (e.key === "ArrowLeft" && !collide(b, p.s, p.x - 1, p.y)) setPiece({ ...p, x: p.x - 1 });
      else if (e.key === "ArrowRight" && !collide(b, p.s, p.x + 1, p.y)) setPiece({ ...p, x: p.x + 1 });
      else if (e.key === "ArrowDown" && !collide(b, p.s, p.x, p.y + 1)) setPiece({ ...p, y: p.y + 1 });
      else if (e.key === "ArrowUp") {
        const rot = p.s[0].map((_, i) => p.s.map((r) => r[i]).reverse());
        if (!collide(b, rot, p.x, p.y)) setPiece({ ...p, s: rot });
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const restart = () => { setBoard(Array.from({ length: H }, () => Array(W).fill(0))); setPiece(spawn()); setScore(0); setOver(false); };

  const display = merge(board, piece.s, piece.x, piece.y);

  return (
    <GameFrame score={score} status={over ? "Game Over" : "Playing"} onRestart={restart} footer="←→ move · ↑ rotate · ↓ drop">
      <div className="grid gap-px bg-black" style={{ gridTemplateColumns: `repeat(${W}, 1fr)`, width: "min(240px, 70vw)" }}>
        {display.flat().map((v, i) => (
          <div key={i} className={`aspect-square ${v ? "bg-neon-cyan" : "bg-white/5"}`} />
        ))}
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Chess (simplified 2-player local, no rule validation)            */
/* ------------------------------------------------------------------ */

const INITIAL_CHESS = [
  "♜♞♝♛♚♝♞♜".split(""),
  Array(8).fill("♟"),
  Array(8).fill(""), Array(8).fill(""), Array(8).fill(""), Array(8).fill(""),
  Array(8).fill("♙"),
  "♖♘♗♕♔♗♘♖".split(""),
];

export function ChessGame() {
  const [b, setB] = useState<string[][]>(INITIAL_CHESS.map((r) => r.slice()));
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<"W" | "B">("W");
  const [captured, setCaptured] = useState<string[]>([]);
  const isWhite = (p: string) => "♙♖♘♗♕♔".includes(p);
  const click = (r: number, c: number) => {
    if (sel) {
      const [sr, sc] = sel;
      if (sr === r && sc === c) { setSel(null); return; }
      const piece = b[sr][sc];
      const target = b[r][c];
      if (target && ((turn === "W" && isWhite(target)) || (turn === "B" && !isWhite(target) && target))) {
        setSel([r, c]); return;
      }
      const nb = b.map((row) => row.slice());
      if (target) setCaptured([...captured, target]);
      nb[r][c] = piece; nb[sr][sc] = "";
      setB(nb); setSel(null); setTurn(turn === "W" ? "B" : "W");
    } else {
      const p = b[r][c];
      if (!p) return;
      if ((turn === "W" && isWhite(p)) || (turn === "B" && !isWhite(p))) setSel([r, c]);
    }
  };
  const restart = () => { setB(INITIAL_CHESS.map((r) => r.slice())); setSel(null); setTurn("W"); setCaptured([]); };

  return (
    <GameFrame score={captured.length} status={`${turn === "W" ? "White" : "Black"}'s turn`} onRestart={restart} footer="Local 2-player · click piece then destination">
      <div className="grid grid-cols-8" style={{ width: "min(360px, 85vw)" }}>
        {b.flat().map((p, i) => {
          const r = Math.floor(i / 8), c = i % 8;
          const dark = (r + c) % 2 === 1;
          const isSel = sel && sel[0] === r && sel[1] === c;
          return (
            <button key={i} onClick={() => click(r, c)}
              className={`aspect-square text-3xl grid place-items-center ${dark ? "bg-stone-700" : "bg-stone-300"} ${isSel ? "ring-2 ring-neon-cyan" : ""}`}>
              <span className={isWhite(p) ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]" : "text-black"}>{p}</span>
            </button>
          );
        })}
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Ludo (simplified 2-player dice race)                             */
/* ------------------------------------------------------------------ */

export function LudoGame() {
  const [pos, setPos] = useState({ P1: 0, P2: 0 });
  const [turn, setTurn] = useState<"P1" | "P2">("P1");
  const [dice, setDice] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const roll = () => {
    if (winner) return;
    const d = 1 + Math.floor(Math.random() * 6);
    setDice(d);
    const np = { ...pos, [turn]: Math.min(30, pos[turn] + d) };
    setPos(np);
    if (np[turn] >= 30) setWinner(turn);
    else if (d !== 6) setTurn(turn === "P1" ? "P2" : "P1");
  };
  const restart = () => { setPos({ P1: 0, P2: 0 }); setTurn("P1"); setDice(null); setWinner(null); };

  return (
    <GameFrame score={`P1 ${pos.P1} · P2 ${pos.P2}`} status={winner ? `🏆 ${winner} wins!` : `${turn}'s turn`} onRestart={restart} footer="Race to 30 · roll 6 for extra turn">
      <div className="w-full max-w-md space-y-4">
        {(["P1", "P2"] as const).map((p) => (
          <div key={p}>
            <div className="flex justify-between text-xs mb-1"><span className={p === turn ? "text-neon-cyan font-bold" : ""}>{p} {p === "P1" ? "🔴" : "🟢"}</span><span>{pos[p]}/30</span></div>
            <div className="h-4 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full ${p === "P1" ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${(pos[p] / 30) * 100}%` }} />
            </div>
          </div>
        ))}
        <div className="text-center">
          <button onClick={roll} disabled={!!winner} className="btn-primary text-2xl px-8 py-4">🎲 {dice ?? "Roll"}</button>
        </div>
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Connect Four (vs AI)                                            */
/* ------------------------------------------------------------------ */

function c4Winner(b: number[][]): number {
  const R = 6, C = 7;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const v = b[r][c]; if (!v) continue;
    for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
      let k = 1;
      while (k < 4 && b[r + dr*k]?.[c + dc*k] === v) k++;
      if (k === 4) return v;
    }
  }
  return 0;
}

export function ConnectFour() {
  const R = 6, C = 7;
  const [b, setB] = useState<number[][]>(() => Array.from({ length: R }, () => Array(C).fill(0)));
  const [turn, setTurn] = useState<1 | 2>(1);
  const w = c4Winner(b);
  const full = b[0].every((v) => v);

  const drop = (col: number, player: 1 | 2) => {
    for (let r = R - 1; r >= 0; r--) if (!b[r][col]) { const nb = b.map((rw) => rw.slice()); nb[r][col] = player; setB(nb); return true; }
    return false;
  };
  const play = (col: number) => { if (w || turn !== 1) return; if (drop(col, 1)) setTurn(2); };

  useEffect(() => {
    if (turn === 2 && !w && !full) {
      const t = setTimeout(() => {
        const cols = Array.from({ length: C }, (_, i) => i).filter((c) => !b[0][c]);
        // block or random
        for (const col of cols) { const test = b.map((r) => r.slice()); for (let r = R - 1; r >= 0; r--) if (!test[r][col]) { test[r][col] = 1; break; } if (c4Winner(test) === 1) { drop(col, 2); setTurn(1); return; } }
        drop(cols[Math.floor(Math.random() * cols.length)], 2); setTurn(1);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [turn, b, w, full]);

  const restart = () => { setB(Array.from({ length: R }, () => Array(C).fill(0))); setTurn(1); };

  return (
    <GameFrame status={w === 1 ? "You win!" : w === 2 ? "AI wins" : full ? "Draw" : turn === 1 ? "Your turn" : "AI…"} onRestart={restart} footer="Click a column">
      <div className="grid gap-1 p-2 rounded-xl bg-blue-900/40" style={{ gridTemplateColumns: `repeat(${C}, 1fr)`, width: "min(360px, 85vw)" }}>
        {b.flat().map((v, i) => (
          <button key={i} onClick={() => play(i % C)} className="aspect-square rounded-full bg-blue-950/80 grid place-items-center">
            {v === 1 && <span className="h-[85%] w-[85%] rounded-full bg-red-500" />}
            {v === 2 && <span className="h-[85%] w-[85%] rounded-full bg-yellow-400" />}
          </button>
        ))}
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Rock Paper Scissors (best of 5)                                 */
/* ------------------------------------------------------------------ */

export function RPSGame() {
  const [score, setScore] = useState({ you: 0, cpu: 0 });
  const [last, setLast] = useState<{ y: string; c: string; r: string } | null>(null);
  const CHOICES = ["✊ Rock", "✋ Paper", "✌️ Scissors"];
  const beats: Record<number, number> = { 0: 2, 1: 0, 2: 1 };
  const winner = score.you === 3 ? "You win the match!" : score.cpu === 3 ? "CPU wins the match" : null;

  const play = (i: number) => {
    if (winner) return;
    const c = Math.floor(Math.random() * 3);
    let r = "Draw";
    if (i !== c) { if (beats[i] === c) { r = "Win"; setScore((s) => ({ ...s, you: s.you + 1 })); } else { r = "Lose"; setScore((s) => ({ ...s, cpu: s.cpu + 1 })); } }
    setLast({ y: CHOICES[i], c: CHOICES[c], r });
  };
  const restart = () => { setScore({ you: 0, cpu: 0 }); setLast(null); };

  return (
    <GameFrame score={`You ${score.you} - ${score.cpu} CPU`} status={winner ?? "Best of 5"} onRestart={restart}>
      <div className="w-full max-w-md">
        <div className="grid grid-cols-3 gap-3">
          {CHOICES.map((c, i) => (
            <button key={c} onClick={() => play(i)} disabled={!!winner} className="glass rounded-2xl p-6 text-3xl hover:glow-purple transition disabled:opacity-40">{c}</button>
          ))}
        </div>
        {last && (
          <div className="mt-4 text-center text-sm">
            <p>You: <b>{last.y}</b> · CPU: <b>{last.c}</b></p>
            <p className={`mt-1 text-lg font-bold ${last.r === "Win" ? "text-emerald-400" : last.r === "Lose" ? "text-red-400" : "text-neon-gold"}`}>{last.r}</p>
          </div>
        )}
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 12. Racing (avoid obstacles)                                        */
/* ------------------------------------------------------------------ */

export function RacingGame() {
  const [lane, setLane] = useState(1);
  const laneRef = useRef(lane);
  useEffect(() => { laneRef.current = lane; }, [lane]);
  const [obstacles, setObstacles] = useState<{ id: number; lane: number; y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const idCount = useRef(0);

  useEffect(() => {
    if (over) return;
    const tick = setInterval(() => {
      setObstacles((obs) => {
        const moved = obs.map((o) => ({ ...o, y: o.y + 8 })).filter((o) => o.y < 100);
        if (Math.random() < 0.35) moved.push({ id: idCount.current++, lane: Math.floor(Math.random() * 3), y: -10 });
        if (moved.some((o) => o.y > 78 && o.y < 92 && o.lane === laneRef.current)) { setOver(true); }
        return moved;
      });
      setScore((s) => s + 1);
    }, 100);
    return () => clearInterval(tick);
  }, [over]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setLane((l) => Math.max(0, l - 1));
      if (e.key === "ArrowRight") setLane((l) => Math.min(2, l + 1));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const restart = () => { setLane(1); setObstacles([]); setScore(0); setOver(false); };

  return (
    <GameFrame score={score} status={over ? "Crashed!" : "Racing"} onRestart={restart} footer="←→ or buttons to switch lanes">
      <div className="relative overflow-hidden rounded-xl bg-stone-900 border-4 border-yellow-500/40" style={{ width: "min(240px, 70vw)", aspectRatio: "3/5" }}>
        <div className="absolute inset-y-0 left-1/3 w-px bg-yellow-500/50" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-yellow-500/50" />
        {obstacles.map((o) => (
          <div key={o.id} className="absolute w-1/3 h-[10%] bg-red-500 rounded" style={{ left: `${o.lane * 33.33}%`, top: `${o.y}%` }} />
        ))}
        <div className="absolute w-1/3 h-[10%] bg-neon-cyan rounded" style={{ left: `${lane * 33.33}%`, top: "80%" }} />
      </div>
      <div className="mt-4 flex gap-4 sm:hidden">
        <button onClick={() => setLane((l) => Math.max(0, l - 1))} className="rounded-lg bg-neon-purple/30 px-6 py-2">←</button>
        <button onClick={() => setLane((l) => Math.min(2, l + 1))} className="rounded-lg bg-neon-purple/30 px-6 py-2">→</button>
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 13. Quiz Battle                                                     */
/* ------------------------------------------------------------------ */

const QUIZ = [
  { q: "Which company makes the PS5?", a: ["Sony", "Microsoft", "Nintendo", "Sega"], i: 0 },
  { q: "Valorant is developed by?", a: ["Valve", "Riot Games", "Blizzard", "EA"], i: 1 },
  { q: "How many players in FIFA online match?", a: ["8", "10", "11", "22"], i: 3 },
  { q: "Minecraft was created by?", a: ["Notch", "Todd Howard", "Miyamoto", "Kojima"], i: 0 },
  { q: "GTA V takes place in?", a: ["Vice City", "Liberty City", "Los Santos", "San Fierro"], i: 2 },
  { q: "Which game has 'Chicken Dinner'?", a: ["Fortnite", "PUBG", "Apex", "COD"], i: 1 },
  { q: "Tekken is a ____ game?", a: ["Racing", "Fighting", "RPG", "Puzzle"], i: 1 },
  { q: "Need for Speed genre?", a: ["Sports", "Racing", "Simulation", "Shooter"], i: 1 },
];

export function QuizGame() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const done = i >= QUIZ.length;
  const pick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === QUIZ[i].i) setScore((s) => s + 1);
    setTimeout(() => { setPicked(null); setI(i + 1); }, 800);
  };
  const restart = () => { setI(0); setScore(0); setPicked(null); };

  return (
    <GameFrame score={`${score}/${QUIZ.length}`} status={done ? "🏆 Complete!" : `Q${i + 1}/${QUIZ.length}`} onRestart={restart}>
      <div className="w-full max-w-md">
        {done ? (
          <div className="text-center p-8">
            <p className="text-5xl mb-3">{score >= 6 ? "🏆" : score >= 4 ? "🎯" : "🎮"}</p>
            <p className="text-2xl font-black">You scored {score}/{QUIZ.length}</p>
          </div>
        ) : (
          <>
            <p className="text-center font-semibold mb-4">{QUIZ[i].q}</p>
            <div className="grid gap-2">
              {QUIZ[i].a.map((a, n) => {
                const correct = picked !== null && n === QUIZ[i].i;
                const wrong = picked === n && n !== QUIZ[i].i;
                return (
                  <button key={n} onClick={() => pick(n)} className={`rounded-xl p-3 text-left border transition ${correct ? "bg-emerald-500/30 border-emerald-400" : wrong ? "bg-red-500/30 border-red-400" : "glass border-border hover:border-neon-cyan"}`}>
                    {a}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const GAME_REGISTRY: Record<string, React.ComponentType> = {
  "2048": Game2048,
  snake: SnakeGame,
  ttt: TicTacToe,
  sudoku: SudokuGame,
  memory: MemoryGame,
  bubble: BubbleShooter,
  tetris: TetrisGame,
  chess: ChessGame,
  ludo: LudoGame,
  c4: ConnectFour,
  rps: RPSGame,
  race: RacingGame,
  quiz: QuizGame,
};
