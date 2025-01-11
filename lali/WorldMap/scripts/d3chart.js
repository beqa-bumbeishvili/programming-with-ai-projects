class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 960,
            svgHeight: 500,
            marginTop: 20,
            marginBottom: 20,
            marginRight: 20,
            marginLeft: 20,
            container: "body",
            defaultTextFill: "#2C3E50",
            defaultFont: "Helvetica",
            data: null,
            chartWidth: null,
            chartHeight: null,
            firstRender: true,
            map: {
                minWidth: 800,
                minHeight: 400,
                aspectRatio: 1.7,
                center: [15, 45],
                pinPath: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                bounds: {
                    minLat: -60,
                    maxLat: 85,
                    minLng: -180,
                    maxLng: 180
                }
            },
            styles: {
                pin: {
                    fill: "#ff4d4d",
                    stroke: "#fff",
                    strokeWidth: 1,
                    scale: 0.8,
                    hoverScale: 1
                },
                countries: {
                    stroke: "#fff",
                    strokeWidth: 0.5
                },
                gradient: {
                    colors: {
                        start: "#72dc8b",
                        middle: "#97ca0e",
                        end: "#dcd472"
                    },
                    attributes: {
                        id: "map-gradient",
                        x1: "0%",
                        y1: "50%",
                        x2: "100%",
                        y2: "50%"
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "10px",
                    fontSize: "14px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    minWidth: "200px"
                }
            },
            animation: {
                pinDelay: 400,
                pinDuration: 800,
                tooltipFadeIn: 200,
                tooltipFadeOut: 500
            },
            templates: {
                tooltip: (d) => `
                    <div style="text-align: left;">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #333;">
                            ${d.country}
                        </div>
                        <div style="color: #666; margin-bottom: 3px;">
                            Score: ${d.score}
                        </div>
                        <div style="color: #666; font-style: italic;">
                            ${d.comment}
                        </div>
                    </div>
                `
            },
            constants: {
                tooltipOffsetX: 15,
                tooltipOffsetY: 35,
                tooltipFadeOpacity: 1,
                pinTransformOffset: { x: 12, y: 24 }
            },
            worldGeojsonUrl: "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
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
        this.drawWorldMap();
        return this;
    }

    calculateProperties() {
        const state = this.getState();

        // Calculate dimensions
        const chartWidth = state.svgWidth - state.marginLeft - state.marginRight;
        const chartHeight = state.svgHeight - state.marginTop - state.marginBottom;

        // Calculate map properties
        const scale = Math.min(
            chartWidth / state.map.minWidth,
            chartHeight / state.map.minHeight
        ) * state.map.minWidth / 8.5;

        const centerX = chartWidth / 2;
        const centerY = chartHeight / 2;

        // Calculate projection with clipping
        const projection = d3.geoMercator()
            .scale(scale)
            .center(state.map.center)
            .translate([centerX, centerY])
            .clipExtent([[0, 0], [chartWidth, chartHeight]]);

        const path = d3.geoPath()
            .projection(projection);

        this.setState({
            chartWidth,
            chartHeight,
            mapScale: scale,
            centerX,
            centerY,
            projection,
            path,

            filterFeature: (d) => {
                if (d.properties && d.properties.name === "Antarctica") return false;

                const coordinates = d.geometry.coordinates[0];
                if (!coordinates) return true;

                const [_, lat] = projection.invert(path.centroid(d));
                return lat > state.map.bounds.minLat;
            }
        });
    }

    drawWorldMap() {
        const {
            chart,
            data,
            projection,
            path,
            map,
            styles,
            animation,
            templates,
            constants,
            worldGeojsonUrl
        } = this.getState();

        chart.selectAll('*').remove();

        const gradient = chart.append("defs")
            .append("linearGradient")
            .attr("id", styles.gradient.attributes.id)
            .attr("x1", styles.gradient.attributes.x1)
            .attr("y1", styles.gradient.attributes.y1)
            .attr("x2", styles.gradient.attributes.x2)
            .attr("y2", styles.gradient.attributes.y2);

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", styles.gradient.colors.start);

        gradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", styles.gradient.colors.middle);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", styles.gradient.colors.end);

        d3.json(worldGeojsonUrl)
            .then(worldData => {

                chart.append('g')
                    .selectAll('path')
                    .data(worldData.features.filter(this.getState().filterFeature))
                    .enter()
                    .append('path')
                    .attr('class', 'countries')
                    .attr("d", path)
                    .style("fill", "url(#map-gradient)")
                    .style("stroke", styles.countries.stroke)
                    .style("stroke-width", styles.countries.strokeWidth);

                chart.append('g')
                    .selectAll('path')
                    .data(data.locations)
                    .enter()
                    .append('path')
                    .attr('class', 'pin-path')
                    .attr('d', map.pinPath)
                    .attr('transform', d => {
                        const [x, y] = projection(d.coordinates);
                        const { x: offsetX, y: offsetY } = constants.pinTransformOffset;
                        return `translate(${x - offsetX},${y - offsetY}) scale(${styles.pin.scale})`;
                    })
                    .style("fill", styles.pin.fill)
                    .style("stroke", styles.pin.stroke)
                    .style("stroke-width", styles.pin.strokeWidth)
                    .style("opacity", 0)
                    .style("cursor", "pointer");

                const tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)
                    .style("position", "absolute")
                    .style("background-color", styles.tooltip.backgroundColor)
                    .style("border", styles.tooltip.border)
                    .style("border-radius", styles.tooltip.borderRadius)
                    .style("padding", styles.tooltip.padding)
                    .style("pointer-events", "none")
                    .style("font-size", styles.tooltip.fontSize)
                    .style("box-shadow", styles.tooltip.boxShadow)
                    .style("min-width", styles.tooltip.minWidth)
                    .style("z-index", "100");

                const pins = chart.append('g')
                    .selectAll('path')
                    .data(data.locations)
                    .enter()
                    .append('path')
                    .attr('class', 'pin-path')
                    .attr('d', map.pinPath)
                    .attr('transform', d => {
                        const [x, y] = projection(d.coordinates);
                        return `translate(${x - 12},${y - 24}) scale(${styles.pin.scale})`;
                    })
                    .style("fill", styles.pin.fill)
                    .style("stroke", styles.pin.stroke)
                    .style("stroke-width", styles.pin.strokeWidth)
                    .style("opacity", 0)
                    .style("cursor", "pointer")
                    .on("mouseover", function (event, d) {
                        tooltip.transition()
                            .duration(animation.tooltipFadeIn)
                            .style("opacity", constants.tooltipFadeOpacity);
                        tooltip.html(templates.tooltip(d))
                            .style("left", (event.pageX + constants.tooltipOffsetX) + "px")
                            .style("top", (event.pageY - constants.tooltipOffsetY) + "px");
                    })
                    .on("mouseout", function (d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                chart.selectAll('.pin-path')
                    .each(function (d, i) {
                        d3.select(this)
                            .transition()
                            .delay(i * animation.pinDelay)
                            .duration(animation.pinDuration)
                            .style("opacity", 1);
                    });
            })
            .catch(error => {
                console.error('Error loading world data:', error);
            });
    }

    drawSvgAndWrappers() {
        const {
            d3Container,
            svgWidth,
            svgHeight,
            defaultFont,
            marginLeft,
            marginTop
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
                "translate(" + marginLeft + "," + marginTop + ")"
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
        if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

        let self = this;

        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        const handleResize = debounce(() => {
            var containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
            if (containerRect.height > 0) attrs.svgHeight = containerRect.height;

            d3Container.select('svg')
                .attr('width', attrs.svgWidth)
                .attr('height', attrs.svgHeight);

            self.calculateProperties();

            self.drawWorldMap();
        }, 250);

        d3.select(window).on("resize." + attrs.id, handleResize);

        this.setState({ d3Container });
    }

}
