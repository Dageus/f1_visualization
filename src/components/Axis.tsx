import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AxisProps {
  scale: d3.AxisScale<any>;
  orient: 'top' | 'right' | 'bottom' | 'left';
  transform?: string;
  tickSize?: number;
  tickFormat?: (d: any) => string;
  tickValues?: any[];
  className?: string;
}

export const Axis: React.FC<AxisProps> = ({
  scale,
  orient,
  transform,
  tickSize = 6,
  tickFormat,
  tickValues,
  className = '',
}) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!ref.current || !scale) return;

    const axisGenerator = {
      bottom: d3.axisBottom,
      left: d3.axisLeft,
      top: d3.axisTop,
      right: d3.axisRight,
    }[orient](scale);

    if (tickFormat) axisGenerator.tickFormat(tickFormat);
    if (tickValues) axisGenerator.tickValues(tickValues);
    axisGenerator.tickSize(tickSize);

    d3.select(ref.current).call(axisGenerator);
  }, [scale, orient, tickSize, tickFormat, tickValues]);

  return <g ref={ref} transform={transform} className={`axis ${className}`} />;
};
