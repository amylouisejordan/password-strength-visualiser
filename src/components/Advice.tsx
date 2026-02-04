import styled from "styled-components";
import { Divider, DividerLabel, DividerLine, DividerSoft } from "./styled";

interface AdviceProps {
  result: { advice: { type: string; detail: string }[] };
}

const AdviceSection = styled.div`
  margin-top: 0.6rem;
  padding-left: 1.2rem;

  li {
    margin-bottom: 0.5rem;
    color: var(--psv-text);
  }
`;

const Advice = (props: AdviceProps) => {
  const { result } = props;

  return (
    <>
      <DividerSoft>
        <Divider>
          <DividerLine />
          <DividerLabel>Advice</DividerLabel>
          <DividerLine />
        </Divider>
      </DividerSoft>

      <AdviceSection>
        {result.advice.length ? (
          result.advice.map((a, i) => <li key={i}>{a.detail}</li>)
        ) : (
          <li>Looks good! Consider a long passphrase with uncommon words.</li>
        )}
      </AdviceSection>
    </>
  );
};

export default Advice;
