import styled from "styled-components";
import { Divider, DividerLabel, DividerLine, DividerSoft } from "./styled";

interface AdviceProps {
  result: { advice: { detail: string }[] };
}

const AdviceSection = styled.ul`
  margin-top: 0.6rem;
  padding-left: 1.2rem;
  list-style: disc;

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
        {result.advice
          .filter((a) => a.detail && a.detail.trim().length > 0)
          .map((a) => (
            <li key={a.detail}>{a.detail}</li>
          ))}
      </AdviceSection>
    </>
  );
};

export default Advice;
