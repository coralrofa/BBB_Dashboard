function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
      // console.log(sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples; 

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filter_samples = samples_array.filter(sampleObj => sampleObj.id == sample);

    // D3_1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_array = data.metadata;
    var filter_metadata = metadata_array.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var first_sample = filter_samples[0];
    console.log(samples_array);
    console.log(filter_samples);
    console.log(first_sample);

    // D3_2. Create a variable that holds the first sample in the metadata array.
    var first_sample_metadata = filter_metadata[0];
    console.log(first_sample_metadata)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otuids = first_sample.otu_ids.reverse().slice(0, 10);
    // var labels = first_sample.otu_labels.slice(0, 10).reverse();
    // var value = first_sample.sample_values.slice(0, 10).reverse();
    var otuids = first_sample.otu_ids;
    var labels = first_sample.otu_labels;
    var value = first_sample.sample_values;
    console.log(otuids);
    console.log(labels);
    console.log(value);

    // D3_3. Create a variable that holds the washing frequency.
    var wash_f = first_sample_metadata.wfreq;
    console.log(wash_f)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    console.log(yticks)
      // the otuID & `OTU ${otuID}` holds the info in otuids for .map to use it 

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: value.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels, 
    }];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Strains from the Human BellyButton",
      width: 500,
      height: 500,
      };

    // 10. Use Plotly to plot the data with the layout. 
    
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: Bubble charts
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuids,
      y: value,
      text: labels,
      mode: "markers",
      marker: {
        size:value,
        color: otuids, 
        colorscale:'YlGnBu'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis:{tittle: "OTU ID"},
      width: 1000, 
      height: 500,
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
    // Deliverable 3: gauge chart
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wash_f,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 20}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [0, 10], 
          tickwidth: 1, 
          tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "yellowgreen"},
          {range: [8, 10], color: "green"},
        ]}
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 400,
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  
  });
}


 