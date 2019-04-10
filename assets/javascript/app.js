
// setting the API call
var config = {
    apiKey: "AIzaSyDhQje3TQr2-fYTPmA41k4jvt4TTR5C6zw",
    authDomain: "evgenia-s-project.firebaseapp.com",
    databaseURL: "https://evgenia-s-project.firebaseio.com",
    projectId: "evgenia-s-project",
    storageBucket: "evgenia-s-project.appspot.com",
    messagingSenderId: "908270590424"
};

firebase.initializeApp(config);
// setting Firebase database
var database = firebase.database();
// serring the submit button and input values
var trainData = "/dataTrain";
$("#submitButton").on("click", function (event) {
    event.preventDefault();

    // Get the input values
    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var frequency = parseInt($("#frequency").val().trim());

    // evaluate input for Train Name
    var regex = /^[a-z0-9 ]+$/i;
    if (!trainName.match(regex)) {
        $("#trainName").val("");
        return;
    }
    // // evaluate input for Train Destination
    if (!trainDestination.match(regex)) {
        $("#destination").val("");
        return;
    }
    // // evaluate input for Train Time
    if (!moment(firstTrainTime, "HH:mm").isValid()) {
        $("#firstTrainTime").val("");
        return;
    }
    // // evaluate input for Frequency
    if (isNaN(frequency)) {
        $("#frequency").val("");
        return;
    }
    // pushing data to database
    database.ref(trainData).push({
        trainWay: trainName,
        destination: trainDestination,
        trainTime: firstTrainTime,
        trainfrequency: frequency
    });

    // cleaning inputes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");

});

var trainDataRef = database.ref(trainData);
trainDataRef.on("value", function (snap) {
    // setting moment 
    var nowTime = moment();
    $("tbody").html("");
    snap.forEach(function (childSnapshot) {

        var firstTrainTime = moment(childSnapshot.val().trainTime, "HH:mm");
        var trainFrequency = childSnapshot.val().trainfrequency;
        var n;
        var minutesAway;
        var nextTrainTime;

        if (nowTime.isBefore(firstTrainTime)) {
            minutesAway = firstTrainTime.diff(nowTime, "minutes");
            nextTrainTime = firstTrainTime;
        }
        else {
            n = Math.ceil(nowTime.diff(firstTrainTime, "minutes") / parseFloat(trainFrequency));
            minutesAway = trainFrequency * n - (nowTime.diff(firstTrainTime, "minutes"));
            var nowClone = moment(nowTime);
            nowClone.add(minutesAway);
            nextTrainTime = nowClone;
        }

        // setting a table for output 
        var row = $("<tr>");
        row.append("<td>" + childSnapshot.val().trainWay + "</td>");
        row.append("<td>" + childSnapshot.val().destination + "</td>");
        row.append("<td>" + childSnapshot.val().trainfrequency + "</td>");
        row.append("<td>" + nextTrainTime.format("LT") + "</td>");
        row.append("<td>" + minutesAway + "</td>");
        $("tbody").append(row);


    });
});
