async function loaddata() {
    const data = await d3.csv('PuertoRicoBanks.csv', d => {
        return {
            Year: +d.Year,
            OFG_Bank_NCO: +d.OFG_Bank_NCO,
            Popular_NCO: +d.Popular_NCO,
            OFG_Bank_StockPrice: +d.OFG_Bank_StockPrice,
            Popular_StockPrice: +d.Popular_StockPrice
        };
    });
    
    return data;
}




function  displayChartForYear(data, year, annotationsData) {
    
    d3.select('svg').selectAll('*').remove();
    var margin = 50;        
    var width = 600-margin;
    var height = 600-margin;

    const svg = d3.select('svg')
        .attr('width', width + margin + margin)
        .attr('height', height + margin + margin)
        .append('g')
        .attr('transform', `translate(${margin},${margin})`);        
    
    var banks = ['OFG_Bank_NCO','Popular_NCO'];
    const legendNames = {'OFG_Bank_NCO': 'OFG Bank', 'Popular_NCO': 'Banco Popular'};
    var xs = d3.scaleBand().domain(data.map(d => d.Year)).range([0,width]).padding(0.2);
    var xg = d3.scaleBand().domain(banks).range([0,xs.bandwidth()]).padding(0.1);       
    var ys = d3.scaleLinear().domain([0,5]).range([height,0]);
    var color = d3.scaleOrdinal().domain(banks).range(['orange','blue'])             
    var filtered_data = data.filter(d => d.Year >=2005 && d.Year <=year)                                 
       
    svg.append('g')
       .call(d3.axisLeft(ys).tickFormat(d3.format(".2f")))
       .append('text')
       .attr('class', 'axis-label')
       .attr('x', margin)
       .attr('y', -10)
       .attr('text-anchor', 'middle')
       .text('Net Charge Off Ratio');
       
                
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xs).tickFormat(d3.format("d")))
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', margin - 10)
        .attr('text-anchor', 'middle')
        .text('Year');

        
        
    const grouped_x = svg.selectAll('.year-group').data(filtered_data).enter()
       .append('g').attr('class','year-group').attr('transform', d => `translate(${xs(d.Year)},0)`);

    
    grouped_x.selectAll('rect')
       .data(d => banks.map(key => ({ key: key,value: d[key]})))
       .enter().append('rect')
       .attr('class',d=> 'bar ${d.key}')        
       .attr('x', d=>xg(d.key))
       .attr('y', d=>ys(d.value))
       .attr('width', xg.bandwidth())
       .attr('height', d => height - ys(d.value))
       .attr('fill', d=> color(d.key));
        

    
    if (annotationsData) {        

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations([annotationsData]);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);
    }
        
    const legend = svg.selectAll('.legend')
        .data(banks)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend.append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);

    legend.append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(d => legendNames[d]);       
}

async function updateChartForYear(end_year) {
    const data = await loaddata();
    d3.select('svg').selectAll('*').remove();
    var margin = 50;
    var width = 600 - margin;
    var height = 600 - margin;

    const svg = d3.select('svg')
        .attr('width', width + margin + margin)
        .attr('height', height + margin + margin)
        .append('g')
        .attr('transform', `translate(${margin},${margin})`);

    var banks = ['OFG_Bank_NCO', 'Popular_NCO'];
    const legendNames = { 'OFG_Bank_NCO': 'OFG Bank', 'Popular_NCO': 'Banco Popular' };
    var xs = d3.scaleBand().domain(data.map(d => d.Year)).range([0, width]).padding(0.2);
    var xg = d3.scaleBand().domain(banks).range([0, xs.bandwidth()]).padding(0.1);
    var ys = d3.scaleLinear().domain([0, 5]).range([height, 0]);
    var color = d3.scaleOrdinal().domain(banks).range(['orange', 'blue']);
    var filtered_data = data.filter(d => d.Year >= 2005 && d.Year <= end_year);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        ;      
    
    
    svg.append('g')
        .call(d3.axisLeft(ys).tickFormat(d3.format(".2f")))
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', margin)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .text('Net Charge Off Ratio');

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xs).tickFormat(d3.format("d")))
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', margin - 10)
        .attr('text-anchor', 'middle')
        .text('Year');

    const grouped_x = svg.selectAll('.year-group').data(filtered_data).enter()
        .append('g').attr('class', 'year-group').attr('transform', d => `translate(${xs(d.Year)},0)`);

    grouped_x.selectAll('rect')
        .data(d => banks.map(key => ({ key: key, value: d[key] })))
        .enter().append('rect')
        .attr('class', d => `bar ${d.key}`)
        .attr('x', d => xg(d.key))
        .attr('y', d => ys(d.value))
        .attr('width', xg.bandwidth())
        .attr('height', d => height - ys(d.value))
        .attr('fill', d => color(d.key))
        .on('mouseover',(d) => tooltip.style('visibility','visible')
                                        .html(`<div class="tooltip-title">${legendNames[d.key]}</div>
                                               <div class="tooltip-value">NCO Ratio: ${d.value}</div>`)                                        
                                        .style("top", (d3.event.pageY - 10) + "px")
                                        .style("left", (d3.event.pageX + 10) + "px"))
        .on('mouseout', function() {tooltip.style('visibility','hidden');});
    
    const legend = svg.selectAll('.legend')
        .data(banks)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);

    legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => legendNames[d]); 
}

async function init() {
    const data = await loaddata();
    const years = [2007, 2012, 2019, 2023, 2023];
    const annotationsData = [
        {
            note: { label: "From 2005 to 2007 the Puerto Rican Economy was strong and Net Charge Offs were low for both banks.",
                    title: "2005 to 2007"},
            type: d3.annotationCalloutRect,
            subject: {width: 90 , height: 130 },
            x: 5,
            y : 420,
            dx : 100,
            dy: -10
        },
        {
            note: { label: "2008 marked the beginning of the Global Financial Crisis. The impact varied significantly for these two banks." +
                            "OFG Bank remained relatively insulated "+
                            " while, Banco Popular saw a sharp rise in loans it had to write off.",
                    title: "2008 to 2012"},
            type: d3.annotationCalloutRect,
            subject: {width: 150 , height: 530 },
            x: 90,
            y : 20,
            dx : 200,
            dy: 50
        },
        {
            note: { label: "Leading up to 2017 when Puerto Rico declared bankruptcy, OFG Bank began to see greater stress on its"+
                           " loans as it only has operations in Puerto Rico. Banco Popular did much better thanks to its US operations.",
                    title: "2013 to 2019"},
            type: d3.annotationCalloutRect,
            subject: {width: 210 , height: 270 },
            x: 230,
            y : 280,
            dx : 70,
            dy: -10
        },
        {
            note: { label: "Following the COVID Pandemic Net Charge Offs for both banks fell to low levels as Federal Aid for the pandemic"+
                            " and for prior hurricanes began to benefit the Puerto Rican Economy",
                    title: "2020 to 2023"},
            type: d3.annotationCalloutRect,
            subject: {width: 120 , height: 170 },
            x: 430,
            y : 380,
            dx : 0,
            dy: -20
        },
    ];

    const button = document.getElementById('myButton');
    const sliderContainer = document.getElementById('yearSliderContainer');
    const slider = document.getElementById('yearSlider');
    const currentYearDisplay = document.getElementById('currentYear');
    let index = 0;

    sliderContainer.style.visibility = 'hidden';
    

    button.addEventListener('click', () => {
        
        if (index < years.length - 1) {
            displayChartForYear(data, years[index],annotationsData[index]);
        } else if (index === years.length - 1) {
            updateChartForYear(2023);
            button.style.visibility = 'hidden';
            sliderContainer.style.visibility = 'visible';
            sliderContainer.style.display = 'block';
            slider.addEventListener('input', () => {
                const year = +slider.value;
                currentYearDisplay.textContent = year;
                updateChartForYear(year);
            });



        }
        index++;
    });
}

window.onload = init;