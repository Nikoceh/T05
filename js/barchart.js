(function () {
  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
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
      d.tech = getVal(d, ["Screen_Technology", "Screen_Type", "Technology", "Type"]);
      d.energy = +getVal(d, ["Energy_Consumption", "Mean_Energy", "Average_Energy", "kWh"]);
    });

    const x = d3.scaleBand()
      .domain(data.map(d => d.tech))
      .range([0, width])
      .padding(0.35);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.energy) * 1.15 || 500])
      .range([height, 0]);

    // X-Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-20)")
      .attr("text-anchor", "end")
      .attr("font-size", "11px");

    // Y-Axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(6))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("fill", "#475569")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text("Mean Energy Consumption (kWh)");

    // Bars
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.tech))
      .attr("y", d => y(d.energy))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.energy))
      .attr("fill", "#0284c7")
      .attr("rx", 3);
  }).catch(err => console.error("Bar chart load error:", err));
})();