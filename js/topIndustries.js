jQuery(function($){        

        // Width and height, plus margins
        // Left value is larger to accomodate $ amounts
        var padding = { top: 20, right: 40, bottom: 30, left: 220}
            width = 900 - padding.left - padding.right, 
            height = 400 - padding.top - padding.bottom;

        // Setting x and y scales
        
        // Linear for numbers, or dollars 
        var xScale = d3.scale.linear()
            .range([0, width]);

        // Ordinal for categories, or industries 
        var yScale = d3.scale.ordinal()
            .rangeRoundBands([0, height], .1);
            
        // Adding commas to the y-axis labels and
        // tooltip numbers
        var dollars = d3.format(",.0f");

        // Setting x and y axes 
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(10)
            .tickSize(-(height), 0, 0)
            .tickFormat(function(d) { 
                return "$" + dollars(d);
            });
        
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickSize(0);

        // Setting the tooltip and its contents
        var tip = d3.tip()
            .attr('class', 'industryTooltip')
            .offset([-10, 0])
            .html(function(d) {
                return "<span style='text-indent: 30px'>" 
                +"<strong>Industry: </strong>" +d.industry + 
                "<br><strong>Amount given: </strong>$" + 
                dollars(d.amount) + "<br><strong>Top organization: </strong>" + 
                d.top_org + ", $" + dollars(d.top_amount);
        })
        // Creating the svg canvas for the chart 
        var svg = d3.select("#vis3").append("svg")
            .attr("width", width + padding.left + padding.right)
            .attr("height", height + padding.top + padding.bottom)
            .append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

        svg.call(tip);
    
        // Loading data from .csv file       
        d3.csv("data/industries.csv", type, function(error, data) {
            
            // Takes the  from the .csv and adding a 
            // domain to the y scale
            yScale.domain(data.map(function(d) { 
                return d.industry; 
            }));
            // Takes the highest annual amount of lobbying
            // and uses it to define the x scale's domain
            xScale.domain([0, d3.max(data, function(d) { 
                return d.amount; 
            })]);

            // Appending the x axis to the svg canvas
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            // Appending the y axis to the svg canvas
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .selectAll("text")  
                .attr("transform", "translate(-5,0)");
            // Selecting the svg canvas and 
            // naming a variable to represent
            // the bars
            var bar = svg.selectAll(".bar")
                .data(data)
              .enter().append("g")
                .attr("y", function(d) { 
                    return yScale(d.industry); 
                })
                .attr("height", yScale.rangeBand());

            // Drawing the bars on the canvas
            bar.append("rect")
                .attr("class", "bar")
                .attr("y", function(d) { 
                    return yScale(d.industry); 
                })
                .attr("height", yScale.rangeBand())
                .attr("x", function(d) {
                    return 0;
                })
                .attr("width", function(d) {
                    return xScale(0);
                })
                .transition()
                    .duration(1500)
                    .attr("width", function (d) {
                    return xScale(d.amount);
                })
        //Enabling tooltip
                bar.on("mouseover", tip.show)
                bar.on("mouseout", tip.hide)

            });
        
        // This parses the dollar amount as a number
        // instead of a string
        function type(d) {
            d.amount = +d.amount;
            return d;        
        };
        
});
