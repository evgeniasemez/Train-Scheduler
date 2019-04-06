

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
        n = Math.ceil(nowTime.diff(firstTrainTime, "minutes") / parseFloat(trainFrequency));


        var minutesAway = trainFrequency * n - (nowTime.diff(firstTrainTime, "minutes"));

        var nextTrainTime = (nowTime.add(minutesAway, "minutes"));


        var row = $("<tr>");
        row.append("<td>" + childSnapshot.val().trainWay + "</td>");
        row.append("<td>" + childSnapshot.val().destination + "</td>");
        row.append("<td>" + childSnapshot.val().trainfrequency + "</td>");
        row.append("<td>" + nextTrainTime.format("HH:mm") + "</td>");
        row.append("<td>" + minutesAway + "</td>");
        $("tbody").append(row);
        

    });
});
