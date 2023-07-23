
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// So I made a function named it IDname so to use to grab all the ID names from json data file
// with d3 i selected the ID for the drop downj menu 
//then we use for loop to iteratte over the list of IDs and append those list to the drop down menu to display

function displayID(){
  d3.json(url).then(function(data) {
    // console.log(data); 
    var IDname = data.names;
    console.log(IDname); 
    var display = d3.select("#selDataset");
    for(let i = 0; i < IDname.length; i++){
      display.append("option")
      .text(IDname[i])
      .property("value",IDname[i]);
    }
    var firstsamples = IDname[0];
    charts(firstsamples);
    metadata(firstsamples);
  });
}

displayID()

//Call a function when a user changes the selected option of a <select> element:
// we need do a onchange event
function optionChanged(firstsamples) {
  // Fetch new data each time a new sample is selected
  metadata(firstsamples);
  charts(firstsamples);
  
}

// Demographics Panel 
function metadata(sampleid) {
  d3.json(url).then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleid);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    //  need to use d3 to append new to h6 HTML heading tag
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// moving on to making the bubble chart and bar chart
function charts(sampleid){
  d3.json(url).then(function(data){

    var samples = data.samples;
    var resultarray = samples.filter(object=>object.id==sampleid);
    var result= resultarray[0];
    var otu_ids = result.otu_ids;
    var sample_values = result.sample_values;
    var otu_labels = result.otu_labels;

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };

    var bubbledata = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"

        }

      }
    ];
    
    Plotly.newPlot("bubble",bubbledata, bubbleLayout);
    
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    let barLayout = {
      title: "The top 10 bacteria cultures found",
      margin: { t: 30, l: 150}
    };

    Plotly.newPlot("bar", barData, barLayout);

  });

}

