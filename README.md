# bike-map
Mount Shasta Area Bike Trails

Things to do:


Get everything out of the controllers and seperate into directives/services/factories.

Stop using two seperate objects for the layers. Include geoXmlDoc[l] into $scope.myTrails so I can keep my sanity,
	this is done for the most part

Use $scope.myTrails for every function rather than passing poly, polyNum and layer around.
	this is done for the most part

3-way data binding for adding a comment. When submit is clicked spinner, close modal, new comment show in comments section

Figure out some sort of localstorage or use cache manifest to store layers locally for quicker load times

minimize. minimize. minimize. then concat for quick load times on crappy mobile connections.
	done during grunt build task


address css issues for mobile.
	add comment modal looks funny
	move left-sidr comments and close buttons above the tail name

disallow zoom on body

right menu when trail is selected pan to that trail


MAP MORE TRAILS.. YAY.

