import styled from "styled-components";
import { Button } from "./styled";
import { useEffect, useRef } from "react";

interface GeneratorProps {
  generateCustomPassword: (length: number) => void;
  setPwd: (pwd: string) => void;
  setShowGenerator: (show: boolean) => void;
  generatedPwd: string;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease;
  z-index: 50;
`;

const Modal = styled.div`
  background: var(--psv-card);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px solid var(--psv-border);
  box-shadow: var(--psv-shadow);
  width: 320px;
  animation: popIn 0.25s ease;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
`;

const Output = styled.div`
  margin: 1rem 0;
  padding: 0.6rem;
  background: var(--psv-bg);
  border-radius: 0.6rem;
  border: 1px solid var(--psv-border);
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const RangeInput = styled.input.attrs({ type: "range" })`
  width: 100%;
  margin-top: 0.3rem;
`;

const Generator = (props: GeneratorProps) => {
  const { generateCustomPassword, setPwd, setShowGenerator, generatedPwd } =
    props;

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowGenerator(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    firstInputRef.current?.focus();

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowGenerator(false);
      if (e.key === "Enter") {
        setPwd(generatedPwd);
        setShowGenerator(false);
      }
      if (e.key.toLowerCase() === "r") generateCustomPassword(20);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedPwd]);

  return (
    <>
      <Backdrop onClick={() => setShowGenerator(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Title>Generate Password</Title>

          <Label>
            Length
            <RangeInput
              ref={firstInputRef}
              min="8"
              max="32"
              defaultValue="20"
              onChange={(e) => generateCustomPassword(Number(e.target.value))}
            />
          </Label>

          <Output>{generatedPwd}</Output>

          <Actions>
            <Button onClick={() => generateCustomPassword(20)}>
              🔁 Regenerate
            </Button>
            <Button
              onClick={() => {
                setPwd(generatedPwd);
                setShowGenerator(false);
              }}
            >
              ✅ Use this password
            </Button>
          </Actions>
        </Modal>
      </Backdrop>
    </>
  );
};

export default Generator;
