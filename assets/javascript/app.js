

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

    snap.forEach(function (childSnapshot) {
        $("#trainTable").append("<td><th>"+childSnapshot.val().trainWay+"</th></td>");
        $("#trainTable").append("<tr><td>"+childSnapshot.val().destination+"</td></tr>");
        $("#trainTable").append("<tr><td>"+childSnapshot.val().trainTime+"</td></tr>");
        $("#trainTable").append("<tr><td>"+childSnapshot.val().trainfrequency+"</td></tr>");
        console.log("<tr>");

    });
});
