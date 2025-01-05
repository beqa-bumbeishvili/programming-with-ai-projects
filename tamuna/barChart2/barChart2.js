const photoElement = document.getElementById('photo');
photoElement.style.width="1160px";
photoElement.style.backgroundColor = "white";
photoElement.style.borderRadius = "8px";
photoElement.style.marginTop = "30px";
photoElement.style.marginBottom = "50px";
photoElement.style.marginLeft = "30px";
photoElement.style.marginRight = "30px";
photoElement.style.padding = "20px";

const all = document.getElementById("all");
all.style.display = "flex";
all.style.justifyContent = "flex-start";  
all.style.alignItems = "center";   
all.style.gap= "10px";       
all.style.width = "100%";   
all.style.paddingLeft= "40px";
all.style.marginTop = "0px";
all.style.paddingTop = "0px";
all.style.height="50px"
          
const header = document.getElementById('myHeading');
header.style.fontFamily = "Helvetica";
header.style.fontSize = '24px';
header.style.fontWeight = "800";
header.style.color = '#606060';
header.style.paddingTop = "20px";
header.style.paddingLeft= "40px";
header.style.paddingBottom= "0px";

const bigText = document.getElementById('bigText');
bigText.style.fontFamily = "Helvetica";
bigText.style.fontSize = '34px';
bigText.style.letterSpacing = '2px';
bigText.style.color = '#404040';
bigText.style.fontWeight = "1000";
bigText.style.display = "inline"; 

const greenText = document.getElementById('greenText');
greenText.style.fontFamily = "Helvetica";
greenText.style.fontSize = '18px';
greenText.style.color = '#49D46C';
greenText.style.fontWeight = "1000";
greenText.style.display = "inline"; 

const greyText = document.getElementById('greyText');
greyText.style.fontFamily = "Helvetica";
greyText.style.fontSize = '16px';
greyText.style.color = 'lightgrey';
greyText.style.fontWeight = "800";
greyText.style.letterSpacing = "1px";
greyText.style.display = "inline"; 
greyText.style.marginLeft = "10px"; 
bigText.style.marginRight = "420px";
 
const buttonContainer = document.getElementById("buttonContainer");
buttonContainer.style.display = "flex";
buttonContainer.style.gap = "10px"; 

const dots = document.getElementById('dots');
dots.style.fontSize = "24px";
dots.style.border = "none";
dots.style.height = "40px";
dots.style.width = "40px";
dots.style.borderRadius = "4px";

const exportButton = document.getElementById('Export');
exportButton.style.border = "none";
exportButton.style.height = "40px";
exportButton.style.width = "100px";
exportButton.style.borderRadius = "4px";
exportButton.style.fontSize = "18px";
exportButton.style.color = "grey";
exportButton.style.backgroundColor = "#f1f1f1"; 
exportButton.style.cursor = "pointer";

const start = 90;      
const increment = 90;  
const length = 12;     

const dataset = [];

for (let i = 0; i < length; i++) {
    dataset.push(start + i * increment);
}

const margin = { top: 50, right: 30, bottom: 40, left: 30 };
const width = 1150 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
   
const histogram = d3.histogram()
    .domain([0, 1080])   
    .thresholds(d3.range(0, 1150, 10)); 

const bins = histogram(dataset);

const customHeights = [200, 250, 180, 220, 200, 70, 210, 80, 140, 150, 70, 160]; 

const x = d3.scaleLinear()
    .domain([-5, 120]) 
    .range([0, width+25]);

const y = d3.scaleLinear()
    .domain([0, d3.max(customHeights)+50]) 
    .range([height+50, 0]);

const barWidth = x(bins[1].x0) - x(bins[0].x0) - 1;

svg.selectAll(".bar")
    .data(bins)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.x0)) 
    .attr("width", barWidth) 
    .attr("y", (d, i) => y(customHeights[i])) 
    .attr("height", (d, i) => height - y(customHeights[i])) 
    .style("fill", "#BEF2CC"); 

svg.selectAll(".top-bar")
    .data(bins)
    .enter().append("rect")
    .attr("class", "top-bar")
    .attr("x", d => x(d.x0))
    .attr("width", d => x(d.x1) - x(d.x0) - 1)
    .attr("y", (d, i) => y(customHeights[i])-1 ) 
    .attr("height", 3)
    .style("fill", "#49D46C")
    .filter((d, i) => i === bins.length - 97)  
    .remove();

const labels = [
        "50", "100", "150", "200", "250", 
        "300", "350", "400", "450", "500", 
        "550", "600"
    ];

svg.selectAll(".label")
    .data(bins)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)  
        .attr("y", height + 30)  
        .text((d, i) => labels[i])  
        .style("fill", "black")
        .style("font-family"," monospace")
        .style("text-anchor", "middle");


svg.selectAll('.x.axis').style('display', 'none');
svg.selectAll('.y.axis').style('display', 'none');

document.getElementById('Export').addEventListener('click', function () {
    const svg = document.querySelector('svg');
    
    const svgWidth = svg.viewBox.baseVal.width || svg.width.baseVal.value;
    const svgHeight = svg.viewBox.baseVal.height || svg.height.baseVal.value;
    
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = svgWidth;
        canvas.height = svgHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngUrl = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = 'barChart.png';
        link.href = pngUrl;
        link.click();
        
        URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
});


// feedback
// getElementById, addEventListener, createElement არ გამოიყენო ვაფშე, d3-ის შესაბამისი მეთოდებით ჩაანაცვლე