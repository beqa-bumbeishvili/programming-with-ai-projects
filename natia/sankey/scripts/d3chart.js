class SankeyChart {
  constructor() {
    // Defining state attributes
    const attrs = {
      id: "ID" + Math.floor(Math.random() * 1000000),
      svgWidth: 1000,
      svgHeight: 600,
      marginTop: 10,
      marginBottom: 10,
      marginRight: 10,
      marginLeft: 10,
      container: "#sankey-container",
      defaultTextFill: "#2C3E50",
      defaultFont: "Helvetica",
      data: null,
      firstRender: true,
      nodeWidth: 15,
      nodePadding: 8,
      linkStyle: {
        fill: "none",
        stroke: "#666",
        strokeOpacity: 0.5,
        opacity: 0.8,
        hoverStrokeOpacity: 0.8,
        hoverOpacity: 1,
      },
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

  calculateProperties() {
    const {
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      svgWidth,
      svgHeight,
    } = this.getState();

    let calc = {
      id: "ID" + Math.floor(Math.random() * 1000000),
      chartLeftMargin: marginLeft,
      chartTopMargin: marginTop,
      chartWidth: svgWidth - marginRight - marginLeft,
      chartHeight: svgHeight - marginBottom - marginTop,
    };

    this.setState({ calc });
  }

  drawSvgAndWrappers() {
    const { d3Container, svgWidth, svgHeight, defaultFont, calc } =
      this.getState();

    // Draw SVG
    const svg = d3Container
      ._add({
        tag: "svg",
        className: "svg-chart-container",
      })
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("font-family", defaultFont);

    //Add container g element
    let chart = svg
      ._add({
        tag: "g",
        className: "chart",
      })
      .attr(
        "transform",
        "translate(" + calc.chartLeftMargin + "," + calc.chartTopMargin + ")"
      );

    this.setState({ chart, svg });
  }

  drawSankey() {
    const { chart, calc, data, nodeWidth, nodePadding, linkStyle } =
      this.getState();

    if (!data) {
      console.error("No data provided");
      return this;
    }
    // Set up Sankey generator
    const sankey = d3
      .sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .nodeAlign(d3.sankeyLeft)
      .nodeSort((a, b) => {
        if (a.layer === b.layer) {
          if (a.layer === 1) {
            return (a.sortIndex || 0) - (b.sortIndex || 0);
          }
          return b.value - a.value;
        }
        return a.layer - b.layer;
      })
      .extent([
        [1, 1],
        [calc.chartWidth - 1, calc.chartHeight - 5],
      ]);

    // Generate Sankey data
    const { nodes, links } = sankey(data);
    const link = chart
      ._add({
        tag: "path",
        className: "link",
        data: links,
      })
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", (d) => Math.max(1, d.width))
      .attr("class", (d) => {
        const sourceName = d.source.name.replace(/[& ]/g, "");
        const targetName = d.target.name.replace(/[& ]/g, "");
        return `link from-${sourceName} to-${targetName}`;
      })
      .style("fill", linkStyle.fill)
      .style("stroke", linkStyle.stroke)
      .style("stroke-opacity", linkStyle.strokeOpacity)
      .style("opacity", linkStyle.opacity)
      .on("mouseover", function () {
        d3.select(this)
          .style("stroke-opacity", linkStyle.hoverStrokeOpacity)
          .style("opacity", linkStyle.hoverOpacity);
      })
      .on("mouseout", function () {
        d3.select(this)
          .style("stroke-opacity", linkStyle.strokeOpacity)
          .style("opacity", linkStyle.opacity);
      });

    // Draw nodes
    const node = chart
      ._add({
        tag: "rect",
        className: "node",
        data: nodes,
      })
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("class", (d) => `node ${d.name.replace(/[& ]/g, "")}`)
      .on("mouseover", function (event, d) {
        // Fade out all links
        link.style("opacity", 0.1);

        // Highlight connected links
        link
          .filter((l) => l.source === d || l.target === d)
          .style("opacity", 0.8);
      })
      .on("mouseout", function () {
        // Restore all links to original opacity
        link.style("opacity", 0.8);
      });

    // Add node labels
    const label = chart
      ._add({
        tag: "text",
        className: "node-label",
        data: nodes,
      })
      .attr("x", (d) => (d.x0 < calc.chartWidth / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) =>
        d.x0 < calc.chartWidth / 2 ? "start" : "end"
      )
      .text((d) => d.name)
      .style("font-size", "10px")
      .style("fill", "#000");

    // Initialize Tippy tooltips for nodes
    node.each(function (d) {
      tippy(this, {
        content: `${d.name}<br>${(d.value / 100).toFixed(1)}%`,
        allowHTML: true,
        placement: "right",
        arrow: true,
        theme: "custom",
        animation: "scale",
        duration: [200, 0],
        offset: [0, 5],
        popperOptions: {
          strategy: "fixed",
          modifiers: [
            {
              name: "flip",
              options: {
                fallbackPlacements: ["left", "top", "bottom"],
              },
            },
            {
              name: "preventOverflow",
              options: {
                boundary: document.querySelector("#sankey-container"),
                padding: 5,
              },
            },
          ],
        },
      });
    });
  }

  initializeEnterExitUpdatePattern() {
    d3.selection.prototype._add = function (params) {
      let container = this;
      let className = params.className;
      let elementTag = params.tag;
      let data = params.data || [className];
      let exitTransition = params.exitTransition || null;
      let enterTransition = params.enterTransition || null;

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

  setDynamicContainer() {
    const attrs = this.getState();

    let d3Container = d3.select(attrs.container);
    let containerRect = d3Container.node().getBoundingClientRect();
    if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

    let self = this;

    d3.select(window).on("resize." + attrs.id, function () {
      let containerRect = d3Container.node().getBoundingClientRect();
      if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
      self.render();
    });

    this.setState({ d3Container });
  }
}