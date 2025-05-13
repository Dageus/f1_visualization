import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ScatterPlot({ data, width, height }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);

    // Clear previous renders
    svg.selectAll('*').remove();

    // Add your D3 visualization code here
    const xScale = d3.scaleLinear()
      .domain([1, 20])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([1, 20])
      .range([height, 0]);

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
