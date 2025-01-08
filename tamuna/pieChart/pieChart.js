document.body.style.margin = "0";
document.body.style.marginTop = "100px";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.overflow = "hidden";

const chartContainer = document.getElementById('chart-container');
chartContainer.style.width = "100vw";
chartContainer.style.height = "60vh";
chartContainer.style.maxWidth = "900px";
chartContainer.style.maxHeight = "400px";

d3.csv('pieChart.csv').then(data => {

data.forEach(d => {
     d.name = d.name.trim();  
     d.expenses_percent = +d.expenses_percent;  
 });

data = data.filter(d => d.expenses_percent > 0);

const chartContainer = d3.select("#chart-container");
const svgWidth = chartContainer.node().clientWidth*1;
const svgHeight = chartContainer.node().clientHeight*1.3;

const radius = Math.min(500, 500) / 2;

const colorScale = d3.scaleOrdinal()
     .range(["#FB9A99", "#33A02C", "#B2DF8A", "#1F78B4", "#A7CEE3", "#FF7F00", "#FDBF6F", "#E31A1C"]);

const svg = chartContainer
     .append("svg")
     .attr("width", svgWidth)
     .attr("height", svgHeight);

const g = svg.append("g")
     .attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);

const pie = d3.pie()
     .value(d => d.expenses_percent)  
     .sort(null);  

const arc = d3.arc()
     .innerRadius(0)  
     .outerRadius(radius * 0.75);  

const labelArc = d3.arc()
     .innerRadius(radius * 0.90)  
     .outerRadius(radius * 0.75);  

const percentageArc = d3.arc()
     .innerRadius(radius * -0.10)  
     .outerRadius(radius);  

 const arcs = g.selectAll(".arc")
     .data(pie(data))
     .enter().append("g")
     .attr("class", "arc");

 arcs.append("path")
     .attr("d", arc)  
     .style("fill", (d, i) => colorScale(i)) 
     .style("stroke", "black")  
     .style("stroke-width", "0.5px");
    
 arcs.append("text")
     .attr("transform", function(d) {
        const centroid = labelArc.centroid(d);  
        return `translate(${centroid})`;  
     })
     .attr("text-anchor", function(d) {
         const angle = (d.startAngle + d.endAngle) / 2;  
         return angle > Math.PI ? "end" : "start";  
     }) 
     .style("font-size", "11px")
     .style("font-weight","300")
     .style("font-family", "Helvetica")
     .text(d => d.data.name);  

arcs.append("text")
     .attr("transform", function(d) {
      const centroid = percentageArc.centroid(d);  
      const angle = (d.startAngle + d.endAngle) / 2;
      const offset = d.data.expenses_percent < 5 ? 5 : 0;  
      return `translate(${centroid[0] + offset}, ${centroid[1] + offset+4})` 
      })
     .attr("text-anchor", "middle")  
     .style("font-size", "8px")
     .style("font-weight","300")
     .style("font-family", "Helvetica")
     .text(d => `${d.data.expenses_percent.toFixed(1)}%`); 

svg.append("text")
     .attr("x", svgWidth / 2)  
     .attr("y", 20)  
     .attr("text-anchor", "middle")  
     .style("font-size", "16px")  
     .style("font-weight", "bold")  
     .style("font-family", "Helvetica")  
     .text("Average Household Expenses");  
});
