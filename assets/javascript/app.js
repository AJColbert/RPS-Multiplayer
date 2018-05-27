
var PlayerNumber = 0;
var PlayerKey;
var Player;
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
//Button Click Add User and Print to Plater Profile
$(".btn-start").on("click", function (event)
{
    event.preventDefault();

    var name = $("#input-name").val().trim();

    Player = {
        name: name,
        choice: "",
        loses: 0,
        wins: 0
    };
    $(".game-info").empty();
    var h3 = $("<h3>");
    h3.text("Hi " + name + "! You are Player " + PlayerNumber);
    $(".game-info").append(h3);

    database.ref("/Players").once("value", function (childSnapshot)
    {
        var JName;
        var Jscore;
        var numchild = childSnapshot.numChildren();
        var name = Player.name;
        var wins = Player.wins;
        var loses = Player.loses;

        if (numchild == 0)
        {
            PlayerNumber = 1;

            database.ref("/Players").child(PlayerNumber).set(Player);

            DisplayPlayerInfo(PlayerNumber, Player);

            database.ref("/Players").child(PlayerNumber).onDisconnect().remove();
        }
        else if (numchild == 1)
        {
            childKey = parseInt(Object.keys(childSnapshot.val())[0]);

            if (childKey == 1)
            {
                PlayerNumber = 2;
            }
            else if (childKey == 2)
            {
                PlayerNumber = 1;
            }

            database.ref("/Players").child(PlayerNumber).set(Player);

            DisplayPlayerInfo(PlayerNumber, Player);

            database.ref("/Players").child(PlayerNumber).onDisconnect().remove();
        }
        else
        {
            PlayerNumber = 3;
            $(".game-info").empty();
            var h3 = $("<h3>");
            h3.text("To Late! There's a Game in Progress. Try Again Later");
            $(".game-info").append(h3);
        }
    }, function (errorObject)
        {
            console.log("The read failed: " + errorObject.code);
        });
});

//Firts Time Connecting Player Data Population
database.ref("/Players").once("value", function (childSnapshot)
{
    var numchild = childSnapshot.numChildren();

    if (numchild == 0)
    {
    }
    else if (numchild == 1)
    {
        var CurrentKey = Object.keys(childSnapshot.val())[0];
        if (CurrentKey == 1)
        {
            PlayerNumber = 2;
        }
        else if (CurrentKey == 2)
        {
            PlayerNumber = 1;
        }

        DisplayPlayerInfo(CurrentKey, childSnapshot.child(CurrentKey).val());

    }
    else if (numchild == 2)
    {
        $(".game-info").empty();
        var h3 = $("<h3>");
        h3.text("To Late! There's a Game in Progress. Try Again Later");
        $(".game-info").append(h3);

        DisplayPlayerInfo(1, childSnapshot.child("1").val());

        DisplayPlayerInfo(2, childSnapshot.child("2").val());
    }
}, function (errorObject)
    {
        console.log("The read failed: " + errorObject.code);
    });


var DisplayPlayerInfo = function (PlayerNumber, SnapChild)
{
    if (SnapChild != null)
    {
        var JName;
        var Jscore;

        if (PlayerNumber == 1)
        {
            //Display Player1
            JName = $(".player1-Name");
            Jscore = $(".player1-score");
        }
        else if (PlayerNumber == 2)
        {
            //Display Player1
            JName = $(".player2-Name");
            Jscore = $(".player2-score");
        }

        var name = SnapChild.name;
        var wins = SnapChild.wins;
        var loses = SnapChild.loses;
        JName.empty();
        Jscore.empty();

        var h4Name = $("<h4>");
        h4Name.text(name);
        JName.append(h4Name);

        var h4winlose = $("<h4>");
        h4winlose.text("Wins: " + wins + "  Loses: " + loses)
        Jscore.append(h4winlose);
    }
}

//For Every Value Update to Database 
database.ref("/Players").on("value", function (Snapshot)
{
    console.log("ON Value")
    var numchild = Snapshot.numChildren();
    console.log(numchild);
    if (numchild == 0)
    {
        JName = $(".player2-Name");
        Jscore = $(".player2-score");
        JName.empty();
        Jscore.empty();
        var h3Name = $("<h3>");
        h3Name.text("Waiting For Player 2");
        JName.append(h3Name);

        JName = $(".player1-Name");
        Jscore = $(".player1-score");
        JName.empty();
        Jscore.empty();
        var h3Name = $("<h3>");
        h3Name.text("Waiting For Player 1");
        JName.append(h3Name);
    }
    else if (numchild == 1)
    {
        var JName;
        var Jscore;
        CurrentKey = Object.keys(Snapshot.val())[0];
        if (CurrentKey == 1)
        {
            JName = $(".player2-Name");
            Jscore = $(".player2-score");
            JName.empty();
            Jscore.empty();
            var h3Name = $("<h3>");
            h3Name.text("Waiting For Player 2");
            JName.append(h3Name);

            DisplayPlayerInfo(1, Snapshot.child("1").val());

        }
        else if (CurrentKey == 2)
        {
            JName = $(".player1-Name");
            Jscore = $(".player1-score");
            JName.empty();
            Jscore.empty();
            var h3Name = $("<h3>");
            h3Name.text("Waiting For Player 1");
            JName.append(h3Name);

            DisplayPlayerInfo(2, Snapshot.child("2").val());
        }

    }
    else if (numchild == 2)
    {
        if (PlayerNumber != 1 && PlayerNumber != 2)
        {
            $(".game-info").empty();
            var h3 = $("<h3>");
            h3.text("To Late! There's a Game in Progress. Try Again Later");
            $(".game-info").append(h3);
        }
        DisplayPlayerInfo(1, Snapshot.child("1").val());

        DisplayPlayerInfo(2, Snapshot.child("2").val());
    }

}, function (errorObject)
    {
        console.log("The read failed: " + errorObject.code);
    });






// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
var playerref = database.ref("/Players");
//console.log("check: " + playerref.child(1) + "Connec: " + connectionsRef)
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
        // database.ref("/Players").child(PlayerKey).onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap)
{

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#connected-viewers").text(snap.numChildren());

    PlayerKey = snap.key;
});

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //


