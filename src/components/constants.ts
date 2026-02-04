export const BADGE_MAP: Record<string, { icon: string; label: string }> = {
  "Very weak": { icon: "🥀", label: "Beginner" },
  Weak: { icon: "🌱", label: "Trying" },
  Fair: { icon: "🌼", label: "Getting Stronger" },
  Strong: { icon: "🌟", label: "Secure" },
  "Very strong": { icon: "🏆", label: "Master of Passwords" },
};

export const BANDS = [
  {
    min: 80,
    label: "Very strong",
    gradient: "linear-gradient(90deg,#fbcfe8,#a7f3d0)",
  },
  {
    min: 60,
    label: "Strong",
    gradient: "linear-gradient(90deg,#f9a8d4,#86efac)",
  },
  {
    min: 36,
    label: "Fair",
    gradient: "linear-gradient(90deg,#f9a8d4,#fde68a)",
  },
  {
    min: 28,
    label: "Weak",
    gradient: "linear-gradient(90deg,#fda4af,#f9a8d4)",
  },
  {
    min: -Infinity,
    label: "Very weak",
    gradient: "linear-gradient(90deg,#fecdd3,#fda4af)",
  },
];

export const typeColors: Record<string, string> = {
  "keyboard-sequence": "#fda4af",
  "dictionary": "#f9a8d4",
  "repeat": "#fde68a",
};
