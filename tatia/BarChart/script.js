// მონაცემები
const data = [
    { category: "Jan", value: 0.04},
    { category: "Feb", value: 0.038},
    { category: "Mar", value: 0.037},
    { category: "Apr", value: 0.036},
    { category: "May", value: 0.035},
    { category: "Jun", value: 0.034}
  ]
  // Y სკალის შექმნა
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);

  // Y ღერძის დამატება
  svg.append("g")
    .call(d3.axisLeft(y));
  

  // გრაფიკის ზომების განსაზღვრა%
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  
  // SVG ელემენტის შექმნა
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // X სკალის შექმნა
  const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.category))
    .padding(0.1);
  

  
  // X ღერძის დამატება
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
  

  // ბარების დამატება
  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.category))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", "#4F46E5")
    .on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "#6366F1");
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "#4F46E5");
    });