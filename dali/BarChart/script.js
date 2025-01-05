const data = [
    { month: "Jan", rate: 4.0, color: "#ff4c4c" },
    { month: "Feb", rate: 3.8, color: "#ffc107" },
    { month: "Mar", rate: 3.7, color: "#4caf50" },
    { month: "Apr", rate: 3.6, color: "#2196f3" },
    { month: "May", rate: 3.5, color: "#9c27b0" },
    { month: "Jun", rate: 3.4, color: "#e91e63" },
];

const margin = { top: 50, right: 30, bottom: 60, left: 50 };

let svgWidth = 700;
let svgHeight = 500;

const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, chartWidth])
    .padding(0.2);

const yScale = d3.scaleLinear()
    .domain([0, 5])
    .range([chartHeight, 0]);

chartGroup.append("g")
    .selectAll("line.horizontal")
    .data(yScale.ticks(5))
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", chartWidth)
    .attr("y1", d => yScale(d))
    .attr("y2", d => yScale(d))
    .attr("stroke", "#aaa")
    .attr("stroke-width", 1.3)
    .attr("stroke-dasharray", "1,1")
    .attr("opacity", 1);

chartGroup.append("g")
    .selectAll("line.vertical")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr("x2", d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr("y1", 0)
    .attr("y2", chartHeight)
    .attr("stroke", "#aaa")
    .attr("stroke-width", 1.3)
    .attr("stroke-dasharray", "1,1")
    .attr("opacity", 1);

chartGroup.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.month))
    .attr("y", d => yScale(d.rate))
    .attr("width", xScale.bandwidth())
    .attr("height", d => chartHeight - yScale(d.rate))
    .attr("fill", d => d.color)
    .attr("fill-opacity", 0.7);

chartGroup.selectAll("text.rate")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "rate")
    .attr("x", d => xScale(d.month) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.rate) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text(d => d.rate + "%");

chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale));

chartGroup.append("g")
    .call(d3.axisLeft(yScale).ticks(5));

svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Month");

svg.append("text")
    .attr("x", -svgHeight / 2)
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Unemployment Rate (%)");

svg
    .append("text")
    .attr("x", svgWidth / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-family", "Arial")
    .style("font-weight", "bold")
    .text("Monthly Unemployment Rate in the US");