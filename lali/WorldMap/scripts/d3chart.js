class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 960,
            svgHeight: 500,
            marginTop: 20,
            marginBottom: 20,
            marginRight: 20,
            marginLeft: 20,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: null,
            chartWidth: null,
            chartHeight: null,
            firstRender: true
        };

        // Defining accessors
        this.getState = () => attrs;
        this.setState = (d) => Object.assign(attrs, d);

        // Automatically generate getter and setters for chart object based on the state properties;
        Object.keys(attrs).forEach((key) => {
            //@ts-ignore
            this[key] = function (_) {
                if (!arguments.length) {
                    return attrs[key];
                }
                attrs[key] = _;
                return this;
            };
        });

        // Custom enter exit update pattern initialization (prototype method)
        this.initializeEnterExitUpdatePattern();
    }
    render() {
        this.setDynamicContainer();
        this.calculateProperties();
        this.drawSvgAndWrappers();
        this.drawWorldMap();
        return this;
    }

    calculateProperties() {
        const {
            marginLeft,
            marginTop,
            marginRight,
            marginBottom,
            svgWidth,
            svgHeight
        } = this.getState();

        //Calculated properties
        var calc = {
            id: null,
            chartTopMargin: null,
            chartLeftMargin: null,
            chartWidth: null,
            chartHeight: null
        };
        calc.id = "ID" + Math.floor(Math.random() * 1000000); // id for event handlings
        calc.chartLeftMargin = marginLeft;
        calc.chartTopMargin = marginTop;
        const chartWidth = svgWidth - marginRight - calc.chartLeftMargin;
        const chartHeight = svgHeight - marginBottom - calc.chartTopMargin;

        this.setState({ calc, chartWidth, chartHeight });
    }

    drawWorldMap() {
        const { chart, data, chartWidth, chartHeight } = this.getState();

        // შინიმალური ზომები და aspect ratio
        const minWidth = 800;
        const minHeight = 400;
        const aspectRatio = 1.7;

        // გინის SVG path განსაზღვრა
        const pinPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

        // გამოთვალე ოპტიმალური scale
        const scale = Math.min(
            chartWidth / minWidth,
            chartHeight / minHeight
        ) * minWidth / 8.5;

        // დამოთვალე ოენტრის წერტილები
        const centerX = chartWidth / 2;
        const centerY = chartHeight / 2;

        // პროექციის პარამეტრები
        const projection = d3.geoMercator()
            .scale(scale)
            .center([15, 45])
            .translate([centerX, centerY]);

        const path = d3.geoPath()
            .projection(projection);

        // მავშალოთ ძველი ელემენტები
        chart.selectAll('*').remove();

        // დავამატოთ გრადიენტი
        const gradient = chart.append("defs")
            .append("linearGradient")
            .attr("id", "map-gradient")
            .attr("x1", "0%")
            .attr("y1", "50%")
            .attr("x2", "100%")
            .attr("y2", "50%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#ff9999");

        gradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#ff99ff");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#ccccff");

        // ჯერ დვხატოთ მსოფლიო რუკა
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
            .then(worldData => {
                // წავხატოთ ქვეყნები
                const countries = chart.append('g')
                    .selectAll('path')
                    .data(worldData.features)
                    .enter()
                    .append('path')
                    .attr('class', 'countries')
                    .attr("d", path)
                    .style("fill", "url(#map-gradient)")
                    .style("stroke", "#fff")
                    .style("stroke-width", 0.5);

                // პავამატოთ tooltip
                const tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)
                    .style("position", "absolute")
                    .style("background-color", "rgba(255, 255, 255, 0.95)")
                    .style("border", "1px solid #ddd")
                    .style("border-radius", "4px")
                    .style("padding", "10px")
                    .style("pointer-events", "none")
                    .style("font-size", "14px")
                    .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
                    .style("min-width", "200px")
                    .style("z-index", "100");

                // პინების დამატება tooltip-ით
                const pins = chart.append('g')
                    .selectAll('path')
                    .data(data.locations)
                    .enter()
                    .append('path')
                    .attr('class', 'pin-path')
                    .attr('d', pinPath)
                    .attr('transform', d => {
                        const [x, y] = projection(d.coordinates);
                        return `translate(${x-12},${y-24}) scale(0.8)`;
                    })
                    .style("fill", "#ff4d4d")
                    .style("stroke", "#fff")
                    .style("stroke-width", 1)
                    .style("opacity", 0)
                    .style("cursor", "pointer")  // დავამატოთ მაუსის კურსორი
                    .on("mouseover", function(event, d) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);
                        tooltip.html(`
                            <div style="text-align: left;">
                                <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #333;">
                                    ${d.country}
                                </div>
                                <div style="color: #666; margin-bottom: 3px;">
                                    Score: ${d.score}
                                </div>
                                <div style="color: #666; font-style: italic;">
                                    ${d.comment}
                                </div>
                            </div>
                        `)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 35) + "px");
                        
                        // გავზარდო პინი hover-ზე
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("transform", function(d) {
                                const [x, y] = projection(d.coordinates);
                                return `translate(${x-12},${y-24}) scale(1)`;
                            });
                    })
                    .on("mouseout", function(d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                        
                        // დავაბრუნთ პინის ორგინალი ზომა
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("transform", function(d) {
                                const [x, y] = projection(d.coordinates);
                                return `translate(${x-12},${y-24}) scale(0.8)`;
                            });
                    });

                // პინების ნიმაცია
                chart.selectAll('.pin-path')
                    .each(function(d, i) {
                        d3.select(this)
                            .transition()
                            .delay(i * 400)
                            .duration(800)
                            .style("opacity", 1);
                    });
            })
            .catch(error => {
                console.error('Error loading world data:', error);
            });
    }

    drawSvgAndWrappers() {
        const {
            d3Container,
            svgWidth,
            svgHeight,
            defaultFont,
            calc,
            data,
            chartWidth,
            chartHeight
        } = this.getState();

        // Draw SVG
        const svg = d3Container
            ._add({
                tag: "svg",
                className: "svg-chart-container"
            })
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("font-family", defaultFont);

        //Add container g element
        var chart = svg
            ._add({
                tag: "g",
                className: "chart"
            })
            .attr(
                "transform",
                "translate(" + calc.chartLeftMargin + "," + calc.chartTopMargin + ")"
            );

        this.setState({ chart, svg });
    }

    initializeEnterExitUpdatePattern() {
        d3.selection.prototype._add = function (params) {
            var container = this;
            var className = params.className;
            var elementTag = params.tag;
            var data = params.data || [className];
            var exitTransition = params.exitTransition || null;
            var enterTransition = params.enterTransition || null;
            // Pattern in action
            var selection = container.selectAll("." + className).data(data, (d, i) => {
                if (typeof d === "object") {
                    if (d.id) {
                        return d.id;
                    }
                }
                return i;
            });
            if (exitTransition) {
                exitTransition(selection);
            } else {
                selection.exit().remove();
            }

            const enterSelection = selection.enter().append(elementTag);
            if (enterTransition) {
                enterTransition(enterSelection);
            }
            selection = enterSelection.merge(selection);
            selection.attr("class", className);
            return selection;
        };
    }

    setDynamicContainer() {
        const attrs = this.getState();

        //Drawing containers
        var d3Container = d3.select(attrs.container);
        var containerRect = d3Container.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
        if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

        let self = this;
        
        // დებაუნსინ ფუნქცია
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // resize ფუნქცი განახლება დებაუნსინგით
        const handleResize = debounce(() => {
            var containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
            if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

            // განაახლე SVG ოომები
            d3Container.select('svg')
                .attr('width', attrs.svgWidth)
                .attr('height', attrs.svgHeight);

            self.calculateProperties();
            
            // სრული გახატვა
            self.drawWorldMap();
        }, 250); // 250მს დაყოვნება

        // მიაბი resize ივენი
        d3.select(window).on("resize." + attrs.id, handleResize);

        this.setState({ d3Container });
    }

}
