class WorldMap {
  constructor() {
    const attrs = {
      id: "ID" + Math.floor(Math.random() * 1000000),
      svgWidth: 800,
      svgHeight: 600,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 5,
      marginLeft: 5,
      container: "#map-container",
      projection: null,
      mapGroup: null,
      zoom: null,
      svg: null,
      geoData: null,
      visitedCountries: null,
      styles: {
        tooltip: {
          position: "absolute",
          visibility: "hidden",
          backgroundColor: "white",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          pointerEvents: "none",
          fontSize: "12px",
          zIndex: "10000",
          maxWidth: "200px",
          width: "auto",
          whiteSpace: "normal",
          wordWrap: "break-word",
          lineHeight: "1.4",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          offsetX: 10,
          offsetY: -10,
          content: {
            titleColor: "#333",
            titleMargin: "4px",
            scoreMargin: "4px",
            commentColor: "#666",
            commentSize: "11px",
          },
        },
        map: {
          scale: 3.3,
          centerX: 10,
          centerY: 0,
          verticalOffset: -50,
        },
        countryDefault: {
          fill: "#69b3a2",
          stroke: "#fff",
          strokeWidth: 0.5,
          opacity: 0.7,
        },
        countryVisited: {
          fill: "#4CAF50",
          stroke: "#fff",
          strokeWidth: 0.5,
          opacity: 1,
          hoverFill: "#2E7D32",
          hoverStrokeWidth: 1.5,
        },
        pin: {
          fill: "red",
          stroke: "#fff",
          strokeWidth: 0.5,
          scale: 0.35,
          path: "M0 0c-3.9 0-7 3.1-7 7 0 5.3 7 13.2 7 13.2s7-7.9 7-13.2c0-3.9-3.1-7-7-7zm0 9.9c-1.6 0-2.9-1.3-2.9-2.9s1.3-2.9 2.9-2.9 2.9 1.3 2.9 2.9-1.3 2.9-2.9 2.9z",
          hoverScale: 1.2,
          normalScale: 1,
          transitionDuration: 200,
          cursor: "pointer",
          initialOpacity: 0,
          finalOpacity: 1,
        },
        zoomControls: {
          button: {
            width: 30,
            height: 30,
            rx: 5,
            fill: "white",
            stroke: "#666",
            cursor: "pointer",
          },
          text: {
            fontSize: "16px",
            textAnchor: "middle",
          },
          position: {
            right: 50,
            top: 20,
            spacing: 40,
          },
          transition: {
            duration: 750,
          },
          scale: {
            min: 0.5,
            max: 8,
            zoomIn: 2,
            zoomOut: 0.5,
          },
        },
        specialLocations: {
          France: [2.2137, 46.2276],
          Bali: [115.1889, -8.4095],
          Nepal: [84.124, 28.3949],
        },
        svg: {
          maxWidth: "100%",
          height: "100vh",
          display: "block",
          margin: "auto",
          background: "#f0f0f0",
        },
      },
    };

    this.getState = () => attrs;
    this.setState = (d) => Object.assign(attrs, d);

    this.initializeEnterExitUpdatePattern();

    Object.keys(attrs).forEach((key) => {
      this[key] = function (_) {
        if (!arguments.length) return attrs[key];
        attrs[key] = _;
        return this;
      };
    });

    this.initializeTooltip();
  }

  initializeTooltip() {
    const { styles } = this.getState();

    d3.select("body")
      ._add({
        tag: "div",
        className: "map-tooltip",
      })
      .attr("id", "map-tooltip")
      .style("position", styles.tooltip.position)
      .style("visibility", styles.tooltip.visibility)
      .style("background-color", styles.tooltip.backgroundColor)
      .style("padding", styles.tooltip.padding)
      .style("border", styles.tooltip.border)
      .style("border-radius", styles.tooltip.borderRadius)
      .style("pointer-events", styles.tooltip.pointerEvents)
      .style("font-size", styles.tooltip.fontSize)
      .style("z-index", styles.tooltip.zIndex)
      .style("max-width", styles.tooltip.maxWidth)
      .style("width", styles.tooltip.width)
      .style("white-space", styles.tooltip.whiteSpace)
      .style("word-wrap", styles.tooltip.wordWrap)
      .style("line-height", styles.tooltip.lineHeight)
      .style("box-shadow", styles.tooltip.boxShadow);
  }

  setDynamicContainer() {
    const attrs = this.getState();
    const { styles } = attrs;

    const svg = d3
      .select(attrs.container)
      ._add({
        tag: "svg",
        className: "world-map-svg",
      })
      .attr("width", attrs.svgWidth)
      .attr("height", attrs.svgHeight)
      .attr("viewBox", `0 0 ${attrs.svgWidth} ${attrs.svgHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("max-width", styles.svg.maxWidth)
      .style("height", styles.svg.height)
      .style("display", styles.svg.display)
      .style("margin", styles.svg.margin)
      .style("background", styles.svg.background);

    this.setState({ svg });
  }

  render() {
    this.setDynamicContainer();
    this.calculateProperties();
    this.drawSvgAndWrappers();
    this.drawMap();
    return this;
  }

  calculateProperties() {
    const attrs = this.getState();
    const { styles } = attrs;
    const scale = Math.min(attrs.svgWidth, attrs.svgHeight) / styles.map.scale;

    const projection = d3
      .geoNaturalEarth1()
      .scale(scale)
      .center([styles.map.centerX, styles.map.centerY])
      .translate([
        attrs.svgWidth / 2,
        attrs.svgHeight / 2 + styles.map.verticalOffset,
      ]);

    this.setState({ projection });
  }

  drawSvgAndWrappers() {
    const attrs = this.getState();
    const { styles } = attrs;
    const mapGroup = attrs.svg._add({
      tag: "g",
      className: "map-group",
    });

    const zoom = d3
      .zoom()
      .scaleExtent([
        styles.zoomControls.scale.min,
        styles.zoomControls.scale.max,
      ])
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform);
      });

    const initialTransform = d3.zoomIdentity
      .translate(attrs.svgWidth / 2, attrs.svgHeight / 2)
      .scale(1)
      .translate(-attrs.svgWidth / 2, -attrs.svgHeight / 2);

    attrs.svg.call(zoom).call(zoom.transform, initialTransform);

    this.setState({ mapGroup, zoom });
  }

  async drawMap() {
    const attrs = this.getState();
    const { styles } = attrs;
    const path = d3.geoPath().projection(attrs.projection);

    try {
      const [geoData, visitedCountries] = await Promise.all([
        d3.json(
          "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        ),
        d3.json("data/data.json"),
      ]);

      this.setState({ geoData, visitedCountries });

      // Draw countries
      const countries = attrs.mapGroup
        ._add({
          tag: "path",
          className: "country",
          data: geoData.features,
        })
        .attr("d", path)
        .attr("fill", (d) => {
          const isVisited = visitedCountries.some(
            (c) => c.name === d.properties.name
          );
          return isVisited
            ? styles.countryVisited.fill
            : styles.countryDefault.fill;
        })
        .attr("stroke", styles.countryDefault.stroke)
        .attr("stroke-width", styles.countryDefault.strokeWidth);

      // Add country interactions
      this.addCountryInteractions(countries);

      // Add pins for visited countries
      visitedCountries.forEach((country, index) => {
        const coords = this.getCountryCoordinates(country, geoData, path);
        if (coords) {
          this.createPin(coords, country, index);
        }
      });

      console.log("Adding zoom controls..."); // Debug log
      this.addZoomControls();
      console.log("Zoom controls added"); // Debug log
    } catch (error) {
      console.error("Error in drawMap:", error);
    }
  }

  addCountryInteractions(countries) {
    const { styles } = this.getState();
    const self = this;

    countries
      .on("mouseover", function (event, d) {
        const countryData = self
          .getState()
          .visitedCountries.find((c) => c.name === d.properties.name);

        if (countryData) {
          d3.select(this)
            .attr("fill", styles.countryVisited.hoverFill)
            .attr("stroke-width", styles.countryVisited.hoverStrokeWidth);

          const tooltipContent = `
                        <div style="font-weight: bold; margin-bottom: ${styles.tooltip.content.titleMargin}; color: ${styles.tooltip.content.titleColor}">
                            ${countryData.name}
                        </div>
                        <div style="margin-bottom: ${styles.tooltip.content.scoreMargin}">
                            Score: ${countryData.score}
                        </div>
                        <div style="font-size: ${styles.tooltip.content.commentSize}; color: ${styles.tooltip.content.commentColor}">
                            ${countryData.comments}
                        </div>
                    `;
          self.showTooltip(event, tooltipContent);
        }
      })
      .on("mousemove", function (event, d) {
        if (
          self
            .getState()
            .visitedCountries.find((c) => c.name === d.properties.name)
        ) {
          self.moveTooltip(event);
        }
      })
      .on("mouseout", function (event, d) {
        if (
          self
            .getState()
            .visitedCountries.find((c) => c.name === d.properties.name)
        ) {
          d3.select(this)
            .attr("fill", styles.countryVisited.fill)
            .attr("stroke-width", styles.countryVisited.strokeWidth);
          self.hideTooltip();
        }
      });
  }

  getCountryCoordinates(country, geoData, path) {
    const { styles, projection } = this.getState();

    // Check for special locations first
    if (styles.specialLocations[country.name]) {
      return projection(styles.specialLocations[country.name]);
    }

    // Otherwise use centroid
    const countryFeature = geoData.features.find(
      (f) =>
        f.properties.name === country.name ||
        f.properties.name.includes(country.name)
    );

    return countryFeature ? path.centroid(countryFeature) : null;
  }

  createPin(coords, country, index) {
    const { styles } = this.getState();
    const self = this;

    const pin = this.getState()
      .mapGroup._add({
        tag: "g",
        className: `pin ${country.name.replace(/\s+/g, "-")}`,
        data: [country],
      })
      .attr("transform", `translate(${coords[0]}, ${coords[1]}) scale(0)`)
      .style("cursor", styles.pin.cursor)
      .style("opacity", styles.pin.initialOpacity);

    pin
      ._add({
        tag: "path",
        className: "pin-path",
      })
      .attr("d", styles.pin.path)
      .attr("fill", styles.pin.fill)
      .attr("stroke", styles.pin.stroke)
      .attr("stroke-width", styles.pin.strokeWidth)
      .attr("transform", `scale(${styles.pin.scale})`);

    this.addPinInteractions(pin, coords, country);

    // Animate pin appearance
    pin
      .transition()
      .delay(index * styles.pin.transitionDuration)
      .duration(styles.pin.transitionDuration * 2.5)
      .style("opacity", styles.pin.finalOpacity)
      .attr(
        "transform",
        `translate(${coords[0]}, ${coords[1]}) scale(${styles.pin.normalScale})`
      );
  }

  addPinInteractions(pin, coords, country) {
    const { styles } = this.getState();
    const self = this;

    pin
      .on("mouseover", function (event) {
        d3.select(this)
          .transition()
          .duration(styles.pin.transitionDuration)
          .attr(
            "transform",
            `translate(${coords[0]}, ${coords[1]}) scale(${styles.pin.hoverScale})`
          );

        const tooltipContent = `
                    <div style="font-weight: bold; margin-bottom: ${styles.tooltip.content.titleMargin}; color: ${styles.tooltip.content.titleColor}">
                        ${country.name}
                    </div>
                    <div style="margin-bottom: ${styles.tooltip.content.scoreMargin}">
                        Score: ${country.score}
                    </div>
                    <div style="font-size: ${styles.tooltip.content.commentSize}; color: ${styles.tooltip.content.commentColor}">
                        ${country.comments}
                    </div>
                `;
        self.showTooltip(event, tooltipContent);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(styles.pin.transitionDuration)
          .attr(
            "transform",
            `translate(${coords[0]}, ${coords[1]}) scale(${styles.pin.normalScale})`
          );
        self.hideTooltip();
      })
      .on("mousemove", self.moveTooltip.bind(self));
  }

  addZoomControls() {
    const attrs = this.getState();
    const { styles } = attrs;

    console.log("SVG exists:", !!attrs.svg); // Debug log
    console.log("Styles exists:", !!styles); // Debug log

    const zoomControls = attrs.svg._add({
      tag: "g",
      className: "zoom-controls",
      data: ["zoom-controls"],
    });

    console.log("Zoom controls created:", !!zoomControls); // Debug log

    // Position the controls
    zoomControls.attr("transform", `translate(${attrs.svgWidth - 50}, 20)`);

    // Add zoom in button
    this.createZoomButton(zoomControls, "+", 0, 2);
    // Add zoom out button
    this.createZoomButton(zoomControls, "-", 40, 0.5);
  }

  createZoomButton(container, text, yOffset, scaleFactor) {
    const attrs = this.getState();
    const { styles } = attrs;

    // Use 'in' and 'out' instead of '+' and '−'
    const buttonClass = text === "+" ? "zoom-button-in" : "zoom-button-out";

    const button = container
      ._add({
        tag: "g",
        className: buttonClass,
        data: [text],
      })
      .attr("transform", `translate(0, ${yOffset})`)
      .style("cursor", styles.zoomControls.button.cursor)
      .on("click", () => {
        attrs.svg
          .transition()
          .duration(styles.zoomControls.transition.duration)
          .call(attrs.zoom.scaleBy, scaleFactor);
      });

    // Add button background with valid class name
    button
      ._add({
        tag: "rect",
        className: `${buttonClass}-bg`,
        data: [text],
      })
      .attr("width", styles.zoomControls.button.width)
      .attr("height", styles.zoomControls.button.height)
      .attr("rx", styles.zoomControls.button.rx)
      .attr("fill", styles.zoomControls.button.fill)
      .attr("stroke", styles.zoomControls.button.stroke);

    // Add button text with valid class name
    button
      ._add({
        tag: "text",
        className: `${buttonClass}-text`,
        data: [text],
      })
      .attr("x", styles.zoomControls.button.width / 2)
      .attr("y", (styles.zoomControls.button.height * 2) / 3)
      .attr("text-anchor", styles.zoomControls.text.textAnchor)
      .style("font-size", styles.zoomControls.text.fontSize)
      .text(text);
  }

  showTooltip(event, content) {
    const { styles } = this.getState();
    d3.select("#map-tooltip")
      .style("visibility", "visible")
      .style("left", `${event.pageX + styles.tooltip.offsetX}px`)
      .style("top", `${event.pageY + styles.tooltip.offsetY}px`)
      .html(content);
  }

  hideTooltip() {
    d3.select("#map-tooltip").style("visibility", "hidden");
  }

  moveTooltip(event) {
    const { styles } = this.getState();
    d3.select("#map-tooltip")
      .style("left", `${event.pageX + styles.tooltip.offsetX}px`)
      .style("top", `${event.pageY + styles.tooltip.offsetY}px`);
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
      let selection = container
        .selectAll("." + className)
        .data(data, (d, i) => {
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
}
