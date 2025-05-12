// components/charts/OvertakingScatterPlot.jsx
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ScatterPlot({ data, width, height }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    // D3 for scales and calculations
    const xScale = d3.scaleLinear()
      .domain([1, 20]) // Grid positions
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([1, 20]) // Finish positions
      .range([height, 0]);

    // React handles rendering
    const svg = d3.select(svgRef.current);
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale(d.grid))
      .attr('cy', d => yScale(d.positionOrder))
      .attr('r', 5);
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
