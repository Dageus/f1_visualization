// components/charts/NationalityHeatmap.jsx
export default function Heatmap({ data }) {
	const ref = useRef();

	useEffect(() => {
		const colorScale = d3.scaleSequential()
			.domain([0, d3.max(data, d => d.points)])
			.interpolator(d3.interpolateBlues);

		d3.select(ref.current)
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('fill', d => colorScale(d.points));
	}, [data]);

	return <svg ref={ref} />;
}
