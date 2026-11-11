// Adapted from the in-class example (inClassExampleOfStaticAddD3VisToPage),
// which was adapted from: https://d3-graph-gallery.com/graph/barplot_basic.html
function addBeadChart(){
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the div with id "bead_viz"
    const svg = d3.select("#bead_viz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv("beads.csv").then( function(data) {

        // Convert counts from text to numbers, then sort from most to least used
        data.forEach(d => d.Count = +d.Count);
        data.sort((a, b) => b.Count - a.Count);

        // X axis
        const x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map(d => d.Color))
            .padding(0.2);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

        // Y axis (domain based on the largest count, instead of a fixed 0-100)
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Count)])
            .nice()
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + margin.top + 20)
            .text("Bead color");

        // Y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left+20)
            .attr("x", -height/2)
            .text("Number of beads");

        // Bars, each filled with its bead color from the CSV
        const bars = svg.selectAll("mybar")
        .data(data)
        .join("rect")
            .attr("x", d => x(d.Color))
            .attr("y", d => y(d.Count))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.Count))
            .attr("fill", d => d.Hex)
            .attr("stroke", "#333")         // outline so white and yellow bars stay visible
            .attr("stroke-width", 1);

        // Tooltip (same SVG-based tooltip as the class example)
        const tooltipContainer = svg
            .append("g")
            .attr('visibility','hidden');

        const tooltipBox = tooltipContainer
            .append('rect')
            .attr('width',140)
            .attr('height',40)
            .attr('fill',"lightgray")
            .attr('opacity',"50%")
            .attr('rx',8);

        const tooltipText = tooltipContainer
            .append('text')
            .attr("x",70)
            .attr('y',25)
            .attr("text-anchor", "middle")
            .text("");

        bars.on("mouseover", (evt, d) => {
            const [mx, my] = d3.pointer(evt);
            const fixedYPos = my - 40;
            tooltipContainer
                .attr("transform", "translate(" + mx + ", " + fixedYPos + ")" )
                .style("visibility","initial");
            tooltipText
                .text(d.Color + ": " + d.Count + " beads");
        })
        .on("mousemove", (evt, d) => {
            const [mx, my] = d3.pointer(evt);
            const fixedYPos = my - 40;
            tooltipContainer
                .attr("transform", "translate(" + mx + ", " + fixedYPos + ")" );
        })
        .on("mouseout", () => {
            tooltipText.text("");
            tooltipContainer.style("visibility","hidden");
        });
    })
}