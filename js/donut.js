(function () {
  const width = 500;
  const height = 380;
  const radius = Math.min(width, height) / 2 - 45;
  const centerX = width * 0.40;
  const centerY = height / 2;

  const svg = d3.select("#chart-donut")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const chartGroup = svg.append("g")
    .attr("transform", `translate(${centerX}, ${centerY})`);

  d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
    const getVal = (d, keys) => {
      for (const k of keys) {
        const found = Object.keys(d).find(col => col.trim().toLowerCase() === k.toLowerCase());
        if (found) return d[found];
      }
      return null;
    };

    data.forEach(d => {
      d.tech = getVal(d, ["Screen_Tech", "Screen_Type", "Technology", "Type"]);
      d.value = +getVal(d, ["Energy_Consumption", "Total_Energy", "Energy", "Count", "Mean"]);
    });

    const cleanData = data.filter(d => d.tech && !isNaN(d.value) && d.value > 0);
    const total = d3.sum(cleanData, d => d.value);

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.76).outerRadius(radius * 0.76);

    const color = d3.scaleOrdinal()
      .domain(cleanData.map(d => d.tech))
      .range(["#3b82f6", "#f97316", "#ef4444", "#10b981"]);

    const arcs = chartGroup.selectAll(".arc")
      .data(pie(cleanData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.tech))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2.5);

    // Direct slice values: percentage and raw value
    arcs.append("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .each(function (d) {
        const pct = (d.data.value / total) * 100;
        if (pct < 6) return; // avoid cluttering small slices
        const el = d3.select(this);
        el.append("tspan")
          .attr("x", 0)
          .attr("dy", "-0.2em")
          .text(`${pct.toFixed(0)}%`);
        el.append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .attr("font-size", "9.5px")
          .attr("font-weight", "400")
          .text(`${d.data.value.toLocaleString()}`);
      });

    // Donut center label
    chartGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("font-size", "15px")
      .attr("font-weight", "700")
      .attr("fill", "#0f172a")
      .text("All Sizes");

    chartGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.3em")
      .attr("font-size", "11px")
      .attr("fill", "#64748b")
      .text("Total Share");

    // Right-hand legend with values included
    const legend = svg.selectAll(".legend")
      .data(cleanData)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${width - 135}, ${centerY - 45 + i * 28})`);

    legend.append("rect")
      .attr("width", 13)
      .attr("height", 13)
      .attr("rx", 3)
      .attr("fill", d => color(d.tech));

    legend.append("text")
      .attr("x", 20)
      .attr("y", 11)
      .attr("font-size", "12px")
      .attr("fill", "#334155")
      .text(d => `${d.tech} (${d.value.toLocaleString()})`);
  }).catch(err => console.error("Donut chart load error:", err));
})();