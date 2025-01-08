<<<<<<< HEAD
class Chart {
    constructor() {
        const margin = {
            top: 100,
            right: 200,     
            bottom: 100,
            left: 200      
        };
        const width = 1000;
        const height = 1000;
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
            wrapWidth: 150,      
            dotRadius: 2.5,
            textAnchor: "middle",
            textDY: "0.35em",
            axisLabelDY: "0.4em",
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
=======
const groupedAttrs = {
	core: {
		id: "ID" + Math.floor(Math.random() * 1000000),
		svgWidth: Math.min(600, window.innerWidth - 10),
		svgHeight: Math.min(600, window.innerHeight - 10),
		container: "body",
		data: null,
		chartWidth: null,
		chartHeight: null,
		firstRender: true,
		guiEnabled: false,
	},
// არ გინდა აქ ხაზების გამოტოვება
	containerStyles: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
		width: '100%',
		position: 'absolute',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		margin: '0',
		padding: '0'
	},

	margin: {
		top: 50,
		right: 100,
		bottom: 50,
		left: 100
	},

	svg: {
		class: "radar",
		style: {
			display: 'block',
			margin: 'auto'
		}
	},

	filter: {
		glow: {
			id: 'glow',
			gaussianBlur: {
				stdDeviation: '2.5',
				result: 'coloredBlur'
			},
			merge: {
				node1: {
					in: 'coloredBlur'
				},
				node2: {
					in: 'SourceGraphic'
				}
			}
		}
	},

	axisGrid: {
		wrapper: {
			class: "axisWrapper"
		},
		circles: {
			class: "gridCircle",
			fill: "#CDCDCD",
			stroke: "#CDCDCD",
			fillOpacity: 0.1,
			filter: "url(#glow)",
			levels: {
				class: "levels"
			}
		},
		labels: {
			class: "axisLabel",
			x: 4,
			dy: "0.4em",
			fontSize: "10px",
			fill: "#737373",
			fontFamily: "'Open Sans', sans-serif",
			fontWeight: "300",
			textShadow: "0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff"
		}
	},

	axis: {
		wrapper: {
			class: "axis"
		},
		line: {
			class: "line",
			x1: 0,
			y1: 0,
			stroke: "white",
			strokeWidth: "2px"
		},
		text: {
			class: "legend",
			fontSize: "11px",
			textAnchor: "middle",
			dy: "0.35em",
			fontFamily: "'Raleway', sans-serif",
			fill: "#333333",
			fontWeight: "400",
			textShadow: "0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff"
		}
	},

	radarLine: {
		interpolation: "linear-closed",
		cardinalClosed: "cardinal-closed"
	},

	blob: {
			wrapper: {
				class: "radarWrapper"
			},
			area: {
				class: "radarArea",
				fillOpacity: 0.25,
				mouseOverOpacity: 0.1,
				mouseOverDuration: 200,
				mouseOutDuration: 200
			},
			stroke: {
				class: "radarStroke",
				strokeWidth: "2px",
				fill: "none",
				filter: "url(#glow)"
			},
			circle: {
				class: "radarCircle",
				radius: 4,
				fillOpacity: 1
			},
			circleWrapper: {
				class: "radarCircleWrapper"
			},
			invisibleCircle: {
				class: "radarInvisibleCircle",
				radius: 4 * 1.5,
				fill: "none",
				pointerEvents: "all"
			}
	},

	tooltip: {
		class: "tooltip",
		styles: {
			opacity: 0,
			"font-family": "sans-serif",
			"font-size": "12px",
			fill: "#333",
			"pointer-events": "none",
			"font-weight": "bold"
		}
	},

	text: {
		wrap: {
			lineHeight: 1.4  
		}
	},

	radar: {
		maxValue: 1.0,
		levels: 5,
		roundStrokes: true,
		Format: d3.format('.0%'),
		labelFactor: 1.25,
		wrapWidth: 60,
		strokeWidth: 1,
		radiusScaleFactor: 1.1  
	},

	theme: {
		color: d3.scaleOrdinal().range([
			"#CC333F",
			"#EDC951",
			"#00A0B0"
		]),
		bodyFont: "Arial",
		legendFont: "Arial"
	},

	animation: {
		duration: 200
	}
};

function render(container, data, options) {
	if (!data) {
		return this;
	}

	RadarChart(container, data, {
		w: options.width,
		h: options.height,
		margin: options.margin,
		maxValue: groupedAttrs.radar.maxValue,
		levels: groupedAttrs.radar.levels,
		roundStrokes: groupedAttrs.radar.roundStrokes,
		color: groupedAttrs.theme.color
	});

	return this;
}

function RadarChart(id, data, options) {
	var cfg = {
		w: 200,
		h: 200,
		margin: groupedAttrs.margin,
		levels: 3,
		maxValue: 0,
		labelFactor: 1.25,
		wrapWidth: 60,
		opacityArea: 0.35,
		dotRadius: 4,
		opacityCircles: 0.1,
		strokeWidth: 2,
		roundStrokes: false,
		color: d3.scaleOrdinal(d3.schemeCategory10)
	};

	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }
	}
	
	const maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	const allAxis = (data[0].map(function(i, j){return i.axis})),	
		total = allAxis.length,					
		radius = Math.min(cfg.w/2, cfg.h/2), 	
		Format = function(value) {
			const num = parseFloat(value);
			if (isNaN(num)) return "0%";
			return d3.format('.0%')(num);
		},
		angleSlice = Math.PI * 2 / total;		
	
    const rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	d3.select(id).select("svg").remove();
	
	const svg = d3.select(id).append("svg")
			.attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id)
			.style("display", "block")
			.style("margin", "auto");
	
    const g = svg.append("g")
			.attr("transform", "translate(" + 
				(cfg.w/2 + cfg.margin.left) + "," + 
				(cfg.h/2 + cfg.margin.top) + ")");

    const filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
	
    const axisGrid = g.append("g").attr("class", "axisWrapper");
	
	axisGrid.selectAll(".levels")
	   .data(Array.from({length: cfg.levels}, (_, i) => cfg.levels - i))
	   .enter()
		.append("circle")
		.attr("class", groupedAttrs.axisGrid.circles.class)
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", groupedAttrs.axisGrid.circles.fill)
		.style("stroke", groupedAttrs.axisGrid.circles.stroke)
		.style("fill-opacity", groupedAttrs.axisGrid.circles.fillOpacity)
		.style("filter", groupedAttrs.axisGrid.circles.filter);

	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", groupedAttrs.axisGrid.labels.class)
	   .attr("x", groupedAttrs.axisGrid.labels.x)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", groupedAttrs.axisGrid.labels.dy)
	   .style("font-family", groupedAttrs.axisGrid.labels.fontFamily)
	   .style("font-size", groupedAttrs.axisGrid.labels.fontSize)
	   .style("font-weight", groupedAttrs.axisGrid.labels.fontWeight)
	   .style("fill", groupedAttrs.axisGrid.labels.fill)
	   .style("text-shadow", groupedAttrs.axisGrid.labels.textShadow)
	   .text(function(d,i) { 
		   const value = maxValue * d/cfg.levels;
		   return Format(value);
	   });
	
    const axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");

	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", groupedAttrs.axis.line.class)
		.style("stroke", groupedAttrs.axis.line.stroke)
		.style("stroke-width", groupedAttrs.axis.line.strokeWidth);

	axis.append("text")
		.attr("class", groupedAttrs.axis.text.class)
		.attr("text-anchor", groupedAttrs.axis.text.textAnchor)
		.attr("dy", groupedAttrs.axis.text.dy)
		.style("font-family", groupedAttrs.axis.text.fontFamily)
		.style("font-size", groupedAttrs.axis.text.fontSize)
		.style("font-weight", groupedAttrs.axis.text.fontWeight)
		.style("fill", groupedAttrs.axis.text.fill)
		.style("text-shadow", groupedAttrs.axis.text.textShadow)
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	const radarLine = d3.lineRadial()
		.curve(cfg.roundStrokes ? d3.curveCardinalClosed : d3.curveLinearClosed)
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d, i) { return i * angleSlice; });
		
	const blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.join("g")
		.attr("class", "radarWrapper");
			
	blobWrapper
		.append("path")
		.attr("class", groupedAttrs.blob.area.class)
		.attr("d", function(d) { return radarLine(d); })
		.style("fill", function(d, i) { return groupedAttrs.theme.color(i); })
		.style("fill-opacity", groupedAttrs.blob.area.fillOpacity)
		.on('mouseover', function(event, d) {
			
			d3.selectAll(".radarArea")
				.transition().duration(groupedAttrs.blob.area.mouseOverDuration)
				.style("fill-opacity", groupedAttrs.blob.area.mouseOverOpacity); 
			
			d3.select(this)
				.transition().duration(groupedAttrs.blob.area.mouseOverDuration)
				.style("fill-opacity", 0.7);    
		})
		.on('mouseout', function() {
			
			d3.selectAll(".radarArea")
				.transition().duration(groupedAttrs.blob.area.mouseOutDuration)
				.style("fill-opacity", groupedAttrs.blob.area.fillOpacity);
		});
		
	blobWrapper.append("path")
		.attr("class", groupedAttrs.blob.stroke.class)
		.attr("d", function(d) { return radarLine(d); })
		.style("stroke-width", groupedAttrs.blob.stroke.strokeWidth)
		.style("stroke", function(d, i) { return groupedAttrs.theme.color(i); })
		.style("fill", groupedAttrs.blob.stroke.fill)
		.style("filter", groupedAttrs.blob.stroke.filter);

	blobWrapper.selectAll(".radarCircle")
		.data(function(d) { return d; })
		.join("circle")
		.attr("class", groupedAttrs.blob.circle.class)
		.attr("r", groupedAttrs.blob.circle.radius)
		.attr("cx", function(d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2); })
		.attr("cy", function(d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2); })
		.style("fill", function(d, i, j) { return groupedAttrs.theme.color(d3.select(this.parentNode).datum()); })
		.style("fill-opacity", groupedAttrs.blob.circle.fillOpacity);

	var tooltip = g.append("text")
		.attr("class", groupedAttrs.tooltip.class)
		.style("opacity", groupedAttrs.tooltip.styles.opacity)
		.style("font-family", groupedAttrs.tooltip.styles["font-family"])
		.style("font-size", groupedAttrs.tooltip.styles["font-size"])
		.style("fill", groupedAttrs.tooltip.styles.fill)
		.style("pointer-events", groupedAttrs.tooltip.styles["pointer-events"])
		.style("font-weight", groupedAttrs.tooltip.styles["font-weight"]);

	const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", groupedAttrs.blob.circleWrapper.class);
		
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", groupedAttrs.blob.invisibleCircle.class)
		.attr("r", groupedAttrs.blob.invisibleCircle.radius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", groupedAttrs.blob.invisibleCircle.fill)
		.style("pointer-events", groupedAttrs.blob.invisibleCircle.pointerEvents)
		.on("mouseover", function(event, d) {
			let newX = parseFloat(d3.select(this).attr('cx')) - 10;
			let newY = parseFloat(d3.select(this).attr('cy')) - 10;
			
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
	
	function wrap(text, width) {
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
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}
}

class RadarChartClass {
	constructor() {
		this._width = Math.min(400, window.innerWidth - 10);
		this._height = Math.min(400, window.innerHeight - 10);
		this._margin = groupedAttrs.margin;
		this._container = 'body';
		this._data = null;
		this._guiEnabled = false;
		this._attrs = groupedAttrs;
	}

	width(value) {
		this._width = value;
		return this;
	}

	height(value) {
		this._height = value;
		return this;
	}

	margin(value) {
		this._margin = value;
		return this;
	}

	container(value) {
		this._container = value;
		return this;
	}

	data(value) {
		this._data = value;
		return this;
	}

	guiEnabled(value) {
		this._guiEnabled = value;
		return this;
	}

	render() {
		if (!this._data) {
			return this;
		}

		const container = d3.select(this._container);
		Object.entries(this._attrs.containerStyles).forEach(([property, value]) => {
			container.style(property, value);
		});

		RadarChart(this._container, this._data, {
			w: this._width,
			h: this._height,
			margin: this._margin,
			maxValue: groupedAttrs.radar.maxValue,
			levels: groupedAttrs.radar.levels,
			roundStrokes: groupedAttrs.radar.roundStrokes,
			color: groupedAttrs.theme.color
		});

		return this;
	}

	async loadCSV(url) {
		try {
			const csvData = await d3.csv(url);
			const groups = Array.from(new Set(csvData.map(d => d.group)));
			const data = groups.map(group => {
				return csvData
					.filter(d => d.group === group)
					.map(d => ({
						axis: d.axis,
						value: +d.value
					}));
			});
			
			this._data = data;
			return this;
		} catch (error) {
			throw error;
		}
	}
}

function makeResponsive(chartId, data) {
    const setDynamicContainer = () => {
        const container = d3.select(chartId);
        const containerRect = container.node().getBoundingClientRect();
>>>>>>> a0aca56270b1253736fdca48147d9a1db6032c58
        
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
            .style("font-size", attrs.axisLabelFontSize)
            .style("font-weight", attrs.axisLabelFontWeight)
            .style("fill", attrs.textFill)
            .style("filter", "url(#glow)")
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
            .style("font-size", attrs.legendFontSize)
            .style("font-weight", attrs.legendFontWeight)
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
            .style("fill", (d, i) => color(i))
            .style("filter", "url(#glow)");

        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", d => radarLine(d))
            .style("stroke", (d, i) => color(i))
            .style("filter", "url(#glow)");

        blobWrapper.selectAll(".radarCircle")
            .data(d => d)
            .enter()
            .append("circle")
            .attr("class", "radarCircle")
            .attr("r", attrs.dotRadius)
            .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2))
            .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2))
            .style("fill", (d, i, j) => color(j))
            .style("filter", "url(#glow)");
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
