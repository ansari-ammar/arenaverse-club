import logoAsset from "@/assets/arenaverse-logo.asset.json";

/**
 * Official ArenaVerse Club logo (uploaded brand mark).
 * Use `size` to control the pixel size; the mark keeps its aspect ratio.
 */
export function ArenaLogo({
  size = 40,
  className = "",
  withGlow = true,
}: {
  size?: number;
  className?: string;
  withGlow?: boolean;
}) {
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-xl ${className}`}
      style={{ width: size, height: size }}
    >
      {withGlow && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-neon-purple/40 to-neon-blue/30 blur-md"
        />
      )}
      <img
        src={logoAsset.url}
        alt="ArenaVerse Club"
        width={size}
        height={size}
        className="h-full w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

export const ARENA_LOGO_URL = logoAsset.url;
