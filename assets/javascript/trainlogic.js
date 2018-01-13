$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyATwGTrL6sUgL1TsdUHq4md5VQaMq9rkbQ",
    authDomain: "train-schedule-d5802.firebaseapp.com",
    databaseURL: "https://train-schedule-d5802.firebaseio.com",
    projectId: "train-schedule-d5802",
    storageBucket: "train-schedule-d5802.appspot.com",
    messagingSenderId: "478276021838"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Capture Button Click
  $("#addTrain").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var freq = $("#interval").val().trim();

    // Code for handling the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: freq
    });
  });


  // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
  database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;

    // Assumptions
    // var tFrequency = 3;

    // Time is 3:30 AM
    // var firstTime = "03:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);
    
    // Current Time
    var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
    
    // Time apart (remainder)
    var tRemainder = diffTime % newFreq;
      console.log(tRemainder);

    // Minute(s) Until Train
    var tMinutesTillTrain = newFreq - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page
    $("#all-display").append(
      ' <tr><td>' + newTrain +
      ' </td><td>' + newLocation +
      ' </td><td>' + newFreq +
      ' </td><td>' + catchTrain +
      ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

    // Clear input fields
    $("#trainName, #destination, #firstTrain, #interval").val("");
    return false;
  },
    //Handle the errors
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

});

