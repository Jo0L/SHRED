// Initialize the Google Map after loading the Google Maps API
$(document).ready(async function () {
    $.ajax({
        url: '/location/getLocation',
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {

            if (response.apiKey && response.locations) {
                // Dynamically load the Google Maps API script
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${response.apiKey}&callback=initMap`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);

                // Wait for the map to be initialized
                window.initMap = function () {
                    // Initialize the map only after the API is loaded
                    const map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 8,
                        center: { lat: 31.252973, lng: 34.791462 } // Center at Israel
                    });

                    // Render locations as markers
                    response.locations.forEach(location => {
                        
                        const marker = new google.maps.Marker({
                            position: { lat: location.latitude, lng: location.longitude },
                            map: map,
                            title: location.name
                        });

                        // Display info window when marker is clicked
                        const infowindow = new google.maps.InfoWindow({
                            content: `<h3>${location.name}</h3><p>${location.description}</p>`
                        });

                        marker.addListener('click', () => {
                            infowindow.open(map, marker);
                        });
                    });
                };
            }
        },
        error: function (err) {
            if (err.status === 500) {
                console.log("Something went wrong while loading the map.");
            }
        }
    });
});
