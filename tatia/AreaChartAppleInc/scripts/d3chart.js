class Chart {
    constructor() {
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 450,
            marginTop: 5,
            marginBottom: 50,
            marginRight: 70,
            marginLeft: 70,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            gridStrokeColor: "lightgrey",
            gridStrokeOpacity: 0.7,
            gridTicks: 4,
            xAxisFontSize: "16px",
            xAxisTextFill: "#666",
            xAxisDy: "1em",
            xAxisTextAnchor: "end",
            xAxisTicks: 5,
            yAxisFontSize: "16px",
            yAxisTextFill: "#666",
            yAxisTicks: 4,
            gradientStopColor: "#34a853",
            gradientStartOpacity: 0.3,
            gradientEndOpacity: 0,
            lineStrokeColor: "#34a853",
            lineStrokeWidth: 4,
            lineStrokeJoin: "round",
            data: null,
            chartWidth: null,
            chartHeight: null,
        };


        this.getState = () => attrs;
        this.setState = (d) => Object.assign(attrs, d);

        Object.keys(attrs).forEach((key) => {
            this[key] = function (_) {
                if (!arguments.length) {
                    return attrs[key];
                }
                attrs[key] = _;
                return this;
            };
        });


        this.initializeEnterExitUpdatePattern();
    }
    render() {
        this.setDynamicContainer();
        this.calculateProperties();
        this.drawSvgAndWrappers();
        this.drawChart();

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

        var calc = {
            id: null,
            chartTopMargin: null,
            chartLeftMargin: null,
            chartWidth: null,
            chartHeight: null
        };

        calc.id = "ID" + Math.floor(Math.random() * 1000000);
        calc.chartLeftMargin = marginLeft;
        calc.chartTopMargin = marginTop;

        const chartWidth = svgWidth - marginRight - calc.chartLeftMargin;
        const chartHeight = svgHeight - marginBottom - calc.chartTopMargin;

        this.setState({ calc, chartWidth, chartHeight });
    }

    drawChart() {
        const {
            chart,
            chartWidth,
            chartHeight,
            data,
            gridStrokeColor,
            gridStrokeOpacity,
            gridTicks,
            xAxisFontSize,
            xAxisTextFill,
            xAxisDy,
            xAxisTextAnchor,
            xAxisTicks,
            yAxisFontSize,
            yAxisTextFill,
            yAxisTicks,
            gradientStopColor,
            gradientStartOpacity,
            gradientEndOpacity,
            lineStrokeColor,
            lineStrokeWidth,
            lineStrokeJoin
        } = this.getState();

        const maxValue = d3.max(data, d => d.price);
        const minValue = d3.min(data, d => d.price);

        const extent = d3.extent(data, d => d.date);
        const x = d3.scaleTime()
            .domain(extent)
            .range([0, chartWidth]);

        const y = d3.scaleLinear()
            .domain([minValue * 0.999, maxValue])
            .range([chartHeight, 0]);

        chart._add({
            tag: "g",
            className: "grid"
        })
            .call(d3.axisLeft(y)
                .ticks(gridTicks)
                .tickSize(-chartWidth)
                .tickFormat(""))
            .selectAll("line")
            .style("stroke", gridStrokeColor)
            .style("stroke-opacity", gridStrokeOpacity);

        chart._add({
            tag: "g",
            className: "x-axis"
        })
            .attr("transform", `translate(0,${chartHeight})`)
            .call(d3.axisBottom(x)
                .ticks(xAxisTicks)
                .tickFormat(d3.timeFormat("%b %d")))
            .selectAll("text")
            .style("font-size", xAxisFontSize)
            .style("fill", xAxisTextFill)
            .attr("dy", xAxisDy)
            .style("text-anchor", xAxisTextAnchor);

        chart._add({
            tag: "g",
            className: "y-axis"
        })
            .call(d3.axisLeft(y).ticks(yAxisTicks))
            .selectAll("text")
            .style("font-size", yAxisFontSize)
            .style("fill", yAxisTextFill);

        const gradient = chart._add({
            tag: "defs",
            className: "gradient-def"
        })
            .append("linearGradient")
            .attr("id", "area-gradient")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", gradientStopColor)
            .attr("stop-opacity", gradientStartOpacity);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", gradientStopColor)
            .attr("stop-opacity", gradientEndOpacity);

        const area = d3.area()
            .x(d => x(d.date))
            .y0(y(minValue))
            .y1(d => y(d.price))
            .curve(d3.curveLinear);

        chart._add({
            tag: "path",
            className: "area",
            data: [data]
        })
            .attr("d", area)
            .style("fill", "url(#area-gradient)");

        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.price))
            .curve(d3.curveLinear);

        chart._add({
            tag: "path",
            className: "line",
            data: [data]
        })
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", lineStrokeColor)
            .style("stroke-width", lineStrokeWidth)
            .style("stroke-linejoin", lineStrokeJoin);
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

        const svg = d3Container
            ._add({
                tag: "svg",
                className: "svg-chart-container"
            })
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("font-family", defaultFont);

        var chart = svg
            ._add({
                tag: "g",
                className: "chart"
            })
            .attr(
                "transform",
                "translate(" + calc.chartLeftMargin + "," + calc.chartTopMargin + ")"
            );
        ;

        this.setState({ chart, svg });
    }

    initializeEnterExitUpdatePattern() {
        d3.selection.prototype._add = function (params) {
            var container = this;
            var className = params.className;
            var data = params.data || [className];
            var exitTransition = params.exitTransition || null;
            var enterTransition = params.enterTransition || null;
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

            const enterSelection = selection.enter().append(params.tag);
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


        var d3Container = d3.select(attrs.container);
        var containerRect = d3Container.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        let self = this;

        d3.select(window).on("resize." + attrs.id, function () {
            var containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

            self.render();
        });

        this.setState({ d3Container });
    }


}
