function createChart() {
    const data = [10, 10, 15, 20, 30, 2, 5, 8];
    const labels = [
        'Leisure', 'Loan', 'Transportation', 'Food',
        'Rent', 'Utilities', 'Education', 'Healthcare'
    ];

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = Math.min(viewportWidth * 0.9, 1000);
    const height = Math.min(viewportHeight * 0.9, 1000);
    const radius = Math.min(width, height) / 2;

    d3.select('body svg').remove();

    const colorScale = d3.scaleOrdinal([
        '#FB9A98', '#31A02D', '#B2DF8A', '#2078B4',
        '#A6CEE3', '#FF7F00', '#FDBF6E', '#E21A1B'
    ]);

    const svg = d3.select('body')
        .append('svg')
        .attr('width', viewportWidth)
        .attr('height', viewportHeight)
        .append('g')
        .attr('transform', `translate(${viewportWidth / 2}, ${viewportHeight / 2})`);

    svg.append('text')
        .attr('x', 0)
        .attr('y', -height / 2 + 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '26px')
        .style('font-weight', 'bold')
        .style('font-family', 'Arial, sans-serif')
        .text('Average Household Expenses');

    const g = svg.append('g');

    const pie = d3.pie()
        .value(d => d)
        .sort(null);

    const arc = d3.arc()
        .outerRadius(radius * 0.75)
        .innerRadius(0);

    const percentageArc = d3.arc()
        .outerRadius(radius * 0.43)
        .innerRadius(radius * 0.43);

        // TODO Lali - ფუნქციები ბოლოში გაიტანე კოდის
    const getLabelPosition = (index, pos) => {
        const customRadiusMultipliers = {
            0: 0.82,
            1: 0.84,
            2: 0.93,
            3: 0.82,
            4: 0.84,
            5: 0.86,
            6: 0.86,
            7: 0.82
        };

        const angle = (pos.startAngle + pos.endAngle) / 2;
        const r = radius * customRadiusMultipliers[index];
        return {
            x: Math.sin(angle) * r,
            y: -Math.cos(angle) * r
        };
    };

    const arcs = g.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .style('fill', (d, i) => colorScale(i))
        .style('stroke', '#11141C')
        .style('stroke-width', 1.5);

    arcs.append('text')
        .attr('transform', (d, i) => {
            const pos = getLabelPosition(i, d);
            return `translate(${pos.x},${pos.y})`;
        })
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('fill', '#525252')
        .style('font-size', '18px')
        .style('font-family', 'Arial, sans-serif')
        .text((d, i) => labels[i]);

    arcs.append('text')
        .attr('transform', d => `translate(${percentageArc.centroid(d)})`)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('fill', '#525252')
        .style('font-size', '15px')
        .style('font-family', 'Arial, sans-serif')
        .text(d => `${d.value.toFixed(1)}%`);
}

createChart();

window.addEventListener('resize', createChart);