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
      ...zx.sequence.slice(0, 4).map((m) => ({
        type: m.pattern,
        detail: m.token,
      })),
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
      setEntropyHistory((prev) => [...prev.slice(-29), result.entropy]); // keep last 30 points
    }
  }, [result]);

  const meterPct = result
    ? Math.min(100, Math.round((result.entropy / 80) * 100))
    : 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pwd);
  };

  const generateStrongPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let out = "";
    for (let i = 0; i < 20; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    setPwd(out);
  };

  const svgWidth = graphRef.current?.clientWidth ?? 300;

  return (
    <div className="psv-shell">
      <h1 className="psv-title">
        <span className="sparkle">✨</span>
        Password Strength Visualiser
        <span className="sparkle">✨</span>
      </h1>

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

          <button
            type="button"
            className="psv-btn"
            onClick={() => setShowPwd((s) => !s)}
          >
            {showPwd ? "🙈 Hide" : "👁 Show"}
          </button>

          <button
            type="button"
            className="psv-btn"
            onClick={copyToClipboard}
            disabled={!pwd}
          >
            📋 Copy
          </button>

          <button
            type="button"
            className="psv-btn"
            onClick={generateStrongPassword}
          >
            ⚡ Generate
          </button>
        </div>
      </div>

      {/* Strength bar */}
      <div className="psv-bar" aria-hidden>
        <div
          className="psv-bar-fill"
          style={{
            width: `${meterPct}%`,
            background: result?.gradient,
          }}
        />
      </div>

      <div className="psv-graph-header">
        <span className="psv-sub">Entropy Graph</span>

        <span className="psv-info" tabIndex="0">
          ⓘ
          <span className="psv-tooltip">
            Shows how your password’s entropy changes as you type. Higher =
            stronger. Updates every keystroke.
          </span>
        </span>
      </div>

      {/* Live entropy graph */}
      <svg ref={graphRef} width="100%" height="60" className="psv-graph">
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          points={entropyHistory
            .map((e, i) => {
              const x = (i / 29) * svgWidth;
              const y = 60 - (e / 80) * 60;
              return `${x},${y}`;
            })
            .join(" ")}
        />
      </svg>

      {!result && <div className="psv-note">Start typing to see analysis.</div>}

      {result && (
        <>
          <div className="psv-meta">
            {result.label} · {result.entropy} bits
          </div>

          <div className="psv-sub">FINDINGS</div>
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

          <div className="psv-sub">ADVICE</div>
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
