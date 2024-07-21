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




async function  onButtonClick(end_year) {

    loaddata().then(data => {
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
        var filtered_data = data.filter(d => d.Year >=2005 && d.Year <=end_year)                           

        var xs = d3.scaleBand().domain(data.map(d => d.Year)).range([0,width]).padding(0.2);
        var xg = d3.scaleBand().domain(banks).range([0,xs.bandwidth()]).padding(0.1);       
        var ys = d3.scaleLinear().domain([0,5]).range([height,0]);
        var color = d3.scaleOrdinal().domain(banks).range(['orange','blue'])     
        
        
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
            .text(d => legendNames[d]); // Adjust text to match your data keys

        })
}

function init() {

    const button = document.getElementById('myButton');
    const sliderContainer = document.getElementById('yearSliderContainer');
    const slider = document.getElementById('yearSlider');
    const currentYearDisplay = document.getElementById('currentYear');
    const years = [2007, 2012, 2019, 2023];
    let index = 0;
    sliderContainer.style.visibility = 'hidden'; 
    button.addEventListener('click', () => {
        onButtonClick(years[index]);
        index++;
        sliderContainer.style.visibility = 'hidden'; 
        if (index >= years.length) {
            // Disable the button at the end of the array
            button.disabled = true;
            button.style.visibility = 'hidden'
            sliderContainer.style.visibility= 'visible';
            sliderContainer.style.display = 'block';  
            slider.addEventListener('input', () => {
                const year = +slider.value;
                currentYearDisplay.textContent = year;
                onButtonClick(year);
            });          
        }
    });

    
}

window.onload = init;