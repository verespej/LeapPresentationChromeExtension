//debugger;
var _d3bu6_ = true;

function debugLog(text) {
	if (_d3bu6_) {
		console.log(text);
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

$(document).ready(function() {
	if (typeof(Leap) === "undefined") {
		alert("Leap undefined");
	} else {
		var lastGestureTime = 0;
		Leap.loop({ "enableGestures": true }, function(frame) {
			var currentTime = (new Date()).getTime();
			if (frame.gestures.length > 0 && currentTime - lastGestureTime >= 1000) {
				var controlEvent = getControlEventFromGestures(frame.gestures);
				if (controlEvent != null) {
					var targetNav = $(".navigate-" + controlEvent.direction);
					if (targetNav.hasClass("enabled")) {
						targetNav.click();
						lastGestureTime = currentTime;
					}
				}
			}
		});
	}
});

