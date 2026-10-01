(function () {
  const margin = { top: 30, right: 30, bottom: 50, left: 65 };
  const width = 600 - margin.left - margin.right;
  const height = 380 - margin.top - margin.bottom;

  const svg = d3.select("#chart-line")
    .append("svg")
    .attr("viewBox", `0 0 600 380`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(data => {
    const cols = Object.keys(data[0]);
    const yearCol = cols.find(c => /year|date/i.test(c)) || cols[0];
    const valCol = cols.find(c => /price|average|avg|value/i.test(c)) || cols[1];

    data.forEach(d => {
      d.year = +d[yearCol];
      d.price = +d[valCol];
    });

    const cleanData = data.filter(d => !isNaN(d.year) && !isNaN(d.price))
                          .sort((a, b) => a.year - b.year);

    const x = d3.scaleLinear()
      .domain(d3.extent(cleanData, d => d.year))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.price) * 1.1 || 200])
      .range([height, 0]);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(6))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "#475569")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text("Year");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(6))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("fill", "#475569")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text("Spot Price ($/MWh)");

    // Line generator
    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.price))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(cleanData)
      .attr("fill", "none")
      .attr("stroke", "#ea580c")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // Data points
    svg.selectAll(".dot")
      .data(cleanData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.price))
      .attr("r", 3)
      .attr("fill", "#ea580c");
  }).catch(err => console.error("Line chart load error:", err));
})();