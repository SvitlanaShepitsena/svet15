define(function (require, exports, module) {


    module.exports = {
        getCoordinates: function () {

            var deerfieldCoordinates = [
                /*Border with Highland Park*/
                new google.maps.LatLng(42.189924, -87.852160),
                new google.maps.LatLng(42.189797, -87.847353),
                new google.maps.LatLng(42.183692, -87.847353),
                new google.maps.LatLng(42.167408, -87.828127),
                new google.maps.LatLng(42.168808, -87.823321),
                new google.maps.LatLng(42.158628, -87.823664),
                new google.maps.LatLng(42.152902, -87.821261),
                /*End// Border with Highland Park*/

                /*Bottom Border with Northbrook*/
                new google.maps.LatLng(42.152887, -87.833732),
                new google.maps.LatLng(42.146269, -87.830985),
                new google.maps.LatLng(42.146015, -87.833389),
                new google.maps.LatLng(42.150088, -87.843002),
                new google.maps.LatLng(42.150342, -87.872012),
                new google.maps.LatLng(42.153269, -87.883857),
                new google.maps.LatLng(42.167394, -87.882827),
                new google.maps.LatLng(42.167648, -87.874244),
                new google.maps.LatLng(42.178335, -87.874587),
                new google.maps.LatLng(42.182151, -87.854503),
                new google.maps.LatLng(42.189846, -87.858194),
                new google.maps.LatLng(42.189924, -87.852160)
            ];
            return deerfieldCoordinates;
        }
    }
});
