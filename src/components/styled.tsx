import styled from "styled-components";

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--psv-border),
    transparent
  );
`;

export const DividerLabel = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--psv-muted);
  background: var(--psv-card);
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(243, 209, 230, 0.8);
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.6rem 0 0.8rem;
`;

export const DividerSoft = styled.div`
  margin-top: 2rem;
`;

export const Button = styled.button`
  background: ${({ theme }) => theme.accentLight};
  border: 2px solid ${({ theme }) => theme.accent};
  padding: 0.5rem 0.8rem;
  border-radius: 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.accent};
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Note = styled.div`
color: var(--psv-muted);
font-style: italic;
margin-top: 0.6rem;
`;