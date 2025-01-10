class Chart {
    constructor() {
        let attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 800,
            svgHeight: 1000,
            marginTop: 30,
            marginBottom: 0,
            marginRight: 0,
            marginLeft: 0,
            container: "#map-container",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: null,
            chartWidth: null,
            chartHeight: null,
            guiEnabled: false,
            markerScale: 1.5,
            markerOffset: { x: -12, y: -24 },
            tooltipOffset: { x: 15, y: -60 },
            mapContainer: { x: 0, y: 0 },
            projection: {
                scale: 1.3,
                minScale: 1.5,
                center: [0, -20],
                translate: { x: 2.2, y: 2.2 }
            }
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

    drawRects() {
        const { chart, data, chartWidth, chartHeight, markerScale, markerOffset, tooltipOffset, projection: projConfig, mapContainer: mapConfig } = this.getState();

        chart.selectAll('.map-container').remove();

        const screenWidth = window.innerWidth;
        const dynamicScale = screenWidth > 1200 ? projConfig.scale : projConfig.minScale;

        const filteredFeatures = data.worldData.features.filter(feature => 
            feature.properties.name !== 'Antarctica'
        );
        
        const mapContainer = chart._add('g.map-container')
            .attr('transform', `translate(${mapConfig.x},${mapConfig.y})`);

        const projection = d3.geoNaturalEarth1()
            .scale((Math.min(chartWidth, chartHeight)) / dynamicScale / Math.PI)
            .center(projConfig.center)
            .translate([chartWidth / projConfig.translate.x, chartHeight / projConfig.translate.y]);

        const pathGenerator = d3.geoPath()
            .projection(projection);

        const paths = mapContainer.selectAll('path')
            .data(filteredFeatures)  
            .join('path')
            .attr('d', pathGenerator);

        const markerPath = "M12 0C7.2 0 3.3 3.9 3.3 8.7c0 7.2 8.7 15.3 8.7 15.3s8.7-8.1\
         8.7-15.3C20.7 3.9 16.8 0 12 0zm0 13c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z";

        data.placesData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const initialDelay = 1000; 
        const delayBetweenPins = 5000; 
    
        data.placesData.forEach((place, index) => {
            setTimeout(() => {
                const marker = mapContainer.append("g")
                    .attr("class", "marker")
                    .attr("transform", `translate(${projection([+place.longitude, +place.latitude])[0]},\
                     ${projection([+place.longitude, +place.latitude])[1]})`)
                    .on("mouseover", function(event) {
                        d3.select("body")
                            .append("div")
                            .attr("class", "tooltip visible")
                            .style("left", (event.pageX + tooltipOffset.x) + "px")
                            .style("top", (event.pageY + tooltipOffset.y) + "px")
                            .html(`
                                <h3>${place.name}</h3>
                                <p>Visited: ${new Date(place.date).getFullYear()}</p>
                                <p>Score: <span class="score">${place.score}</span></p>
                                <p>${place.comment}</p>
                            `);
                    })
                    .on("mouseout", function() {
                        d3.selectAll(".tooltip").remove();
                    })
                    .on("mousemove", function(event) {
                        d3.select(".tooltip")
                            .style("left", (event.pageX + tooltipOffset.x) + "px")
                            .style("top", (event.pageY + tooltipOffset.y) + "px");
                    });
                
                marker.append("path")
                    .attr("d", markerPath)
                    .attr("transform", `translate(${markerOffset.x}, ${markerOffset.y}) scale(${markerScale})`)
                    .classed('marker-path', true);
                
            }, initialDelay + (index * delayBetweenPins));
        });

        return this;
    }

    drawSvgAndWrappers() {
        const attrs = this.getState();

        const container = d3.select(attrs.container);
        
        container.selectAll('svg').remove();
        
        const svg = container.append('svg')
            .attr('width', attrs.svgWidth)
            .attr('height', attrs.svgHeight)
            .attr('font-family', attrs.defaultFont);

        const chart = svg.append('g')
            .attr('class', 'chart')
            .attr(
                'transform',
                `translate(${attrs.marginLeft},${attrs.marginTop})`
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
                bindData = [container.datum()];
            }
            if (!bindData) {
                bindData = [className]
            }
            if (!Array.isArray(bindData)) {
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

        var d3Container = d3.select(attrs.container);
        var containerRect = d3Container.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        d3.select(window).on("resize." + attrs.id, () => {
            var containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
            this.render();
        });

        this.setState({ d3Container });
    }
}

const chart = new Chart();