

var config = {
    apiKey: "AIzaSyDhQje3TQr2-fYTPmA41k4jvt4TTR5C6zw",
    authDomain: "evgenia-s-project.firebaseapp.com",
    databaseURL: "https://evgenia-s-project.firebaseio.com",
    projectId: "evgenia-s-project",
    storageBucket: "evgenia-s-project.appspot.com",
    messagingSenderId: "908270590424"
};

firebase.initializeApp(config);

var database = firebase.database();

var trainData = "/dataTrain";
$("#submitButton").on("click", function (event) {
    event.preventDefault();

    // Get the input values
    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var frequency = parseInt($("#frequency").val().trim());

    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTrainTime);
    console.log(frequency);

    // evaluate input
    var regex = /^[a-z0-9 ]+$/i;
    if (!trainName.match(regex)) {
        $("#trainName").val("");
        return;
    }

    if (!trainDestination.match(regex)) {
        $("#destination").val("");
        return;
    }

    if (!moment(firstTrainTime, "HH:mm").isValid()) {
        $("#firstTrainTime").val("");
        return;
    }
    if (isNaN(frequency)) {
        $("#frequency").val("");
        return;
    }

    database.ref(trainData).push({
        trainWay: trainName,
        destination: trainDestination,
        trainTime: firstTrainTime,
        trainfrequency: frequency
    });


    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");

});

var trainDataRef = database.ref(trainData);
trainDataRef.on("value", function (snap) {

    var nowTime = moment();
    $("tbody").html("");
    snap.forEach(function (childSnapshot) {

        var firstTrainTime = moment(childSnapshot.val().trainTime, "HH:mm");
        var trainFrequency = childSnapshot.val().trainfrequency;
        var n;
        var minutesAway;
        var nextTrainTime;

        console.log(nowTime.format());
        console.log(firstTrainTime.format());
        console.log(nowTime.isBefore(firstTrainTime));
        if (nowTime.isBefore(firstTrainTime)) {
            console.log("Future start time");
            minutesAway = firstTrainTime.diff(nowTime, "minutes");
            // nextTrainTime = (nowTime.add(minutesAway, "minutes"));
            nextTrainTime = firstTrainTime;
        }
        else {
            console.log("Past start time");
            n = Math.ceil(nowTime.diff(firstTrainTime, "minutes") / parseFloat(trainFrequency));
            minutesAway = trainFrequency * n - (nowTime.diff(firstTrainTime, "minutes"));
            // nextTrainTime = (nowTime.add(minutesAway, "minutes"));
            var nowClone = moment(nowTime);
            nowClone.add(minutesAway);
            nextTrainTime = nowClone;
        }


        var row = $("<tr>");
        row.append("<td>" + childSnapshot.val().trainWay + "</td>");
        row.append("<td>" + childSnapshot.val().destination + "</td>");
        row.append("<td>" + childSnapshot.val().trainfrequency + "</td>");
        row.append("<td>" + nextTrainTime.format("LT") + "</td>");
        row.append("<td>" + minutesAway + "</td>");
        $("tbody").append(row);


    });
});
