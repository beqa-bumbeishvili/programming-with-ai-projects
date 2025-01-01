const data = [4, 3.8, 3.7, 3.6, 3.5, 3.4];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const chartContainer = d3.select("#chart-container");
const svgWidth = chartContainer.node().clientWidth;
const svgHeight = chartContainer.node().clientHeight;

const margin = { top: 50, right: 50, bottom: 50, left: 50};  
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const svg = chartContainer
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3.scaleBand()
    .domain(months)
    .range([0, chartWidth])
    .padding(0.2);

const yScale = d3.scaleLinear()
    .domain([0, 5])
    .range([chartHeight, 0]);

const color = d3.scaleOrdinal()
    .domain(data) 
    .range(["#ff9066","#ffde21","#8aea92","#ADD8E6","#b069db","#F26096"]); 

chart
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(months[i]))  
    .attr("y", d => yScale(d))  
    .attr("width", xScale.bandwidth())  
    .attr("height", d => chartHeight - yScale(d))  
    .attr("fill", function(d) { return color(d) });

const xGridlines = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisBottom(xScale)
        .tickSize(chartHeight)  
        .tickFormat("")  
    )
    .selectAll(".tick line")
    .attr("stroke", "#D3D3D3")  
    .attr("stroke-dasharray", "0.1");

const yGridlines = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(yScale)
        .tickSize(-chartWidth)  
        .tickFormat("")  
        .tickValues([0, 1, 2, 3, 4, 5])  
    )
    .selectAll(".tick line")
    .attr("stroke", "#D3D3D3")
    .attr("stroke-dasharray", "0.1");

svg.selectAll(".domain").remove(); 

const xAxis = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${chartHeight + margin.top})`)  
    .call(d3.axisBottom(xScale).tickSize(-5).tickSizeOuter(0));

const yAxis = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)  
    .call(d3.axisLeft(yScale).tickSize(-5).tickSizeOuter(0).ticks(5));

chart.selectAll("text.bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", (d, i) => xScale(months[i]) + xScale.bandwidth() / 2)  
    .attr("y", d => yScale(d) - 5)  
    .attr("text-anchor", "middle")  
    .style("font-size", "12px") 
    .style("font-family", "Arial Narrow, sans-serif") 
    .text(d => `${d}%`); 

svg.append("text")
    .attr("transform", `translate(${svgWidth / 2}, ${chartHeight + margin.top + 30})`)  
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-family", "Arial Narrow, sans-serif")
    .text("Month");

chart.append("text")
    .attr("transform", "rotate(-90)")  
    .attr("x", -chartHeight / 2)  
    .attr("y", -margin.left + 30)  
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-family", "Arial Narrow, sans-serif")
    .text("Unemployment rate (%)");

svg.append("text")
    .attr("transform", `translate(${svgWidth / 2}, ${margin.top - 10})`)  
    .style("text-anchor", "middle")
    .style("font-size", "18px")  
    .style("font-family", "Arial Narrow, sans-serif")
    .style("font-weight", "bold")  
    .text("Monthly Unemployment Rate in the US");

  

