class Chart {
  constructor() {
    const attrs = {
      // Chart dimensions
      svgWidth: 1100,
      svgHeight: 400,
      marginTop: 10,
      marginBottom: 30,
      marginRight: 20,
      marginLeft: 60,
      container: "#chart",
      data: [],

      // Container styles
      containerStyles: {
        width: "95%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px",
        position: "relative",
      },

      // Info text styles
      infoTextStyles: {
        display: "block",
        width: "calc(100% - 120px)", // Adjusted width
        fontFamily: "Helvetiva",
        marginBottom: "30px",
        marginLeft: "0", // Reset margin
        fontSize: "14px",
        position: "relative",
        backgroundColor: "rgba(0,0,255,0.1)", // Temporary background
      },

      // Chart container styles
      chartContainerStyles: {
        display: "block",
        width: "100%",
        height: "400px",
        position: "relative",
        clear: "both",
        backgroundColor: "rgba(255,0,0,0.1)", // Temporary background
      },

      // Individual info line styles - NEW
      infoLineStyles: {
        marginLeft: "60px", // Move individual lines instead
      },

      // SVG margins
      marginTop: 10,
      marginBottom: 30,
      marginRight: 20,
      marginLeft: 60, // This should match infoTextStyles marginLeft

      // Text styles
      textStyles: {
        infoLine: {
          marginBottom: "4px",
          display: "block",
        },
        company: {
          fontSize: "24px",
          fontWeight: "normal",
          color: "#333",
        },
        bold: {
          fontSize: "24px",
          fontWeight: "bold",
        },
        price: {
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "8px",
        },
        green: {
          color: "#4caf50",
          fontWeight: "bold",
        },
        red: {
          color: "#f44336",
          fontWeight: "bold",
        },
        black: {
          color: "#333",
        },
      },

      // Chart element styles
      chartElementStyles: {
        area: {
          fill: "rgba(0, 128, 0, 0.2)",
        },
        line: {
          fill: "none",
          stroke: "green",
          "stroke-width": "2",
        },
      },
    };

    this.attrs = attrs;
    this.state = {
      data: null,
      svg: null,
      chartWidth: null,
      chartHeight: null,
      parseDate: d3.timeParse("%d-%m-%y %H:%M"),
    };
  }

  // Getter/setter methods
  svgWidth(value) {
    if (!arguments.length) return this.attrs.svgWidth;
    this.attrs.svgWidth = value;
    return this;
  }

  svgHeight(value) {
    if (!arguments.length) return this.attrs.svgHeight;
    this.attrs.svgHeight = value;
    return this;
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

  // Helper methods
  getState() {
    return this.state;
  }

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
  }

  // Main render method
  render() {
    this.applyStyles();
    this.setDimensions();
    this.drawSvgAndWrappers();
    this.drawLineChart();
    return this;
  }

  // Set dimensions
  setDimensions() {
    const {
      marginTop,
      marginBottom,
      marginRight,
      marginLeft,
      svgWidth,
      svgHeight,
    } = this.attrs;

    this.setState({
      chartWidth: svgWidth - marginLeft - marginRight,
      chartHeight: svgHeight - marginTop - marginBottom,
    });
  }

  // Draw SVG and wrappers
  drawSvgAndWrappers() {
    const { container, svgWidth, svgHeight, marginLeft, marginTop } =
      this.attrs;

    // Remove any existing SVG
    d3.select(container).selectAll("svg").remove();

    // Add SVG
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`);

    this.setState({ svg });
  }

  // Draw line chart
  drawLineChart() {
    const {
      svg,
      data,
      chartWidth: width,
      chartHeight: height,
    } = this.getState();
    const { chartElementStyles } = this.attrs;

    if (!data || !data.length) {
      console.error("No data available");
      return;
    }

    // Set scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.price) * 0.99,
        d3.max(data, (d) => d.price) * 1.01,
      ])
      .range([height, 0]);

    // Create line generator
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.price))
      .curve(d3.curveMonotoneX);

    // Create area generator
    const area = d3
      .area()
      .x((d) => x(d.date))
      .y0(height)
      .y1((d) => y(d.price))
      .curve(d3.curveMonotoneX);

    // Add gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(0, 128, 0, 0.1)");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(0, 128, 0, 0.3)");

    // Add area with styles
    svg
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", chartElementStyles.area.fill);

    // Add line with styles
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .style("fill", chartElementStyles.line.fill)
      .style("stroke", chartElementStyles.line.stroke)
      .style("stroke-width", chartElementStyles.line["stroke-width"]);

    // Add axes
    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""))
      .style("stroke", "#e5e5e5")
      .style("stroke-width", "0.5")
      .call((g) => g.selectAll(".tick line").style("stroke", "#e5e5e5"))
      .call((g) => g.select(".domain").remove());

    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(2))
      .call((g) => g.select(".domain").remove())
      .style("font-size", "13px")
      .style("fill", "#666666")
      .call((g) =>
        g
          .selectAll(".tick text")
          .style("font-size", "13px")
          .style("fill", "#666666")
      )
      .call((g) => g.selectAll(".tick line").style("stroke", "#e5e5e5"));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeDay.every(1))
          .tickFormat(d3.timeFormat("%b %d"))
      )
      .call((g) => g.select(".domain").remove())
      .style("font-size", "13px")
      .style("fill", "#666666")
      .call((g) =>
        g
          .selectAll(".tick text")
          .style("font-size", "13px")
          .style("fill", "#666666")
      )
      .call((g) => g.selectAll(".tick line").style("stroke", "#e5e5e5"));
  }

  // Add this new method
  applyStyles() {
    const {
      textStyles,
      containerStyles,
      infoTextStyles,
      chartContainerStyles,
      infoLineStyles,
    } = this.attrs;

    // Apply container styles
    Object.entries(containerStyles).forEach(([key, value]) => {
      d3.select("#chart-container").style(key, value);
    });

    // Apply info text styles
    Object.entries(infoTextStyles).forEach(([key, value]) => {
      d3.select("#info-text").style(key, value);
    });

    // Apply chart styles
    Object.entries(chartContainerStyles).forEach(([key, value]) => {
      d3.select("#chart").style(key, value);
    });

    // Apply text styles
    d3.selectAll(".info-line")
      .style("margin-bottom", textStyles.infoLine.marginBottom)
      .style("display", textStyles.infoLine.display);

    // Apply company name styles
    d3.selectAll(".info-line.company")
      .style("font-size", textStyles.company.fontSize)
      .style("font-weight", textStyles.company.fontWeight)
      .style("color", textStyles.company.color);

    // Apply main price styles
    d3.select(".info-line.bold")
      .style("font-size", textStyles.price.fontSize)
      .style("font-weight", textStyles.price.fontWeight)
      .style("margin-bottom", textStyles.price.marginBottom);

    // Apply span bold styles
    d3.selectAll("span.bold").style("font-weight", "bold");

    // Apply color styles
    d3.selectAll("span.green").style("color", textStyles.green.color);
    d3.selectAll("span.red").style("color", textStyles.red.color);
    d3.selectAll("span.black").style("color", textStyles.black.color);

    // Apply margin to individual info lines
    d3.selectAll(".info-line").style("margin-left", infoLineStyles.marginLeft);

    // Apply color AND bold styles to percentage values
    d3.selectAll('span.green')
        .style('color', textStyles.green.color)
        .style('font-weight', 'bold');        // Explicit bold

    d3.selectAll('span.red')
        .style('color', textStyles.red.color)
        .style('font-weight', 'bold');        // Explicit bold

    d3.selectAll('span.black')
        .style('color', textStyles.black.color);

    // Make sure span.bold is still bold
    d3.selectAll('span.bold')
        .style('font-weight', 'bold');
  }
}
