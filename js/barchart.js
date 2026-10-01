(function () {
  const margin = { top: 35, right: 30, bottom: 50, left: 65 };
  const width = 600 - margin.left - margin.right;
  const height = 380 - margin.top - margin.bottom;

  const svg = d3.select("#chart-bar")
    .append("svg")
    .attr("viewBox", `0 0 600 380`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(data => {
    const getVal = (d, keys) => {
      for (const k of keys) {
        const found = Object.keys(d).find(col => col.trim().toLowerCase() === k.toLowerCase());
        if (found) return d[found];
      }
      return null;
    };

    data.forEach(d => {
      d.tech = getVal(d, ["Screen_Tech", "Screen_Type", "Technology", "Type"]);
      d.energy = +getVal(d, ["Energy_Consumption", "Mean_Energy", "Average_Energy", "kWh", "Mean"]);
    });

    const cleanData = data.filter(d => d.tech && !isNaN(d.energy));
    cleanData.sort((a, b) => a.energy - b.energy);

    const x = d3.scaleBand()
      .domain(cleanData.map(d => d.tech))
      .range([0, width])
      .padding(0.42);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.energy) * 1.2 || 500])
      .range([height, 0]);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("dy", "1em");

    // Y Axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(6))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -48)
      .attr("fill", "#475569")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("text-anchor", "middle")
      .text("Mean Energy Consumption (kWh)");

    // Bars
    svg.selectAll(".bar")
      .data(cleanData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.tech))
      .attr("y", d => y(d.energy))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.energy))
      .attr("fill", "#0284c7")
      .attr("rx", 4);

    // Value labels above bars
    svg.selectAll(".bar-label")
      .data(cleanData)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => x(d.tech) + x.bandwidth() / 2)
      .attr("y", d => y(d.energy) - 8)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "#0f172a")
      .text(d => `${d.energy.toFixed(1)} kWh`);
  }).catch(err => console.error("Bar chart load error:", err));
})();