class Boxplot {
  constructor(data, containerID, tooltipID) {
    this.data = data
    this.containerID = containerID
    this.tooltipID = tooltipID
    this.handlers = {}
    this.margin = { top: 20, right: 40, bottom: 60, left: 90 };
  }

  init() {
    console.log("[BOXPLOT] Initializing Data")
    this.container = d3.select(this.containerID)
    this.element = document.querySelector(this.containerID)
    const chart_width = this.element.getBoundingClientRect().width;
    const chart_height = this.element.getBoundingClientRect().height;
    console.log("[BOXPLOT] Chart Height:", chart_height);
    console.log("[BOXPLOT] Chart Width:", chart_width);
    this.drawChart(chart_width, chart_height);
  }

  drawChart(chart_width, chart_height) {
    const { data, tracks, speedRanges } = this.filterData();

    d3.select(this.containerID).select("svg").remove();

    const width = chart_width - this.margin.left - this.margin.right;
    const height = chart_height - this.margin.top - this.margin.bottom;

    let x, y;
    const allSpeeds = data.flatMap(d => [d.min, d.q1, d.median, d.q3, d.max]);
    const speedExtent = [d3.min(allSpeeds), d3.max(allSpeeds)];

    x = d3.scaleBand()
      .domain(tracks)
      .range([0, width])
      .padding(0.2);

    y = d3.scaleLinear()
      .domain(speedExtent)
      .range([height, 0]);

    // Create SVG with proper dimensions
    const svg = d3.select(this.containerID)
      .append("svg")
      .attr("width", chart_width)
      .attr("height", chart_height)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    svg.selectAll(".box")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "box")
      .attr("x", d => x(d.track))
      .attr("y", d => y(d.q3))
      .attr("width", x.bandwidth())
      .attr("height", d => y(d.q1) - y(d.q3))
      .attr("fill", "#e51a1a")
      .attr("stroke", "black")

    svg.selectAll(".median")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "median")
      .attr("x1", d => x(d.track))
      .attr("x2", d => x(d.track) + x.bandwidth())
      .attr("y1", d => y(d.median))
      .attr("y2", d => y(d.median))
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Draw whiskers (adjusted for inversion)
    svg.selectAll(".whisker-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "whisker-group")
      .each(function (d) {
        const g = d3.select(this);

        const centerX = x(d.track) + x.bandwidth() / 2;

        // Vertical whisker lines
        g.append("line")
          .attr("class", "whisker")
          .attr("x1", centerX)
          .attr("x2", centerX)
          .attr("y1", y(d.min))
          .attr("y2", y(d.q1))
          .attr("stroke", "black");

        g.append("line")
          .attr("class", "whisker")
          .attr("x1", centerX)
          .attr("x2", centerX)
          .attr("y1", y(d.q3))
          .attr("y2", y(d.max))
          .attr("stroke", "black");

        // Horizontal caps
        g.append("line")
          .attr("class", "whisker-cap")
          .attr("y1", y(d.min))
          .attr("y2", y(d.min))
          .attr("x1", centerX - x.bandwidth() / 4)
          .attr("x2", centerX + x.bandwidth() / 4)
          .attr("stroke", "black");

        g.append("line")
          .attr("class", "whisker-cap")
          .attr("y1", y(d.max))
          .attr("y2", y(d.max))
          .attr("x1", centerX - x.bandwidth() / 4)
          .attr("x2", centerX + x.bandwidth() / 4)
          .attr("stroke", "black");
      });

    svg.append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .attr("class", "axis axis-y")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-45)")
      .attr("y", -this.margin.left + 30)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .text("Speed (km/h)");
  }

  filterData() {
    const byTrack = d3.group(this.data, d => d.circuitName);
    const tracks = Array.from(byTrack.keys()).sort();

    const boxplotData = tracks.map(track => {
      const speeds = byTrack.get(track)
        .map(d => d.fastestLapSpeed)
        .filter(speed => speed != null)
        .sort((a, b) => a - b);

      if (speeds.length === 0) {
        return {
          track,
          min: 0,
          q1: 0,
          median: 0,
          q3: 0,
          max: 0
        };
      }

      // Calculate quartiles
      const min = d3.min(speeds);
      const max = d3.max(speeds);
      const median = d3.quantile(speeds, 0.5);
      const q1 = d3.quantile(speeds, 0.25);
      const q3 = d3.quantile(speeds, 0.75);

      return {
        track,
        min,
        q1,
        median,
        q3,
        max
      };
    });

    return {
      data: boxplotData,
      tracks
    };
  }
}
