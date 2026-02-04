import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

interface GraphProps {
  result: { entropy: number };
}

interface Point {
  x: number;
  y: number;
  entropy: number;
}

const GraphSection = styled.svg`
  width: 100%;
  border-radius: 0.8rem;
  border: 2px solid var(--psv-border);
  overflow: hidden;
  background: var(--psv-bg);
`;

const GraphHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.2rem;
  margin-bottom: 0.4rem;
`;

const GraphActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
`;

const BasePath = styled.path`
  transition: d 0.4s ease;
`;

const GraphLine = BasePath;
const GraphFill = BasePath;

const Tooltip = styled.span`
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  background: white;
  border: 1px solid var(--psv-border);
  padding: 0.6rem 0.8rem;
  border-radius: 0.6rem;
  font-size: 0.75rem;
  width: 200px;
  box-shadow: var(--psv-shadow);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 10;
`;

const Info = styled.span`
  position: relative;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  background: var(--psv-accent-light);
  border: 1px solid var(--psv-accent);
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover ${Tooltip}, &:focus ${Tooltip} {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const Sub = styled.span`
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--psv-muted);
`;

const Graph = (props: GraphProps) => {
  const { result } = props;
  const graphRef = useRef<SVGSVGElement>(null);
  const historyRef = useRef<number[]>([]);
  const [entropyHistory, setEntropyHistory] = useState<number[]>([]);

  const { graphPath, graphFillPath } = useMemo(() => {
    if (!graphRef.current || entropyHistory.length < 2)
      return {
        graphPath: "",
        graphFillPath: "",
        peakPoints: [],
      };

    const width = graphRef.current.clientWidth;
    const height = 80;

    const points = entropyHistory.map((e, i) => ({
      x: (i / (entropyHistory.length - 1)) * width,
      y: height - (e / 80) * height,
      entropy: e,
    }));

    const buildPath = (pts: Point[]) =>
      pts.reduce((acc, p, i, arr) => {
        if (i === 0) return `M ${p.x},${p.y}`;
        const prev = arr[i - 1];
        const cx = (prev.x + p.x) / 2;
        return acc + ` C ${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
      }, "");

    const path = buildPath(points);
    const fill = path + ` L ${width},${height} L 0,${height} Z`;

    return { graphPath: path, graphFillPath: fill };
  }, [entropyHistory]);

  useEffect(() => {
    if (result) {
      historyRef.current = [...historyRef.current.slice(-29), result.entropy];
      setEntropyHistory([...historyRef.current]);
    }
  }, [result]);

  useEffect(() => {
    if (!graphRef.current) return;

    const observer = new ResizeObserver(() => {
      setEntropyHistory((prev) => [...prev]);
    });

    observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GraphHeader>
        <Sub>Entropy Graph</Sub>

        <GraphActions>
          <Info
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.currentTarget.classList.toggle("active");
              }
            }}
          >
            ⓘ
            <Tooltip>
              Shows how your password’s entropy changes as you type. Higher =
              stronger. Updates every keystroke.
            </Tooltip>
          </Info>
        </GraphActions>
      </GraphHeader>

      <GraphSection ref={graphRef} height="80">
        <defs>
          <pattern
            id="psvGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="20" height="20" fill="var(--psv-bg)" />
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--psv-border)"
              strokeWidth="1"
            />
          </pattern>

          <linearGradient id="psvGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#psvGrid)" />

        <GraphFill d={graphFillPath} fill="url(#psvGradient)" />

        <GraphLine d={graphPath} fill="none" stroke="#6366f1" strokeWidth="3" />
      </GraphSection>
    </>
  );
};

export default Graph;
