define(function (require, exports, module) {


    module.exports = {
        getCoordinates: function () {

            var glencoeCoordinates = [
                /*Top Border with Northbrook*/
                new google.maps.LatLng(42.152516, -87.795999),
                new google.maps.LatLng(42.119928, -87.780034),
                new google.maps.LatLng(42.116280, -87.775601),
                new google.maps.LatLng(42.119973, -87.775601),
                new google.maps.LatLng(42.119591, -87.741268),
                new google.maps.LatLng(42.128503, -87.741612),
                new google.maps.LatLng(42.152433, -87.759293),

                new google.maps.LatLng(42.152516, -87.795999)
            ];
            return glencoeCoordinates;
        }
    }
});
