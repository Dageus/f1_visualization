class Boxplot {
  constructor(data, containerID, tooltipID) {
    this.data = data
    this.containerID = containerID
    this.tooltipID = tooltipID
    this.handlers = {}
    this.margin = { top: 20, right: 40, bottom: 60, left: 90 };
    this.invertedAxis = false
  }


  toggleAxis() {
    this.invertedAxis = !this.invertedAxis;
    this.drawChart(this.currentWidth, this.currentHeight);
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

  update() {

  }

  drawChart(chart_width, chart_height) {
    const { data, tracks, speedRanges } = this.filterData();

    // Clear previous SVG
    d3.select(this.containerID).select("svg").remove();

    // Calculate available space after margins
    const width = chart_width - this.margin.left - this.margin.right;
    const height = chart_height - this.margin.top - this.margin.bottom;

    let x, y;
    const allSpeeds = data.flatMap(d => [d.min, d.q1, d.median, d.q3, d.max]);
    const speedExtent = [d3.min(allSpeeds), d3.max(allSpeeds)];

    if (this.invertedAxis) {
      x = d3.scaleLinear()
        .domain(speedExtent)
        .range([0, width]);

      y = d3.scaleBand()
        .domain(tracks)
        .range([height, 0])
        .padding(0.2);
    } else {
      x = d3.scaleBand()
        .domain(tracks)
        .range([0, width])
        .padding(0.2);

      y = d3.scaleLinear()
        .domain(speedExtent)
        .range([height, 0]);
    }

    // Create SVG with proper dimensions
    const svg = d3.select(this.containerID)
      .append("svg")
      .attr("width", chart_width)
      .attr("height", chart_height)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    // Draw boxes (adjusted for inversion)
    if (this.invertedAxis) {
      svg.selectAll(".box")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "box")
        .attr("y", d => y(d.track))
        .attr("x", d => x(d.q1))
        .attr("height", y.bandwidth())
        .attr("width", d => x(d.q3) - x(d.q1))
        .attr("fill", "#69b3a2")
        .attr("stroke", "black");
    } else {
      svg.selectAll(".box")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "box")
        .attr("x", d => x(d.track))
        .attr("y", d => y(d.q3))
        .attr("width", x.bandwidth())
        .attr("height", d => y(d.q1) - y(d.q3))
        .attr("fill", "#69b3a2")
        .attr("stroke", "black");
    }

    // Draw medians (adjusted for inversion)
    if (this.invertedAxis) {
      svg.selectAll(".median")
        .data(data)
        .enter()
        .append("line")
        .attr("class", "median")
        .attr("y1", d => y(d.track))
        .attr("y2", d => y(d.track) + y.bandwidth())
        .attr("x1", d => x(d.median))
        .attr("x2", d => x(d.median))
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    } else {
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
    }

    // Draw whiskers (adjusted for inversion)
    svg.selectAll(".whisker-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "whisker-group")
      .each(function (d) {
        const g = d3.select(this);

        if (this.invertedAxis) {
          const centerY = y(d.track) + y.bandwidth() / 2;

          // Horizontal whisker lines
          g.append("line")
            .attr("class", "whisker")
            .attr("y1", centerY)
            .attr("y2", centerY)
            .attr("x1", x(d.min))
            .attr("x2", x(d.q1))
            .attr("stroke", "black");

          g.append("line")
            .attr("class", "whisker")
            .attr("y1", centerY)
            .attr("y2", centerY)
            .attr("x1", x(d.q3))
            .attr("x2", x(d.max))
            .attr("stroke", "black");

          // Vertical caps
          g.append("line")
            .attr("class", "whisker-cap")
            .attr("x1", x(d.min))
            .attr("x2", x(d.min))
            .attr("y1", centerY - y.bandwidth() / 4)
            .attr("y2", centerY + y.bandwidth() / 4)
            .attr("stroke", "black");

          g.append("line")
            .attr("class", "whisker-cap")
            .attr("x1", x(d.max))
            .attr("x2", x(d.max))
            .attr("y1", centerY - y.bandwidth() / 4)
            .attr("y2", centerY + y.bandwidth() / 4)
            .attr("stroke", "black");
        } else {
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
        }
      });

    // Add axes (adjusted for inversion)
    if (this.invertedAxis) {
      svg.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y));
    } else {
      svg.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y));
    }

    // Add axis titles (adjusted for inversion)
    if (this.invertedAxis) {
      svg.append("text")
        .attr("class", "axis-title")
        .attr("x", width / 2)
        .attr("y", height + this.margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Speed (km/h)");

      svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", -this.margin.left + 15)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .text("Tracks");
    } else {
      svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-45)")
        .attr("y", -this.margin.left + 30)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .text("Speed (km/h)");

      svg.append("text")
        .attr("class", "axis-title")
        .attr("x", width / 2)
        .attr("y", height + this.margin.bottom - 20)
        .style("text-anchor", "middle")
        .text("Tracks");
    }
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
