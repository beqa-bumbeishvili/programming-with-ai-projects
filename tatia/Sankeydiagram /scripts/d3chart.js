class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 200,
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
        this.setDynamicContainer();
        this.calculateProperties();
        this.drawSvgAndWrappers();
        this.drawRects();
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

    drawRects() {
        const { chart, data, chartWidth, chartHeight } = this.getState();

        // შევქმნათ sankey გენერატორი
        const sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[0, 0], [chartWidth, chartHeight]]);

        // მოვამზადოთ მონაცემები sankey-სთვის
        const graph = {
            nodes: [
                { name: "Income" },
                { name: "Expenses" },
                { name: "Direct Savings" },
                { name: "Food and Dining" },
                { name: "Home" },
                { name: "Education" },
                { name: "Shopping" },
                { name: "Travel" },
                { name: "Bills & Utilities" },
                { name: "Health" },
                { name: "Other" },
                { name: "Investments" }
            ],
            links: [
                { source: "Income", target: "Expenses", value: 67.6 },
                { source: "Income", target: "Direct Savings", value: 32.4 },
                { source: "Expenses", target: "Food and Dining", value: 18.1 },
                { source: "Expenses", target: "Home", value: 16.9 },
                { source: "Expenses", target: "Education", value: 3.1 },
                { source: "Expenses", target: "Shopping", value: 4.5 },
                { source: "Expenses", target: "Travel", value: 7.3 },
                { source: "Expenses", target: "Bills & Utilities", value: 4.0 },
                { source: "Expenses", target: "Health", value: 1.3 },
                { source: "Expenses", target: "Other", value: 2.4 },
                { source: "Expenses", target: "Investments", value: 10.0 }
            ]
        };

        // გამოვიყენოთ sankey გენერატორი
        const { nodes, links } = sankey(graph);

        // დავხატოთ links (კავშირები)
        const link = chart.append("g")
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", d => Math.max(1, d.width));

        // დავხატოთ nodes (კვანძები)
        const node = chart.append("g")
            .selectAll("rect")
            .data(nodes)
            .join("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", "#69b3a2");

        // დავამატოთ ტექსტი
        chart.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("x", d => d.x0 < chartWidth / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < chartWidth / 2 ? "start" : "end")
            .text(d => `${d.name}: ${d.value?.toFixed(1)}%`);
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

    drawSankey() {
        const { chart, data, chartWidth, chartHeight } = this.getState();

        // გავასუფთავოთ წინა ვიზუალიზაცია
        chart.selectAll("*").remove();

        // მონაცემების მომზადება
        const graph = {
            nodes: [
                { id: "Income" },
                { id: "Expenses" },
                { id: "Direct Savings" },
                { id: "Food and Dining" },
                { id: "Home" },
                { id: "Education" },
                { id: "Shopping" },
                { id: "Travel" },
                { id: "Bills & Utilities" },
                { id: "Health" },
                { id: "Other" },
                { id: "Investments" }
            ],
            links: [
                { source: 0, target: 1, value: 67.6 },
                { source: 0, target: 2, value: 32.4 },
                { source: 1, target: 3, value: 18.1 },
                { source: 1, target: 4, value: 16.9 },
                { source: 1, target: 5, value: 3.1 },
                { source: 1, target: 6, value: 4.5 },
                { source: 1, target: 7, value: 7.3 },
                { source: 1, target: 8, value: 4.0 },
                { source: 1, target: 9, value: 1.3 },
                { source: 1, target: 10, value: 2.4 },
                { source: 1, target: 11, value: 10.0 }
            ]
        };

        // Sankey გენერატორის შექმნა
        const sankey = d3.sankey()
            .nodeId(d => d.id)
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 1], [chartWidth - 1, chartHeight - 1]]);

        // Sankey მონაცემების გამოთვლა
        const sankeyData = sankey(graph);

        // ფერების სკალა
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // კავშირების დახატვა
        chart.append("g")
            .attr("class", "links")
            .selectAll("path")
            .data(sankeyData.links)
            .enter()
            .append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke", d => color(d.source.id))
            .attr("stroke-width", d => Math.max(1, d.width))
            .attr("fill", "none")
            .attr("opacity", 0.5);

        // კვანძების დახატვა
        const nodes = chart.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(sankeyData.nodes)
            .enter()
            .append("g");

        nodes.append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => color(d.id))
            .attr("opacity", 0.8);

        // ტექსტის დამატება
        nodes.append("text")
            .attr("x", d => d.x0 < chartWidth / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < chartWidth / 2 ? "start" : "end")
            .text(d => `${d.id}: ${d.value?.toFixed(1)}%`)
            .attr("font-size", "10px");

        return this;
    }

}
