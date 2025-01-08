class Chart {
    constructor() {
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 300,
            svgHeight: 150,
            marginTop: 5,
            marginBottom: 5,
            marginRight: 5,
            marginLeft: 5,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: null,
            chartWidth: null,
            chartHeight: null,
            firstRender: true
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
        const { d3Container } = this.getState();

        this.setDynamicContainer();
        this.calculateProperties();
        this.drawSvgAndWrappers();
        this.drawRadarChart();
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
        calc.chartTopMargin = marginTop;  //ერთი ხაზი გამოტოვე აქ ლოგიკურად ახალ მონაკვეთს იწყებ
        const chartWidth = svgWidth - marginRight - calc.chartLeftMargin;
        const chartHeight = svgHeight - marginBottom - calc.chartTopMargin;

        this.setState({ calc, chartWidth, chartHeight });
    }
    drawRadarChart() {
        const { chart, data, chartWidth, chartHeight } = this.getState();

        const config = {
            radius: Math.min(chartWidth, chartHeight) / 3,
            levels: 5,
            maxValue: 100,
            labelFactor: 1.25
        };

        const total = data.datasets[0].values.length;
        const angleSlice = (Math.PI * 2) / total;

        const rScale = d3.scaleLinear()
            .range([0, config.radius])
            .domain([0, config.maxValue]);



        const axes = chart._add({
            tag: 'g',
            className: 'axes-group'
        })
            ._add({
                tag: 'line',
                className: 'axis',
                data: data.datasets[0].values
            })
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', (d, i) => rScale(config.maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y2', (d, i) => rScale(config.maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
            .style('stroke', '#999')
            .style('stroke-width', '1px');

        const levels = chart._add({
            tag: 'g',
            className: 'levels',
            data: d3.range(1, config.levels + 1).reverse()
        })

        levels._add({
            tag: 'circle',
            className: 'gridCircle',
            data: d => [d]
        })
            .attr('r', d => (config.radius / config.levels) * d)
            .style('fill', '#CDCDCD')
            .style('stroke', '#999')
            .style('fill-opacity', 0.1);
            // attrs-ში


        levels._add({
            tag: 'text',
            className: 'levelValue',
            data: d => [d]
        })
            .attr('x', 5)
            .attr('y', d => -(config.radius / config.levels) * d)
            .attr('dy', '0.4em')
            .style('font-size', '10px')
            .style('fill', '#737373')
            .text(d => Math.round(config.maxValue * d / config.levels) + '%');

        const axisLabels = chart._add({
            tag: 'text',
            className: 'axisLabel',
            data: data.datasets[0].values
        })
            .attr('x', (d, i) => rScale(config.maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y', (d, i) => rScale(config.maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d.axis)
            .style('font-size', '11px')
            .attr('text-anchor', 'middle');


        chart._add({
            tag: 'path',
            className: 'radarArea',
            data: data.datasets.map((dataset, i) => {
                const points = dataset.values.map((d, j) => {
                    const angle = angleSlice * j - Math.PI / 2;
                    return {
                        x: rScale(d.value) * Math.cos(angle),
                        y: rScale(d.value) * Math.sin(angle),
                        value: d.value
                    };
                });
                return {
                    dataset: dataset,
                    points: points
                }

            })
        })
            .attr('d', d => {
                return d3.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .curve(d3.curveLinearClosed)(d.points)
            })
            .style('fill', d => d.dataset.color)
            .style('fill-opacity', 0.3)
            .style('stroke', d => d.dataset.color)
            .style('stroke-width', '2px');


        chart.attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`);
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
        var d3Container = d3.select(attrs.container);
        var containerRect = d3Container.node().getBoundingClientRect();
        if (containerRect.width > 0) {
            attrs.svgWidth = containerRect.width;
            attrs.svgHeight = containerRect.width / 2;
        }

        let self = this;
        const throttledResize = this.throttle(() => {
            var containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) {
                attrs.svgWidth = containerRect.width;
                attrs.svgHeight = containerRect.width / 2;
                self.render();
            }
        }, 100);

        d3.select(window).on("resize." + attrs.id, throttledResize);

        this.setState({ d3Container });
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

}
