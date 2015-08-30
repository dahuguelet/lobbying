jQuery(function($){



        // Width and height, plus margins
        // Bottom value is 30 to accomodate x-axis (years)
        // Left value is larger to accomodate $ amounts
      
        var padding = { top: 20, right: 0, bottom: 36, left: 83}
            width = 450 - padding.left - padding.right, 
            height = 406 - padding.top - padding.bottom;

        // Setting x and y scales
        var xScale = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var yScale = d3.scale.linear()
            .range([height, 0]);
            
        // Adding commas to the y-axis labels
        var dollars = d3.format(",.0f")

        // Setting x and y axes 
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10)
            .tickSize(-(width), 0, 0)
            .tickFormat(function(d) { 
                return "$" + dollars(d);
        })
        // Setting the tooltip and its contents
        var tip = d3.tip()
            .attr('class', 'riseTooltip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong><span style='color:#000'>" +d.fullyear + ":</strong> $" + dollars(d.inflation) + " in gifts</span>"; //+ "<br><strong><span style='color:#ff0000'> or </strong><br>" + " </span><span style='color:#000'>$" + dollars(d.inflation / 197) + " per legislator </span>";
        })

        // Creating the svg canvas for the chart 
        var svg = d3.select("#vis4").append("svg")
            .attr("width", width + padding.left + padding.right)
            .attr("height", height + padding.top + padding.bottom)
          .append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

        svg.call(tip);

        // Loading data from .csv file       
        d3.csv("data/more_money.csv", type, function(error, data) {
            // Takes the years from the .csv and adding a 
            // domain to the x scale
            xScale.domain(data.map(function(d) { 
                return d.year; 
            }));
            // Takes the highest annual amount of lobbying
            // and uses it to define the y scale's domain
            yScale.domain([0, d3.max(data, function(d) { 
                return d.inflation; 
            })]);

            // Appending the x axis to the svg canvas
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                // Wraps the text so "Jan.-Sept. 2014" stays 
                // centered underneath its column
              .selectAll(".tick text")
                .call(wrap, xScale.rangeBand());

            // Appending the y axis to the svg canvas
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            // Appending the bars to the svg canvas
            var bar = svg.selectAll(".bar")
                .data(data)
                .enter().append("g")
                .attr("x", function(d) {
                    return xScale(d.year);
                })
                .attr("width", xScale.rangeBand());  

            bar.append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { 
                    return xScale(d.year); 
                })
                .attr("y", function(d) {
                    return height; 
                })
                .attr("height", 0)
                .attr("width", xScale.rangeBand())
                .transition()
                .duration(1000)
                .attr("height", function(d) { 
                    return height - yScale(d.inflation); 
                })
                .attr("y", function(d) { 
                    return yScale(d.inflation);
                })
            
            // Introducing interactivity to 
            // allow tooltip to work
            bar.on("mouseover", tip.show)
            bar.on("mouseout", tip.hide)

            });
        // The text wrapping function
        function wrap(text, width) {
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }
        
        // This parses the dollar amount as a number
        // instead of a string
        function type(d) {
            d.inflation = +d.inflation;
            return d;        
        };
        

        

});