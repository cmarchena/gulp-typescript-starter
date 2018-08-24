

declare var google: any;
export default function initMap(locations: any) {

    const loc = {
        lat: 40.712216,
        lng: -73.987501,
    };

    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 12, center: loc,
            scrollwheel: false,
        });




    locations.map((markerLoc: any) => {
        var marker = new google.maps.Marker({ position: markerLoc, map: map, animation: google.maps.Animation.DROP });
    })

}