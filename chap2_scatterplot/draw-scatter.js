async function drawScatter() {
    let dataset = await d3.json("../datasets/covid_daily.json")

    const xAccessor = d => d.positiveIncrease
    const yAccessor = d => d.hospitalizedIncrease

    console.table(dataset[0])
    const width = d3.min([
        window.innerWidth * 0.9,
        window.innerHeight * 0.9
    ])

    let dimensions = {
        width: width,
        height: width,
        margin: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 60
        },
    }

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right

    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform",
            `translate(
                    ${dimensions.margin.left}px,
                    ${dimensions.margin.top}px
        )`)

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice()

    let dots = bounds.selectAll("circle")
        .data(dataset)
        .enter()

    dots.append("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 2)
        .attr("fill", "cornflowerblue")

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        .ticks(4)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)


    const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "black")
        .style("font-size", "1rem")
        .html("Increase in Number of Cases")

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .ticks(4)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
        .attr("x", -dimensions.boundedHeight / 2)
        .attr("y", -dimensions.margin.left + 10)
        .attr("fill", "black")
        .style("font-size", "1rem")
        .text("Change in Number of Hospitalizations")
        .style("transform", "rotate(-90deg")
        .style("text-anchor", "middle")

}

drawScatter()