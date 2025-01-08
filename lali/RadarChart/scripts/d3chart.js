class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 400,
            marginTop: 50,
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
        
        chart.selectAll('*').remove();
        
        const minSize = 300; //attrs-ში
        const effectiveWidth = Math.max(minSize, chartWidth); //calc-ში
        const effectiveHeight = Math.max(minSize, chartHeight);//calc-ში
        
        const angleSlice = (Math.PI * 2) / data.features.length;//calc-ში
        const radius = Math.min(effectiveWidth, effectiveHeight) / 2.8; //calc-ში
        
        const fontSize = Math.max(12, Math.min(14, radius / 10)); //calc-ში
        
        const labelDistance = radius * 1.2; //calc-ში
        
        const rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, 100]); //attrs-ში

        const levels = [0, 20, 40, 60, 80, 100]; //attrs-ში
        const axisGrid = chart._add({
            tag: 'g',
            className: 'axis-grid'
        });

        levels.forEach(level => {
            axisGrid.append('circle')
                .attr('r', rScale(level))
                .style('fill', 'none')
                .style('stroke', '#CDCDCD')
                .style('stroke-width', '0.5px');
                //attrs-ში

            if (level > 0) {
                const angle = -Math.PI / 2;
                const x = rScale(level) * Math.cos(angle);
                const y = rScale(level) * Math.sin(angle);
                
                axisGrid.append('text')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', '-0.5em')
                    .style('font-size', `${fontSize}px`)
                    .style('text-anchor', 'middle')
                    .text(level.toString());
                    //attrs-ში
            }
        });

        const axes = chart._add({
            tag: 'g',
            className: 'axes'
        });

        axes.selectAll('.axis-line')
            .data(data.features)
            .enter()
            .append('line')
            .attr('class', 'axis-line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y2', (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
            .style('stroke', '#999')
            .style('stroke-width', '1px');
            //attrs-ში

        axes.selectAll('.axis-label')
            .data(data.features)
            .enter()
            .append('text')
            .attr('class', 'axis-label')
            .attr('x', (d, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                const distance = labelDistance;
                return distance * Math.cos(angle);
            })
            .attr('y', (d, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                const distance = labelDistance;
                return distance * Math.sin(angle);
            })
            .style('text-anchor', (d, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                if (Math.abs(Math.cos(angle)) < 0.1) return 'middle';
                return Math.cos(angle) > 0 ? 'start' : 'end';
            })
            .style('dominant-baseline', 'central')
            .style('font-size', `${fontSize}px`)
            .style('font-weight', '500')
            .text(d => d)
            .call(wrap, 60);
            //attrs-ში

        const colors = ['#ca8cf0', '#7FFFD4'];  //attrs-ში
        
        data.persons.forEach((person, personIndex) => {
            const points = person.scores.map((score, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                return {
                    x: rScale(score) * Math.cos(angle),
                    y: rScale(score) * Math.sin(angle)
                };
            });

            chart._add({
                tag: 'path',
                className: `radar-path-${personIndex}`
            })
            .datum(points)
            .attr('d', d3.line()
                .x(d => d.x)
                .y(d => d.y)
                .curve(d3.curveLinearClosed))
            .style('fill', colors[personIndex])
            .style('fill-opacity', 0.3)
            .style('stroke', colors[personIndex])
            .style('stroke-width', '2px');
            //attrs-ში

            chart._add({
                tag: 'g',
                className: `dots-group-${personIndex}`
            })
            .selectAll('.dot')
            .data(points)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 4)
            .style('fill', colors[personIndex]);
        });

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
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        let self = this;
        
        let resizeTimeout;
        d3.select(window).on("resize." + attrs.id, function () {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                var containerRect = d3Container.node().getBoundingClientRect();
                if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
                
                d3Container.selectAll("*").remove();
                
                self.render();
            }, 250); 
        });

        this.setState({ d3Container });
    }

}

function wrap(text, width) {
    text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy") || 0);
        let tspan = text.text(null).append("tspan")
            .attr("x", text.attr("x"))
            .attr("y", y)
            .attr("dy", dy + "em");
        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", text.attr("x"))
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}
