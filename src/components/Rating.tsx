import { styled } from "styled-components";

interface RatingProps {
  result: { entropy: number };
}

const Age = styled.div`
  margin-top: 0.2rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.7rem;
  background: rgba(198, 180, 255, 0.12);
  border: 1px solid rgba(198, 180, 255, 0.5);
  font-size: 0.85rem;
`;

const Label = styled.div`
  font-weight: 600;
  margin-right: 0.25rem;
`;

const Value = styled.div`
  font-weight: 700;
`;

const Detail = styled.div`
  margin-top: 0.2rem;
  color: var(--psv-muted);
`;

const Rating = (props: RatingProps) => {
  const { result } = props;

  const estimatePasswordLifetime = (entropyBits: number) => {
    if (!entropyBits)
      return { label: "Unknown", detail: "Start typing to estimate lifetime." };
    if (entropyBits < 40)
      return {
        label: "Days",
        detail: "This might only resist guessing for days.",
      };
    if (entropyBits < 60)
      return {
        label: "Months",
        detail: "Likely safe for a few months at best.",
      };
    if (entropyBits < 80)
      return { label: "Years", detail: "Could hold up for several years." };
    return {
      label: "Decades+",
      detail:
        "Very strong. Likely safe for decades with current attack models.",
    };
  };

  return (
    <>
      <Age>
        <Label>Estimated lifetime:</Label>
        <Value>
          {estimatePasswordLifetime(result.entropy).label}
        </Value>
        <Detail>
          {estimatePasswordLifetime(result.entropy).detail}
        </Detail>
      </Age>
    </>
  );
};

export default Rating;
