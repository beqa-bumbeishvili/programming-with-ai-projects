class RadarChart {
  constructor(data) {
    const style = document.createElement("style");
    style.textContent = `
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
            }
            
            #radar-chart {
                width: 1000px;
                height: 600px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        `;
    document.head.appendChild(style);

    const attrs = {
      svgWidth: 1000,
      svgHeight: 600,

      marginTop: 70,
      marginBottom: 70,
      marginRight: 70,
      marginLeft: 70,

      // Base dimensions and settings
      container: "body",
      data: data,
      levels: 5,
      maxValue: 100,
      labelFactor: 1.25,
      wrapWidth: 90,
      roundStrokes: true,

      // Color scheme
      color: d3.scaleOrdinal().range(["#FF6B6B", "#4ECDC4"]),

      axisLabel: {
        xOffset: 4,
        dyOffset: "0.4em",
        fontSize: "10px",
        fill: "#737373",
      },

      gridCircle: {
        fill: "#CDCDCD",
        stroke: "#CDCDCD",
        fillOpacity: 0.1,
      },

      line: {
        stroke: "#CDCDCD",
        strokeWidth: "1px",
      },

      legend: {
        fontSize: "12px",
        fontWeight: "bold",
        textAnchor: "start",
        dyOffset: "0.35em",
        rectSize: 12,
        spacing: 15,
        xOffset: 400,
        yOffset: 0,
      },

      radarArea: {
        fillOpacity: 0.35,
      },

      radarStroke: {
        strokeWidth: 2,
      },

      radarCircle: {
        radius: 4,
        fillOpacity: 0.8,
      },
    };

    this.attrs = attrs;
    this.state = {
      data: data,
      svg: null,
      chartWidth: null,
      chartHeight: null,
    };
  }

  container(value) {
    if (!arguments.length) return this.attrs.container;
    this.attrs.container = value;
    return this;
  }

  data(value) {
    if (!arguments.length) return this.state.data;
    this.state.data = value;
    return this;
  }

  setDimensions() {
    const {
      svgWidth,
      svgHeight,
      marginTop,
      marginBottom,
      marginRight,
      marginLeft,
    } = this.attrs;

    this.state.chartWidth = svgWidth - marginLeft - marginRight;
    this.state.chartHeight = svgHeight - marginTop - marginBottom;
  }

  drawSvgAndWrappers() {
    const { container, svgWidth, svgHeight } = this.attrs;

    // Draw SVG
    this.state.svg = d3
      .select(container)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);
  }

  drawRadarChart() {
    const { svg, data } = this.state;
    const {
      levels,
      maxValue,
      labelFactor,
      wrapWidth,
      opacityArea,
      dotRadius,
      strokeWidth,
      color,
    } = this.attrs;

    const allAxis = data[0].axes.map((i) => i.axis),
      total = allAxis.length,
      radius = Math.min(this.state.chartWidth / 2, this.state.chartHeight / 2),
      angleSlice = (Math.PI * 2) / total;

    // Scale for the radius
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    // Draw the circular grid
    const axisGrid = svg.append("g").attr("class", "axisWrapper");

    // Draw the background circles
    axisGrid
      .selectAll(".levels")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d) => (radius / levels) * d)
      .style("fill", this.attrs.gridCircle.fill)
      .style("stroke", this.attrs.gridCircle.stroke)
      .style("fill-opacity", this.attrs.gridCircle.fillOpacity);

    // Add level numbers
    axisGrid
      .selectAll(".axisLabel")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr("x", this.attrs.axisLabel.xOffset)
      .attr("y", (d) => (-d * radius) / levels)
      .attr("dy", this.attrs.axisLabel.dyOffset)
      .style("font-size", this.attrs.axisLabel.fontSize)
      .attr("fill", this.attrs.axisLabel.fill)
      .text((d) => Math.round((maxValue * d) / levels) + "%");

    // Draw the axes
    const axis = axisGrid
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    // Draw the lines
    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr(
        "x2",
        (d, i) =>
          rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "y2",
        (d, i) =>
          rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .attr("class", "line")
      .style("stroke", this.attrs.line.stroke)
      .style("stroke-width", this.attrs.line.strokeWidth);

    // Draw the axis labels
    axis
      .append("text")
      .attr("class", "legend")
      .style("font-size", this.attrs.legend.fontSize)
      .style("font-weight", this.attrs.legend.fontWeight)
      .attr("text-anchor", this.attrs.legend.textAnchor)
      .attr("dy", this.attrs.legend.dyOffset)
      .attr(
        "x",
        (d, i) =>
          rScale(maxValue * labelFactor) *
          Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "y",
        (d, i) =>
          rScale(maxValue * labelFactor) *
          Math.sin(angleSlice * i - Math.PI / 2)
      )
      .text((d) => d)
      .call(wrap, wrapWidth);

    // Draw the radar chart blobs
    const radarLine = d3
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    // Create the radar areas
    svg
      .selectAll(".radarWrapper")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "radarWrapper")
      .append("path")
      .attr("class", "radarArea")
      .attr("d", (d) => radarLine(d.axes))
      .style("fill", (d, i) => color(i))
      .style("fill-opacity", this.attrs.radarArea.fillOpacity);

    // Create the outlines
    svg
      .selectAll(".radarWrapper")
      .append("path")
      .attr("class", "radarStroke")
      .attr("d", (d) => radarLine(d.axes))
      .style("stroke-width", this.attrs.radarStroke.strokeWidth + "px")
      .style("stroke", (d, i) => color(i))
      .style("fill", "none");

    // Append the circles
    svg
      .selectAll(".radarWrapper")
      .selectAll(".radarCircle")
      .data((d) => d.axes)
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", this.attrs.radarCircle.radius)
      .attr(
        "cx",
        (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .style("fill", (d, i, j) => color(j))
      .style("fill-opacity", this.attrs.radarCircle.fillOpacity);
  }

  drawLegend() {
    const { svg, data } = this.state;
    const { color, legend } = this.attrs;

    // Create legend group with updated positioning
    const legendGroup = svg
      .append("g")
      .attr("class", "legend-group")
      .attr("transform", `translate(${legend.xOffset},${legend.yOffset})`);

    // Add legend items
    const legendItems = legendGroup
      .selectAll(".legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * legend.spacing})`);

    // Add colored rectangles
    legendItems
      .append("rect")
      .attr("width", legend.rectSize)
      .attr("height", legend.rectSize)
      .style("fill", (d, i) => color(i));

    // Add text labels
    legendItems
      .append("text")
      .attr("x", legend.rectSize + 5)
      .attr("y", legend.rectSize / 2)
      .style("font-size", legend.fontSize)
      .style("font-weight", legend.fontWeight)
      .attr("dy", "0.35em")
      .text((d) => d.name);
  }

  render() {
    this.setDimensions();
    this.drawSvgAndWrappers();
    this.drawRadarChart();
    this.drawLegend();
    return this;
  }
}

// Text wrapping function
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.4,
      y = text.attr("y"),
      x = text.attr("x"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

// Create the initialization function
function initializeChart(data) {
  if (!data || !data.length) {
    console.error("No data provided to chart");
    return;
  }

  const chart = new RadarChart(data).container("#radar-chart").render();
}
