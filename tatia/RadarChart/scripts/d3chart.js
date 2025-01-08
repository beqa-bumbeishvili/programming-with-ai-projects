class Chart {
    constructor() {
        // Defining state attributes
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
        // გავასუფთ�ოთ წინა ელემენტები
        const { d3Container } = this.getState();
        if (d3Container) {
            d3Container.selectAll('*').remove();
        }

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
    drawRadarChart() {
        const { chart, data, chartWidth, chartHeight } = this.getState();
        
        // რადარის კონფიგურაცია
        const config = {
            radius: Math.min(chartWidth, chartHeight) / 3,
            levels: 5,
            maxValue: 100,
            labelFactor: 1.25
        };
        
        // კუთხეების გამოთვლა თითოეული ღერძისთვის
        const total = data.datasets[0].values.length;
        const angleSlice = (Math.PI * 2) / total;
        
        // რადიალური სკალა
        const rScale = d3.scaleLinear()
            .range([0, config.radius])
            .domain([0, config.maxValue]);
        
        // ღერძების დახაზვა
        const axes = chart.append('g')
            .selectAll('.axis')
            .data(data.datasets[0].values)
            .enter()
            .append('line')
            .attr('class', 'axis')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', (d, i) => rScale(config.maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y2', (d, i) => rScale(config.maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
            .style('stroke', '#999')
            .style('stroke-width', '1px');
            
        // კონცენტრული წრეები და მათი ლეიბლები
        const levels = chart.selectAll('.levels')
            .data(d3.range(1, config.levels + 1).reverse())
            .enter()
            .append('g')
            .attr('class', 'levels');

        // წრეები
        levels.append('circle')
            .attr('class', 'gridCircle')
            .attr('r', d => (config.radius / config.levels) * d)
            .style('fill', '#CDCDCD')
            .style('stroke', '#999')
            .style('fill-opacity', 0.1);

        // პროცენტლი მნიშვნლობების დამატება
        levels.append('text')
            .attr('class', 'levelValue')
            .attr('x', 5)
            .attr('y', d => -(config.radius / config.levels) * d)
            .attr('dy', '0.4em')
            .style('font-size', '10px')
            .style('fill', '#737373')
            .text(d => Math.round(config.maxValue * d / config.levels) + '%');
        
        // ღერძებს დისახელების დამატება
        const axisLabels = chart.selectAll('.axisLabel')
            .data(data.datasets[0].values)
            .enter()
            .append('text')
            .attr('class', 'axisLabel')
            .attr('x', (d, i) => rScale(config.maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y', (d, i) => rScale(config.maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d.axis)
            .style('font-size', '11px')
            .attr('text-anchor', 'middle');
        
        // მონაცემების დახაზვა
        data.datasets.forEach((dataset, i) => {
            // წერტილების კოორდინატების გამოთვლა
            const points = dataset.values.map((d, j) => {
                const angle = angleSlice * j - Math.PI / 2;
                return {
                    x: rScale(d.value) * Math.cos(angle),
                    y: rScale(d.value) * Math.sin(angle),
                    value: d.value
                };
            });
            
            // Path გენერატორი
            const radarLine = d3.lineRadial()
                .radius(d => d.value)
                .angle((d, i) => i * angleSlice);
                
            // არის შევსება
            chart.append('path')
                .datum(points)
                .attr('class', 'radarArea')
                .attr('d', d3.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .curve(d3.curveLinearClosed))
                .style('fill', dataset.color)
                .style('fill-opacity', 0.3)
                .style('stroke', dataset.color)
                .style('stroke-width', '2px');
        });
        
        // გადავწიოთ chart ცენტრში
        chart.attr('transform', `translate(${chartWidth/2},${chartHeight/2})`);
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
        if (containerRect.width > 0) {
            attrs.svgWidth = containerRect.width;
            // დავამატოთ სიმაღლის პროპორციული ცვლილებაც
            attrs.svgHeight = containerRect.width / 2; // ან სხვა თქვენთვის სასურველი პროპორცია
        }

        let self = this;
        // დავამატოთ throttle რომ ძალიან ხშირად არ მოხდეს გადახატვა
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

    // დავამატო� throttle �ფუნქცია
    throttle(func, limit) {
        let inThrottle;
        return function() {
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
