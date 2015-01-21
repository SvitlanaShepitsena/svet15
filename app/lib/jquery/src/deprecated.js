define([
	"./core",
	"./traversing"
], function( jQuery ) {

// The number of elements contained in the matched element set
jQuery.scrollUtil.size = function() {
	return this.length;
};

jQuery.scrollUtil.andSelf = jQuery.scrollUtil.addBack;

});
