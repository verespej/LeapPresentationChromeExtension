$.noConflict();

var _d3bu6_ = true;

function debugLog(text) {
	if (_d3bu6_) {
		console.log(text);
	}
}

function debugBreak() {
	if (_d3bu6_) {
		debugger;
	}
}

function getControlEventFromGestures(gestures) {
	for (var i in gestures) {
		var gesture = gestures[i];
		if (gesture.type === "swipe") {
			debugLog(
				"speed: " + gesture.speed + 
				", x: " + gesture.direction[0] + 
				", y: " + gesture.direction[1]
				);
			var x = gesture.direction[0];
			var y = gesture.direction[1];
			if (Math.abs(x) >= 0.6 && gesture.speed > 2000) {
				// Prefer horizontal first
				return { "direction": x > 0 ? "right" : "left" };
			}	else if (Math.abs(y) >= 0.6 && gesture.speed > 1500) {
				// Less speed required to triggered vertical
				return { "direction": y > 0 ? "up" : "down" };
			}
		}
	}
	return null;
}

function handleEventForGDocs(controlEvent) {
	debugLog("Handling GDocs event: " + controlEvent.direction);

	var originalUrl = window.location.href;
	var slideIdPrefix = "#slide=id.";
	var idIndex = originalUrl.indexOf(slideIdPrefix);

	if (idIndex < 0) {
		alert("ERROR: Unexpected URL format!");
		return false;
	}
	idIndex += slideIdPrefix.length;

	var urlBase = originalUrl.substring(0, idIndex);
	var currentSlideId = originalUrl.substring(idIndex);

	var slides = jQuery("g[transform^='translate'] > g[id^='filmstrip-']");
	var slideIds = slides.map(function() {
		var slide = jQuery(this).attr("id");
		var slideId = /filmstrip-\d+-(.+)/.exec(slide)[1];
		return slideId;
	});

	var navBack = controlEvent.direction === "left" || controlEvent.direction === "up";
	var performedAction = false;
	for (var i = 0; i < slideIds.length; i++) {
		if (currentSlideId === slideIds[i]) {
			if (navBack) {
				if (i > 0) {
					window.location.href = urlBase + slideIds[i-1];
					performedAction = true;
				}
			} else {
				if (i+1 < slideIds.length) {
					window.location.href = urlBase + slideIds[i+1];
					performedAction = true;
				}
			}
			break;
		}
	}

	return performedAction;
}

function handleEventForRevealJs(controlEvent) {
	debugLog("Handling Reveal.js event: " + controlEvent.direction);
	var targetNav = jQuery(".navigate-" + controlEvent.direction);
	if (targetNav.hasClass("enabled")) {
		targetNav.click();
		return true;
	}
	return false;
}

function isGDocsPres() {
	return /http[s]?:\/\/docs.google.com\//.exec(window.location.href);
}

function isRevealJsPres() {
	var scripts = jQuery("script");
	for (var i = 0; i < scripts.length; i++) {
		var scriptSrc = jQuery(scripts[i]).attr("src");
		if (/[\/\.]reveal(\.|\.[^\/]*\.)js$/.exec(scriptSrc)) {
			return true;
		}
	}
	return false;
}

jQuery(document).ready(function() {
	var presType = null;
	if (isGDocsPres()) {
		presType = "gdocs";
	} else if (isRevealJsPres()) {
		presType = "revealjs";
	}

	if (presType == null) {
		return;
	}

	if (typeof(Leap) === "undefined") {
		alert("Leap SDK not loaded");
	} else {
		var lastGestureTime = 0;
		Leap.loop({ "enableGestures": true }, function(frame) {
			var currentTime = (new Date()).getTime();
			if (frame.gestures.length > 0 && currentTime - lastGestureTime >= 1000) {
				var controlEvent = getControlEventFromGestures(frame.gestures);
				if (controlEvent != null) {
					debugLog("Acting on frame " + frame.id + " at " + currentTime);
					var tookAction = false;
					if (presType === "gdocs") {
						tookAction = handleEventForGDocs(controlEvent);
					} else if (presType === "revealjs") {
						tookAction = handleEventForRevealJs(controlEvent);
					}
					if (tookAction) {
						lastGestureTime = currentTime;
					}
					debugLog("Done with frame " + frame.id + ", took action: " + tookAction);
				}
			}
		});
	}
});

