(function () {
  const width = 500;
  const height = 380;
  const radius = Math.min(width, height) / 2 - 40;

  const svg = d3.select("#chart-donut")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
    const getVal = (d, keys) => {
      for (const k of keys) {
        const found = Object.keys(d).find(col => col.trim().toLowerCase() === k.toLowerCase());
        if (found) return d[found];
      }
      return null;
    };

    data.forEach(d => {
      d.tech = getVal(d, ["Screen_Technology", "Screen_Type", "Technology", "Type"]);
      d.value = +getVal(d, ["Energy_Consumption", "Total_Energy", "Energy", "Count", "Mean_Energy"]);
    });

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const arcs = svg.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.tech))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    // Centered label
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("fill", "#0f172a")
      .text("All Sizes");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.3em")
      .attr("font-size", "11px")
      .attr("fill", "#64748b")
      .text("Total Share");

    // Side Legend
    const legend = svg.selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${radius + 15}, ${-radius + i * 22})`);

    legend.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("rx", 2)
      .attr("fill", d => color(d.tech));

    legend.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .attr("font-size", "11px")
      .attr("fill", "#334155")
      .text(d => d.tech);
  }).catch(err => console.error("Donut chart load error:", err));
})();