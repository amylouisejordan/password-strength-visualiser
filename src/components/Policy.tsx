import { useMemo, useState } from "react";

interface PolicyProps {
  pwd: string;
}

const Policy = (props: PolicyProps) => {
  const { pwd } = props;

  const [policy, setPolicy] = useState({
    minLength: 12,
    requireUpper: true,
    requireLower: true,
    requireNumber: true,
    requireSymbol: false,
  });

  const policyResult = useMemo(() => {
    if (!pwd) return null;

    const issues: string[] = [];

    if (pwd.length < policy.minLength) {
      issues.push(`Needs at least ${policy.minLength} characters.`);
    }
    if (policy.requireUpper && !/[A-Z]/.test(pwd)) {
      issues.push("Add at least one uppercase letter.");
    }
    if (policy.requireLower && !/[a-z]/.test(pwd)) {
      issues.push("Add at least one lowercase letter.");
    }
    if (policy.requireNumber && !/[0-9]/.test(pwd)) {
      issues.push("Add at least one number.");
    }
    if (policy.requireSymbol && !/[^\w]/.test(pwd)) {
      issues.push("Add at least one symbol.");
    }

    return {
      passes: issues.length === 0,
      issues,
    };
  }, [pwd, policy]);

  return (
    <>
      <div className="psv-divider psv-divider-soft">
        <span className="psv-divider-line" />
        <span className="psv-divider-label">Policy check</span>
        <span className="psv-divider-line" />
      </div>

      <div className="psv-policy">
        <div className="psv-policy-controls">
          <label>
            Min length
            <input
              type="number"
              min="4"
              max="64"
              value={policy.minLength}
              onChange={(e) =>
                setPolicy((p) => ({
                  ...p,
                  minLength: Number(e.target.value) || 0,
                }))
              }
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={policy.requireUpper}
              onChange={(e) =>
                setPolicy((p) => ({ ...p, requireUpper: e.target.checked }))
              }
            />
            Uppercase
          </label>

          <label>
            <input
              type="checkbox"
              checked={policy.requireLower}
              onChange={(e) =>
                setPolicy((p) => ({ ...p, requireLower: e.target.checked }))
              }
            />
            Lowercase
          </label>

          <label>
            <input
              type="checkbox"
              checked={policy.requireNumber}
              onChange={(e) =>
                setPolicy((p) => ({
                  ...p,
                  requireNumber: e.target.checked,
                }))
              }
            />
            Number
          </label>

          <label>
            <input
              type="checkbox"
              checked={policy.requireSymbol}
              onChange={(e) =>
                setPolicy((p) => ({
                  ...p,
                  requireSymbol: e.target.checked,
                }))
              }
            />
            Symbol
          </label>
        </div>

        {pwd && policyResult && (
          <div
            className={`psv-policy-status ${
              policyResult.passes ? "ok" : "fail"
            }`}
          >
            {policyResult.passes ? (
              <span>✅ Meets current policy.</span>
            ) : (
              <>
                <span>⚠ Doesn’t meet policy:</span>
                <ul>
                  {policyResult.issues.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Policy;
