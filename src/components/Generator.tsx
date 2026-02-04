interface GeneratorProps {
  generateCustomPassword: (length: number) => void;
  setPwd: (pwd: string) => void;
  setShowGenerator: (show: boolean) => void;
  generatedPwd: string;
}

const Generator = (props: GeneratorProps) => {
  const { generateCustomPassword, setPwd, setShowGenerator, generatedPwd } =
    props;

  return (
    <>
      <div
        className="psv-modal-backdrop"
        onClick={() => setShowGenerator(false)}
      >
        <div className="psv-modal" onClick={(e) => e.stopPropagation()}>
          <h3 className="psv-modal-title">Generate Password</h3>

          <label className="psv-modal-label">
            Length
            <input
              type="range"
              min="8"
              max="32"
              defaultValue="20"
              onChange={(e) => generateCustomPassword(Number(e.target.value))}
            />
          </label>

          <div className="psv-modal-output">{generatedPwd}</div>

          <div className="psv-modal-actions">
            <button
              className="psv-btn"
              type="button"
              onClick={() => generateCustomPassword(20)}
            >
              🔁 Regenerate
            </button>
            <button
              className="psv-btn"
              type="button"
              onClick={() => {
                setPwd(generatedPwd);
                setShowGenerator(false);
              }}
            >
              ✅ Use this password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Generator;
