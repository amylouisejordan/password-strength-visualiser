import { useMemo, useState, useEffect } from "react";
import zxcvbn from "zxcvbn";
import Graph from "./Graph";
import Policy from "./Policy";
import Findings from "./Findings";
import Advice from "./Advice";
import Rating from "./Rating";

const BANDS = [
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

const QWERTY = "qwertyuiopasdfghjklzxcvbnm";

const PasswordStrength = () => {
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [prevLabel, setPrevLabel] = useState(null);

  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedPwd, setGeneratedPwd] = useState("");

  const result = useMemo(() => {
    if (!pwd) return null;

    const zx = zxcvbn(pwd);
    let entropy = zx.guesses_log10 * Math.log2(10);

    const letters = pwd.toLowerCase().replace(/[^a-z]/g, "");
    let longestWalk = 1;
    let run = 1;

    for (let i = 1; i < letters.length; i++) {
      const diff = Math.abs(
        QWERTY.indexOf(letters[i]) - QWERTY.indexOf(letters[i - 1])
      );
      if (diff === 1) run++;
      else {
        longestWalk = Math.max(longestWalk, run);
        run = 1;
      }
    }
    longestWalk = Math.max(longestWalk, run);

    const hasWalk = longestWalk >= 4;
    if (hasWalk) entropy -= 10;

    const band = BANDS.find((b) => entropy >= b.min);

    const findings = [
      ...(hasWalk
        ? [
            {
              type: "keyboard-sequence",
              detail: `sequence length ${longestWalk}`,
            },
          ]
        : []),
      ...zx.sequence
        .slice(0, 4)
        .map((m) => ({ type: m.pattern, detail: m.token })),
    ];

    const advice = [
      ...(hasWalk
        ? ["Break keyboard sequences with unrelated words/symbols."]
        : []),
      zx.feedback.warning,
      ...(zx.feedback.suggestions ?? []),
    ]
      .filter(Boolean)
      .slice(0, 3);

    return {
      entropy: Math.max(0, Math.round(entropy)),
      label: band.label,
      gradient: band.gradient,
      findings,
      advice,
    };
  }, [pwd]);

  useEffect(() => {
    if (!result) return;

    if (
      prevLabel &&
      BANDS.findIndex((b) => b.label === result.label) <
        BANDS.findIndex((b) => b.label === prevLabel)
    )
      setPrevLabel(result.label);
  }, [result, prevLabel]);

  const meterPct = result
    ? Math.min(100, Math.round((result.entropy / 80) * 100))
    : 0;

  const copyToClipboard = () => navigator.clipboard.writeText(pwd);

  const generateCustomPassword = (len = 20) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let out = "";
    for (let i = 0; i < len; i++)
      out += chars[Math.floor(Math.random() * chars.length)];
    setGeneratedPwd(out);
  };

  const mascotMood = result?.label ?? "Very weak";

  const badge = {
    "Very weak": { icon: "🥀", label: "Beginner" },
    Weak: { icon: "🌱", label: "Trying" },
    Fair: { icon: "🌼", label: "Getting Stronger" },
    Strong: { icon: "🌟", label: "Secure" },
    "Very strong": { icon: "🏆", label: "Master of Passwords" },
  }[mascotMood];

  return (
    <div className="psv-shell">
      <h1 className="psv-title">
        <span className="sparkle">✨</span>
        Password Strength Visualiser
        <span className="sparkle">✨</span>
      </h1>

      <div className="psv-badge">
        <span className="psv-badge-icon">{badge.icon}</span>
        <span className="psv-badge-label">{badge.label}</span>
      </div>

      <div className="psv-input">
        <label htmlFor="pwd">Password</label>

        <div className="psv-input-row">
          <input
            id="pwd"
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Type to analyse…"
          />

          <button className="psv-btn" onClick={() => setShowPwd((s) => !s)}>
            {showPwd ? "🙈 Hide" : "👁 Show"}
          </button>

          <button className="psv-btn" onClick={copyToClipboard} disabled={!pwd}>
            📋 Copy
          </button>

          <button
            className="psv-btn"
            onClick={() => {
              generateCustomPassword(20);
              setShowGenerator(true);
            }}
          >
            ⚡ Generate
          </button>
        </div>
      </div>

      <div className="psv-bar">
        <div
          className="psv-bar-fill"
          style={{ width: `${meterPct}%`, background: result?.gradient }}
        />
      </div>

      {result && (
        <>
          <div className="psv-meta">
            {result.label} · {result.entropy} bits
          </div>
          <Rating result={result} />
        </>
      )}

      {!result && <div className="psv-note">Start typing to see analysis.</div>}

      {result && (
        <>
          <Graph result={result} />
          <Policy pwd={pwd} />
          <Findings result={result} />
          <Advice result={result} />
        </>
      )}

      {showGenerator && (
        <div
          className="psv-modal-backdrop"
          onClick={() => setShowGenerator(false)}
        >
          <div className="psv-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="psv-modal-title">Generate Password</h3>

            <label className="psv-modal-label">
              Length
              <input
                type="range"
                min="8"
                max="32"
                defaultValue="20"
                onChange={(e) => generateCustomPassword(Number(e.target.value))}
              />
            </label>

            <div className="psv-modal-output">{generatedPwd}</div>

            <div className="psv-modal-actions">
              <button
                className="psv-btn"
                type="button"
                onClick={() => generateCustomPassword(20)}
              >
                🔁 Regenerate
              </button>
              <button
                className="psv-btn"
                type="button"
                onClick={() => {
                  setPwd(generatedPwd);
                  setShowGenerator(false);
                }}
              >
                ✅ Use this password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
