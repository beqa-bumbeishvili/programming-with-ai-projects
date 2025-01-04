const data = [
	{ category: "Leisure", value: 10, color: "#fb9a98" },
	{ category: "Loan", value: 10, color: "#31a02d" },
	{ category: "Transportation", value: 15, color: "#b2df8a" },
	{ category: "Food", value: 20, color: "#2078b4" },
	{ category: "Rent", value: 30, color: "#a6cee3" },
	{ category: "Utilities", value: 2, color: "#ff7f00" },
	{ category: "Education", value: 5, color: "#fdbf6e" },
	{ category: "Healthcare", value: 8, color: "#e21a1b" }
];

const width = 1000;
const height = 500;
const radius = Math.min(width, height) / 2;

const pie = d3.pie()
	.value(d => d.value)
	.sort(null);

const arc = d3.arc()
	.innerRadius(0)
	.outerRadius(radius);

const svg = d3.select("svg")
	.attr("viewBox", `0 0 ${width} ${height}`)
	.append("g")
	.attr("transform", `translate(${width / 2}, ${height / 2})`);

const arcs = svg.selectAll("path")
	.data(pie(data))
	.enter()
	.append("path")
	.attr("d", arc)
	.attr("fill", d => d.data.color)
	.style("stroke", "black")
	.style("stroke-width", "0.7");

const innerLabels = svg.selectAll(".inner-label")
	.data(pie(data))
	.enter()
	.append("text")
	.attr("class", "inner-label")
	.attr("transform", d => `translate(${arc.centroid(d)})`)
	.attr("dy", "0.35em")
	.attr("text-anchor", "middle")
	.text(d => `${d.data.value.toFixed(1)}%`)
	.style("font-size", "10px")
	.style("fill", "black")
	.style("font-weight", "1px");


const outerLabels = svg.selectAll(".outer-label")
	.data(pie(data))
	.enter()
	.append("text")
	.attr("class", "outer-label")
	.attr("transform", function (d) {
		const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
		const posX = Math.cos(midAngle - Math.PI / 2) * radius * 1.05;
		const posY = Math.sin(midAngle - Math.PI / 2) * radius * 1.05;
		return `translate(${posX},${posY})`;
	})
	.attr("text-anchor", d => {
		const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
		return midAngle < Math.PI ? "start" : "end";
	})
	.attr("alignment-baseline", "middle")
	.attr("dx", function (d) {
		const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
		return midAngle < Math.PI ? "0.5em" : "-0.5em";
	})
	.text(d => `${d.data.category}`)
	.style("font-size", "12px")
	.style("fill", "#333");