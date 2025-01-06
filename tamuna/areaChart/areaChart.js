class AreaChart {
    constructor() {
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 800,
            svgHeight: 400,
            marginTop: 10,
            marginBottom: 30,
            marginRight: 30,
            marginLeft: 50,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: null,
            chartWidth: null,
            chartHeight: null
        };

        this.getState = () => attrs;
        this.setState = (d) => Object.assign(attrs, d);

        Object.keys(attrs).forEach((key) => {
            this[key] = function (_) {
                if (!arguments.length) return attrs[key];
                attrs[key] = _;
                return this;
            };
        });
    }

    render() {
        const attrs = this.getState();
        const margin = { 
            top: attrs.marginTop, 
            right: attrs.marginRight, 
            bottom: attrs.marginBottom, 
            left: attrs.marginLeft 
        };
        
        const width = attrs.svgWidth - margin.left - margin.right;
        const height = attrs.svgHeight - margin.top - margin.bottom;

        this.createContainers(width, height, margin);
        this.setupScales(width, height);
        this.drawAxes(width, height);
        this.drawChart(width, height);
        this.updatePriceInfo();

        return this;
    }

    createContainers(width, height, margin) {
        const mainContainer = d3.select(this.container())
            .append("div")
            .style("width", "100%")
            .style("max-width", "800px")
            .style("margin", "0 auto")
            .style("padding-top", "40px");

        const contentContainer = mainContainer.append("div")
            .style("width", "100%");

        const titleGroup = contentContainer
            .insert("div", "svg")
            .style("margin-bottom", "100px");

        titleGroup.append("div")
            .style("font-size", "18px")
            .style("font-family", "Helvetica")
            .style("margin-left", "10px")
            .style("opacity", "0.8")
            .text("Apple Inc (AAPL)");

        const priceGroup = titleGroup.append("div")
            .style("position", "relative")
            .style("margin-left", "10px");

        const svg = contentContainer.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this.setState({ svg, priceGroup });
    }

    setupScales(width, height) {
        const { data } = this.getState();

        const x = d3.scaleTime()
            .domain([d3.min(data, d => d.date), d3.max(data, d => d.date)])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([246, 256])
            .range([height, 0]);

        this.setState({ x, y });
    }

    drawAxes(width, height) {
        const { svg, x, y } = this.getState();

        // X axis
        const xAxis = d3.axisBottom(x)
            .ticks(5)
            .tickSize(0)
            .tickFormat((d, i) => {
                const formattedDate = d3.timeFormat("%b %d")(d);
                return formattedDate === "Dec 15" ? "" : formattedDate;
            });

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "14px")
            .style("fill", "grey")
            .style("font-family", "Arial, sans-serif")
            .style("text-anchor", "middle")
            .attr("dx", "15")
            .attr("dy", "25");

        svg.select("g").select("path").remove();

        // Y axis
        const yAxis = d3.axisLeft(y)
            .tickValues([246, 248, 250, 252, 254, 256])
            .tickSize(0);

        svg.append("g")
            .call(yAxis)
            .attr("class", "y-axis")
            .selectAll("text")
            .style("font-size", "14px")
            .style("fill", "grey")
            .style("font-family", "Arial, sans-serif")
            .style("text-anchor", "end")
            .attr("dx", "-10");

        d3.select(".y-axis").selectAll("path, line").remove();
    }

    drawChart(width, height) {
        const { svg, x, y, data } = this.getState();

        // Add gridlines
        this.drawGridlines(width);

        // Create gradient
        const areaGradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "areaGradient")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        areaGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#39A93B")
            .attr("stop-opacity", 0.4);

        areaGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#39A93B")
            .attr("stop-opacity", 0);

        // Add area
        const area = d3.area()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d.value))
            .curve(d3.curveLinear);

        svg.append("path")
            .datum(data)
            .attr("fill", "url(#areaGradient)")
            .attr("d", area);

        // Add line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#39A93B")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
                .curve(d3.curveLinear)
            );
    }

    drawGridlines(width) {
        const { svg, y } = this.getState();

        const makeGridlines = () => {
            return d3.axisLeft(y)
                .tickValues([246, 248, 250, 252, 254, 256]);
        };

        svg.append("g")
            .attr("class", "grid")
            .style("stroke", "lightgrey")
            .style("opacity", "0.1")
            .call(makeGridlines()
                .tickSize(-width)
                .tickFormat("")
            )
            .select(".domain").remove();

        svg.select(".grid").lower();
    }

    updatePriceInfo() {
        const { priceGroup } = this.getState();

        priceGroup.append("h1")
            .style("font-size", "36px")
            .style("font-family", "Helvetica")
            .style("font-weight", "500")
            .style("margin", "0")
            .style("margin-top", "10px")
            .text("$249.79");

        priceGroup.append("h2")
            .style("position", "absolute")
            .style("left", "0")
            .style("top", "40px")
            .style("font-size", "14px")
            .style("font-family", "Arial, sans-serif")
            .style("color", "#39A93B")
            .style("margin", "0")
            .style("margin-top", "20px")
            .html("+$2.14 (0.86%) <span style='color: black; font-family: Helvetica;\
               font-weight: 500; margin-left: 10px'> Past 5 days</span>");

        priceGroup.append("h3")
            .style("position", "absolute")
            .style("left", "2px")
            .style("top", "40px")
            .style("font-size", "14px")
            .style("font-family", "Arial, sans-serif")
            .style("color", "black")
            .style("font-weight", "550")
            .style("margin", "0")
            .style("margin-top", "45px")
            .style("margin-bottom", "40px")
            .html(`$247.32 <span style='color: red; font-family: Helvetica;\
               font-weight:350; margin-left: 10px'> -$2.47 (-0.99%)</span><span style='color: black; font-family: Helvetica;\
               font-weight:350;margin-left: 10px'> Pre-Market</span>`);
    }

    setDynamicContainer() {
        const attrs = this.getState();
        
        // Get container width
        const containerEl = d3.select(attrs.container).node();
        const containerWidth = containerEl.getBoundingClientRect().width;
        
        // Update dimensions
        attrs.svgWidth = Math.min(containerWidth, 800);
        attrs.svgHeight = Math.max(attrs.svgWidth * 0.5, 300); // minimum height of 300px
        attrs.chartWidth = attrs.svgWidth - attrs.marginLeft - attrs.marginRight;
        attrs.chartHeight = attrs.svgHeight - attrs.marginTop - attrs.marginBottom;

        // Add resize listener (with cleanup of old listener)
        const resizeHandler = () => {
            const newWidth = containerEl.getBoundingClientRect().width;
            attrs.svgWidth = Math.min(newWidth, 800);
            attrs.svgHeight = Math.max(attrs.svgWidth * 0.5, 300);
            attrs.chartWidth = attrs.svgWidth - attrs.marginLeft - attrs.marginRight;
            attrs.chartHeight = attrs.svgHeight - attrs.marginTop - attrs.marginBottom;
            
            d3.select(attrs.container).selectAll("*").remove();
            this.render();
        };

        // Remove old listener if exists
        if (window._chartResizeHandler) {
            window.removeEventListener('resize', window._chartResizeHandler);
        }
        
        // Add new listener
        window._chartResizeHandler = resizeHandler;
        window.addEventListener('resize', resizeHandler);

        return this;
    }
}

// Data loading
d3.csv("areaChart.csv", d => {
    const parseDate = d3.timeParse("%b %d %H:%M");
    const date = parseDate(d.date);
    
    return {
        date: date,
        value: +d.value
    };
}).then(data => {
    console.log("Data loaded:", data);
    const chart = new AreaChart()
        .container("#chart")
        .data(data)
        .setDynamicContainer()
        .render();
}).catch(error => {
    console.error("Error loading data:", error);
});