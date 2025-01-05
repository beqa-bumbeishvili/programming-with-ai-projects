// Data with current and previous year values
const data = [
    { name: '50', currentMonth: 15000, previousMonth: 14625 },
    { name: '100', currentMonth: 32000, previousMonth: 31200 },
    { name: '150', currentMonth: 18000, previousMonth: 17550 },
    { name: '200', currentMonth: 25000, previousMonth: 24375 },
    { name: '250', currentMonth: 22000, previousMonth: 21450 },
    { name: '300', currentMonth: 12000, previousMonth: 11700 },
    { name: '350', currentMonth: 24000, previousMonth: 23400 },
    { name: '400', currentMonth: 14000, previousMonth: 13650 },
    { name: '450', currentMonth: 16000, previousMonth: 15600 },
    { name: '500', currentMonth: 18000, previousMonth: 17550 },
    { name: '550', currentMonth: 13000, previousMonth: 12675 },
    { name: '600', currentMonth: 19000, previousMonth: 18525 }
];

// Calculate percentage for each data point
data.forEach(d => {
    d.percentage = (d.previousMonth / d.currentMonth) * 100;
});

// Set up dimensions
const margin = { top: 20, right: 5, bottom: 30, left: 5 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const totalCurrentMonth = d3.sum(data, d => d.currentMonth);
const totalPreviousMonth = d3.sum(data, d => d.previousMonth);

// Create SVG
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, width])
    .padding(0.02);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.currentMonth)])
    .range([height, 0]);

// Create and append background (green) bars - full height
svg.selectAll(".bar-bg")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar-bg")
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.currentMonth))
    .attr("height", d => height - y(d.currentMonth))
    .attr("rx", 0.1)
    .attr("fill", "#2acf56");

svg.selectAll(".bar-fg")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar-fg")
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", d => height - (height - y(d.previousMonth)) * (d.percentage / 100)) // ახალი y პოზიცია
    .attr("height", d => (height - y(d.previousMonth)) * (d.percentage / 100))
    .attr("rx", 0.1)
    .attr("fill", "#bff1cc");


// Add X axis
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

// Create tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Add tooltip interactions
svg.selectAll(".bar-bg, .bar-fg")
    .on("mouseover", function (event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip.html(`Current: $${d.currentMonth.toLocaleString()}<br>Previous: $${d.previousMonth.toLocaleString()}<br>Percentage: ${d.percentage.toFixed(1)}%`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Export functionality
document.getElementById('exportBtn').addEventListener('click', function () {
    const svgData = document.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgData);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = width + margin.left + margin.right;
    canvas.height = height + margin.top + margin.bottom;

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'income-chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
});