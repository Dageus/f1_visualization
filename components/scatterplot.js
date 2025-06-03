class Scatterplot {
  constructor(data, containerID, tooltipID) {
    this.data = data
    this.containerID = containerID
    this.tooltipID = tooltipID
    this.handlers = {}
    this.margin = { top: 10, right: 40, bottom: 60, left: 50 };
  }

  init() {
    // filter data for the year we want
    console.log("[SCATTERPLOT] Initializing Data")
    this.container = d3.select(this.containerID)
    this.element = document.querySelector(this.containerID)
    const chart_width = this.element.getBoundingClientRect().width;
    const chart_height = this.element.getBoundingClientRect().height;
    console.log("[SCATTERPLOT] Chart Height:", chart_height);
    console.log("[SCATTERPLOT] Chart Width:", chart_width);
    this.drawChart(chart_width, chart_height);
  }

  drawChart(chart_width, chart_height) {
    const filteredData = this.filterData()
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 20);

    console.log("filtered data:", filteredData.slice(0, 2));

    // Clear previous SVG
    d3.select(this.containerID).select("svg").remove();

    // Calculate available space after margins
    const width = chart_width - this.margin.left - this.margin.right;
    const height = chart_height - this.margin.top - this.margin.bottom;

    const svg = d3.select(this.containerID)
      .append("svg")
      .attr("width", chart_width)
      .attr("height", chart_height)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    const maxRaces = d3.max(filteredData, d => d.races);
    const maxPoints = d3.max(filteredData, d => d.totalPoints);

    const x = d3.scaleLinear()
      .domain([0, maxPoints * 1.1])
      .range([0, width])
      .nice();

    const y = d3.scaleLinear()
      .domain([0, maxRaces * 1.1])
      .range([height, 0])
      .nice();

    // Color and size scales
    const colorScale = d3.scaleSequential(d3.interpolatePlasma)
      .domain([0, filteredData.length - 1]);

    const size = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d.avgPointsPerRace))
      .range([15, 45]);

    svg.append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dy", "1em");

    svg.append("g")
      .attr("class", "axis axis-y")
      .call(d3.axisLeft(y));

    // Create bubbles
    const bubbles = svg.append('g')
      .selectAll(".bubble")
      .data(filteredData)
      .enter()
      .append("g")
      .attr("class", "bubble");

    // Add circles
    bubbles.append("circle")
      .attr("cx", d => x(d.totalPoints))
      .attr("cy", d => y(d.races))
      .attr("r", d => size(d.avgPointsPerRace))
      .style("fill", (d, i) => colorScale(i))
      .style("opacity", 0.7)
      .style("stroke", "#333")
      .style("stroke-width", 1.5);

    // Add initials
    bubbles.each(function (d) {
      const bubbleSize = size(d.avgPointsPerRace);
      const g = d3.select(this);
      const textColor = d.totalPoints < 1000 ? "#333" : "white";
      const textWeight = d.totalPoints < 1000 ? "normal" : "bold";

      if (bubbleSize >= 15) {
        g.append("text")
          .attr("x", x(d.totalPoints))
          .attr("y", y(d.races))
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .text(() => {
            const foreInitial = d.forename ? d.forename[0] : '';
            const surInitial = d.surname ? d.surname[0] : '';
            return `${foreInitial}${surInitial}`.toUpperCase();
          })
          .style("fill", textColor)
          .style("font-weight", textWeight)
          .style("font-size", Math.min(bubbleSize * 0.5, 16) + "px")
          .style("pointer-events", "none");
      }
    });

    // average points reference line
    const avgPoints = d3.mean(filteredData, d => d.totalPoints);
    const avgRaces = d3.mean(filteredData, d => d.races);

    const slope = avgPoints / avgRaces;

    // Calculate where line would intersect top of chart (y = 0)
    const maxX = slope * (maxRaces * 1.1);

    // Draw extended average line
    svg.append("line")
      .attr("class", "average-line")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", x(maxX))
      .attr("y2", 0)
      .attr("stroke", "#666")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,2")
      .style("opacity", 0.7);

    // Add axis labels
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + this.margin.bottom - 20)
      .style("text-anchor", "middle")
      .text("Total Points Scored");

    svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", -this.margin.left + 15)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .text("Number of Races");

    const tooltip = d3.select(this.tooltipID)
      .style("position", "absolute")
      .style("opacity", 0);

    bubbles.on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.95);

      tooltip.html(`
          <div class="tooltip-header">${d.forename} ${d.surname}</div>
          <div class="tooltip-row">
            <span class="tooltip-label">Races:</span>
            <span class="tooltip-value">${d.races}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">Total Points:</span>
            <span class="tooltip-value">${d.totalPoints}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">Avg Points:</span>
            <span class="tooltip-value">${d.avgPointsPerRace.toFixed(2)}</span>
          </div>
        `)
        .style("left", (event.clientX + 10) + "px")
        .style("top", (event.clientY - 28) + "px");
    })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.clientX + 10) + "px")
          .style("top", (event.clientY - 28) + "px");
      });
  }

  filterData() {
    const byDriver = d3.group(this.data, d => d.driverRef);

    const driverStats = Array.from(byDriver, ([driver, races]) => {
      const totalPoints = d3.sum(races, d => d.points || 0);
      const raceCount = races.length;
      const avgPointsPerRace = totalPoints / raceCount;

      return {
        driver,
        races: raceCount,
        forename: races[0].forename || '',
        surname: races[0].surname || '',
        totalPoints,
        avgPointsPerRace
      };
    });

    // Sort by total points descending
    return driverStats.sort((a, b) => b.totalPoints - a.totalPoints);
  }

  update() {

  }
}
