import { useMemo, useState } from "react";
import styled from "styled-components";
import { Divider, DividerLabel, DividerLine, DividerSoft } from "./styled";

interface PolicyProps {
  pwd: string;
}

export const PolicySection = styled.div`
  margin-top: 0.8rem;
  padding: 0.8rem;
  border-radius: 0.8rem;
  background: #fffafc;
  border: 1px dashed var(--psv-border);
  font-size: 0.85rem;
`;

export const PolicyControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  align-items: center;
  margin-bottom: 0.6rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  input[type="number"] {
    width: 3.2rem;
    padding: 0.2rem 0.3rem;
    border-radius: 0.4rem;
    border: 1px solid var(--psv-border);
    font-size: 0.8rem;
  }
`;

export const PolicyStatus = styled.div<{ ok?: boolean }>`
  padding: 0.5rem 0.7rem;
  border-radius: 0.6rem;

  ${({ ok }) =>
    ok
      ? `
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.4);
  `
      : `
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.4);
  `}

  ul {
    margin: 0.3rem 0 0;
    padding-left: 1.1rem;
  }
`;

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
      <DividerSoft>
        <Divider>
          <DividerLine />
          <DividerLabel>Policy check</DividerLabel>
          <DividerLine />
        </Divider>
      </DividerSoft>

      <PolicySection>
        <PolicyControls>
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
        </PolicyControls>

        {pwd && policyResult && (
          <PolicyStatus ok={policyResult.passes}>
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
          </PolicyStatus>
        )}
      </PolicySection>
    </>
  );
};

export default Policy;
