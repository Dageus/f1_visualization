class Slopegraph {

  constructor(data, containerID, tooltipID) {
    this.data = data
    this.containerID = containerID
    this.tooltipID = tooltipID
    this.handlers = {}
    this.currentYear = 2024
    this.timeCategories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    this.margin = { top: 20, right: 20, bottom: 60, left: 20 };
  }

  init() {
    // filter data for the year we want
    console.log("[SLOPEGRAPH] Initializing Data")
    this.container = d3.select(this.containerID)
    this.element = document.querySelector(this.containerID)
    const chart_width = this.element.getBoundingClientRect().width;
    const chart_height = this.element.getBoundingClientRect().height;
    console.log("[SLOPEGRAPH] Chart Height:", chart_height);
    console.log("[SLOPEGRAPH] Chart Width:", chart_width);
    this.drawChart(chart_width, chart_height);
  }

  getConstructors() {
    return this.activeConstructors.map((d, i) => ({
      name: d,
      color: this.colorScale(i)
    }));
  }

  update(params) {
    if (params) {
      this.currentYear = params.year;
      this.container = d3.select(this.containerID)
      this.element = document.querySelector(this.containerID)
      const chart_width = this.element.getBoundingClientRect().width;
      const chart_height = this.element.getBoundingClientRect().height;

      this.currentYear = params.year;
      this.drawChart(chart_width, chart_height);
    }
  }

  updateLegend() {
    const constructors = this.getConstructors();
    const legendContainer = d3.select("#slopegraph-legend").html("");

    // Add legend title
    legendContainer.append("h6")
      .style("margin-bottom", "10px")
      .text(`Constructors (${this.currentYear})`);

    // Add legend items
    const legendItems = legendContainer.selectAll(".legend-item")
      .data(constructors)
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .style("margin-bottom", "5px")
      .style("display", "flex")
      .style("align-items", "center");

    legendItems.append("div")
      .attr("class", "legend-color")
      .style("width", "12px")
      .style("height", "12px")
      .style("margin-right", "8px")
      .style("background-color", d => d.color);

    legendItems.append("div")
      .text(d => d.name)
      .style("font-size", "12px");
  }

  drawChart(chart_width, chart_height) {
    const { year, constructorMonthlyPoints, allConstructors } = this.filterData(parseInt(this.currentYear));
    console.log("[SLOPEGRAPH] Data for year:", year)

    this.activeConstructors = allConstructors

    console.log("active constructors:", this.activeConstructors)

    // Convert to D3-friendly format
    const slopeData = allConstructors.map(constructor => ({
      constructor,
      values: constructorMonthlyPoints.get(constructor)
    }));

    const allPoints = Array.from(constructorMonthlyPoints.values())
      .flat() // Flatten arrays of monthly data
      .map(d => d.points); // Extract just the points values

    const [minPoints, maxPoints] = d3.extent(allPoints);

    console.log("[SLOPEGRAPH] min | max values:", minPoints, maxPoints)

    // Create the yDomain considering missing data
    const buffer = 5;
    const yDomain = [
      constructorMonthlyPoints.length === 0 ? Math.max(0, minPoints - buffer) : 0,
      Math.max(100, maxPoints + buffer)
    ];

    // NOTE: too lazy to use pandas, just doing what I can with JS
    const activeMonths = Array.from(constructorMonthlyPoints.values())
      .flatMap(teamData => teamData.map(d => d.month)) // Get all months
      .filter((month, i, arr) => arr.indexOf(month) === i) // Unique months
      .sort((a, b) => a - b); // Sorted numerically (1-12)

    const monthsWithPoints = activeMonths.filter(month =>
      Array.from(constructorMonthlyPoints.values()).some(teamData =>
        teamData.some(d => d.month === month && d.points > 0)
      )
    );

    // Define scales for X (months) and Y (points)
    const x = d3
      .scalePoint()
      .domain(monthsWithPoints)
      .range([0, chart_width])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain(yDomain)
      .range([chart_height - 50, 20]);

    console.log("Y-scale domain:", y.domain());

    // actually drawing the svg

    d3.select(this.containerID).select("svg").remove();

    const svg = d3.select(this.containerID)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${chart_width} ${chart_height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    // Right Y-axis (with labels)
    svg.append("g")
      .attr("class", "y axis-right")
      .attr("transform", `translate(${chart_width}, 0)`)
      .call(d3.axisRight(y));

    this.timeCategories.forEach((time, i) => {
      if (!activeMonths.includes(time)) return; // skip unused months

      const axisGroup = svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${x(time)}, 0)`);

      if (time === activeMonths[0]) {
        axisGroup.call(d3.axisLeft(y));
      }
      else if (i === this.timeCategories.length - 1) {
        axisGroup.call(d3.axisRight(y));
      }
      else {
        axisGroup.call(d3.axisLeft(y).tickFormat(""));
      }

      // Add month label
      svg.append("text")
        .attr("class", "month-label")
        .attr("x", x(time))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .text(this.getMonthName(time));
    });

    const colorScale = d3.scaleOrdinal()
      .domain(allConstructors)
      .range(d3.schemeTableau10);

    this.colorScale = colorScale

    // Draw the lines
    svg.selectAll(".slope-line")
      .data(slopeData)
      .enter()
      .append("path")
      .attr("class", "slope-line")
      .attr("d", d => {
        return d3.line()
          .x(d => x(d.month))
          .y(d => y(d.points))
          (d.values);
      })
      .attr("stroke", d => colorScale(d.constructor))
      .attr("fill", "none");

    svg.selectAll(".slope-point")
      .data(slopeData)
      .enter()
      .each(function (d) {
        d3.select(this)
          .selectAll(".point")
          .data(d.values)
          .enter()
          .append("circle")
          .attr("class", "slope-point")
          .attr("cx", d => x(d.month))
          .attr("cy", d => y(d.points))
          .attr("r", 4)
          .attr("fill", colorScale(d.constructor));
      });
  }

  getMonthName(monthNumber) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthNumber - 1]; // -1 because months are 1-12
  }

  filterData(year) {
    // represents each month of the year
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const yearData = this.data.filter(d =>
      // might be null, you never know when you're using javascript
      d.raceDate.getFullYear() === year
    );

    const constructorMonthlyPoints = new Map();

    months.forEach(month => {
      const monthRaces = yearData.filter(d =>
        d.raceDate.getMonth() + 1 === month
      );

      // Sum points by constructor for this month
      const pointsByConstructor = d3.rollup(
        monthRaces,
        v => d3.sum(v, race => +race.points || 0), // Sum points
        d => d.constructorName // Group by constructor
      );

      // Store in the map
      pointsByConstructor.forEach((points, constructor) => {
        if (!constructorMonthlyPoints.has(constructor)) {
          constructorMonthlyPoints.set(constructor, []);
        }

        constructorMonthlyPoints.get(constructor).push({
          month,
          points,
          races: monthRaces.filter(r => r.constructorName === constructor)
        });

      });
    });

    return {
      year,
      constructorMonthlyPoints, // Map(constructor → [{month, points, races}])
      allConstructors: Array.from(constructorMonthlyPoints.keys())
    };
  }
}
