import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ScatterPlot({ data, width, height }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([1, 20]) // Grid positions
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([1, 20]) // Finish positions
      .range([height, 0]);

    // Draw circles
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale(d.grid))
      .attr('cy', d => yScale(d.positionOrder))
      .attr('r', 5)
      .attr('fill', '#ff5722');

  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
