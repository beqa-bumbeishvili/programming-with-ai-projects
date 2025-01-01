const data = [
    { month: 'Jan', value: 4.0 },
    { month: 'Feb', value: 3.8 },
    { month: 'Mar', value: 3.7 },
    { month: 'Apr', value: 3.6 },
    { month: 'May', value: 3.5 },
    { month: 'Jun', value: 3.4 }
];

const margin = { top: 50, right: 30, bottom: 70, left: 50 };
const width = 900 - margin.left - margin.right;
const height = 660 - margin.top - margin.bottom;

const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .style("font-family", "Verdana")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.month))
    .padding(0.2);

const y = d3.scaleLinear()
    .domain([0, 5])
    .range([height, 0]);

svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat(""));

svg.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y)
        .tickValues([1, 2, 3, 4, 5])
        .tickSize(-width)
        .tickFormat(""));

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Month");

svg.append("g")
    .call(d3.axisLeft(y)
        .tickValues([1, 2, 3, 4, 5])
        .tickFormat(d => d));

svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .style("font-weight", "bold")
    .text("Monthly Unemployment Rate in the US");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Unemployment Rate (%)");

const colors = [
    '#ff9d7a',  //Orange
    '#fdd406',  // Yellow
    '#8cfd98',  // Light green
    '#82d0eb',  // Sky blue
    '#996fda',  // Darker purple
    '#ff63b4'   // Darker pink
];

svg.selectAll("bar")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.month))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", (d, i) => colors[i])
    .attr("class", "bar");

svg.selectAll(".label")
    .data(data)
    .join("text")
    .attr("class", "label")
    .attr("x", d => x(d.month) + x.bandwidth() / 1.72)
    .attr("y", d => y(d.value) - 10)
    .attr("text-anchor", "middle")
    .text(d => d.value.toFixed(1) + "%");