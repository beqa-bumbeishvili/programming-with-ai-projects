class Chart {
    constructor() {
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 400,
            marginTop: 20,
            marginBottom: 10,
            marginRight: 50,
            marginLeft: 50,
            container: "body",
            defaultFont: "Helvetica",
            data: null,
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
            .nodeWidth(10) //attrs-ში ესენი
            .nodePadding(12)
            .extent([[1, 50], [width+400, height-200]])
            .nodeAlign(d3.sankeyLeft)
            .nodeSort((a, b) => {
                if (a.name === "Income") return -1; //არაა აუცილებელი სურათის მიხედვით იყოს დასორტირებული, სანკეი სულ უნდა მუშაობდეს რა დატაც არ უნდა შემოვიცეს csv ფაილიდან
                if (b.name === "Income") return 1;  // შეილება Income და Savings სულ არ იყოს იმ დატაში, აქ შეგიძლია დაასორტირო ალფავიტის მიხედვით მაგალითად
                if (a.name === "Savings") return 2;
                if (b.name === "Savings") return -2;
                
                if (a.name === "Food") return 2;
                if (b.name === "Food") return -2;
                if (a.name === "Housing") return -1.5;
                if (b.name === "Housing") return 1.5;
                
                const sequence = [
                    "Housing",
                    "Entertainment",
                    "Taxes",
                    "Transportation",
                    "Shopping",
                    "Travel",
                    "Health",
                    "Other",
                    "Food"
                ];
                
                return sequence.indexOf(a.name) - sequence.indexOf(b.name);
            });

        const { nodes: sankeyNodes, links: sankeyLinks2 } = sankey(sankeyData);

        const colorScale = d3.scaleOrdinal()
            .domain(['Income', 'Savings', 'Food', 'Housing', 'Shopping', 'Taxes', 'Health', 'Other', 'Transportation', 'Entertainment'])
            .range(['#A4BFD0', '#A4BFD0', '#F6BB9F', '#D69B7F', '#D69B7F', '#9BC4A5', '#D69B7F', '#9BC4A5', '#D69B7F', '#9BC4A5']);
            // ატტრს-ში

        const link = chart.append("g")
            .selectAll("path")
            .data(sankeyLinks2)
            .join("path")
            .attr("class", "link")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("d", d => {
                if (d.target.name === "Housing" || d.target.name === "Entertainment") { //ნწუ, დატაში შეილება ვაფშე არ გქონდეს ეგენი
                    const source = d.source;
                    const target = d.target;
                    const x0 = source.x0;
                    const x1 = target.x1;
                    const y0 = source.y0+30 ;
                    const y1 = target.y1-80;  
                    
                    return `M${x0},${y0}
                            C${(x0 + x1) / 2},${y0}
                             ${(x0 + x1) / 2},${y1}
                             ${x1},${y1}`;
                } //ხაზი გამოტოვე ქვევით
                return d3.sankeyLinkHorizontal()(d);
            })
            .attr("stroke", d => colorScale(d.target.name))
            .attr("stroke-width", d => Math.max(1, d.width));

        const tooltip = d3.select("body")
            ._add({
                tag: 'div',
                className: 'tooltip'
            })
  // ორი ხაზი ზედმეტია

        const node = chart.append("g")
            .selectAll("rect")
            .data(sankeyNodes)
            .join("rect")
            .attr("class", "node")
            .attr("x", d => d.x0)
            .attr("y", d => {

                if (d.name === "Housing") { //ნწუ, დატაში შეილება ვაფშე არ გქონდეს ეს
                    return d.y0 - 50;  
                }
                return d.y0;
            })
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => colorScale(d.name));

        node.on("mouseover", (event, d) => {
            const nodeWidth = d.x1 - d.x0;
            const nodeCenter = d.x0 + (nodeWidth / 2);
            
            const svgRect = svg.node().getBoundingClientRect();
            const chartTransform = d3.select('.chart').attr('transform');
            const translate = chartTransform.match(/translate\(([\d.]+),\s*([\d.]+)\)/);
            const scale = chartTransform.match(/scale\(([\d.]+)\)/);
            const translateX = parseFloat(translate[1]);
            const translateY = parseFloat(translate[2]);
            const scaleValue = parseFloat(scale[1]);
            
            let xOffset = 40;  
            let yOffset = -15; 
            
            // ნწუ, დატაში შეილება ვაფშე არ გქონდეს ესენი. hardCode ქვია ამას, ხელით რო ასწორებ კონკრეტულ რაღაცებს, არ მოსულა ;დ
            if (d.name === "Income") {
                xOffset = 90; 
             yOffset = -30; 
            } else if (d.name === "Savings") {
                xOffset = 50; 
                yOffset = -60;  
            }else if (d.name === "Expenses") {
                    xOffset = 50; 
                    yOffset = -30;    
            } else if (!["Income", "Expenses", "Savings"].includes(d.name)) {
                xOffset = 0; 
                yOffset = -80;
            }
            
            const xPosition = svgRect.left + (nodeCenter + translateX) * scaleValue + xOffset;
            const yPosition = svgRect.top + (d.y0 + translateY) * scaleValue + yOffset;
            
            tooltip.style("opacity", 1)
                   .html(`${d.name}: ${(d.value * 100).toFixed(1)}%`)
                   .style("left", `${xPosition}px`)
                   .style("top", `${yPosition}px`)
                   .style("transform", "translate(-50%, -100%)"); 
                   
            link.style("opacity", l => 
                l.source === d || l.target === d ? 1 : 0.1
            )
            .style("stroke-width", l => 
                l.source === d || l.target === d ? Math.max(1, l.width) + 2 : Math.max(1, l.width)
            );
            
            d3.select(event.currentTarget)
                .classed("hover", true);
        })
        .on("mouseout", (event) => {
            link.style("opacity", 1)
                .style("stroke-width", d => Math.max(1, d.width));
            
            d3.select(event.currentTarget)
                .classed("hover", false);
            
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
                if (d.name === "Housing") {
                    return (d.y0 - 50) + (d.y1 - d.y0) / 2;  
                }
                return d.y0 + (d.y1 - d.y0) / 2;
            })
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

        let calc = {
            id: null,
            chartTopMargin: null,
            chartLeftMargin: null,
            chartWidth: null,
            chartHeight: null
        };

        calc.id = "ID" + Math.floor(Math.random() * 1000000);
        calc.chartLeftMargin = marginLeft + 50;
        calc.chartTopMargin = marginTop;
        calc.chartWidth = svgWidth - marginRight - calc.chartLeftMargin;
        calc.chartHeight = svgHeight - marginBottom - calc.chartTopMargin;

        this.setState({ calc });
    }

    setDynamicContainer() {
        const attrs = this.getState();

        if (attrs.container.startsWith('#')) {
            this.setState({ container: attrs.container });
        } else {
            this.setState({ container: '.' + attrs.container });
        }
    }

    drawSvgAndWrappers() {
        const attrs = this.getState();
        
        d3.select(attrs.container).selectAll("*").remove();
        
        const container = d3.select(attrs.container)
            .style("width", "100vw")
            .style("height", "100vh")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center");

        if (!container.empty()) {
            const svg = container
                ._add({
                    tag: 'svg',
                    className: 'svg-chart-container'
                })
                .attr("width", 1200)
                .attr("height", 800)
                .attr("viewBox", "0 0 1200 800")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("font-family", attrs.defaultFont);

            let chart = svg
                ._add({
                    tag: 'g',
                    className: 'chart'
                })
                .attr(
                    "transform",
                    `translate(150, 150) scale(1)` 
                );

            this.setState({ chart, svg });
        } else {
            console.error('Container not found:', attrs.container);
        }
    }

    initializeEnterExitUpdatePattern() {
        d3.selection.prototype._add = function(params) {
            var container = this;
            var className = params.className;
            var elementTag = params.tag;


            var selection = container.append(elementTag)
                .attr('class', className);

            return selection;
        };
    }
}
