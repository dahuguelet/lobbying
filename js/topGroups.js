// Setting height and width
  var width = 460;
      height = 500;

  // Setting the outerRadius to be half as tall as
  // the canvas (like a normal bar chart), but 
  // then cutting out 30px to make it slightly 
  // smaller   
  //
  // Setting innerRadius to cut the hole in the 
  // center for the overall stats
  var outerRadius = height / 2 - 30,
      innerRadius = outerRadius / 3 + 10;

  // Using ordinal scale (since I'm using strings)
  // to color the arcs 

  var color = d3.scale.ordinal()
      .domain(["Group", "Representative", "Senator"])
      .range(["#008000", "#99cc99","#99cc99"]);

  // defining the arc radii
  var arc = d3.svg.arc()
        .outerRadius(outerRadius) 
        .innerRadius(innerRadius);
  // defining the larger arc for mouseover
  // englargement
  var bigArc = d3.svg.arc()
        .outerRadius(outerRadius +5 )
        .innerRadius(innerRadius +5 );

  // Setting the layout of the pie chart and directing
  // it to set arc sizes (groups) by percentage 
  // amount of lobbyist gifts received 

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.percent;
      })

  // Defining the canvas on which the svg will be 
  // "painted"

  var svg = d3.select("#vis5").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); 

  // calling data from the .csv
  d3.csv("data/groups.csv", function(error, data) {

  // parsing the $ amount given and percentage of the 
  // same per group as numbers

  data.forEach(function(d) {
    var dollars = d3.format("$,.0f")
    d.amount = dollars(d.amount);
    d.percent = +d.percent;;
  });

  // Format with commas for dollar amounts
  var dollars = d3.format(",.0f")
  // Drawing the group/canvas according to the
  // specifications made above 
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  // Setting locations for tooltip-like data
  // display in the middle of the donut
  var centerText = g.append("text")
    .attr("dx", "0")
    .attr("dy", "-10")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-family", "arial, serif")
    .style("font-size", "16px")

  var centerText2 = g.append("text")
    .attr("dx", "0")
    .attr("dy", "10")
    .style("text-anchor", "middle")
    .style("font-weight", "normal")
    .style("font-family", "arial, serif")
    .style("font-size", "16px")

  var centerText3 = g.append("text")
    .attr("dx", "0")
    .attr("dy", "30")
    .style("text-anchor", "middle")
    .style("font-weight", "normal")
    .style("font-family", "arial, serif")
    .style("font-size", "16px")
    
  // Appending the arcs using colors set by 
  // their categories/the variable color set above
  // 
  // The arcs are animated by the tween function below 

  g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { 
      return color(d.data.category); 
    })
    .transition()
    .duration(1000)
    // Using tween to extend the arcs over the 
    // donut path
    .attrTween("d", function(d) {
      // Telling the interpolate function to start
      // and end at zero degrees to complete the 
      // circle 
      var i = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return function(t) {
          return arc(i(t));
        } 
      }) 
      // Appending overall amounts to the middle 
      // of the chart 
      g.append("text")
        centerText.text("Total gifts")
        centerText2.text("100 percent")
        centerText3.text("$1,813,768.74")

      // Setting event listeners to display 
      // specific segment information
      g.on("mouseover", function(d) {
        d3.select(this).select("path")
            .transition()
            .duration(100)
            // englarges the arcs, appends specific
            // information to the middle
            .attr("d", bigArc);
            centerText.text( d3.select(this).datum().data.category);
            centerText2.text( d3.select(this).datum().data.percent + " percent");
            centerText3.text( d3.select(this).datum().data.amount)
      })
      // Remove segment info, revert to total
      g.on("mouseout", function(d) {
        d3.select(this).select("path")
            .transition()
            .duration(100)
            .attr("d", arc)
            centerText.text("Total gifts")
            centerText2.text("100 percent")
            centerText3.text("$1,813,768.74");
      });
    
  
});
        


  