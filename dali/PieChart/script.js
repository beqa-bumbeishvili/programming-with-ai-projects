const data = [
    { category: "Utilities", value: 2, color: "#FF8C00" },
    { category: "Education", value: 5, color: "#FFA500" },
    { category: "Healthcare", value: 8, color: "#FF4500" },
    { category: "Leisure", value: 10, color: "#FFB6C1" },
    { category: "Loan", value: 10, color: "#228B22" },
    { category: "Transportation", value: 15, color: "#90EE90" },
    { category: "Food", value: 20, color: "#4682B4" },
    { category: "Rent", value: 30, color: "#87CEFA" },
];

const margin = { top: 50, right: 100, bottom: 50, left: 100 };
const height = 600;
const width = 600;
const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left + (width - margin.left - margin.right) / 2},
                                  ${margin.top + (height - margin.top - margin.bottom) / 2})`);

svg.append("text")
    .attr("x", 0)
    .attr("y", -radius - margin.bottom)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("Average Household Expenses")
    .style("font-family", "Arial")

const pie = d3.pie()
    .value(d => d.value)
    .sort(null);

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

const outerArc = d3.arc()
    .innerRadius(radius)
    .outerRadius(radius);

const arcs = svg.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g");

arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => d.data.color)
    .attr("stroke", "#000")
    .attr("stroke-width", "1px");

arcs.append("text")
    .attr("transform", d => {
        const pos = arc.centroid(d);
        pos[1] -= 1;
        return `translate(${pos})`;
    })
    .attr("text-anchor", "middle")
    .attr("font-size", d => d.data.value < 5 ? "12px" : "12px")
    .attr("fill", "#000")
    .attr("font-family", "Arial")
    .text(d => `${d.data.value.toFixed(1)}%`);

arcs
    .append("text")
    .attr("transform", (d) => {
        const pos = outerArc.centroid(d);
        pos[0] *= 1.1;
        pos[1] *= 1.1;
        return `translate(${pos})`;
    })
    .attr("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end"))
    .attr("font-size", "12px")
    .attr("font-family", "Arial")
    .attr("fill", "#000")
    .text((d) => d.data.category);

function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
}