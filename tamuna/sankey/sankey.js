class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 200,
            marginTop: 70,
            marginBottom: 70,
            marginRight: 70,
            marginLeft: 70,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: null,
            firstRender: true,
        };

        this.getState = () => attrs;
        this.setState = (d) => Object.assign(attrs, d);

       
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
        const { chart, svg, data } = this.getState();
        const { chartWidth: width, chartHeight: height } = this.getState().calc;

        const nodes = Array.from(
            new Set(data.flatMap(l => [l.source, l.target])),
            name => ({ name })
        );

        const sankeyLinks = data.map(d => ({
            source: nodes.findIndex(node => node.name === d.source),
            target: nodes.findIndex(node => node.name === d.target),
            value: +d.value
        }));

        const sankeyData = {
            nodes: nodes,
            links: sankeyLinks
        };

        const sankey = d3.sankey()
            .nodeWidth(10)
            .nodePadding(40)
            .extent([[0, 0], [width,height]])
            .nodeAlign(d3.sankeyCenter)
            .nodeSort(null);

        const { nodes: sankeyNodes, links: sankeyLinks2 } = sankey(sankeyData);

        const colorScale = d3.scaleOrdinal()
            .domain(['Income', 'Savings', 'Food', 'Housing', 'Shopping', 'Taxes', 'Health', 'Other', 'Transportation', 'Entertainment'])
            .range(['#A4BFD0', '#A4BFD0', '#F6BB9F', '#D69B7F', '#D69B7F', '#9BC4A5', '#D69B7F', '#9BC4A5', '#D69B7F', '#9BC4A5']);

        const link = chart.append("g")
            .selectAll("path")
            .data(sankeyLinks2)
            .join("path")
            .attr("class", "link")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("d", d => {
              
                return d3.sankeyLinkHorizontal()(d);
            })
            .attr("stroke", d => colorScale(d.target.name))
            .attr("stroke-width", d => Math.max(1, d.width));

        const tooltip = d3.select("body")
            ._add({
                tag: 'div',
                className: 'tooltip'
            })
            .style("position", "fixed")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("z-index", "1000")
            .style("transition", "opacity 0.2s")
            .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
            .style("white-space", "nowrap");

        const node = chart.append("g")
            .selectAll("rect")
            .data(sankeyNodes)
            .join("rect")
            .attr("class", "node")
            .attr("x", d => d.x0)
            .attr("y", d => {

               
                return d.y0;
            })
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => colorScale(d.name));

        node.on("mouseover", (event, d) => {
            const nodeElement = event.currentTarget;
            const nodeRect = nodeElement.getBoundingClientRect();
            
            const xPosition = nodeRect.left + (nodeRect.width / 2);
            const yPosition = nodeRect.top - 10;
            
            tooltip
                .style("opacity", 1)
                .html(`${d.name}: ${(d.value * 100).toFixed(1)}%`)
                .style("left", `${xPosition}px`)
                .style("top", `${yPosition}px`)
                .style("transform", "translate(-50%, -100%)")
                .style("background", "rgba(0, 0, 0, 0.8)")
                .style("color", "white")
                .style("padding", "8px")
                .style("border-radius", "4px")
                .style("font-size", "14px");
            
            link.style("opacity", l => 
                l.source === d || l.target === d ? 1 : 0.1
            )
            .style("stroke-width", l => 
                l.source === d || l.target === d ? Math.max(1, l.width) + 2 : Math.max(1, l.width)
            );
            
            d3.select(event.currentTarget)
                .style("opacity", 0.8);
        })
        .on("mouseout", (event) => {
            link.style("opacity", 1)
                .style("stroke-width", d => Math.max(1, d.width));
            
            d3.select(event.currentTarget)
                .style("opacity", 1);
            
            tooltip.style("opacity", 0);
        });

        chart.append("g")
            .selectAll("text")
            .data(sankeyNodes)
            .join("text")
            .attr("class", "node-label")
            .attr("x", d => {
                if (d.name === "Income" || d.name === "Expenses" || d.name === "Savings") {
                    return d.x0 + (d.x1 - d.x0) * 4.5;
                }
                return d.x0 - 50;
            })
            .attr("y", d => {
                
                return d.y0 + (d.y1 - d.y0) / 2;
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(d => d.name);   
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
        let calc = {
            id: null,
            chartTopMargin: null,
            chartLeftMargin: null,
            chartWidth: null,
            chartHeight: null
        };

        calc.id = "ID" + Math.floor(Math.random() * 1000000); // id for event handlings
        calc.chartLeftMargin = marginLeft;
        calc.chartTopMargin = marginTop;
        calc.chartWidth = svgWidth - marginRight - calc.chartLeftMargin;
        calc.chartHeight = svgHeight - marginBottom - calc.chartTopMargin;

        this.setState({ calc });
    }

    drawSvgAndWrappers() {
        const {
            d3Container,
            svgWidth,
            svgHeight,
            defaultFont,
            calc,
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

            svg.selectAll("*").remove();

        let chart = svg
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
            let container = this;
            let className = params.className;
            let elementTag = params.tag;
            let data = params.data || [className];
            let exitTransition = params.exitTransition || null;
            let enterTransition = params.enterTransition || null;
            // Pattern in action
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
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        let self = this;

        d3.select(window).on("resize." + attrs.id, function () {
            let containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

            self.render();
        });

        this.setState({ d3Container });
    }
}
