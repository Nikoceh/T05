(function () {
  const margin = { top: 30, right: 30, bottom: 50, left: 60 };
  const width = 600 - margin.left - margin.right;
  const height = 380 - margin.top - margin.bottom;

  const svg = d3.select("#chart-scatter")
    .append("svg")
    .attr("viewBox", `0 0 600 380`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/Ex5_TV_energy.csv").then(data => {
    // Normalise column keys (handles casing variations)
    const getVal = (d, keys) => {
      for (const k of keys) {
        const found = Object.keys(d).find(col => col.trim().toLowerCase() === k.toLowerCase());
        if (found) return d[found];
      }
      return null;
    };

    data.forEach(d => {
      d.star = +getVal(d, ["Star2", "Star", "Star_Rating", "Stars"]);
      d.energy = +getVal(d, ["Energy_Consumpt", "Energy", "Labelled_Energy", "kWh"]);
    });

    const cleanData = data.filter(d => !isNaN(d.star) && !isNaN(d.energy));

    const x = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.star) * 1.05 || 10])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.energy) * 1.05 || 500])
      .range([height, 0]);

    // Gridlines
    svg.append("g")
      .attr("class", "grid")
      .attr("stroke", "#f1f5f9")
      .attr("stroke-dasharray", "2,2")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "#475569")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text("Star Rating (Stars)");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(6))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("fill", "#475569")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text("Annual Energy Consumption (kWh)");

    // Plot circles
    svg.selectAll("circle")
      .data(cleanData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.star))
      .attr("cy", d => y(d.energy))
      .attr("r", 4.5)
      .attr("fill", "#3b82f6")
      .attr("opacity", 0.6)
      .attr("stroke", "#1d4ed8")
      .attr("stroke-width", 0.5);
  }).catch(err => console.error("Scatter plot load error:", err));
})();