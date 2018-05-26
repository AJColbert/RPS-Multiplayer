
var PlayerNumber = 0;
var PlayerKey;
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAL5x0RCXzShzYrsG3pnzunppU-aFYEZSA",
    authDomain: "rps-multiplayer-37dda.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-37dda.firebaseio.com",
    projectId: "rps-multiplayer-37dda",
    storageBucket: "rps-multiplayer-37dda.appspot.com",
    messagingSenderId: "63691394570"
};
firebase.initializeApp(config);

var database = firebase.database();

// var playerconnRef = database.ref("/Players");

$(".btn-start").on("click", function (event)
{
    event.preventDefault();

    var name = $("#input-name").val().trim();

    var Player = {
        name: name,
        choice: "",
        loses: 0,
        wins: 0
    };

    $(".game-info").empty();
    var h3 = $("<h3>");
    h3.text("Hi " + name + "! You are Player#");
    $(".game-info").append(h3);

    console.log(Player.name);
    console.log(Player.choice);
    console.log(Player.loses);
    console.log(Player.wins);

    database.ref("/Players").push(Player);

    alert("Successfully Added a New Employee");

    $("#employeename").text("");
    $("#role").text("");
    $("#startdate").text("");
    $("#monthlyrate").text("");

});


database.ref("/Players").on("child_added", function (childSnapshot)
{
    var JName;
    var Jscore;
    console.log("childadd")
    console.log(childSnapshot.key);

    PlayerNumber += 1;
console.log(PlayerNumber)
    var name = childSnapshot.val().name;
    var wins = childSnapshot.val().wins;
    var loses = childSnapshot.val().loses;

    switch (PlayerNumber)
    {
        case 1:
        PlayerKey = childSnapshot.key
            JName = $(".player1-Name");
            Jscore = $(".player1-score");
            break;

        case 2:
        PlayerKey = childSnapshot.key
            JName = $(".player2-Name");
            Jscore = $(".player2-score");
            break;

        default:
    };
    console.log("KEY" + PlayerKey);
    JName.empty();
    Jscore.empty();
    
    var h4Name = $("<h4>");
    h4Name.text(name);
    JName.append(h4Name);

    var h4winlose = $("<h4>");
    h4winlose.text("Wins: " + wins + "  Loses: " + loses)
    Jscore.append(h4winlose);

}, function (errorObject)
    {
        console.log("The read failed: " + errorObject.code);
    });




function PlayerInfo()
{
    //Determine which player they are use switch to execute




    var h2Name = $("<h2>");
    h2Name.text(name);

    var h2winlose = $("<h2>");
    h2winlose.text("Wins: " + wins + "Loses: " + loses)





}






// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
var playerref = database.ref();
// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function (snap)
{

    // If they are connected..
    if (snap.val())
    {

        // Add user to the connections list.
        var con = connectionsRef.push(true);

        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
        playerref.child(PlayerKey).remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap)
{

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#connected-viewers").text(snap.numChildren());
});

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //


