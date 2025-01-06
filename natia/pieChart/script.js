const data = [
  { label: "HealthCare", value: 8, color: "#E31A1C" },
  { label: "Leisure", value: 10, color: "#FB9A99" },
  { label: "Loan", value: 10, color: "#33A02C" },
  { label: "Transportation", value: 15, color: "#B2DF8A" },
  { label: "Food", value: 20, color: "#1F78B4" },
  { label: "Rent", value: 30, color: "#A6CEE3" },
  { label: "Utilities", value: 2, color: "#FF7F00" },
  { label: "Education", value: 5, color: "#FDBF6F" },
];

// Set up dimensions and radius
const width = window.innerWidth;
const height = window.innerHeight;
const radius = Math.min(width, height) / 3;

// Create the SVG container
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Add the title text
svg
  .append("text")
  .attr("x", width / 2) // Center the title horizontally
  .attr("y", 100) // Position the title above the chart
  .attr("text-anchor", "middle") // Center align the text
  .attr("font-size", "30px") // Set font size for the title
  .attr("font-weight", "bold") // Make the title bold
  .attr("fill", "#333") // Set the title color
  .text("Average Household Expenses"); // Title text

// Append the pie chart group
const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2 + 30})`); // Shift the pie chart group down

// Create the pie generator
const pie = d3
  .pie()
  .value((d) => d.value)
  .sort(null);

// Create the arc generator
const arc = d3
  .arc()
  .innerRadius(0) // For a pie chart, inner radius is 0
  .outerRadius(radius * 0.75);

const hoverArc = d3
  .arc()
  .innerRadius(0) // For a pie chart, inner radius is 0
  .outerRadius(radius * 0.85);  

// Create another arc for labels
const labelArc = d3
  .arc()
  .innerRadius(radius * 0.85) // Position outside the chart
  .outerRadius(radius * 0.85);

// Calculate total for percentages
const totalValue = data.reduce((sum, d) => sum + d.value, 0);

// Bind data and create pie chart slices
const arcs = chartGroup
  .selectAll(".arc")
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "arc");

// Draw the pie chart slices
arcs
  .append("path")
  .attr("d", arc)
  .attr("fill", (d) => d.data.color)
  .style("fill-opacity", "0.8")
  .style("stroke", "#382222")
  .style("stroke-width", 1)
  .on("mouseover",function (d,i) {
    d3.select(this)
    .style("fill-opacity", "1")
    .transition().duration(500)
    .attr("d",hoverArc)
  })
  .on("mouseout",function (d,i) {
    d3.select(this)
    .style("fill-opacity", "0.8")
    .transition().duration(500)
    .attr("d",arc)
  })

// Add percentage values inside the pie chart
arcs
  .append("text")
  .attr("transform", (d) => `translate(${arc.centroid(d)})`) // Position inside the slice
  .attr("text-anchor", "middle")
  .attr("font-size", "10px")
  .attr("font-weight", "800")
  .attr("fill", "#382222")
  .text((d) => {
    const percentage = ((d.data.value / totalValue) * 100).toFixed(1);
    return `${percentage}%`; // Display percentage
  });

// Add labels outside the pie chart
arcs
  .append("text")
  .attr("transform", (d) => `translate(${labelArc.centroid(d)})`) // Position outside the slice
  .attr("text-anchor", (d) =>
    d.endAngle - d.startAngle > Math.PI ? "end" : "start"
  ) // Align labels
  .attr("font-size", "12px")
  .attr("fill", "#000")
  .text((d) => d.data.label); // Display label
