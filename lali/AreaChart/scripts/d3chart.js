class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 300,
            marginTop: 230,
            marginBottom: 50,
            marginRight: 260,
            marginLeft: 260,
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
        this.drawAreaChart();
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

    drawAreaChart() {
        const { chart, data, chartWidth, chartHeight, marginTop } = this.getState();

        console.log('Price range:', d3.extent(data, d => d.price)); //ეს console log ამოიღე როცა ტვირთავ

        if (!Array.isArray(data)) {
            console.error('Data is not properly formatted');
            return;
        }

        // data-დან უნდა წაიკითხო მინიმალური და მაქსიმალური თარიღი
        const xScale = d3.scaleTime()
            .domain([
                new Date('2023-12-15'),
                new Date('2023-12-20')
            ])
            .range([0, chartWidth]);

        // 246-ის ნაცვლად დატადან უნდა წაიკითხო მინიმალური ვალუე
        const yScale = d3.scaleLinear()
            .domain([246, d3.max(data, d => d.price) * 1.01])
            .range([chartHeight, 0]);

        const areaGenerator = d3.area()
            .x(d => xScale(new Date(d.date)))
            .y0(chartHeight)
            .y1(d => yScale(d.price))
            .curve(d3.curveMonotoneX);

        const lineGenerator = d3.line()
            .x(d => xScale(new Date(d.date)))
            .y(d => yScale(d.price))
            .curve(d3.curveMonotoneX);

        chart._add({
            tag: 'g',
            className: 'grid-lines'
        })
            .call(d3.axisRight(yScale)
                .ticks(5)
                .tickSize(chartWidth)
                .tickFormat(''))
            .style('stroke', '#e5e5e5')
            .style('stroke-opacity', 0.7);
            // attrs-ში აიტანე 5, '#e5e5e5' და 0.7

        const gradient = chart._add({
            tag: 'defs'
        })
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#C9E6C7')
            .attr('stop-opacity', 0.8);

        gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', '#C9E6C7')
            .attr('stop-opacity', 0.3);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#C9E6C7')
            .attr('stop-opacity', 0.1);

            // გრადიენტის რაღაცები attrs-ში აიტანე

        chart._add({
            tag: 'path',
            className: 'area',
            datum: data
        })
            .attr('d', areaGenerator(data))
            .style('fill', 'url(#gradient)');

        chart._add({
            tag: 'path',
            className: 'line',
            datum: data
        })
            .attr('d', lineGenerator(data))
            .style('stroke', '#2FA533')
            .style('stroke-width', '2.5')
            .style('fill', 'none');
            // attrs-ში 

        chart._add({
            tag: 'g',
            className: 'x-axis'
        })
            .attr('transform', `translate(0,${yScale(246)})`)
            .call(d3.axisBottom(xScale)
                .tickValues([
                    new Date('2023-12-16'),
                    new Date('2023-12-17'),
                    new Date('2023-12-18'),
                    new Date('2023-12-19'),
                    new Date('2023-12-20')  //დატადან უნდა წაიკითხო ესენი
                ])
                .tickFormat(d3.timeFormat('%b %d')) 
                .tickSize(0))
            .style('color', '#666');
            // attrs-ში

        chart._add({
            tag: 'g',
            className: 'y-axis-labels'
        })
            .attr('transform', `translate(0,0)`)
            .call(d3.axisLeft(yScale)
                .ticks(5)
                .tickFormat(d => Math.round(d)))
            .style('color', '#666')
            .select('.domain').remove();
// attrs-ში

        chart._add({
            tag: 'text',
            className: 'company-name'
        })
            .attr('x', 0)
            .attr('y', -marginTop + 45)
            .text('Apple Inc (AAPL)'); // attrs-ში

        chart._add({
            tag: 'text',
            className: 'main-price'
        })
            .attr('x', 0)
            .attr('y', -marginTop + 110)
            .text('$249.79');

        chart._add({
            tag: 'text',
            className: 'price-change-text'
        })
            .attr('x', 0)
            .attr('y', -marginTop + 150)
            .selectAll('tspan')
            .data([
                { text: '+$2.14 (+0.86%)', class: 'positive bold-text', color: '#30A632' },
                { text: ' Past 5 days', class: 'black-text' }
            ])
            .enter()
            .append('tspan')
            .attr('class', d => d.class)
            .style('fill', d => d.color)
            .text(d => d.text);

        chart._add({
            tag: 'text',
            className: 'pre-market-text'
        })
            .attr('x', 0)
            .attr('y', -marginTop + 185)
            .selectAll('tspan')
            .data([
                { text: '$247.32', class: 'black-text bold-text' },
                { text: ' -$2.47 (-0.99%) ', class: 'negative bold-text', color: '#EF4444' },
                { text: 'Pre-Market', class: 'black-text' }
            ])
            .enter()
            .append('tspan')
            .attr('class', d => d.class)
            .style('fill', d => d.color)
            .text(d => d.text);

            // ზევით რაც გიწერია ყველაფერი attrs-ში
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

        let self = this;

        d3.select(window).on("resize." + attrs.id, function () {
            var containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

            self.render();
        });

        this.setState({ d3Container });
    }

}
