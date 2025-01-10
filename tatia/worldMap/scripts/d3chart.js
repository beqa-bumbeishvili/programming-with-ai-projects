class Chart {
    constructor() {
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 200,
            marginTop: 5,
            marginBottom: 5,
            marginRight: 5,
            marginLeft: 5,
            container: "body",
            defaultFont: "Helvetica",
            data: null,
            chartWidth: null,
            chartHeight: null,
            worldMap: null,
            tooltipStyles: {
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "5px",
                pointerEvents: "none",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                position: "absolute",
                opacity: 0.8,
                fontSize: "22px",
                maxWidth: "500px"
            },
            countryStyles: {
                stroke: "#fff",
                strokeWidth: 0.5
            },
            pinStyles: {
                size: 30,
                cursor: "pointer",
                opacity: 0,
                initialSize: 0
            },
            gradientColors: {
                start: "#91EAE4",
                end: "#7F7FD5"
            },
            countryOrder: ['Georgia', 'Hungary', 'Austria', 'Italy']
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
        this.resizeTimer = null;
    }

    render() {
        this.setDynamicContainer();
        this.calculateProperties();
        this.drawSvgAndWrappers();
        this.drawWorldMap();

        return this;
    }

    calculateProperties() {
        const { marginLeft, marginTop, marginRight, marginBottom, svgWidth, svgHeight } = this.getState();

        const calc = {
            chartLeftMargin: marginLeft,
            chartTopMargin: marginTop,
        };

        const chartWidth = svgWidth - marginRight - calc.chartLeftMargin;
        const chartHeight = svgHeight - marginBottom - calc.chartTopMargin;

        this.setState({ calc, chartWidth, chartHeight });
    }

    drawWorldMap() {
        const {
            chart,
            chartWidth,
            chartHeight,
            worldMap,
            data,
            gradientColors,
            countryStyles,
            tooltipStyles,
            pinStyles
        } = this.getState();

        const mapLayer = chart._add('g.map-layer');
        const pinsLayer = chart._add('g.pins-layer');

        const filteredFeatures = worldMap.features.filter(d => d.properties.name !== "Antarctica");

        const projection = d3.geoMercator()
            .fitSize([chartWidth, chartHeight], {
                type: "FeatureCollection",
                features: filteredFeatures
            });

        const path = d3.geoPath().projection(projection);

        const gradient = mapLayer._add("defs.gradient-defs")
            ._add("linearGradient.gradient")
            .attr("id", "country-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "0")
            .attr("y1", "0")
            .attr("x2", chartWidth)
            .attr("y2", chartHeight);

        gradient._add("stop.gradient-stop-start")
            .attr("offset", "0%")
            .attr("stop-color", gradientColors.start);

        gradient._add("stop.gradient-stop-end")
            .attr("offset", "100%")
            .attr("stop-color", gradientColors.end);

        mapLayer._add('path.country', filteredFeatures)
            .attr('d', path)
            .attr('fill', 'url(#country-gradient)')
            .attr('stroke', countryStyles.stroke)
            .attr('stroke-width', countryStyles.strokeWidth);

        const tooltip = d3.select("body")
            ._add("div.tooltip")
            .style("background-color", tooltipStyles.backgroundColor)
            .style("padding", tooltipStyles.padding)
            .style("border-radius", tooltipStyles.borderRadius)
            .style("pointer-events", tooltipStyles.pointerEvents)
            .style("box-shadow", tooltipStyles.boxShadow)
            .style("position", tooltipStyles.position)
            .style("opacity", tooltipStyles.opacity)
            .style("font-size", tooltipStyles.fontSize)
            .style("max-width", tooltipStyles.maxWidth
            );

        const newPins = pinsLayer._add("image.pin", data?.locations || [])
            .attr("width", pinStyles.initialSize)
            .attr("height", pinStyles.initialSize)
            .attr("href", "images/pin.svg")
            .style("cursor", pinStyles.cursor)
            .style("opacity", pinStyles.opacity)
            .attr("x", d => {
                const coords = projection([d.longitude, d.latitude]);
                return coords ? coords[0] - pinStyles.size / 2 : 0;
            })
            .attr("y", d => {
                const coords = projection([d.longitude, d.latitude]);
                return coords ? coords[1] - pinStyles.size : 0;
            })
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`<strong>${d.name}</strong><br/>შეფასება: ${d.score}</strong><br/>${d.info}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        newPins
            .transition()
            .delay((d, i) => i * 1000)
            .duration(500)
            .style("opacity", 1)
            .attr("width", pinStyles.size)
            .attr("height", pinStyles.size);
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

        const self = this;
        d3.select(window).on("resize." + attrs.id, function () {
            if (self.resizeTimer) clearTimeout(self.resizeTimer);

            self.resizeTimer = setTimeout(() => {
                requestAnimationFrame(() => {
                    const containerRect = d3Container.node().getBoundingClientRect();
                    if (containerRect.width > 0) {
                        const oldWidth = attrs.svgWidth;
                        attrs.svgWidth = containerRect.width;

                        self.updateDimensions(oldWidth);
                    }
                });
            }, 100);
        });

        this.setState({ d3Container });
    }

    updateDimensions(oldWidth) {
        const attrs = this.getState();
        const { chart, chartWidth, chartHeight, worldMap } = attrs;

        if (!worldMap) return;

        d3.select(attrs.container)
            .select('svg.svg-container')
            .attr("width", attrs.svgWidth);

        const newChartWidth = attrs.svgWidth - attrs.marginRight - attrs.marginLeft;

        const projection = d3.geoMercator()
            .fitSize([newChartWidth, chartHeight], {
                type: "FeatureCollection",
                features: worldMap.features.filter(d => d.properties.name !== "Antarctica")
            });
        const path = d3.geoPath().projection(projection);

        chart.select('.map-layer')
            .selectAll('path.country')
            .attr('d', path);

        chart.select('.pins-layer')
            .selectAll('.pin')
            .attr("x", d => {
                const coords = projection([d.longitude, d.latitude]);
                return coords ? coords[0] - this.getState().pinStyles.size / 2 : 0;
            })
            .attr("y", d => {
                const coords = projection([d.longitude, d.latitude]);
                return coords ? coords[1] - this.getState().pinStyles.size : 0;
            });

        this.setState({ chartWidth: newChartWidth });
    }
}