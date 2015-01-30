define(function (require, exports, module) {


    module.exports = {
        getCoordinates: function () {

            var highlandParkCoordinates = [
                /*Border with Deerfield*/
                new google.maps.LatLng(42.189924, -87.852160),
                new google.maps.LatLng(42.189797, -87.847353),
                new google.maps.LatLng(42.183692, -87.847353),
                new google.maps.LatLng(42.167408, -87.828127),
                new google.maps.LatLng(42.168808, -87.823321),
                new google.maps.LatLng(42.158628, -87.823664),
                new google.maps.LatLng(42.152902, -87.821261),
                /*End// Border with Deerfield*/

                new google.maps.LatLng(42.152520, -87.759291),
                new google.maps.LatLng(42.211415, -87.802378),
                new google.maps.LatLng(42.196665, -87.808214),
                new google.maps.LatLng(42.196665, -87.808214),
                new google.maps.LatLng(42.210652, -87.817999),
                new google.maps.LatLng(42.211034, -87.816111),
                new google.maps.LatLng(42.213577, -87.818343),
                new google.maps.LatLng(42.217899, -87.804953),
                new google.maps.LatLng(42.223493, -87.807528),
                new google.maps.LatLng(42.218026, -87.821776),
                new google.maps.LatLng(42.218154, -87.842032),
                new google.maps.LatLng(42.212687, -87.842547),
                new google.maps.LatLng(42.210907, -87.847010),
                new google.maps.LatLng(42.203786, -87.847010),
                new google.maps.LatLng(42.203786, -87.851816),
                new google.maps.LatLng(42.189924, -87.852160)
            ];
            return highlandParkCoordinates;
        }
    }
});
