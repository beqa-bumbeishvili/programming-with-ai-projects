const data = [144, 129, 92, 75, 40, 234];  // Data for the donut chart
const labels = ["$144K (20.2%)", "$129K (18.0%)", "$92K (12.9%)", "$75K (10.6%)", "40K (5.6%)", "$234K (32.7%)"];  // Custom labels for each segment
const legendLabels = ["Telephone and Communication", "Chairs & Chairmans", "Office Machines", "Binders and Binder Accessories", "Office Furnishings", "Others"]; // Custom labels for the legend



// Set up dimensions for the SVG container
const width = 500;
const height = 500;
const margin = 40;
const radius = Math.min(width, height) / 2 - margin;  // Radius of the donut chart

// Create an SVG container and center it
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);  // Centering the chart

// Create the pie chart layout function (no sorting)
const pie = d3.pie().sort(null);  // Ensure no sorting of data

// Create the arc function for the donut chart
const arc = d3.arc()
    .outerRadius(radius)               // Outer radius for the chart
    .innerRadius(radius / 2);          // Inner radius for the donut hole

// Transform data using the pie chart function
const pieData = pie(data);

// Corrected color array for the segments
const colors = ["#12229E", "#E66C37", "#6B007B", "#E044A7", "#744EC3", "#F8FEF8"]; // Last color is #F8FEF8


const defs = svg.append("defs");

defs.append("pattern")
    .attr("id", "dashedPattern")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 10)
    .attr("height", 10)
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 10)
    .attr("y2", 10)
    .attr("stroke", "#A9F2A9")
    .attr("stroke-width", 2)
    .attr("stroke-srraight", "5,5");  // Dashed pattern

// Create the pie chart slices
svg.selectAll("path")
    .data(pieData)
    .enter().append("path")
    .attr("d", arc)                     // Apply the arc shape to each slice
    .attr("fill", (d, i) => {
        // If this is the last segment (index = 5), apply the dashed pattern
        return i === pieData.length - 1 ? "url(#dashedPattern)" : colors[i];  // Apply dashed pattern for Segment F
    })
    .attr("stroke", (d, i) => {
        // Apply the regular stroke (white) for all segments
        return i === pieData.length - 1 ? "#A9F2A9" : "white";
    })
    .attr("stroke-width", (d, i) => {
        // Apply thicker border only to the last segment (Segment F)
        return i === pieData.length - 1 ? 3 : 2;
    });





// Create the pie chart slices
svg.selectAll("path")
    .data(pieData)
    .enter().append("path")
    .attr("d", arc)                     // Apply the arc shape to each slice
    .attr("fill", (d, i) => colors[i])  // Set color based on the index
    .attr("stroke", "white")            // White stroke between the segments
    .attr("stroke-width", 2);

// Add a white circle in the center to create the "donut" effect
svg.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", radius / 2)  // Set the radius for the center circle (half of the donut radius)
    .style("fill", "#fff");  // Fill color (white for the hole effect)

// Add text labels inside the donut (center of the chart)
svg.append("text")
    .attr("x", 0)                      // Position text horizontally at the center
    .attr("y", 0)                      // Position text vertically at the center
    .attr("dy", ".35em")               // Adjust text position vertically (align center)
    .attr("text-anchor", "middle")     // Align the text to the center
    .text("$ 715K")                    // The text to display inside the donut
    .style("font-size", "36px") 
    .style("font-weight", "600")       // Font size for better visibility
    .style("fill", "#000")             // Text color (black)
    .style("font-family", "Arial, sans-serif");  // Font family

// Label offset outside the donut
const labelOffset = 40;  // Distance between the donut and the label

// Add text labels outside the donut chart with custom labels
const labelGroup = svg.selectAll("g.label-group")
    .data(pieData)
    .enter().append("g")
    .attr("class", "label-group")  // Group each label with its background rectangle

// Append rectangles behind the labels (background for the label)
labelGroup.append("rect")
    .attr("x", (d, i) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.cos(angle) * (radius + labelOffset); // X position outside the donut
        return x - 35;  // Offset for rectangle position (adjust width accordingly)
    })
    .attr("y", (d, i) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const y = Math.sin(angle) * (radius + labelOffset); // Y position outside the donut
        return y - 10;  // Offset for rectangle position (adjust height accordingly)
    })
    .attr("width", 70)  // Width of the rectangle (adjust size accordingly)
    .attr("height", 20)  // Height of the rectangle (adjust size accordingly)
    .attr("fill", "#EEF2F8")  // Rectangle fill color (grey for background)
      // Rounded corners for the rectangle
    // Rounded corners for the rectangle

// Add text labels on top of the rectangles
labelGroup.append("text")
    .attr("transform", (d, i) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.cos(angle) * (radius + labelOffset); // X position outside the donut
        const y = Math.sin(angle) * (radius + labelOffset); // Y position outside the donut
        return `translate(${x},${y})`; // Place label outside the donut
    })
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")  // Center the label vertically
    .text((d, i) => labels[i])  // Use the custom label text for each segment
    .style("font-size", "10px")
    .style("fill", "grey")  // Label text color (black)
    .style("font-family", "Arial, sans-serif");

// Add small ticks (lines) from the border of each segment to their corresponding labels
const shortenedLabelOffset = 20;  // Reduce this value to shorten the tick lines

svg.selectAll("line")
    .data(pieData)
    .enter().append("line")
    .attr("x1", (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        return Math.cos(angle) * radius;  // Get the x position of the outer border of the segment
    })
    .attr("y1", (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        return Math.sin(angle) * radius;  // Get the y position of the outer border of the segment
    })
    .attr("x2", (d, i) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        return Math.cos(angle) * (radius + shortenedLabelOffset);  // X position of the shortened label
    })
    .attr("y2", (d, i) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        return Math.sin(angle) * (radius + shortenedLabelOffset);  // Y position of the shortened label
    })
    .attr("stroke", (d, i) => colors[i])  // Line color matches the segment color
    .attr("stroke-linecap", "round")     // Rounded ends
    .attr("stroke-linejoin", "round")    // Rounded corners
    .attr("stroke-dasharray", "5,5")     // Dashed line
    .attr("stroke-dashoffset", "5");
    
    
    const legend = d3.select("#legend"); // Assuming you have an element with id 'legend'

    // Loop through each label and create a legend entry for each
    legendLabels.forEach((label, index) => {
        // Append a list item (<li>) for each legend entry
        const legendItem = legend.append("li")
            .attr("class", "legend-item"); // Optional: Add a class for styling
    
        // Append a circle (colored) for the segment color
        legendItem.append("span")
            .attr("class", "legend-circle") // Class for the circle, optional for styling
            .style("background-color", colors[index]) // Set the background color to match the pie segment
            .style("display", "inline-block") // Ensure it behaves as inline-block for alignment
            .style("margin-right", "10px") // Space between the circle and text
            .style("width", "15px") // Circle size
            .style("height", "15px") // Circle size
            .style("border-radius", "50%"); // Make it round (circle)
    
        // Append the label text next to the circle
        legendItem.append("span")
            .text(label) // Set the label text
            .style("color", "#000") // Set text color to black
            .style("font-size", "14px") // Text font size
            .style("font-family", "Arial, sans-serif"); // Font family
    });