class Chart {
    constructor() {
        const margin = {
            top: 100,
            right: 200,     
            bottom: 100,
            left: 200      
        };
        const width = 1200;  
        const height = 800;  
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: width,            
            svgHeight: height,           
            margin: margin,
            container: "body",
            data: null,
            chartWidth: width - margin.left - margin.right,   
            chartHeight: height - margin.top - margin.bottom,  
            firstRender: true,
            guiEnabled: false,
            levels: 5,
            maxValue: 1,
            labelFactor: 1.25,    
            wrapWidth: 100,      
            dotRadius: 2.5,
            textAnchor: "middle",
            textDY: "0.35em",
            axisLabelDY: "0.4em",
            fontSize: "11px",
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: "300",
            textFill: "#242424",
            legendFontFamily: "'Raleway', sans-serif",
            legendFill: "#333333",
            tooltipFill: "#333333",
            color: d3.scaleOrdinal()
                .range([ "#FFD700", "#FF7F7F",]),
            Format: d3.format('.0%'),
            tooltipOffset: 10,          
            invisibleCircleRadius: 6,  
            tooltipOpacityHidden: 0,    
            tooltipOpacityVisible: 1,   
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
    }
    render() {
        this.setDynamicContainer();
        this.calculateProperties();
        this.drawSvgAndWrappers();
        this.drawCharts();
        return this;
    }

    calculateProperties() {
        const attrs = this.getState();
        
        const radius = Math.min(attrs.svgWidth/2, attrs.svgHeight/2);
        const allAxis = attrs.data[0].map(d => d.axis);
        const total = allAxis.length;
        const angleSlice = Math.PI * 2 / total;
        
        const rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, attrs.maxValue]);

        this.setState({ 
            radius,
            allAxis,
            total,
            angleSlice,
            rScale
        });
    }
    
    drawCharts() {
        const attrs = this.getState();
        this.drawCircularGrid();
        this.drawAxes();
        this.drawBlobs();
        this.addTooltips();
    }

    drawCircularGrid() {
        const attrs = this.getState();
        const { chart, radius, levels, rScale, maxValue, Format } = attrs;
    
        const axisGrid = chart.append("g").attr("class", "axisWrapper");
    
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (levels + 1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", d => radius / levels * d);
    
        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1, (levels + 1)).reverse())
            .enter()
            .append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", d => -d * radius / levels)
            .attr("dy", "0.4em")
            .text(d => Format(maxValue * d / levels));
    }

    drawAxes() {
        const attrs = this.getState();
        const { chart, allAxis, angleSlice, rScale, maxValue, labelFactor } = attrs;

        const axis = chart.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("class", "line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2));

        axis.append("text")
            .attr("class", "legend")
            .attr("text-anchor", attrs.textAnchor)
            .attr("dy", attrs.textDY)
            .attr("x", (d, i) => rScale(maxValue * labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y", (d, i) => rScale(maxValue * labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d)
            .call(this.wrap, attrs.wrapWidth);
    }

    drawBlobs() {
        const attrs = this.getState();
        const { chart, data, rScale, angleSlice, color } = attrs;

        const radarLine = d3.lineRadial()
            .curve(d3.curveCardinalClosed)
            .radius(d => rScale(d.value))
            .angle((d, i) => i * angleSlice);

        const blobWrapper = chart.selectAll(".radarWrapper")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "radarWrapper");

        blobWrapper.append("path")
            .attr("class", "radarArea")
            .attr("d", d => radarLine(d))
            .style("fill", (d, i) => color(i));

        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", d => radarLine(d))
            .style("stroke", (d, i) => color(i));

        blobWrapper.selectAll(".radarCircle")
            .data(d => d)
            .enter()
            .append("circle")
            .attr("class", "radarCircle")
            .attr("r", attrs.dotRadius)
            .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2))
            .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2))
            .style("fill", (d, i, j) => color(j));
    }

    wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4,
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan")
                    .attr("x", x)
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
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
            }
        });
    }

    setDynamicContainer() {
        const attrs = this.getState();

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

    drawSvgAndWrappers() {
        const attrs = this.getState();

        const containerEl = d3.select(attrs.container);
        containerEl.selectAll('svg').remove();

        const svg = containerEl
            .append("svg")
            .attr("width", attrs.svgWidth)      
            .attr("height", attrs.svgHeight)      
            .attr("viewBox", `0 0 ${attrs.svgWidth} ${attrs.svgHeight}`)
            .style("overflow", "visible");        

        const chart = svg
            .append("g")
            .attr("transform", `translate(${attrs.svgWidth/2},${attrs.svgHeight/2})`);

        const defs = svg.append("defs");
        const filter = defs.append("filter").attr("id", "glow");
        filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        this.setState({ svg, chart });
    }

    addTooltips() {
        const attrs = this.getState();
        const { chart, data, rScale, angleSlice, Format, tooltipOffset, invisibleCircleRadius } = attrs;

        const tooltip = chart.append("text")
            .attr("class", "tooltip");

        const blobCircleWrapper = chart.selectAll(".radarCircleWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");

        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(d => d)
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", invisibleCircleRadius)
            .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2))
            .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2))
            .on("mouseover", function(event, d) {
                const newX = parseFloat(d3.select(this).attr('cx')) - tooltipOffset;
                const newY = parseFloat(d3.select(this).attr('cy')) - tooltipOffset;
                tooltip
                    .attr('x', newX)
                    .attr('y', newY)
                    .text(Format(d.value))
                    .classed('visible', true);
            })
            .on("mouseout", function() {
                tooltip.classed('visible', false);
            });
    }
}
