$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAZfKSlt6LHzzQtRN61yUATogD3RfwJ-6g",
    authDomain: "trainschedule-88a49.firebaseapp.com",
    databaseURL: "https://trainschedule-88a49.firebaseio.com",
    projectId: "trainschedule-88a49",
    storageBucket: "trainschedule-88a49.appspot.com",
    messagingSenderId: "957605981518"
  };
  firebase.initializeApp(config);
	
	var database = firebase.database();

		var currentTime = moment();

			$("#submit").on("click", function() {

			var name = $("#nameInput").val().trim();
			var dest = $("#destInput").val().trim();
			var time = $("#timeInput").val().trim();
			var freq = $("#freqInput").val().trim();

			database.ref().push({
			name: name,
			dest: dest,
			time: time,
			freq: freq,
			timeAdded: firebase.database.serverValue.TIMESTAMP
		});
		$("input").val('');
		return false;
	});
	database.ref().on("child_added", function(childSnapshot){
		var name = childSnapshot.val().name;
		var dest = childSnapshot.val().dest;
		var time = childSnapshot.val().time;
		var freq = childSnapshot.val().freq;

		var freq = parseInt(freq);

		var currentTime = moment();

		var dConverted = moment(childSnapshot.val().time, "HH:mm").subtract(1, 'years');

		var trainTime = moment(dConverted).format("HH:mm");

		var tConverted = moment(trainTime, "HH:mm").subtract(1, 'years');
		var tDifference =moment().diff(moment(tConverted), "minutes");

		var tRemainder = tDifference % freq;

		var minAway = freq -tRemainder;

		var nextTrain = moment().add(minAway, "minutes");

		$("#currentTime").text(currentTime);
		$("#trainTable").append(
			"<tr><td id="nameDisplay">" + childSnapshot.val().name +
			"</td><td id="destDisplay">" + childSnapshot.val().dest +
			"</td><td id="freqDisplay">" + childSnapshot.val().freq +
			"</td><td id="nextDisplay">" + moment(nextTrain).format("HH:mm") +
			"</td><td id="awayDisplay">" + minsAway + " minutes until next arrival" + "</td><tr>");

	});		

	database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added" function(snapshot){
		$("#nameDisplay").html(snapshot.val().name);
		$("#destDisplay").html(snapshot.val().dest);
		$("#timeDisplay").html(snapshot.val().time);
		$("#freqDisplay").html(snapshot.val().freq);

	})	
});