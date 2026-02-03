import { useMemo, useState, useRef } from "react";
import zxcvbn from "zxcvbn";

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
  const [entropyHistory, setEntropyHistory] = useState([]);
  const graphRef = useRef(null);

  const result = useMemo(() => {
    if (!pwd) return null;

    const zx = zxcvbn(pwd);
    let entropy = zx.guesses_log10 * Math.log2(10);

    // Detect keyboard walk
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

  // Update entropy graph
  useMemo(() => {
    if (result) {
      setEntropyHistory((prev) => [...prev.slice(-29), result.entropy]);
    }
  }, [result]);

  const meterPct = result
    ? Math.min(100, Math.round((result.entropy / 80) * 100))
    : 0;

  const copyToClipboard = () => navigator.clipboard.writeText(pwd);

  const generateStrongPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let out = "";
    for (let i = 0; i < 20; i++)
      out += chars[Math.floor(Math.random() * chars.length)];
    setPwd(out);
  };

  // Mascot mood
  const mascotMood = result?.label ?? "Very weak";
  const mascot = {
    "Very weak": { face: "😵", text: "Oh no… we can do better!" },
    Weak: { face: "😟", text: "Getting there, but still risky." },
    Fair: { face: "😌", text: "Not bad! A bit more oomph?" },
    Strong: { face: "😎", text: "Nice! That’s a solid password." },
    "Very strong": { face: "🦄", text: "Legendary. You’re a password wizard." },
  }[mascotMood];

  // Build smooth curve + fill + sparkles
  const { graphPath, graphFillPath, peakPoints } = useMemo(() => {
    if (!graphRef.current || entropyHistory.length < 2)
      return { graphPath: "", graphFillPath: "", peakPoints: [] };

    const width = graphRef.current.clientWidth;
    const height = 80;

    const points = entropyHistory.map((e, i) => ({
      x: (i / (entropyHistory.length - 1)) * width,
      y: height - (e / 80) * height,
      entropy: e,
    }));

    const peakPoints = points.filter((p, i) => {
      if (i === 0 || i === points.length - 1) return false;
      return (
        p.entropy > points[i - 1].entropy && p.entropy > points[i + 1].entropy
      );
    });

    const path = points.reduce((acc, p, i, arr) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + p.x) / 2;
      return acc + ` C ${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
    }, "");

    const fill = path + ` L ${width},${height} L 0,${height} Z`;

    return { graphPath: path, graphFillPath: fill, peakPoints };
  }, [entropyHistory]);

  return (
    <div className="psv-shell">
      <h1 className="psv-title">
        <span className="sparkle">✨</span>
        Password Strength Visualiser
        <span className="sparkle">✨</span>
      </h1>

      {/* Mascot */}
      <div className="psv-mascot">
        <div className="psv-mascot-face">{mascot.face}</div>
        <div className="psv-mascot-text">{mascot.text}</div>
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

          <button className="psv-btn" onClick={generateStrongPassword}>
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
        </>
      )}

      <div className="psv-divider psv-divider-soft">
        <span className="psv-divider-line" />
        <span className="psv-divider-label">Entrophy Graph</span>
        <span className="psv-divider-line" />
      </div>

      <div className="psv-graph-header">
        <span className="psv-info" tabIndex="0">
          ⓘ
          <span className="psv-tooltip">
            Shows how your password’s entropy changes as you type. Higher =
            stronger. Updates every keystroke.
          </span>
        </span>
      </div>

      <svg ref={graphRef} className="psv-graph" height="80">
        <defs>
          <pattern
            id="psvGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="20" height="20" fill="var(--psv-bg)" />
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--psv-border)"
              strokeWidth="1"
            />
          </pattern>

          <linearGradient id="psvGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#psvGrid)" />

        <path
          className="psv-graph-fill"
          d={graphFillPath}
          fill="url(#psvGradient)"
        />

        <path
          className="psv-graph-line"
          d={graphPath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
        />

        {peakPoints.map((p, i) => (
          <text key={i} x={p.x} y={p.y - 6} className="psv-sparkle">
            ✨
          </text>
        ))}
      </svg>

      {!result && <div className="psv-note">Start typing to see analysis.</div>}

      {result && (
        <>
          <div className="psv-divider">
            <span className="psv-divider-line" />
            <span className="psv-divider-label">Analysis</span>
            <span className="psv-divider-line" />
          </div>

          {result.findings.length ? (
            <div className="psv-findings">
              {result.findings.map((f, i) => (
                <span className="psv-pill" key={i}>
                  🔎 {f.type}: <code>{f.detail}</code>
                </span>
              ))}
            </div>
          ) : (
            <div className="psv-note">No obvious patterns found. Nice!</div>
          )}

          <div className="psv-divider psv-divider-soft">
            <span className="psv-divider-line" />
            <span className="psv-divider-label">Advice</span>
            <span className="psv-divider-line" />
          </div>

          <ul className="psv-advice">
            {result.advice.length ? (
              result.advice.map((a, i) => <li key={i}>{a}</li>)
            ) : (
              <li>
                Looks good! Consider a long passphrase with uncommon words.
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default PasswordStrength;
