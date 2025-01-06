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
            priceDeltaStyles: {
                position: "absolute",
                left: "0",
                top: "30px",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                color: "#39A93B",
                margin: "0",
                marginTop: "20px"
            },
            preMarketStyles: {
                position: "absolute",
                left: "2px",
                top: "10px",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                color: "black",
                fontWeight: "400",
                marginTop: "75px",
                marginBottom: "60px"
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
            }
        };

        attrs.width = attrs.svgWidth - attrs.marginLeft - attrs.marginRight;
        attrs.height = attrs.svgHeight - attrs.marginTop - attrs.marginBottom;
        attrs.data = [];  

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

    render() {
        const attrs = this.getState();
        console.log('Rendering with data:', attrs.data);
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
        const attrs = this.getState();

        d3.select(attrs.container).selectAll("*").remove();

        const mainContainer = d3.select(attrs.container)
            .append("div")
            .style("display",attrs.mainContainerStyles.display)
            .style("justify-content",attrs.mainContainerStyles.justifyContent)
            .style("align-items",attrs.mainContainerStyles.alignItems)
            .style("width", attrs.mainContainerStyles.width)
            .style("margin", attrs.mainContainerStyles.margin)
            .style("margin-top",attrs.mainContainerStyles.marginTop);

        const contentContainer = mainContainer.append("div")
            .style("width", attrs.contentContainerStyles.width);

        const titleGroup = contentContainer
            .insert("div", "svg")
            .style("margin-bottom", attrs.titleGroupStyles.marginBottom);

        titleGroup.append("div")
            .style("font-size", attrs.companyTitleStyles.fontSize)
            .style("font-family", attrs.companyTitleStyles.fontFamily)
            .style("margin-left", attrs.companyTitleStyles.marginLeft)
            .style("opacity", attrs.companyTitleStyles.opacity)
            .text("Apple Inc (AAPL)");

        const priceGroup = titleGroup.append("div")
            .style("position", attrs.priceGroupStyles.position)
            .style("margin-left", attrs.priceGroupStyles.marginLeft);

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
        const attrs = this.getState();
        const { svg, x, y } = attrs;

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
            .style("font-size", attrs.xAxis.text.fontSize)
            .style("fill", attrs.xAxis.text.fill)
            .style("font-family", attrs.xAxis.text.fontFamily)
            .style("text-anchor", attrs.xAxis.text.textAnchor)
            .attr("dx", attrs.xAxis.text.dx)
            .attr("dy", attrs.xAxis.text.dy);

        svg.select("g").select("path").remove();

        const yAxis = d3.axisLeft(y)
            .tickValues([246, 248, 250, 252, 254, 256])
            .tickSize(0);

        svg.append("g")
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

    drawChart(width, height) {
        const attrs = this.getState();
        const { svg, data, x, y } = attrs;

        if (!attrs.area) {
            attrs.area = {
                gradient: {
                    top: { color: "#39A93B", opacity: 0.4 },
                    bottom: { color: "#39A93B", opacity: 0 }
                },
                path: {}
            };
        }

        const gradientId = `area-gradient-${attrs.id}`;
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", gradientId)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", attrs.area.gradient.top.color)
            .attr("stop-opacity", attrs.area.gradient.top.opacity);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", attrs.area.gradient.bottom.color)
            .attr("stop-opacity", attrs.area.gradient.bottom.opacity);

        const area = d3.area()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d.price));

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            .style("fill", `url(#${gradientId})`);

        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.price));

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "#39A93B")
            .style("stroke-width", "2px");

        this.drawGridlines(width);
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
        const attrs = this.getState();
        const { priceGroup } = attrs;

        priceGroup.append("h1")
            .style("font-size", attrs.mainPriceStyles.fontSize)
            .style("font-family", attrs.mainPriceStyles.fontFamily)
            .style("font-weight", attrs.mainPriceStyles.fontWeight)
            .style("margin", attrs.mainPriceStyles.margin)
            .style("margin-top", attrs.mainPriceStyles.marginTop)
            .text("$249.79");

        priceGroup.append("h2")
            .style("font-size", attrs.priceDeltaStyles.fontSize)
            .style("font-family", attrs.priceDeltaStyles.fontFamily)
            .style("color", attrs.priceDeltaStyles.color)
            .style("margin", attrs.priceDeltaStyles.margin)
            .style("margin-top", attrs.priceDeltaStyles.marginTop)
            .html("+$2.14 (0.86%) <span style='color: black;\
                font-family: Helvetica; font-weight: 300; margin-left: 10px'> Past 5 days</span>");

        priceGroup.append("h3")
            .style("position", attrs.preMarketStyles.position)
            .style("left", attrs.preMarketStyles.left)
            .style("top", attrs.preMarketStyles.top)
            .style("font-size", attrs.preMarketStyles.fontSize)
            .style("font-family", attrs.preMarketStyles.fontFamily)
            .style("color", attrs.preMarketStyles.color)
            .style("font-weight", attrs.preMarketStyles.fontWeight)
            .style("margin-top", attrs.preMarketStyles.marginTop)
            .html(`$247.32 <span style='color: red; font-family: Helvetica;\
                 font-weight:350; margin-left: 10px'> -$2.47 (-0.99%)</span><span \
                 style='color: black; font-family: Helvetica; font-weight:300;margin-left: 10px'> Pre-Market</span>`);
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
            window.removeEventListener('resize', window._chartResizeHandler);
        }
        
        window._chartResizeHandler = resizeHandler;
        window.addEventListener('resize', resizeHandler);

        return this;
    }

    getState() {
        return this.attrs;  
    }

    setState(d) {
        Object.assign(this.attrs, d);
    }
}
