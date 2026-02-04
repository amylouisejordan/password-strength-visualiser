interface FindingsProps {
  result: { findings: { type: string; detail: string }[] };
}

const Findings = (props: FindingsProps) => {
  const { result } = props;

  return (
    <>
      <div className="psv-divider">
        <span className="psv-divider-line" />
        <span className="psv-divider-label">Analysis</span>
        <span className="psv-divider-line" />
      </div>

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
    </>
  );
};

export default Findings;
