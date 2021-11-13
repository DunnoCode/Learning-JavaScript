/**
 * @name initialize
 * @description Creating the basic structure of the HTML
 * @param null
 * 
 * @returns null
 */
const initialize = async () =>{
    const structure = ` <div id="header" class="header" style="background-color: #a2a2a2">
                            <h1>Countries / Territories / Areas<h1>
                        </div>
                        <div id="content" class="content">
                            <div id="control" class="control">
                                <div id="search" class="search"></div>
                                <div id="drop" class="drop">
                                    <div id="sort" class="sort"></div>
                                    <div id="region" class="region"></div>
                                </div>
                            </div>
                            <div id="display" class="display">
                                <div>ORDERED BY:<span id="order" class="order">Name</span></div>
                                <div>SHOWED REGION:<span id="shown" class="shown">All</span></div>
                            </div>
                            <div id="searchResult" class="searchResult"></div>
                            <div id="country" class="country" style="display:flex; flex-wrap: wrap;">
                            </div>
                        </div>
                      `
    document.body.insertAdjacentHTML('beforeend', structure)
}



/**
 * @name countryBlock
 * @description creating the block of country which contain country's information
 * @param {Object} editted country object fetch from api
 * 
 * @returns null
 */
const countryBlock = async(country) =>{
    console.log(country.name, country.latlng)
    const template = `
                        <div id="${country.name}" class="${country.name};${country.region};${country.area == undefined? Number.MAX_SAFE_INTEGER : country.area};${country.population}" style="width: 300px; margin: 15px 25px; display: block;">
                            <div id="flag" class="flag" style="height: 200px; width: 300px;">
                                <img src="${country.flag}" alt="image" style="width: 100%; height: 100%;">
                            </div>
                            <div id="info" class="info" style="line-height: 2; padding-bottom: 20px; padding-top: 20px; width: 100%; background-color:#d3d3d3">
                                <p style="font-weight: bold; font-size: 30px;">${country.name}</p>
                                <p style="font-size: 18px"><span>Population:</span> ${country.population} </p>
                                ${country.area == undefined ?　`` : `<p style="font-size: 18px"><span>Area:</span> ${country.area} km²</p>`}
                                <p style="font-size: 18px"><span>Region:</span> ${country.region}</p>
                                <p style="font-size: 18px"><span>Subregion:</span> ${country.subregion}</p>
                                ${country.latlng == undefined ? `` : `<p style="font-size: 18px"><span>Lat:</span> ${country.latlng[0]} &nbsp&nbsp <span>Long:</span> ${country.latlng[1]} <button id="map-${country.name}" class="map-${country.name}">Map</button></p>`}
                                <p style="font-size: 18px"><span>Code:</span> ${country.alpha3Code} &nbsp&nbsp&nbsp <span>Calling Code:</span> ${country.callingCodes}</p>
                            </div>
                        </div>
                     `
    const template2 = `
                            ${(country.latlng != undefined) ? 
                            `
                                <div id="showMap-${country.name}" class="showMap-${country.name}" style="position: fixed; width: 60vw; height:60vh; index: 100; display: none; top:20vh; left:20vw">
                                    <button id="close-showMap-${country.name}" class="close-showMap-${country.name} close" style="font-size: 30px; color:black">×</button>
                                </div>
                            `
                            : 
                            ``}
                     `
    document.getElementById("country").insertAdjacentHTML('beforeend', template)
    document.getElementById("content").insertAdjacentHTML('beforebegin', template2)
    if(country.latlng != undefined){
        if(country.area == undefined){
            var area = 1
        }else{
            var area = country.area
        }
        var latlng = country.latlng
        var map = new ol.Map({
            target: `showMap-${country.name}`,
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([latlng[1], latlng[0]]),
              zoom: 11 - (Math.log10((area/(16 - Math.log10(area)))))
            })
        });
        // https://github.com/openlayers/openlayers/issues/4817
        // should be a bug for the openlayers, need to use updateSize to re-render the map
        document.getElementById(`map-${country.name}`).addEventListener('click', function(event){
            document.getElementById(`showMap-${country.name}`).style.display = "block";
            setTimeout(function() {
                map.updateSize();
            }, 0);
        })
        document.getElementById(`close-showMap-${country.name}`).addEventListener('click', function(event){
            document.getElementById(`showMap-${country.name}`).style.display = "none";
        })
        
    }
}


/**
 * @name fetchData
 * @description fetching data of country and creating the information boxes into the HTML body.
 * @param null
 * 
 * @returns null
 */
const fetchData = async() =>{
    const response = await fetch('https://restcountries.com/v2/all')
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const countries = await response.json();
    const mappedCountries = await countries.map((country) => {
        const {name, alpha3Code, callingCodes, subregion, region, population, latlng, area, flag, ...remainings} = country
        return {name, alpha3Code, callingCodes, subregion, region, population, latlng, area, flag}
    })

    mappedCountries.map((country) => {
        countryBlock(country)
    })
    const myElement = document.getElementById("country").children;
    sortList = Object.values(myElement).sort((a,b) => {
        if (a.getAttribute('class').split(";")[0] < b.getAttribute('class').split(";")[0]){
            return -1;
        }else if (a.getAttribute('class').split(";")[0] > b.getAttribute('class').split(";")[0]){
            return 1;
        }else{
            return 0
        }
    })
    // console.log(sortList)
    var parent = document.getElementById('country');
    parent.innerHTML = ""
    for(var i = 0, l = sortList.length; i < l; i++) {
        parent.appendChild(sortList[i]);
    }
}



/**
 * @name insertFunction
 * @description inserting the content management function: searchBar, sort by droplist, and by region droplist
 * @param null
 * 
 * @returns null
 */
const insertFunction = async() =>{
    searchBar = `<input type="search" placeholder="Search name..." name="search" id="searchBar">`
    document.getElementById("search").insertAdjacentHTML('beforeend', searchBar)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
    document.getElementById('searchBar').addEventListener('search', function(event){
        var searchValue = document.getElementById('searchBar').value;
        var currentValue = document.getElementById('shown').innerHTML.toLowerCase()
        const myElement = document.getElementById("country");
        var count = 0;
        if(searchValue == ''){
            document.getElementById('display').style.display = "block";
            document.getElementById(`drop`).style.display = "block";
            const backSort = document.getElementById('order').innerHTML.toLowerCase();
            const backRegion = document.getElementById('shown').innerHTML.toLowerCase();
            switch (backRegion){
                case 'all':
                    for (let i = 0; i < myElement.children.length; i++) {
                            myElement.children[i].style.display = "block";
                    }
                    break;
                case 'africa':
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Africa"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                    break;
                case 'americas':
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Americas"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                    break;
                case 'asia':
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Asia"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                    
                    break;
                case 'europe':
                    for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Europe"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                    }
                    break;
                case 'oceania':
                    for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Oceania"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                    }
                    break;
                case 'polar':
                    for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Polar"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    break;
                default:
                    break;
            }
            switch(backSort){
                case 'area':
                    sortList = Object.values(myElement.children).sort((a,b) => {
                        return parseInt(a.getAttribute('class').split(";")[2]) - parseInt(b.getAttribute('class').split(";")[2])
                    })
                    var parent = document.getElementById('country');
                    parent.innerHTML = ""
                    for(var i = 0, l = sortList.length; i < l; i++) {
                        parent.appendChild(sortList[i]);
                    }
                    break;
                case 'name':
                    sortList = Object.values(myElement.children).sort((a,b) => {
                        if (a.getAttribute('class').split(";")[0] < b.getAttribute('class').split(";")[0]){
                            return -1;
                        }else if (a.getAttribute('class').split(";")[0] > b.getAttribute('class').split(";")[0]){
                            return 1;
                        }else{
                            return 0
                        }
                    })
                    // console.log(sortList)
                    var parent = document.getElementById('country');
                    parent.innerHTML = ""
                    for(var i = 0, l = sortList.length; i < l; i++) {
                        parent.appendChild(sortList[i]);
                    }
                    break;
                case 'population':
                    sortList = Object.values(myElement.children).sort((a,b) => {
                        return parseInt(a.getAttribute('class').split(";")[3]) - parseInt(b.getAttribute('class').split(";")[3])
                    })
                    var parent = document.getElementById('country');
                    parent.innerHTML = ""
                    for(var i = 0, l = sortList.length; i < l; i++) {
                        parent.appendChild(sortList[i]);
                    }
                    break;
                default:
                    break;
            }
            document.getElementById('searchResult').innerHTML = ''
        }else{
            document.getElementById('display').style.display = "none";
            document.getElementById(`drop`).style.display = "none";
            //sort all order by name
            sortList = Object.values(myElement.children).sort((a,b) => {
                if (a.getAttribute('class').split(";")[0] < b.getAttribute('class').split(";")[0]){
                    return -1;
                }else if (a.getAttribute('class').split(";")[0] > b.getAttribute('class').split(";")[0]){
                    return 1;
                }else{
                    return 0
                }
            })
            var parent = document.getElementById('country');
            parent.innerHTML = ""
            for(var i = 0, l = sortList.length; i < l; i++) {
                parent.appendChild(sortList[i]);
            }
            switch (currentValue){
                case 'all':
                    if(searchValue != ''){
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }else{
                        for (let i = 0; i < myElement.children.length; i++) {
                                myElement.children[i].style.display = "block";
                        }
                    }
                    break;
                case 'africa':
                    if(searchValue != ''){
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Africa" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }else{
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Africa"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }
                    break;
                case 'americas':
                    if(searchValue != ''){
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Americas" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }else{
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Americas"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }
                    break;
                case 'asia':
                    if(searchValue != ''){
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Asia" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }else{
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Asia"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }
                    break;
                case 'europe':
                    if(searchValue != ''){
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Europe" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }else{
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Europe"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }
                    break;
                case 'oceania':
                    if(searchValue != ''){
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Oceania" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }else{
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Oceania"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }
                    break;
                case 'polar':
                    if(searchValue != ''){
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Polar" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }else{
                        for (let i = 0; i < myElement.children.length; i++) {
                            if(myElement.children[i].getAttribute('class').split(';')[1] == "Polar"){
                                myElement.children[i].style.display = "block";
                                count++;
                            }else{
                                myElement.children[i].style.display = "none";
                            }
                        }
                    }
                    break;
                default:
                    break;
        }
        document.getElementById('searchResult').innerHTML = `<p>Search Results: ${count} MATCHES</p>`
    }
    });
    sortDropBox = `
                    <select name="sortOrder" id="sortDropBox">
                        <option value="sortby" selected hidden>Sort by</option>
                        <option value="area">Area</option>
                        <option value="name" default>Name</option>
                        <option value="population">Population</option>
                    </select>
                  `
    document.getElementById("sort").insertAdjacentHTML('beforeend', sortDropBox)
    document.getElementById('sortDropBox').addEventListener('change', function(event) {
        // do the sort
        // https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
        // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        const currentValue = document.getElementById('sortDropBox').value
        const myElement = document.getElementById("country").children;
        switch(currentValue){
            case 'area':
                sortList = Object.values(myElement).sort((a,b) => {
                    return parseInt(a.getAttribute('class').split(";")[2]) - parseInt(b.getAttribute('class').split(";")[2])
                })
                var parent = document.getElementById('country');
                parent.innerHTML = ""
                for(var i = 0, l = sortList.length; i < l; i++) {
                    parent.appendChild(sortList[i]);
                }
                break;
            case 'name':
                sortList = Object.values(myElement).sort((a,b) => {
                    if (a.getAttribute('class').split(";")[0] < b.getAttribute('class').split(";")[0]){
                        return -1;
                    }else if (a.getAttribute('class').split(";")[0] > b.getAttribute('class').split(";")[0]){
                        return 1;
                    }else{
                        return 0
                    }
                })
                // console.log(sortList)
                var parent = document.getElementById('country');
                parent.innerHTML = ""
                for(var i = 0, l = sortList.length; i < l; i++) {
                    parent.appendChild(sortList[i]);
                }
                break;
            case 'population':
                sortList = Object.values(myElement).sort((a,b) => {
                    return parseInt(a.getAttribute('class').split(";")[3]) - parseInt(b.getAttribute('class').split(";")[3])
                })
                var parent = document.getElementById('country');
                parent.innerHTML = ""
                for(var i = 0, l = sortList.length; i < l; i++) {
                    parent.appendChild(sortList[i]);
                }
                break;
            default:
                break;
        }
        document.getElementById('order').innerHTML = currentValue.charAt(0).toUpperCase() + currentValue.slice(1)
        document.getElementById('sortDropBox').addEventListener('change', function(event) {
            document.getElementById('sortDropBox').value = "sortby";
        });
    });
    regionDropBox = `
                        <select name="regionFilter" id="regionDropBox">
                            <option value="byregion" selected hidden>By Region</option>
                            <option value="all" default>All</option>
                            <option value="africa">Africa</option>
                            <option value="americas">Americas</option>
                            <option value="asia">Asia</option>
                            <option value="europe">Europe</option>
                            <option value="oceania">Oceania</option>
                            <option value="polar">Polar</option>
                        </select>
                    `
    document.getElementById("region").insertAdjacentHTML('beforeend', regionDropBox)
    document.getElementById('regionDropBox').addEventListener('change', function(event) {
        //do the filtering
        const currentValue = document.getElementById('regionDropBox').value
        const searchValue = document.getElementById('searchBar').value;
        const myElement = document.getElementById("country");
        var count = 0;
        switch (currentValue){
            case 'all':
                if(searchValue != ''){
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }else{
                    for (let i = 0; i < myElement.children.length; i++) {
                            myElement.children[i].style.display = "block";
                    }
                }
                break;
            case 'africa':
                if(searchValue != ''){
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Africa" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }else{
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Africa"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }
                break;
            case 'americas':
                if(searchValue != ''){
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Americas" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }else{
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Americas"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }
                break;
            case 'asia':
                if(searchValue != ''){
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Asia" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }else{
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Asia"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }
                break;
            case 'europe':
                if(searchValue != ''){
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Europe" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }else{
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Europe"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }
                break;
            case 'oceania':
                if(searchValue != ''){
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Oceania" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }else{
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Oceania"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }
                break;
            case 'polar':
                if(searchValue != ''){
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Polar" && myElement.children[i].getAttribute('class').split(';')[0].toLowerCase().includes(searchValue.toLowerCase())){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }else{
                    for (let i = 0; i < myElement.children.length; i++) {
                        if(myElement.children[i].getAttribute('class').split(';')[1] == "Polar"){
                            myElement.children[i].style.display = "block";
                            count++;
                        }else{
                            myElement.children[i].style.display = "none";
                        }
                    }
                }
                break;
            default:
                break;
        }
        if(searchValue != ''){
            document.getElementById('searchResult').innerHTML = `<p>Search Results: ${count} MATCHES</p>`
        }else{
            document.getElementById('searchResult').innerHTML = ''
        }
        document.getElementById('shown').innerHTML = currentValue.charAt(0).toUpperCase() + currentValue.slice(1)
        document.getElementById('regionDropBox').addEventListener('change', function(event) {
            document.getElementById('regionDropBox').value = "byregion";
        });
    });
}



/**
 * @name main
 * @description running the function in order
 * @param null
 * 
 * @returns null
 */
const main = async() => {
    await initialize()
    await fetchData()
    await insertFunction()
}


main()