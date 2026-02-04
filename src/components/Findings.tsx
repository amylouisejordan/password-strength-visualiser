import { styled } from "styled-components";
import { DividerLabel, DividerLine } from "./styled";

interface FindingsProps {
  result: { findings: { type: string; detail: string }[] };
}

const FindingsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.6rem;
  margin-bottom: 1.2rem;
`;

const Pill = styled.span`
  background: var(--psv-accent-light);
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--psv-accent);
  font-size: 0.85rem;
  color: var(--psv-text);
  transition: var(--psv-transition);

  hover {
    background: var(--psv-accent);
    color: white;
  }
`;

const Note = styled.div`
  color: var(--psv-muted);
  font-style: italic;
  margin-top: 0.6rem;
`;

const Findings = (props: FindingsProps) => {
  const { result } = props;

  return (
    <>
      <div className="psv-divider">
        <DividerLine />
        <DividerLabel>Analysis</DividerLabel>
        <DividerLine />
      </div>

      {result.findings.length ? (
        <FindingsSection>
          {result.findings.map((f, i) => (
            <Pill key={i}>
              🔎 {f.type}: <code>{f.detail}</code>
            </Pill>
          ))}
        </FindingsSection>
      ) : (
        <Note>No obvious patterns found. Nice!</Note>
      )}
    </>
  );
};

export default Findings;
