(function () {
  const margin = { top: 30, right: 35, bottom: 55, left: 65 };
  const width = 600 - margin.left - margin.right;
  const height = 380 - margin.top - margin.bottom;

  const svg = d3.select("#chart-scatter")
    .append("svg")
    .attr("viewBox", `0 0 600 380`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/Ex5_TV_energy.csv").then(data => {
    const getVal = (d, keys) => {
      for (const k of keys) {
        const found = Object.keys(d).find(col => col.trim().toLowerCase() === k.toLowerCase());
        if (found) return d[found];
      }
      return null;
    };

    data.forEach(d => {
      d.star = +getVal(d, ["Star2", "Star", "Star_Rating", "Stars"]);
      d.energy = +getVal(d, ["Energy_Consumpt", "Energy_Consumption", "Energy", "Labelled_Energy", "kWh"]);
    });

    const cleanData = data.filter(d => !isNaN(d.star) && !isNaN(d.energy) && d.energy > 0);

    const maxStar = d3.max(cleanData, d => d.star) || 8;
    const x = d3.scaleLinear()
      .domain([0, maxStar + 0.6])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.energy) * 1.08 || 3000])
      .range([height, 0]);

    // Gridlines
    svg.append("g")
      .attr("class", "grid")
      .attr("stroke", "#f1f5f9")
      .attr("stroke-dasharray", "2,2")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(9))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 42)
      .attr("fill", "#475569")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("text-anchor", "middle")
      .text("Star Rating (Stars)");

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
      .text("Annual Energy Consumption (kWh)");

    // Circles: Smaller radius (2.5px), lighter opacity (0.28), no stroke border
    svg.selectAll("circle")
      .data(cleanData)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => {
        // Deterministic jitter between -0.16 and +0.16
        const jitter = Math.sin(i * 1234.56) * 0.16;
        return x(d.star + jitter);
      })
      .attr("cy", d => y(d.energy))
      .attr("r", 2.6)               // Smaller size leaves breathing room between points
      .attr("fill", "#2563eb")       // Vibrant blue
      .attr("opacity", 0.3)          // Transparency reveals density gradients
      .style("pointer-events", "all")
      .on("mouseover", function () {
        d3.select(this)
          .raise()                   // Bring hovered element to front
          .attr("r", 5)
          .attr("opacity", 1)
          .attr("fill", "#ea580c");  // Highlight in orange on hover
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("r", 2.6)
          .attr("opacity", 0.3)
          .attr("fill", "#2563eb");
      });
  }).catch(err => console.error("Scatter plot load error:", err));
})();