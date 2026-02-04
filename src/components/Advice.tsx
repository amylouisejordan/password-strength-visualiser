interface AdviceProps {
  result: { advice: { type: string; detail: string }[] };
}

const Advice = (props: AdviceProps) => {
  const { result } = props;

  return (
    <>
      <div className="psv-divider psv-divider-soft">
        <span className="psv-divider-line" />
        <span className="psv-divider-label">Advice</span>
        <span className="psv-divider-line" />
      </div>

      <ul className="psv-advice">
        {result.advice.length ? (
          result.advice.map((a, i) => <li key={i}>{a.detail}</li>)
        ) : (
          <li>Looks good! Consider a long passphrase with uncommon words.</li>
        )}
      </ul>
    </>
  );
};

export default Advice;
