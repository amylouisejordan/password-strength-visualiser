import { useEffect, useMemo, useRef, useState } from "react";

interface GraphProps {
  result: { entropy: number };
}

const Graph = (props: GraphProps) => {
  const { result } = props;
  const graphRef = useRef<SVGSVGElement>(null);
  const [entropyHistory, setEntropyHistory] = useState<number[]>([]);

  const { graphPath, graphFillPath } = useMemo(() => {
    if (!graphRef.current || entropyHistory.length < 2)
      return {
        graphPath: "",
        graphFillPath: "",
        peakPoints: [],
        replayPath: "",
      };

    const width = graphRef.current.clientWidth;
    const height = 80;

    const points = entropyHistory.map((e, i) => ({
      x: (i / (entropyHistory.length - 1)) * width,
      y: height - (e / 80) * height,
      entropy: e,
    }));

    const buildPath = (pts: any[]) =>
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
      setEntropyHistory((prev) => [...prev.slice(-29), result.entropy]);
    }
  }, [result]);

  return (
    <>
      <div className="psv-graph-header">
        <span className="psv-sub">Entropy Graph</span>

        <div className="psv-graph-actions">
          <span className="psv-info" tabIndex={0}>
            ⓘ
            <span className="psv-tooltip">
              Shows how your password’s entropy changes as you type. Higher =
              stronger. Updates every keystroke.
            </span>
          </span>
        </div>
      </div>
      <svg ref={graphRef} className="psv-graph" height="80">
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

        <path
          className="psv-graph-fill"
          d={graphFillPath}
          fill="url(#psvGradient)"
        />

        <path
          className="psv-graph-line"
          d={graphPath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
        />
      </svg>
    </>
  );
};

export default Graph;
