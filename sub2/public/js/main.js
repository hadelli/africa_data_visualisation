// Load all data using Promise.all
Promise.all([
    d3.json('data/africa.json'),
    //d3.csv('data/region_population_density.csv'),
    d3.csv('data/africa_languages.csv')
]).then(data => {
    const geoData = data[0];
    const countryData = data[1]; // Uncomment this line if you need countryData
    const languageData = data[1];
    // Processing language data
    const languageMap = new Map();

    // Combine both datasets by adding the population density to the TopoJSON file
    geoData.objects.collection.geometries.forEach(d => {
         if (countryData) { // Uncomment these lines if you need countryData
             countryData.forEach(country => {
                 if (d.properties.name == country.region) {
                     d.properties.pop_density = +country.pop_density;
                     
                 }
             });
         }
         if (languageData) {
            languageData.forEach(country => {
                if (d.properties.name == country.region) {
                    if (!languageMap.has(d.properties.name)) {
                        languageMap.set(d.properties.name, []);
                    }
                    if (country.language) {
                        languageMap.get(d.properties.name).push(country.language);
                    }
                }
            });
        }
    });
    const choroplethMap = new ChoroplethMap({
        parentElement: '#map'
    }, geoData);

    

    const languages = ['Arabic', 'French', 'Hausa', 'Swahili', 'English', 'Portuguese'];

    const select = d3.select("#selectButton");
    select.selectAll("option")
        .data(languages).enter()
        .append("option")
        .text(d => d);

    select.on("change", function () {
        const selectedLanguage = select.property("value");
        // Remove the 'highlighted' class from all countries
        d3.selectAll(".country").classed("highlighted", false);
        if (selectedLanguage === 'English') {
            d3.selectAll(".country").classed("highlighted", true);
        } else {
            // Highlight countries that speak the selected language
            d3.selectAll(".country")
                .filter(d => (languageMap.get(d.properties.name) || []).includes(selectedLanguage))
                .classed("highlighted", true);
        }
    });

    // Initial map update for the first selected language
    select.dispatch("change"); // Trigger change event to update map initially
})
.catch(error => console.error(error));
