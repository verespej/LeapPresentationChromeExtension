#Leap Motion Presention Control

##Use:

1. Connect your leap motion
1. Modify manifest.js to grant permissions for whatever site the presentation is on
1. Install the chrome extension
1. Open the presentation in the browser where you installed this extension and swipe!


##Currently works with:

1. reveal.js


##TODO

1. Identify pages with reveal by finding reveal script
    1. reveal.\*.js
2. Only act in tab that has focus
    1. https://developer.chrome.com/extensions/messaging.html
    2. http://developer.chrome.com/extensions/tabs.html
3. Add additional sites (Google Docs? SlideShare? Prezi?)
4. Work on smoother control
5. Try to achieve this with the camera for people who don't have leap
    1. https://github.com/anvaka/oflow
6. Create a config menu (overlay on circle motion)

