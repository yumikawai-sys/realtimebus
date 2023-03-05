
(function(){
    let map = L.map('theMap').setView([44.650627, -63.597140], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

    //Declare a layergroup to render icons
    let newlayer = new L.LayerGroup();
    newlayer.addTo(map);

    //A function to get the bus location from HRM transit, convert the data, and render icons
    function updateBuslocations()
    {
        // fetch('https://hrmbusapi.onrender.com/')
        // .then(res=>res.json())
        // .then(json=>{
        //     const arrData = json.entity;
        //     let arrBusData = [];
             let arrGeojasonBusData = [];

            //Filter busdata where Route No. is less than 10
            // arrBusData = arrData.filter(x=>parseInt(x.vehicle.trip.routeId)<=10);
            // arrBusData = arrBusData.map(x=>{return(
            //     {routeId:x.vehicle.trip.routeId,
            //     latitude:x.vehicle.position.latitude,
            //     longitude:x.vehicle.position.longitude,
            //     vehicle:x.vehicle.vehicle.id,
            //     bearing:x.vehicle.position.bearing
            //     })});            
                    
            //Below is sample data (https://hrmbusapi.onrender.com/ is not available now)
            arrBusData = [
                {routeId:"1",
                latitude:44.650637,
                longitude:-63.597150,
                vehicle:'1234',
                bearing:220
                },
                {routeId:"2",
                latitude:44.655200,
                longitude:-63.597100,
                vehicle:'2345',
                bearing:90
                },
                {routeId:"3",
                latitude:44.659000,
                longitude:-63.596800,
                vehicle:'7890',
                bearing:10
                }                        
            ];       

            console.log('busdata',arrBusData);
            //Call generateGeoFromLatLong to convert all bus data to GeoJason
            const ourObj ={};
            function reducer(objsofar, currentelement)
            {
                objsofar = generateGeoFromLatLong(currentelement.latitude,
                currentelement.longitude,
                currentelement.routeId,
                `This vehicle ID is ${currentelement.vehicle}`,
                currentelement.bearing);
                arrGeojasonBusData.push(objsofar);

                return arrGeojasonBusData;
            }
            let geojasonBusdata = arrBusData.reduce(reducer,ourObj)


            //Create a new bus icon
            function createCustomIcon (feature, latlng) 
            {
                let myIcon = L.icon({
                  iconUrl: 'image/bus.png',
                  iconSize: [25, 25]
                })
                let result;
                result = L.marker(latlng, {icon: myIcon, rotationAngle: feature.properties.rotationAngle});
                
                return result;
            }

            //A function ---> pop-up (onclick)
            function onEachFeature(feature, layer) 
            {
                if (feature.properties && feature.properties.popupContent) 
                {
                    layer.bindPopup(feature.properties.popupContent);
                }
            }

            //Clear the existing layergroup in advance
            newlayer.clearLayers();

            //Display bus icons in the layer           
            L.geoJSON(geojasonBusdata, {
                onEachFeature: onEachFeature,
                pointToLayer: createCustomIcon
            }).addTo(newlayer);          
        // })
    }

    //Call the function created above to display bus icons
    updateBuslocations();
    //Call the function in every 15 seconds
    setInterval(updateBuslocations,15000);

    //A function to convert raw bus data into GeoJson
    function generateGeoFromLatLong(lat, long, routeId, popup, bearing)
    {
        return geoObj = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [long, lat]
            },
            "properties": {
                "routeId": routeId,
                "popupContent": popup,
                "rotationAngle": bearing
            }
        }
    }

})();
