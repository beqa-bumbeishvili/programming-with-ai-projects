d3.selection.prototype._add = function(tagName) {
    return this.append(tagName);
};

class AreaChart {
    constructor() {
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            container: "body",
            svgWidth: 1000,
            svgHeight: 400,
            width: null,
            height: null,
            marginTop: 40,
            marginBottom: 40,
            marginRight: 20,
            marginLeft: 40,
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: [],
            mainContainerStyles: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
                marginTop: "80px",
            },
            contentContainerStyles: {
                width: "800px",
                maxWidth: "700px"
            },
            titleGroupStyles: {
                marginBottom: "30px"
            },
            companyTitleStyles: {
                fontSize: "18px",
                fontFamily: "Helvetica",
                marginLeft: "5px",
                opacity: "0.8"
            },
            priceGroupStyles: {
                position: "relative",
                marginLeft: "5px"
            },
            mainPriceStyles: {
                fontSize: "36px",
                fontFamily: "Helvetica",
                fontWeight: "500",
                margin: "0",
                marginTop: "10px"
            },
            timeframeWeight: "300",
            preMarketLabelWeight: "300",
            preMarketDeltaWeight: "300",
            priceDeltaStyles: {
                position: "absolute",
                left: "0",
                top: "30px",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                color: "#39A93B",
                margin: "0",
                marginTop: "20px",
                priceDelta: "+$2.14",
                priceDeltaPercent: "0.86",
                timeframeText: "Past 5 days",
                timeframeStyles: {
                    color: "black",
                    fontFamily: "Helvetica",
                    fontWeight: "200",
                    marginLeft: "10px"
                }
            },
            preMarketStyles: {
                position: "absolute",
                left: "2px",
                top: "10px",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                color: "black",
                marginTop: "75px",
                marginBottom: "60px",
                deltaFontWeight: "200",
                labelFontWeight: "200",
                deltaSpanStyles: {
                    marginLeft: "10px"
                }
            },
            xAxisTextStyles: {
                fontSize: "14px",
                fill: "grey",
                fontFamily: "Arial, sans-serif",
                textAnchor: "middle"
            },
            yAxisTextStyles: {
                fontSize: "14px",
                fill: "grey",
                fontFamily: "Arial, sans-serif",
                textAnchor: "end"
            },
            gridStyles: {
                stroke: "#e0e0e0",
                opacity: "0.5"
            },
            areaStyles: {
                fillGradientTop: {
                    color: "#39A93B",
                    opacity: 0.4
                },
                fillGradientBottom: {
                    color: "#39A93B",
                    opacity: 0
                }
            },
            lineStyles: {
                stroke: "#39A93B",
                strokeWidth: 2
            },
            grid: {
                horizontal: {
                    stroke: "lightgrey",
                    opacity: 0.1,
                    strokeWidth: 1,
                    config: {
                        ticks: 5,
                        tickSize: null  
                    }
                },
                vertical: {
                    stroke: "lightgrey",
                    opacity: 0.1,
                    strokeWidth: 1,
                    config: {
                        ticks: 5,
                        tickSize: null
                    }
                }
            },
            xAxis: {
                text: {
                    fontSize: "14px",
                    fill: "grey",
                    fontFamily: "Arial, sans-serif",
                    textAnchor: "middle",
                    dx: "15",
                    dy: "25"
                },
                line: {
                    stroke: "none"
                },
                ticks: {
                    number: 5
                }
            },
            svg: {
                preserveAspectRatio: "xMidYMid meet"
            },
            area: {
                gradient: {
                    top: { color: "#39A93B", opacity: 0.4 },
                    bottom: { color: "#39A93B", opacity: 0 }
                },
                path: {}
            },
            gradient: {
                x1: "0%",
                y1: "0%",
                x2: "0%",
                y2: "100%",
                stops: {
                    start: { offset: "0%" },
                    end: { offset: "100%" }
                }
            },
            gridlines: {
                class: "grid",
                style: {
                    stroke: "lightgrey",
                    opacity: "0.1"
                },
                ticks: 5,
                domain: false
            },
            preMarketPrice: "$247.32",
            preMarketDelta: "-$2.47",
            preMarketDeltaPercent: "-0.99",
            preMarketDeltaColor: "red",
            timeframeStyles: {
                color: "black",
                fontFamily: "Helvetica",
                fontWeight: "${attrs.timeframeWeight}",
                marginLeft: "10px"
            },
            preMarketLabelStyles: {
                color: "black",
                fontFamily: "Helvetica",
                fontWeight: "${attrs.preMarketLabelWeight}",
                marginLeft: "10px"
            }
        };

        this.attrs = attrs;

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

    calc(props) {
        const attrs = this.getState();

        attrs.width = attrs.svgWidth - attrs.marginLeft - attrs.marginRight;
        attrs.height = attrs.svgHeight - attrs.marginTop - attrs.marginBottom;

        return this;
    }

    render() {
        const attrs = this.getState();
        
        this.calc();
        
        const margin = { 
            top: attrs.marginTop, 
            right: attrs.marginRight, 
            bottom: attrs.marginBottom, 
            left: attrs.marginLeft 
        };
        
        this.createContainers(attrs.width, attrs.height, margin);
        this.setupScales();
        this.drawAxes();
        this.drawChart();
        this.updatePriceInfo();

        return this;
    }

    createContainers(width, height, margin) {
        const attrs = this.getState();

        d3.select(attrs.container).selectAll("*").remove();

        const mainContainer = d3.select(attrs.container)
            ._add("div")
            .style("display", attrs.mainContainerStyles.display)
            .style("justify-content", attrs.mainContainerStyles.justifyContent)
            .style("align-items", attrs.mainContainerStyles.alignItems)
            .style("width", attrs.mainContainerStyles.width)
            .style("margin", attrs.mainContainerStyles.margin)
            .style("margin-top", attrs.mainContainerStyles.marginTop);

        const contentContainer = mainContainer._add("div")
            .style("width", attrs.contentContainerStyles.width);

        const titleGroup = contentContainer
            .insert("div", "svg")
            .style("margin-bottom", attrs.titleGroupStyles.marginBottom);

        titleGroup._add("div")
            .style("font-size", attrs.companyTitleStyles.fontSize)
            .style("font-family", attrs.companyTitleStyles.fontFamily)
            .style("margin-left", attrs.companyTitleStyles.marginLeft)
            .style("opacity", attrs.companyTitleStyles.opacity)
            .text("Apple Inc (AAPL)");

        const priceGroup = titleGroup._add("div")
            .style("position", attrs.priceGroupStyles.position)
            .style("margin-left", attrs.priceGroupStyles.marginLeft);

        const svg = contentContainer._add("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .attr("preserveAspectRatio", attrs.svg.preserveAspectRatio)
            ._add("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this.setState({ svg, priceGroup });
    }

    setupScales() {
        const attrs = this.getState();
        const { data, width, height } = attrs;

        const x = d3.scaleTime()
            .domain([d3.min(data, d => d.date), d3.max(data, d => d.date)])
            .range([0, width]);

        const minPrice = d3.min(data, d => d.price);
        const y = d3.scaleLinear()
            .domain([
                minPrice - 1,  
                minPrice + 9   
            ])
            .range([height, 0]);

        this.setState({ x, y });
    }

    drawAxes() {
        const attrs = this.getState();
        const { svg, x, y, height, data } = attrs;

        const lastDate = d3.max(data, d => d.date);

        const xAxis = d3.axisBottom(x)
            .ticks(5)
            .tickSize(0)
            .tickFormat((d, i) => {
                const formattedDate = d3.timeFormat("%b %d")(d);
                return d.getTime() === lastDate.getTime() ? "" : formattedDate;
            });

        svg._add("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("font-size", attrs.xAxis.text.fontSize)
            .style("fill", attrs.xAxis.text.fill)
            .style("font-family", attrs.xAxis.text.fontFamily)
            .style("text-anchor", attrs.xAxis.text.textAnchor)
            .attr("dx", attrs.xAxis.text.dx)
            .attr("dy", attrs.xAxis.text.dy);

        svg.select("g").select("path").remove();

        const yAxis = d3.axisLeft(y)
            .ticks(5)  
            .tickSize(0);

        svg._add("g")
            .call(yAxis)
            .attr("class", "y-axis")
            .selectAll("text")
            .style("font-size", attrs.yAxisTextStyles.fontSize)
            .style("fill", attrs.yAxisTextStyles.fill)
            .style("font-family", attrs.yAxisTextStyles.fontFamily)
            .style("text-anchor", attrs.yAxisTextStyles.textAnchor)
            .attr("dx", "-8");

        d3.select(".y-axis").selectAll("path, line").remove();
    }

    drawChart() {
        const attrs = this.getState();
        const { svg, data, x, y, width, height } = attrs;

        const gradientId = `area-gradient-${attrs.id}`;
        const gradient = svg._add("defs")
            ._add("linearGradient")
            .attr("id", gradientId)
            .attr("x1", attrs.gradient.x1)
            .attr("y1", attrs.gradient.y1)
            .attr("x2", attrs.gradient.x2)
            .attr("y2", attrs.gradient.y2);

        gradient._add("stop")
            .attr("offset", attrs.gradient.stops.start.offset)
            .attr("stop-color", attrs.area.gradient.top.color)
            .attr("stop-opacity", attrs.area.gradient.top.opacity);

        gradient._add("stop")
            .attr("offset", attrs.gradient.stops.end.offset)
            .attr("stop-color", attrs.area.gradient.bottom.color)
            .attr("stop-opacity", attrs.area.gradient.bottom.opacity);

        const area = d3.area()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d.price));

        svg._add("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            .style("fill", `url(#${gradientId})`);

        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.price));

        svg._add("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", attrs.lineStyles.stroke)
            .style("stroke-width", attrs.lineStyles.strokeWidth + "px");

        this.drawGridlines(width);
    }

    drawGridlines(width) {
        const attrs = this.getState();
        const { svg, y, gridlines } = attrs;

        const makeGridlines = () => {
            return d3.axisLeft(y)
                .ticks(gridlines.ticks);
        };

        svg._add("g")
            .attr("class", gridlines.class)
            .style("stroke", gridlines.style.stroke)
            .style("opacity", gridlines.style.opacity)
            .call(makeGridlines()
                .tickSize(-width)
                .tickFormat("")
            )
            .select(".domain").remove();

        svg.select(`.${gridlines.class}`).lower();
    }

    updatePriceInfo() {
        const attrs = this.getState();
        const { priceGroup } = attrs;

        priceGroup._add("h1")
            .style("font-size", attrs.mainPriceStyles.fontSize)
            .style("font-family", attrs.mainPriceStyles.fontFamily)
            .style("font-weight", attrs.mainPriceStyles.fontWeight)
            .style("margin", attrs.mainPriceStyles.margin)
            .style("margin-top", attrs.mainPriceStyles.marginTop)
            .text("$249.79");

        priceGroup._add("h2")
            .style("font-size", attrs.priceDeltaStyles.fontSize)
            .style("font-family", attrs.priceDeltaStyles.fontFamily)
            .style("color", attrs.priceDeltaStyles.color)
            .style("margin", attrs.priceDeltaStyles.margin)
            .style("margin-top", attrs.priceDeltaStyles.marginTop)
            .html(`${attrs.priceDeltaStyles.priceDelta} (${attrs.priceDeltaStyles.priceDeltaPercent}%) <span style='color: ${attrs.timeframeStyles.color}; \
                font-family: ${attrs.timeframeStyles.fontFamily}; \
                font-weight: ${attrs.timeframeWeight}; \
                margin-left: ${attrs.timeframeStyles.marginLeft}'>${attrs.priceDeltaStyles.timeframeText}</span>`);

        priceGroup._add("h3")
            .style("position", attrs.preMarketStyles.position)
            .style("left", attrs.preMarketStyles.left)
            .style("top", attrs.preMarketStyles.top)
            .style("font-size", attrs.preMarketStyles.fontSize)
            .style("font-family", attrs.preMarketStyles.fontFamily)
            .style("color", attrs.preMarketStyles.color)
            .style("margin-top", attrs.preMarketStyles.marginTop)
            .html(`${attrs.preMarketPrice} <span style='color: ${attrs.preMarketDeltaColor}; font-family: ${attrs.defaultFont}; \
                font-weight: ${attrs.preMarketDeltaWeight}; margin-left: ${attrs.preMarketStyles.deltaSpanStyles.marginLeft}'> ${attrs.preMarketDelta} (${attrs.preMarketDeltaPercent}%)</span><span \
                style='color: ${attrs.preMarketLabelStyles.color}; font-family: ${attrs.preMarketLabelStyles.fontFamily}; font-weight: ${attrs.preMarketLabelWeight}; margin-left: ${attrs.preMarketLabelStyles.marginLeft}'> Pre-Market</span>`);
    }

    setDynamicContainer() {
        const attrs = this.getState();
        
        const containerEl = d3.select(attrs.container).node();
        const containerWidth = containerEl.getBoundingClientRect().width;
        
        attrs.svgWidth = Math.min(containerWidth * 0.95, 600); 
        attrs.svgHeight = Math.min(attrs.svgWidth * 0.5, 300); 
        
        attrs.width = attrs.svgWidth - attrs.marginLeft - attrs.marginRight;
        attrs.height = attrs.svgHeight - attrs.marginTop - attrs.marginBottom;

        const resizeHandler = () => {
            const newWidth = containerEl.getBoundingClientRect().width;
            attrs.svgWidth = Math.min(newWidth, 800);
            attrs.svgHeight = Math.max(attrs.svgWidth * 0.5, 300);
            attrs.chartWidth = attrs.svgWidth - attrs.marginLeft - attrs.marginRight;
            attrs.chartHeight = attrs.svgHeight - attrs.marginTop - attrs.marginBottom;
            
            d3.select(attrs.container).selectAll("*").remove();
            this.render();
        };

        if (window._chartResizeHandler) {
            d3.select(window).on('resize.' + attrs.id, null);
        }
        
        d3.select(window).on('resize.' + attrs.id, resizeHandler);

        return this;
    }

    getState() {
        return this.attrs;  
    }

    setState(d) {
        Object.assign(this.attrs, d);
    }
}
