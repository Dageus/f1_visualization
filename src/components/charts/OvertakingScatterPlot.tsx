import * as d3 from 'd3';
import { useMemo } from 'react';
import { Axis } from '../Axis';

type ScatterplotProps = {
  data: {
    x: number;
    y: number;
    driverName: string;
    constructorName: string;
    status: "Finished" | "DNF";
    positionDelta: number;
    fastestLapRank: number;
  }[];
};

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

export default function ScatterPlot({ data }: ScatterplotProps) {

  // Constants
  const width = 1000;
  const height = 600;
  const margin = { top: 20, right: 120, bottom: 60, left: 150 };

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Memoized scales
  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([1, 20]) // Grid positions (1-20)
      .range([0, boundsWidth]);
  }, [boundsWidth]);

  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([1, 20]) // Finish positions (1-20)
      .range([boundsHeight, 0]);
  }, [boundsHeight]);

  // Color scale for constructors
  const colorScale = useMemo(() => {
    const constructors = Array.from(new Set(data.map(d => d.constructorName)));
    return d3.scaleOrdinal()
      .domain(constructors)
      .range(d3.schemeTableau10);
  }, [data]);

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* X axis */}
          <Axis
            scale={xScale}
            orient="bottom"
            transform={`translate(0,${height - margin.top - margin.bottom})`}
            tickFormat={(d) => `${d}s`}
            className="text-gray-500"
          />
          <text
            x={(width - margin.left - margin.right) / 2}
            y={height - margin.bottom + 40}
            textAnchor="middle"
            className="text-lg font-semibold fill-current"
          >
            Placeholder for variables
          </text>

          {/* Y-Axis (Drivers) */}
          <Axis
            scale={yScale}
            orient="left"
            tickSize={0}
            className="text-gray-500"
          />
        </g>
      </svg>
    </div>
  );
}
