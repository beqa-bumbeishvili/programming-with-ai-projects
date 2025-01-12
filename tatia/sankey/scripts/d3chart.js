class Chart {
    constructor() {
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 200,
            marginTop: 5,
            marginBottom: 5,
            marginRight: 20,
            marginLeft: 20,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: null,
            chartWidth: null,
            chartHeight: null,
            nodeWidth: 15,
            nodePadding: 10,
            nodeStroke: "lightblue",
            nodeFill: "blue",
            nodeLabelPadding: 6,
            nodeLebelFontSize: "12px",
            nodeLabelDY: "0.35em",
            linkStrokeOpacity: 0.8,
            linkStroke: "#c4dfef",
            linkFill: "none",
            linkMinWidth: 1
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

    drawSankey() {
        const {
            chart,
            data,
            chartWidth,
            chartHeight,
            nodeWidth,
            nodePadding,
            nodeStroke,
            nodeFill,
            nodeLabelPadding,
            nodeLabelDY,
            linkStrokeOpacity,
            linkStroke,
            linkFill,
            linkMinWidth,
            nodeLebelFontSize
        } = this.getState();

        const sankey = d3.sankey()
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            .extent([[0, 0], [chartWidth, chartHeight]]);

        const sankeyData = sankey(data);

        const colorScale = d3.scaleOrdinal()
            .domain(sankeyData.links.filter(d => d.source.name === "Expenses").map(d => d.target.name)) 
            .range(['#f7f791', '#9befda', '#e6daf2', '#b7eab4', '#baf2eb', '#a791f2', '#dda0dd']); //attrs-ში

        const linkG = chart._add('g.links-container');
        const link = linkG._add('path.link', sankeyData.links)
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke", d => {
                if (d.source.name === "Expenses") {
                    const color = colorScale(d.target.name);
                    return color;
                }
                return linkStroke;  // Income-ის ლინკების ფერი
            })
            .attr("fill", linkFill)
            .attr("stroke-opacity", linkStrokeOpacity)
            .attr("stroke-width", d => Math.max(linkMinWidth, d.width));

        link._add('title.link-tooltip')
            .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toFixed(1)}%`);

        const nodeG = chart._add('g.nodes-container');
        const node = nodeG._add('g.node', sankeyData.nodes)
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        node._add('rect.node-rect')
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", nodeFill)
            .attr("stroke", nodeStroke);

        node._add('text.node-lebel')
            .attr("x", d => d.x0 < chartWidth / 2 ? nodeLabelPadding + (d.x1 - d.x0) : -nodeLabelPadding)
            .attr("y", d => (d.y1 - d.y0) / 2)
            .attr("dy", nodeLabelDY)
            .attr("text-anchor", d => d.x0 < chartWidth / 2 ? "start" : "end")
            .attr("font-size", nodeLebelFontSize)
            .text(d => `${d.name}`);

        node._add('title')
            .text(d => `${d.name}\n${d.value.toFixed(1)}%`);

    }

    drawSvgAndWrappers() {
        const {
            d3Container,
            svgWidth,
            svgHeight,
            defaultFont,
            calc,
        } = this.getState();

        const svg = d3Container._add('svg.svg-container')
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("font-family", defaultFont);

        var chart = svg._add('g.chart')
            .attr(
                "transform",
                "translate(" + calc.chartLeftMargin + "," + calc.chartTopMargin + ")"
            );

        this.setState({ chart, svg });
    }

    initializeEnterExitUpdatePattern() {
        d3.selection.prototype._add = function (classSelector, data, params) {
            const container = this;
            const split = classSelector.split(".");
            const elementTag = split[0];
            const className = split[1] || 'not-good';
            const exitTransition = params?.exitTransition;
            const enterTransition = params?.enterTransition;

            let bindData = data;
            if (typeof data === 'function') {
                bindData = data(container.datum());
            }
            if (!bindData) {
                bindData = d => [d];
            }
            if (!bindData) {
                bindData = [className]
            }
            if (!Array.isArray(bindData) && typeof bindData === "object") {
                bindData = [bindData];
            }
            let selection = container.selectAll(elementTag + '.' + className).data(bindData, (d, i) => {
                if (typeof d === "object" && d.id) return d.id;
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
            selection.attr("class", className)
                .attr('stroke', className == 'not-good' ? 'red' : null)
                .attr('stroke-width', className == 'not-good' ? 10 : null)

            return selection;
        }
    }

    setDynamicContainer() {
        const attrs = this.getState();

        //Drawing containers
        var d3Container = d3.select(attrs.container);
        var containerRect = d3Container.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        const self = this;

        d3.select(window).on("resize." + attrs.id, function () {
            var containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
            self.render();
        });

        this.setState({ d3Container });
    }
}