const data = [4, 3.8, 3.7, 3.6, 3.5, 3.4];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const colors = ["#FFA07A","#FFD700","#98FB98","#87CEEB","#9370DB","#FF69B4",];

const margin = { top: 50, right: 20, bottom: 40, left: 80 };

const chartWidth = 700 - margin.left - margin.right;
const chartHeight = 500 - margin.top - margin.bottom;

const barContainer = d3.select("#bar-Container");

const svg = barContainer
  .append("svg")
  .attr("width", chartWidth + margin.left + margin.right)
  .attr("height", chartHeight + margin.top + margin.bottom);

const chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define scales
const xScale = d3
  .scaleBand()
  .domain(months)
  .range([0, chartWidth])
  .padding(0.1);

const yScale = d3.scaleLinear().domain([0, 5]).range([chartHeight, 0]);

// Add bars
chart
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (_, i) => xScale(months[i]))
  .attr("y", (d) => yScale(d))
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => chartHeight - yScale(d))
  .attr("fill", (_, i) => colors[i]);

// Add x-axis with month labels
const bottomAxis = d3.axisBottom(xScale);

chart
  .append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);

// Add y-axis with rounded and explicit integer ticks
const leftAxis = d3
  .axisLeft(yScale)
  .tickValues([0, 1, 2, 3, 4, 5]) // Explicitly set the tick values for the y-axis
  .tickFormat((d) => d);

chart.append("g").call(leftAxis);

chart
  .selectAll(".tick text") // Select the tick text elements
  .style("font-size", "14px");

// Add bar labels
chart
  .selectAll("text.label")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("x", (_, i) => xScale(months[i]) + xScale.bandwidth() / 2)
  .attr("y", (d) => yScale(d) - 5)
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "black")
  .text((d) => `${d.toFixed(1)}%`);

// Add x-axis title
svg
  .append("text")
  .attr("class", "x-axis-title")
  .attr(
    "transform",
    `translate(${chartWidth / 2 + margin.left}, ${
      chartHeight + margin.top + 40
    })`
  )
  .style("text-anchor", "middle")
  .style("font-size", "14px")
  .text("Month");

// Add y-axis title with adjusted position
svg
  .append("text")
  .attr("class", "y-axis-title")
  .attr(
    "transform",
    `translate(${margin.left - 30}, ${
      chartHeight / 2 + margin.top
    }) rotate(-90)`
  )
  .style("text-anchor", "middle")
  .style("font-size", "14px")
  .text("Unemployment Rate (%)");

chart
  .append("g")
  .attr("class", "grid")
  .selectAll("line")
  .data([0, 1, 2, 3, 4, 5]) // Use the explicit tick values (0, 1, 2, 3, 4, 5)
  .enter()
  .append("line")
  .attr("x1", 0) // Start the grid line at the left side of the chart
  .attr("x2", chartWidth) // End the grid line at the right side of the chart
  .attr("y1", (d) => yScale(d)) // Use the tick value for the position on the y-axis
  .attr("y2", (d) => yScale(d)) // Same position for the end of the line
  .style("stroke", "#ccc") // Light gray color for the grid lines
  .style("stroke-dasharray", "2,2"); // Dotted line

// Dotted grid lines on the y-axis (vertical) starting from the ticks (January, February, etc.)
chart
  .append("g")
  .attr("class", "grid")
  .selectAll("line")
  .data(months) // Use the domain from xScale (months)
  .enter()
  .append("line")
  .attr("x1", (d) => xScale(d) + xScale.bandwidth() / 2) // Start from the center of each bar (middle of each tick)
  .attr("x2", (d) => xScale(d) + xScale.bandwidth() / 2) // End at the same position
  .attr("y1", 0) // Start at the top of the chart
  .attr("y2", chartHeight) // End at the bottom of the chart
  .style("stroke", "#ccc") // Light gray color for the grid lines
  .style("stroke-dasharray", "2,2"); // Dotted line

// Add title at the top of the chart
svg
  .append("text")
  .attr("x", chartWidth / 2 + margin.left) // Position it at the center of the chart width
  .attr("y", margin.top - 20) // Position it above the chart (10px from the top)
  .attr("text-anchor", "middle") // Center align the text
  .style("font-size", "20px") // Set the font size
  .style("font-weight", "bold") // Make the title bold
  .text("Monthly Unemployment Rate in the US"); // Set the title text
