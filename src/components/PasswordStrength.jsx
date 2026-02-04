import { useMemo, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import zxcvbn from "zxcvbn";
import Graph from "./Graph";
import Policy from "./Policy";
import Findings from "./Findings";
import Advice from "./Advice";
import Rating from "./Rating";
import { BADGE_MAP, BANDS } from "./constants";
import InputSection from "./InputSection";
import { Note } from "./styled";

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
  width: ${({ pct }) => pct}%;
  background: ${({ gradient }) => gradient},
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.35) 0px,
      rgba(255, 255, 255, 0.35) 2px,
      transparent 2px,
      transparent 6px
    );
  background-blend-mode: overlay;
  background-size: 100% 100%, 200% 200%;
  animation: stripeMove 3s linear infinite;
  transition: width 0.4s ease;

  @keyframes stripeMove {
    from {
      background-position: 0 0, 0 0;
    }
    to {
      background-position: 0 0, 40px 0;
    }
  }
`;

const QWERTY = "qwertyuiopasdfghjklzxcvbnm";

const PasswordStrength = () => {
  const [pwd, setPwd] = useState("");
  const [prevLabel, setPrevLabel] = useState(null);

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
      .slice(0, 3)
      .map((text) => ({ detail: text }));

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

  const generateCustomPassword = (len = 20) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let out = "";
    for (let i = 0; i < len; i++)
      out += chars[Math.floor(Math.random() * chars.length)];
    setGeneratedPwd(out);
  };

  const badge = BADGE_MAP[result?.label ?? "Very weak"];

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

      <InputSection
        pwd={pwd}
        setPwd={setPwd}
        generateCustomPassword={generateCustomPassword}
        generatedPwd={generatedPwd}
      />

      <Bar>
        <BarFill pct={meterPct} gradient={result?.gradient} />
      </Bar>

      {result && (
        <>
          <Meta>
            {result.label} · {result.entropy} bits
          </Meta>
          <Rating result={result} />
        </>
      )}

      {!result && <Note>Start typing to see analysis.</Note>}

      {result && (
        <>
          <Graph result={result} />
          <Policy pwd={pwd} />
          <Findings result={result} />
          <Advice result={result} />
        </>
      )}
    </Shell>
  );
};

export default PasswordStrength;
