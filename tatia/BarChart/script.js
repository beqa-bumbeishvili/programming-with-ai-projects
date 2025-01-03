const data = [
  { category: "Jan", value: 4, color: "rgb(255,159,122)" },
  { category: "Feb", value: 3.8, color: "rgb(255,214,1)" },
  { category: "Mar", value: 3.7, color: "rgb(151,251,152)" },
  { category: "Apr", value: 3.6, color: "rgb(135,206,235)" },
  { category: "May", value: 3.5, color: "rgb(147,111,218)" },
  { category: "Jun", value: 3.4, color: "rgb(255,104,180)" }
]

const margin = { top: 5, right: 50, bottom: 30, left: 50 };
const width = 700 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const yScale = d3.scaleLinear()
  .domain([0, (d3.max(data, d => d.value) + 1)])
  .range([height, 0])

const xScale = d3.scaleBand()
  .range([0, width])
  .domain(data.map(d => d.category))
  .padding(0.2)


const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

svg.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", d => xScale(d.category))
  .attr("y", d => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.value))
  .attr("fill", d => d.color)
  .style(opacity = 0.5)


svg.append("g")
  .attr("class", "grid horizontal")
  .style("stroke-dasharray", "1 1")
  .call(d3.axisLeft(yScale)
    .tickSize(-width)
    .ticks(5)
    .tickSizeuother(-7)
    
  )
  .style("font-size", "14px")



svg.append("g")
  .attr("class", "grid vertical")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale)
    .tickSize(-height)
    .tickSizeInner(-7)
  )
  .selectAll("text")
  .attr("transform", "translate(0,0)rotate(0)")
  .style("text-anchor", "middle")
  .style("font-size", "14px")


const texts = svg.append('g')
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .attr('class', 'bar-text')
  .text((d) => (d.value + "%"))
  .attr("x", d => (xScale(d.category) + xScale.bandwidth() / 2))
  .attr("y", d => (yScale(d.value) - 5))
  .style("text-anchor", "middle")
  .style("font-size", "14px")


svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left)
  .attr("x", -height / 2)
  .attr("dy", "1.5em")
  .style("text-anchor", "middle")
  .style("font-size", "15px")
  .style("font-weight", 200)
  .text("Unemployment Rate (%)");



