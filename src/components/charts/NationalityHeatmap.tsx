type HeatmapProps = {
  width: number;
  height: number;
  data: {
    x: number;
    y: number;
    driverName: string;
    driverNationality: string;
    circuitCountry: string;
    points: number;
  }[];
};

export default function Heatmap({ data, width, height }: HeatmapProps) {
  return (
    <svg ref={svgRef} width={width} height={height} />
  );
}
