class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: window.innerWidth - 40,
            svgHeight: 600,
            marginTop: 140,
            marginBottom: 60,
            marginRight: 80,
            marginLeft: 80,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",

            gridLineColor: '#e5e5e5',
            gridLineOpacity: 0.7,
// ხაზების გამოტოვება არ გინდა attrs-ში
            gradientStops: [
                { offset: '0%', color: '#C9E6C7', opacity: 0.8 },
                { offset: '50%', color: '#C9E6C7', opacity: 0.3 },
                { offset: '100%', color: '#C9E6C7', opacity: 0.1 }
            ],

            lineColor: '#2FA533',
            lineWidth: '2.5',

            axisColor: '#666',
            axisFontSize: '12px',

            companyNameFontSize: '24px',
            companyNameColor: '#1a1a1a',
            mainPriceFontSize: '32px',
            mainPriceColor: '#1a1a1a',

            positiveColor: '#30A632',
            negativeColor: '#EF4444',

            containerPadding: '20px',

            curveType: d3.curveMonotoneX,
            ticksCount: 5,
            dateFormat: '%b %d',

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
        const {
            chart,
            data,
            chartWidth,
            chartHeight,
            marginTop,
            gridLineColor,
            gridLineOpacity,
            gradientStops,
            lineColor,
            lineWidth,
            axisColor,
            axisFontSize,
            curveType,
            ticksCount,
            dateFormat,
            companyNameFontSize,
            companyNameColor,
            mainPriceFontSize, //ეს ორი ცვლადი ზედმეტია
            mainPriceColor,
            positiveColor,
            negativeColor
        } = this.getState();

        if (!Array.isArray(data)) {
            console.error('Data is not properly formatted');
            return;
        }

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([0, chartWidth]);

        const yScale = d3.scaleLinear()
            .domain([
                d3.min(data, d => d.price) * 0.999,
                d3.max(data, d => d.price) * 1.001
            ])
            .range([chartHeight, 0]);

        const areaGenerator = d3.area()
            .x(d => xScale(new Date(d.date)))
            .y0(chartHeight)
            .y1(d => yScale(d.price))
            .curve(d3.curveMonotoneX);

        const lineGenerator = d3.line()
            .x(d => xScale(new Date(d.date)))
            .y(d => yScale(d.price))
            .curve(curveType);

        chart._add({
            tag: 'g',
            className: 'grid-lines'
        })
            .call(d3.axisRight(yScale)
                .ticks(5)
                .tickSize(chartWidth)
                .tickFormat(''))
            .style('stroke', gridLineColor)
            .style('stroke-opacity', gridLineOpacity);

        const gradient = chart._add({
            tag: 'defs'
        })
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%');

        gradientStops.forEach(stop => {
            gradient.append('stop')
                .attr('offset', stop.offset)
                .attr('stop-color', stop.color)
                .attr('stop-opacity', stop.opacity);
        });

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
            .style('stroke', lineColor)
            .style('stroke-width', lineWidth)
            .style('fill', 'none');

        chart._add({
            tag: 'g',
            className: 'x-axis'
        })
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale)
                .ticks(ticksCount)
                .tickFormat(d3.timeFormat(dateFormat)))
            .style('color', axisColor)
            .style('font-size', axisFontSize);

        chart._add({
            tag: 'g',
            className: 'y-axis-labels'
        })
            .attr('transform', `translate(0,0)`)
            .call(d3.axisLeft(yScale)
                .ticks(5)
                .tickFormat(d => Math.round(d)))
            .style('color', '#666') //ატტრს-ში
            .select('.domain').remove();

        const lastPrice = data[data.length - 1].price.toFixed(2);

        const firstDate = new Date(data[0].date);
        const lastDate = new Date(data[data.length - 1].date);

        const dayDiff = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24));

        const firstPrice = data[0].price;
        const priceChange = (lastPrice - firstPrice).toFixed(2);
        const priceChangePercent = ((priceChange / firstPrice) * 100).toFixed(2);

        const previousPrice = data[data.length - 2].price.toFixed(2);
        const preMarketChange = (lastPrice - previousPrice).toFixed(2);
        const preMarketChangePercent = ((preMarketChange / previousPrice) * 100).toFixed(2);

        chart._add({
            tag: 'text',
            className: 'company-name'
        })
            .attr('x', 0)
            .attr('y', -marginTop + 20)
            .style('font-size', companyNameFontSize)
            .style('fill', companyNameColor)
            .text('Apple Inc (AAPL)');

        chart._add({
            tag: 'text',
            className: 'main-price'
        })
            .attr('x', 0)
            .attr('y', -marginTop + 65)
            .text(`$${lastPrice}`);

        chart._add({
            tag: 'text',
            className: 'price-change-text'
        })
            .attr('x', 0)
            .attr('y', -marginTop + 95)
            .selectAll('tspan')
            .data([
                {
                    text: `${priceChange >= 0 ? '+' : ''}$${priceChange} (${priceChange >= 0 ? '+' : ''}${priceChangePercent}%)`,
                    class: priceChange >= 0 ? 'positive bold-text' : 'negative bold-text',
                    color: priceChange >= 0 ? positiveColor : negativeColor
                },
                { text: ` Past ${dayDiff} days`, class: 'black-text' }
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
            .attr('y', -marginTop + 125)
            .selectAll('tspan')
            .data([
                { text: `$${previousPrice}`, class: 'black-text bold-text' },
                {
                    text: ` ${preMarketChange >= 0 ? '+' : ''}$${preMarketChange} (${preMarketChange >= 0 ? '+' : ''}${preMarketChangePercent}%) `,
                    class: preMarketChange >= 0 ? 'positive bold-text' : 'negative bold-text',
                    color: preMarketChange >= 0 ? '#30A632' : '#EF4444'
                },
                { text: 'Pre-Market', class: 'black-text' }
            ])
            .enter()
            .append('tspan')
            .attr('class', d => d.class)
            .style('fill', d => d.color)
            .text(d => d.text);
    }

    drawSvgAndWrappers() {
        const {
            d3Container,
            svgWidth,
            svgHeight,
            defaultFont,
            calc,
            chartWidth //ზედმეტია
        } = this.getState();

        d3Container.selectAll('svg').remove();

        d3Container
            .style("padding", "20px")
            .style("overflow-x", "auto")
            .style("overflow-y", "hidden")
            .style("display", "block"); //ატტრს-ში

        const svg = d3Container
            ._add({
                tag: "svg",
                className: "svg-chart-container"
            })
            .attr("width", "100%")
            .attr("height", svgHeight)
            .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
            .attr("preserveAspectRatio", "xMinYMid meet")
            .style("overflow", "visible")
            .attr("font-family", defaultFont);

        const chart = svg
            ._add({
                tag: "g",
                className: "chart"
            })
            .attr(
                "transform",
                `translate(${calc.chartLeftMargin},${calc.chartTopMargin})`
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
        const { containerPadding } = attrs;
        const d3Container = d3.select(attrs.container)
            .style("padding", containerPadding)
            .style("overflow-x", "auto")
            .style("overflow-y", "hidden")
            .style("display", "block"); //ატტრს-ში

        this.updateDimensions();

        let resizeTimeout;
        const handleResize = () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                this.updateDimensions();
                this.render();
            }, 100);
        };

        window.removeEventListener('resize', handleResize);
        window.addEventListener('resize', handleResize);

        this.setState({ d3Container });
    }

    updateDimensions() {
        const attrs = this.getState();
        const d3Container = d3.select(attrs.container);
        const containerRect = d3Container.node().getBoundingClientRect();

        if (containerRect.width > 0) {
            const minWidth = 800;
            const minHeight = 500;
            const padding = 40;

            attrs.svgWidth = Math.max(containerRect.width - (padding * 2), minWidth);

            attrs.svgHeight = Math.max(window.innerHeight * 0.85, minHeight);

            attrs.chartWidth = attrs.svgWidth - attrs.marginLeft - attrs.marginRight;
            attrs.chartHeight = attrs.svgHeight - attrs.marginTop - attrs.marginBottom;
        }
    }

}
