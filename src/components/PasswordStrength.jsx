import { useMemo, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import zxcvbn from "zxcvbn";
import Graph from "./Graph";
import Policy from "./Policy";
import Findings from "./Findings";
import Advice from "./Advice";
import Rating from "./Rating";
import Generator from "./Generator";
import { Button } from "./styled";

const Shell = styled.div`
  max-width: 500px;
  margin: 2.5rem auto;
  padding: 2rem;
  background: var(--psv-card);
  border-radius: var(--psv-radius);
  box-shadow: var(--psv-shadow);
  border: 2px solid var(--psv-border);
  font-family: "Inter", system-ui, sans-serif;
  position: relative;
`;

const Sparkle = styled.span`
  font-size: 1.3rem;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--psv-text);
  margin-bottom: 1.4rem;
`;

const Meta = styled.div`
  font-weight: 600;
  margin-bottom: 0.4rem;
`;

const badgePop = keyframes` 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } `;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
  padding: 0.3rem 0.6rem;
  background: ${({ theme }) => theme.accentLight};
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 999px;
  font-size: 0.8rem;
  animation: ${badgePop} 0.4s ease;
`;

const BadgeIcon = styled.span`
  font-size: 1rem;
`;

const BadgeLabel = styled.span`
  font-weight: 600;
`;

const Bar = styled.div`
  height: 12px;
  background: #f5e7f0;
  border-radius: 999px;
  margin: 1.2rem 0 0.6rem;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${({ width }) => width}%;
  background: ${({ theme }) => theme.accentStrong};
  transition: width 0.4s ease;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 0.7rem 0.9rem;
  border-radius: 0.7rem;
  border: 2px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  font-size: 1rem;
  transition: ${({ theme }) => theme.transition};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(247, 168, 216, 0.25);
  }
`;

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
    <Shell>
      <Title>
        <Sparkle>✨</Sparkle>
        Password Strength Visualiser
        <Sparkle>✨</Sparkle>
      </Title>

      <Badge>
        <BadgeIcon>{badge.icon}</BadgeIcon>
        <BadgeLabel>{badge.label}</BadgeLabel>
      </Badge>

      <Input>
        <label htmlFor="pwd">Password</label>

        <InputRow>
          <TextInput
            id="pwd"
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Type to analyse…"
          />

          <Button onClick={() => setShowPwd((s) => !s)}>
            {showPwd ? "🙈 Hide" : "👁 Show"}
          </Button>

          <Button onClick={copyToClipboard} disabled={!pwd}>
            📋 Copy
          </Button>

          <Button
            onClick={() => {
              generateCustomPassword(20);
              setShowGenerator(true);
            }}
          >
            ⚡ Generate
          </Button>
        </InputRow>
      </Input>

      <Bar>
        <BarFill
          style={{ width: `${meterPct}%`, background: result?.gradient }}
        />
      </Bar>

      {result && (
        <>
          <Meta>
            {result.label} · {result.entropy} bits
          </Meta>
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
        <Generator
          generateCustomPassword={generateCustomPassword}
          setPwd={setPwd}
          setShowGenerator={setShowGenerator}
          generatedPwd={generatedPwd}
        />
      )}
    </Shell>
  );
};

export default PasswordStrength;
