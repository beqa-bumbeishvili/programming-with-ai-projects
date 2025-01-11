class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 800,
            svgHeight: 600,
            marginTop: 100,
            marginBottom: 100,
            marginRight: 150,
            marginLeft: 20,
            container: "body",
            data: null,
            nodeWidth: 15,
            nodePadding: 25,
            linkOpacity: 0.7,
            fontSize: 12,
            tooltipStyles: {
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                pointerEvents: 'none',
                offsetX: 10,
                offsetY: -28,
                fadeInDuration: 200,
                fadeOutDuration: 500,
                opacity: 0.9
            },

            labelStyles: {
                fontSize: '11px',
                opacity: 0.6,
                fontWeight: 300
            },

            nodeStyles: {
                opacity: 0.9
            },

            hoverEffects: {
                link: {
                    highlighted: 0.9,
                    dimmed: 0.1
                }
            },

            labelLayout: {
                padding: 6,
                verticalOffset: '0.35em',
                textAnchor: {
                    left: 'start',
                    right: 'end'
                }
            }
        };

        // Defining accessors
        this.getState = () => attrs;
        this.setState = (d) => Object.assign(attrs, d);

        // Automatically generate getter and setters
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

        this.initializeEnterExitUpdatePattern();
    }

    render() {
        this.setDynamicContainer();
        this.calculateProperties();
        this.drawSvgAndWrappers();
        this.drawSankey();

        return this;
    }

    drawSankey() {
        const {
            chart,
            calc,
            tooltipStyles,
            labelStyles,
            nodeStyles,
            hoverEffects,
            linkOpacity,
            data,
            labelLayout
        } = this.getState();

        chart.selectAll('.links, .nodes, .labels').remove();

        const tooltip = d3.select('body')
            ._add({
                tag: 'div',
                className: 'tooltip'
            });

        Object.entries(calc.tooltip.styles).forEach(([key, value]) => {
            tooltip.style(key, value);
        });

        const { sankeyData } = calc;

        const links = chart._add({
            tag: 'g',
            className: 'links'
        })
            .selectAll('path')
            .data(sankeyData.links)
            .join('path')
            .attr('d', d3.sankeyLinkHorizontal())
            .attr('class', d => {
                const sourceNode = d.source.name.replace(/\s+/g, '-');
                const targetNode = d.target.name.replace(/\s+/g, '-');
                const className = `link from-${sourceNode} to-${targetNode}`;
                console.log('Created class name:', className);
                return className;
            })
            .style('stroke', d => {
                console.log('Link source:', d.source.name);
                return 'inherit';
            })
            .style('fill', 'none')
            .style('stroke-opacity', linkOpacity)
            .style('stroke-width', d => Math.max(1, d.width));

        const nodes = chart._add({
            tag: 'g',
            className: 'nodes'
        })
            .selectAll('rect')
            .data(sankeyData.nodes)
            .join('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', calc.getNodeHeight)
            .attr('width', calc.getNodeWidth)
            .attr('class', d => `node ${d.name}`)
            .style('opacity', calc.getNodeStyle.opacity)
            .on('mouseover', function (event, d) {
                tooltip
                    .style('opacity', tooltipStyles.opacity)
                    .html(Math.round(d.value) + '%')
                    .style('left', (event.pageX + tooltipStyles.offsetX) + 'px')
                    .style('top', (event.pageY + tooltipStyles.offsetY) + 'px');

                links.style('opacity', l =>
                    l.source === d || l.target === d ?
                        calc.getHoverEffects.link.highlighted :
                        calc.getHoverEffects.link.dimmed
                );
            })
            .on('mousemove', function (event) {
                tooltip
                    .style('left', (event.pageX + tooltipStyles.offsetX) + 'px')
                    .style('top', (event.pageY + tooltipStyles.offsetY) + 'px');
            })
            .on('mouseout', function () {
                tooltip.transition()
                    .duration(tooltipStyles.fadeOutDuration)
                    .style('opacity', 0);

                links.style('opacity', calc.getLinkStyle.strokeOpacity);
            });

        const labels = chart._add({
            tag: 'g'
        })
            .selectAll('text')
            .data(sankeyData.nodes)
            .join('text')
            .attr('x', d => calc.labelLayout.getX(d))
            .attr('y', d => calc.labelLayout.getY(d))
            .attr('dy', labelLayout.verticalOffset)
            .attr('text-anchor', d => calc.labelLayout.getAnchor(d))
            .text(d => d.name)
            .style('font-size', calc.getLabelStyle.fontSize)
            .style('opacity', calc.getLabelStyle.opacity)
            .style('font-weight', calc.getLabelStyle.fontWeight);
    }

    calculateProperties() {
        const {
            marginLeft,
            marginTop,
            marginRight,
            marginBottom,
            svgWidth,
            svgHeight,
            nodeWidth,
            nodePadding,
            data,
            tooltipStyles,
            fontSize,
            linkOpacity,
            labelLayout
        } = this.getState();

        let calc = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            chartLeftMargin: marginLeft,
            chartTopMargin: marginTop,
            chartWidth: svgWidth - marginRight - marginLeft,
            chartHeight: svgHeight - marginBottom - marginTop,

            tooltip: {
                styles: {
                    opacity: 0,
                    position: 'absolute',
                    fontSize: `${fontSize}px`,
                    backgroundColor: tooltipStyles.backgroundColor,
                    borderRadius: tooltipStyles.borderRadius,
                    boxShadow: tooltipStyles.boxShadow,
                    pointerEvents: tooltipStyles.pointerEvents
                }
            },

            sankeyGenerator: d3.sankey()
                .nodeWidth(nodeWidth)
                .nodePadding(nodePadding)
                .nodeSort((a, b) => {
                    if (a.layer === b.layer) {
                        if (a.layer === 2 && a.position === "top" && b.position === "top") {
                            return (a.order || 0) - (b.order || 0);
                        }
                        if (a.position === "top") return -1;
                        if (b.position === "top") return 1;
                        return 0;
                    }
                    return a.layer - b.layer;
                })
                .extent([[0, 0], [
                    svgWidth - marginRight - marginLeft,
                    svgHeight - marginBottom - marginTop
                ]]),

            getNodeX: (d, isStart) => d.x0 < calc.chartWidth / 2 ? d.x1 + 6 : d.x0 - 6,
            getNodeY: d => (d.y1 + d.y0) / 2,
            getNodeHeight: d => d.y1 - d.y0,
            getNodeWidth: d => d.x1 - d.x0,

            getTextAnchor: d => d.x0 < calc.chartWidth / 2 ? 'start' : 'end',

            getLinkStyle: {
                fill: 'none',
                strokeOpacity: linkOpacity || 0.7,
                strokeWidth: d => Math.max(1, d.width)
            },

            getNodeStyle: {
                opacity: 0.8
            },

            getTooltipPosition: (event) => ({
                left: event.pageX + 10 + 'px',
                top: event.pageY - 28 + 'px'
            }),

            // hover ეფექტები
            getHoverEffects: {
                link: {
                    highlighted: 0.9,
                    dimmed: 0.1
                },
                label: {
                    highlighted: 1,
                    dimmed: 0.1
                }
            },

            getLabelStyle: {
                fontSize: '14px', 
                opacity: 0.7,   
                fontWeight: 300  
            },

            labelLayout: {
                getX: d => d.x0 < calc.chartWidth / 2 ? d.x1 + labelLayout.padding : d.x0 - labelLayout.padding,
                getY: d => (d.y1 + d.y0) / 2,
                getAnchor: d => d.x0 < calc.chartWidth / 2 ? labelLayout.textAnchor.left : labelLayout.textAnchor.right
            }
        };

        if (data) {
            const nodes = data.nodes.map(d => ({ ...d }));
            const links = data.links.map(d => {
                const link = { ...d };
                
                if (nodes[link.target].name === "Savings") {
                    link.value *= 1; 
                }

                if (nodes[link.source].name === "Expenses") {
                    link.custom = {
                        targetX: calc.chartWidth, 
                        targetY: link.target * (calc.chartHeight / 6) 
                    };
                }
                return link;
            });

            calc.sankeyData = calc.sankeyGenerator({
                nodes: nodes,
                links: links
            });

            calc.sankeyData.nodes.forEach(node => {
                if (node.name === "Savings") {
                    node.x0 = calc.chartWidth * 0.5;
                    node.x1 = calc.chartWidth * 0.6;
                    node.dy *= 0.4;
                }
            });
        }

        this.setState({ calc });
    }

    drawSvgAndWrappers() {
        const { d3Container, svgWidth, svgHeight, calc } = this.getState();

        d3Container.selectAll('svg').remove();

        const svg = d3Container
            ._add({ tag: "svg" })
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        const chart = svg._add({
            tag: "g",
            className: "chart-wrapper"
        })
            .attr("transform", `translate(${calc.chartLeftMargin},${calc.chartTopMargin})`);

        this.setState({ chart, svg });
    }

    initializeEnterExitUpdatePattern() {
        d3.selection.prototype._add = function (params) {
            let container = this;
            let className = params.className;
            let elementTag = params.tag;
            let data = params.data || [className];
            let exitTransition = params.exitTransition || null;
            let enterTransition = params.enterTransition || null;

            let selection = container.selectAll("." + className).data(data, (d, i) => {
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
        let d3Container = d3.select(attrs.container);
        let containerRect = d3Container.node().getBoundingClientRect();

        if (containerRect.width > 0) {
            attrs.svgWidth = containerRect.width;
            attrs.svgHeight = containerRect.height;
        }

        let self = this;

        d3.select(window).on("resize." + attrs.id, function () {
            let containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) {
                attrs.svgWidth = containerRect.width;
                attrs.svgHeight = containerRect.height;
            }

            d3.select(attrs.container + ' svg')
                .attr('width', attrs.svgWidth)
                .attr('height', attrs.svgHeight);

            self.render();
        });

        this.setState({ d3Container });
    }
}
