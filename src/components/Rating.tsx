interface RatingProps {
  result: { entropy: number };
}

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
      <div className="psv-age">
        <span className="psv-age-label">Estimated lifetime:</span>
        <span className="psv-age-value">
          {estimatePasswordLifetime(result.entropy).label}
        </span>
        <div className="psv-age-detail">
          {estimatePasswordLifetime(result.entropy).detail}
        </div>
      </div>
    </>
  );
};

export default Rating;
