import styled from "styled-components";
import { Button } from "./styled";
import { useState } from "react";
import Generator from "./Generator";

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 0.7rem 0.9rem;
  border-radius: 0.7rem;
  border: 2px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  font-size: 1rem;
  transition: ${({ theme }) => theme.transition};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(247, 168, 216, 0.25);
  }
`;

interface InputSectionProps {
  pwd: string;
  setPwd: (pwd: string) => void;
  generateCustomPassword: (length: number) => void;
  setShowGenerator: (show: boolean) => void;
  generatedPwd: string;
}

const InputSection = (props: InputSectionProps) => {
  const {
    pwd,
    setPwd,
    generateCustomPassword,
    generatedPwd,
  } = props;
  const [showPwd, setShowPwd] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const copyToClipboard = () => navigator.clipboard.writeText(pwd);

  return (
    <>
      <Input>
        <label htmlFor="pwd">Password</label>

        <InputRow>
          <TextInput
            id="pwd"
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Type to analyse…"
          />

          <Button onClick={() => setShowPwd((s) => !s)}>
            {showPwd ? "🙈 Hide" : "👁 Show"}
          </Button>

          <Button onClick={copyToClipboard} disabled={!pwd}>
            📋 Copy
          </Button>

          <Button
            onClick={() => {
              generateCustomPassword(20);
              setShowGenerator(true);
            }}
          >
            ⚡ Generate
          </Button>
        </InputRow>
      </Input>

      {showGenerator && (
        <Generator
          generateCustomPassword={generateCustomPassword}
          setPwd={setPwd}
          setShowGenerator={setShowGenerator}
          generatedPwd={generatedPwd}
        />
      )}
    </>
  );
};

export default InputSection;
