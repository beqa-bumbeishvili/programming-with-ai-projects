class Chart {
  constructor(container) {
    this.state = {
      container: container,
      svgWidth: 800,
      svgHeight: 600,
      projection: null,
      mapGroup: null,
      zoom: null,
      svg: null,
      currentZoom: null,
      tooltip: null,
      styles: {
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
        },
        tooltip: {
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "10px",
          fontSize: "12px",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
        },
        zoomControls: {
          button: {
            width: 40,
            height: 40,
            rx: 5,
            fill: "white",
            stroke: "#666",
            cursor: "pointer",
          },
          text: {
            fontSize: "20px",
            cursor: "pointer",
          },
          position: {
            right: 60,
            top: 20,
            spacing: 50,
          },
        },
      },
    };

    // Create tooltip div with modified width and word-wrap
    d3.select("body")
      .append("div")
      .attr("id", "map-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("padding", "8px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("z-index", "10000")
      .style("max-width", "200px") // Set maximum width
      .style("width", "auto") // Allow flexible width up to max-width
      .style("white-space", "normal") // Allow text wrapping
      .style("word-wrap", "break-word") // Enable word breaking for long words
      .style("line-height", "1.4") // Improve readability
      .style("box-shadow", "0 1px 4px rgba(0,0,0,0.2)"); // Add subtle shadow

    this.initializeMap();
  }

  showTooltip(event, content) {
    d3.select("#map-tooltip")
      .style("visibility", "visible")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 10 + "px")
      .html(content);
  }

  hideTooltip() {
    d3.select("#map-tooltip").style("visibility", "hidden");
  }

  moveTooltip(event) {
    d3.select("#map-tooltip")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 10 + "px");
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  getState() {
    return this.state;
  }

  initializeMap() {
    const svg = d3.select("#my_dataviz");
    svg.selectAll("*").remove();

    // Set viewBox for better scaling
    svg
      .attr("viewBox", `0 0 ${this.state.svgWidth} ${this.state.svgHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("max-width", "100%")
      .style("height", "100vh")
      .style("display", "block")
      .style("margin", "auto");

    const mapGroup = svg.append("g");

    // Adjust scale and shift map up
    const scale = Math.min(this.state.svgWidth, this.state.svgHeight) / 3.3;
    const projection = d3
      .geoNaturalEarth1()
      .scale(scale)
      .center([10, 0])
      .translate([this.state.svgWidth / 2, this.state.svgHeight / 2 - 50]);

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform);
      });

    // Initial transform
    const initialTransform = d3.zoomIdentity
      .translate(this.state.svgWidth / 2, this.state.svgHeight / 2)
      .scale(1)
      .translate(-this.state.svgWidth / 2, -this.state.svgHeight / 2);

    svg.call(zoom).call(zoom.transform, initialTransform);

    this.setState({
      svg,
      mapGroup,
      projection,
      zoom,
    });

    // Load and draw the map
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    ).then((data) => this.drawMap(data));
  }

  drawMap(data) {
    const { mapGroup, projection, styles } = this.getState();
    const path = d3.geoPath().projection(projection);
    const self = this; // Store reference to this

    // Draw base map
    mapGroup
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", styles.countryDefault.fill)
      .attr("stroke", styles.countryDefault.stroke)
      .attr("stroke-width", styles.countryDefault.strokeWidth);

    // Load visited countries
    d3.json("data/visitedCountries.json").then((visitedCountries) => {
      const visitedCountryNames = new Set(visitedCountries.map((c) => c.name));

      // Update colors and add interactions
      mapGroup
        .selectAll("path")
        .attr("fill", (d) =>
          visitedCountryNames.has(d.properties.name)
            ? styles.countryVisited.fill
            : styles.countryDefault.fill
        )
        .attr("opacity", (d) =>
          visitedCountryNames.has(d.properties.name)
            ? styles.countryVisited.opacity
            : styles.countryDefault.opacity
        )
        .on("mouseover", function (event, d) {
          // Use function to preserve this context
          const countryName = d.properties.name;
          if (visitedCountryNames.has(countryName)) {
            const countryData = visitedCountries.find(
              (c) => c.name === countryName
            );
            if (countryData) {
              d3.select(this)
                .attr("fill", styles.countryVisited.hoverFill)
                .attr("stroke-width", styles.countryVisited.hoverStrokeWidth);

              const tooltipContent = `
                <div style="font-weight: bold; margin-bottom: 4px; color: #333;">${countryName}</div>
                <div style="margin-bottom: 4px;">Score: ${countryData.score}</div>
                <div style="font-size: 11px; color: #666;">${countryData.comments}</div>
              `;

              self.showTooltip(event, tooltipContent);
            }
          }
        })
        .on("mousemove", function (event, d) {
          // Use function to preserve this context
          const countryName = d.properties.name;
          if (visitedCountryNames.has(countryName)) {
            self.moveTooltip(event);
          }
        })
        .on("mouseout", function (event, d) {
          // Use function to preserve this context
          const countryName = d.properties.name;
          if (visitedCountryNames.has(countryName)) {
            d3.select(this)
              .attr("fill", styles.countryVisited.fill)
              .attr("stroke-width", styles.countryVisited.strokeWidth);
            self.hideTooltip();
          }
        });

      // Add pins
      self.addPins(visitedCountries);
    });

    // Add zoom controls with updated positioning
    const zoomControls = this.getState()
      .svg.append("g")
      .attr("class", "zoom-controls")
      .attr("transform", `translate(${this.state.svgWidth - 50}, 20)`);

    // Zoom in button
    const zoomIn = zoomControls
      .append("g")
      .style("cursor", "pointer")
      .on("click", () => {
        this.getState()
          .svg.transition()
          .duration(750)
          .call(this.getState().zoom.scaleBy, 2);
      });

    zoomIn
      .append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("rx", 5)
      .attr("fill", "white")
      .attr("stroke", "#666");

    zoomIn
      .append("text")
      .attr("x", 15)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("+");

    // Zoom out button
    const zoomOut = zoomControls
      .append("g")
      .attr("transform", "translate(0, 40)")
      .style("cursor", "pointer")
      .on("click", () => {
        this.getState()
          .svg.transition()
          .duration(750)
          .call(this.getState().zoom.scaleBy, 0.5);
      });

    zoomOut
      .append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("rx", 5)
      .attr("fill", "white")
      .attr("stroke", "#666");

    zoomOut
      .append("text")
      .attr("x", 15)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("−");
  }

  addPins(visitedCountries) {
    const { projection, mapGroup, styles } = this.getState();
    if (!projection || !mapGroup) return;

    // Load GeoJSON for country centroids
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    ).then((geoData) => {
      const path = d3.geoPath().projection(projection);

      const pins = visitedCountries
        .map((country, index) => {
          // Special handling for specific countries
          if (country.name === "France") {
            const coords = projection([2.2137, 46.2276]);
            if (!coords) return null;
            return this.createPin(coords, country);
          }

          if (country.name === "Bali") {
            const coords = projection([115.1889, -8.4095]);
            if (!coords) return null;
            return this.createPin(coords, country);
          }

          if (country.name === "Nepal") {
            const coords = projection([84.124, 28.3949]);
            if (!coords) return null;
            return this.createPin(coords, country);
          }

          // For other countries, use the centroid method
          const countryFeature = geoData.features.find(
            (f) =>
              f.properties.name === country.name ||
              f.properties.name.includes(country.name)
          );

          if (!countryFeature) {
            console.warn(`Country not found in GeoJSON: ${country.name}`);
            return null;
          }

          const coords = path.centroid(countryFeature);
          if (!coords || coords.some(isNaN)) {
            console.warn(`Invalid centroid for ${country.name}`);
            return null;
          }

          return this.createPin(coords, country);
        })
        .filter(Boolean);

      // Animate pins sequentially
      pins.forEach(({ pin, coords }, index) => {
        pin
          .transition()
          .delay(index * 200)
          .duration(500)
          .style("opacity", 1)
          .attr("transform", `translate(${coords[0]}, ${coords[1]}) scale(1)`);
      });
    });
  }

  createPin(coords, country) {
    const { mapGroup, styles } = this.getState();
    const self = this;

    const pin = mapGroup
      .append("g")
      .attr("class", `pin ${country.name.replace(/\s+/g, "-")}`)
      .attr("transform", `translate(${coords[0]}, ${coords[1]}) scale(0)`)
      .style("cursor", "pointer")
      .style("opacity", 0);

    pin
      .append("path")
      .attr("d", styles.pin.path)
      .attr("fill", styles.pin.fill)
      .attr("stroke", styles.pin.stroke)
      .attr("stroke-width", styles.pin.strokeWidth)
      .attr("transform", `scale(${styles.pin.scale})`);

    pin
      .on("mouseover", function (event) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr(
            "transform",
            `translate(${coords[0]}, ${coords[1]}) scale(1.2)`
          );
        self.showTooltip(
          event,
          `<strong>${country.name}</strong><br>Score: ${country.score}<br>Comments: ${country.comments}`
        );
      })
      .on("mouseout", function (event) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", `translate(${coords[0]}, ${coords[1]}) scale(1)`);
        self.hideTooltip();
      })
      .on("mousemove", function (event) {
        self.moveTooltip(event);
      });

    return { pin, coords };
  }
}

// Initialize the chart
const chart = new Chart();
