import { styled } from "styled-components";
import { Divider, DividerLabel, DividerLine, Note } from "./styled";
import { typeColors } from "./constants";
import { theme } from "../theme";

interface Finding {
  type: string;
  detail: string;
}

interface FindingsProps {
  result: { findings: Array<Finding> };
}

const FindingsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.6rem;
  margin-bottom: 1.2rem;
`;

const Pill = styled.span<{ typeKey: string }>`
  background: ${({ typeKey }) => typeColors[typeKey] ?? theme.accentLight};
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--psv-accent);
  font-size: 0.85rem;
  color: var(--psv-text);
  transition: var(--psv-transition);

  &:hover {
    background: var(--psv-accent);
    color: white;
  }
`;

const Findings = (props: FindingsProps) => {
  const { result } = props;

  return (
    <>
      <Divider>
        <DividerLine />
        <DividerLabel>Analysis</DividerLabel>
        <DividerLine />
      </Divider>

      {result.findings.length > 0 ? (
        <FindingsSection>
          {result.findings.map((f) => (
            <Pill typeKey={f.type} key={`${f.type}-${f.detail}`}>
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
