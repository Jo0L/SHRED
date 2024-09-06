fetch('/manager/api/orders-stats')
    .then(response => response.json())
    .then(data => {
        // ---- PIE CHART ----
        const statusCounts = { Delivered: 0, Processing: 0 };
        data.forEach(order => {
            statusCounts[order.status]++;
        });

        const width = 450, height = 450, margin = 40;
        const radius = Math.min(width, height) / 2 - margin;

        const svg = d3.select("#order-status-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const dataReady = Object.entries(statusCounts);

        const color = d3.scaleOrdinal()
            .domain(dataReady)
            .range(["#c2350a", "#4CAF50"]);

        const pie = d3.pie()
            .value(d => d[1]);

        const dataPie = pie(dataReady);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        svg.selectAll('slices')
            .data(dataPie)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[0]))
            .attr("stroke", "white")            
            .attr('class', 'rectangle')
            .style("stroke-width", "2px");

        svg.selectAll('text')
            .data(dataPie)
            .enter()
            .append('text')
            .text(d => d.data[0] + ": " + d.data[1])
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .style("text-anchor", "middle")
            .style("font-size", 15);

        // ---- BAR CHART ----
        const salesByMonth = {};
        data.forEach(order => {
            const month = new Date(order.date).toLocaleString('en-US', { month: 'long' });
            if (!salesByMonth[month]) {
                salesByMonth[month] = 0;
            }
            salesByMonth[month] += order.price;
        });

        const barWidth = 450, barHeight = 450, barMargin = { top: 20, right: 30, bottom: 60, left: 60 };
        const svgBar = d3.select("#monthly-sales-chart")
            .append("svg")
            .attr("width", barWidth + barMargin.left + barMargin.right)
            .attr("height", barHeight + barMargin.top + barMargin.bottom)
            .append("g")
            .attr("transform", `translate(${barMargin.left}, ${barMargin.top})`);

        const salesData = Object.entries(salesByMonth);

        const x = d3.scaleBand()
            .domain(salesData.map(d => d[0]))
            .range([0, barWidth])
            .padding(0.2);

        svgBar.append("g")
            .attr("transform", `translate(0,${barHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        const y = d3.scaleLinear()
            .domain([0, d3.max(salesData, d => d[1])])
            .range([barHeight, 0]);

        svgBar.append("g")
            .call(d3.axisLeft(y));

        svgBar.selectAll("bars")
            .data(salesData)
            .enter()
            .append("rect")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d[1]))
            .attr("width", x.bandwidth())
            .attr("height", d => barHeight - y(d[1]))
            .attr("fill", "#4CAF50")
            .attr('class', 'rectangle');

        // X Axis Label
        svgBar.append("text")
            .attr("x", barWidth / 2)
            .attr("y", barHeight + barMargin.bottom - 10)
            .style("text-anchor", "middle")
            .text("Month");

        // Y Axis Label
        svgBar.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - barMargin.left)
            .attr("x", 0 - (barHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Sales Amount ($)");
    });
