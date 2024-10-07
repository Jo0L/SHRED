fetch('/manager/api/orders-stats')
  .then(response => response.json())
  .then(data => {
        // ---- PIE CHART ----
        const dataReady = data["statusCount"].map(a => Object.values(a));

        const width = 320, height = 320, margin = 20;
        const radius = Math.min(width, height) / 2 - margin;

        const svg = d3.select("#order-status-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);


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

        const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#f9f9f9")
        .style("border", "1px solid #d3d3d3")
        .style("border-radius", "4px")
        .style("padding", "8px")
        .style("color", "#333")
        .style("font-size", "12px")
        .style("box-shadow", "0px 0px 10px rgba(0, 0, 0, 0.1)");

        
        // ---- BAR CHART ---- Monthly Sales
        const salesData = data["mounthSale"].map(a => Object.values(a));

        const barWidth = 250, barHeight = 250, barMargin = { top: 20, right: 30, bottom: 80, left: 60 };
        const svgBar = d3.select("#monthly-sales-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${barWidth + barMargin.left + barMargin.right} ${barHeight + barMargin.top + barMargin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${barMargin.left}, ${barMargin.top})`);

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

        if (salesData.length > 0) {
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
        } else {
        console.warn("No data found for monthly sales chart");
        }

        svgBar.selectAll("rect")
        .on("mouseover", function(event, d) {
            tooltip.html(`Month: ${d[0]}<br>Sales: $${d[1].toFixed(2)}`)
            .style("visibility", "visible");
        })
        .on("mousemove", function(event) {
            tooltip.style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });

        // X Label
        svgBar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", barHeight + barMargin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Month");

        // Y Label
        svgBar.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - barMargin.left)
        .attr("x", 0 - (barHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Sales Amount ($)");


        // ---- LINE CHART ---- Orders over time
        const orderTrendsData = data["dailyOrder"].map(a => Object.values(a));
   
        const trendWidth = 250, trendHeight = 250, trendMargin = { top: 20, right: 30, bottom: 80, left: 60 };
        const svgTrend = d3.select("#accessory-sales-chart")  // Using same chart container
          .append("svg")
          .attr("viewBox", `0 0 ${trendWidth + trendMargin.left + trendMargin.right} ${trendHeight + trendMargin.top + trendMargin.bottom}`)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
          .attr("transform", `translate(${trendMargin.left}, ${trendMargin.top})`);
    
        const xTrend = d3.scalePoint()
          .domain(orderTrendsData.map(d => d[0]))
          .range([0, trendWidth]);
    
        const yTrend = d3.scaleLinear()
          .domain([0, d3.max(orderTrendsData, d => d[1])])
          .range([trendHeight, 0]);
    
        svgTrend.append("g")
          .attr("transform", `translate(0,${trendHeight})`)
          .call(d3.axisBottom(xTrend))
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
    
        svgTrend.append("g")
          .call(d3.axisLeft(yTrend));
    
        const line = d3.line()
          .x(d => xTrend(d[0]))
          .y(d => yTrend(d[1]));
    
        svgTrend.append("path")
          .datum(orderTrendsData)
          .attr("fill", "none")
          .attr("stroke", "#FF9800")
          .attr("stroke-width", 1.5)
          .attr("d", line);
    
        const tooltip2 = d3.select("body").append("div")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background", "#f9f9f9")
          .style("border", "1px solid #ccc")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("box-shadow", "2px 2px 12px rgba(0,0,0,0.1)");
    
        svgTrend.selectAll("dots")
          .data(orderTrendsData)
          .enter()
          .append("circle")
          .attr("cx", d => xTrend(d[0]))
          .attr("cy", d => yTrend(d[1]))
          .attr("r", 4)
          .attr("fill", "#FF9800")
          .on("mouseover", (event, d) => {
            tooltip2.html(`Month: ${d[0]}<br>Orders: ${d[1]}`)
              .style("visibility", "visible");
          })
          .on("mousemove", event => {
            tooltip2
              .style("top", `${event.pageY - 28}px`)
              .style("left", `${event.pageX + 5}px`);
          })
          .on("mouseout", () => {
            tooltip2.style("visibility", "hidden");
          });
    
        // X Label
        svgTrend.append("text")
          .attr("x", trendWidth / 2)
          .attr("y", trendHeight + trendMargin.bottom - 10)
          .style("text-anchor", "middle")
          .text("Month");
    
        // Y Label
        svgTrend.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - trendMargin.left)
          .attr("x", 0 - (trendHeight / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Number of Orders");
      });