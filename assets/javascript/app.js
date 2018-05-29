
var PlayerNumber = 0;
var PlayerKey;
var Player;
var RoundOver = false;
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
    //THis function executes once for the initial Player add on the Start Button on Click
    database.ref("/Players").once("value", function (childSnapshot)
    {
        var JName;
        var Jscore;
        var numchild = childSnapshot.numChildren();
        var name = Player.name;
        var wins = Player.wins;
        var loses = Player.loses;

        if (numchild == 0)//Check if any Players exists in the DB
        {
            PlayerNumber = 1;

            $(".game-info").empty();
            var h3 = $("<h3>");
            h3.text("Hi " + name + "! You are Player " + PlayerNumber);
            $(".game-info").append(h3);

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
            $(".game-info").empty();
            var h3 = $("<h3>");
            h3.text("Hi " + name + "! You are Player " + PlayerNumber);
            $(".game-info").append(h3);
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

        var h4Name = $("<h3>");
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
            $(".player1-r").empty();
            $(".player1-p").empty();
            $(".player1-s").empty();
            $(".wait2").empty();
            $(".yourturn").empty();
            $(".yourturn").empty();
            $(".result").empty();

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
            $(".player2-r").empty();
            $(".player2-p").empty();
            $(".player2-s").empty();
            $(".wait1").empty();
            $(".yourturn").empty();
            $(".result").empty();

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

        DisplayPlayerInfo(1, Snapshot.child("1").val());
        DisplayPlayerInfo(2, Snapshot.child("2").val());

        console.log("Ready to start Playing");
        if (PlayerNumber != 1 && PlayerNumber != 2)
        {
            $(".game-info").empty();
            var h3 = $("<h3>");
            h3.text("To Late! There's a Game in Progress. Try Again Later");
            $(".game-info").append(h3);
        }
        console.log(RoundOver);
        if (RoundOver)
        {
            setTimeout(function ()
            {
                $(".wait2").remove();
                $(".wait1").remove();
                $(".player1-r").empty();
                $(".player1-p").empty();
                $(".player1-s").empty();
                $(".player2-r").empty();
                $(".player2-p").empty();
                $(".player2-s").empty();
                $(".result").empty();
                RoundOver = false;
                PlayGame(Snapshot);
            }, 5000)


        } else
        {
            PlayGame(Snapshot);
        }
    }

}, function (errorObject)
    {
        console.log("The read failed: " + errorObject.code);
    });
//Execute game function
var PlayGame = function (Snapshot)
{
    var Player1Choice = Snapshot.child("1").child("choice").val()
    var Player2Choice = Snapshot.child("2").child("choice").val()
    console.log("p1 chance - " + Player1Choice);
    console.log(Player2Choice);

    if (Player1Choice == "")
    {
      
        if (PlayerNumber == 1)
        {
            if ($(".yourturn").length)
            {
                $(".yourturn").remove();
            }
            //NOT Drawing for some reason
            var h3 = $("<h3>");
            h3.text("It's Your Turn!");
            h3.attr("class", "yourturn");
            $(".game-info").append(h3);
            console.log(h3)
            addRPS(1);
        }
        else
        {
            console.log("IN th else not printing")

            var h3turn = $("<h3>");
            h3turn.attr("class", "wait1");
            h3turn.html("Waiting For Player 1");
            console.log(h3turn)
            $(".game-info").append(h3turn);
        }
    }
    else if (Player1Choice != "" && Player2Choice == "")
    {
        if (PlayerNumber == 2)
        {
            if ($(".yourturn").length)
            {
                $(".yourturn").remove();
            }

            $("wait1").remove();
            //NOT Drawing for some reason
            var h3 = $("<h3>");
            h3.attr("class", "yourturn");
            h3.text("It's Your Turn!");
            $(".game-info").append(h3);
            console.log(h3)
            addRPS(2);
        }
        else
        {
            var h3turn = $("<h3>");
            h3turn.attr("class", "wait2");
            h3turn.html("Waiting For Player 2");
            $(".game-info").append(h3turn);
        }

    }
    else if (Player1Choice != "" && Player2Choice != "")
    {

        $(".wait2").remove();

        Player1Obj = Snapshot.child("1").val();
        Player2Obj = Snapshot.child("2").val()

        // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
        if ((Player1Choice === "Rock") || (Player1Choice === "Paper") || (Player1Choice === "Scissors"))
        {
            if ((Player1Choice === "Rock") && (Player2Choice === "Scissors"))
            {
                Player1Win(Player1Obj, Player2Obj);
            } else if ((Player1Choice === "Rock") && (Player2Choice === "Paper"))
            {
                Player2Win(Player1Obj, Player2Obj);
            } else if ((Player1Choice === "Scissors") && (Player2Choice === "Rock"))
            {
                Player2Win(Player1Obj, Player2Obj);
            } else if ((Player1Choice === "Scissors") && (Player2Choice === "Paper"))
            {
                Player1Win(Player1Obj, Player2Obj);
            } else if ((Player1Choice === "Paper") && (Player2Choice === "Rock"))
            {
                Player1Win(Player1Obj, Player2Obj);
            } else if ((Player1Choice === "Paper") && (Player2Choice === "Scissors"))
            {
                Player2Win(Player1Obj, Player2Obj);
            } else if (Player1Choice === Player2Choice)
            {
                TieGame(Player1Obj, Player2Obj);
            }
        }

        //game logic make new func maybe
        /*  game logic from old rps game
        Clear controls
        declare winner
        update winlose via set functions
        clear winner field */

    }
}

//Get Value of choice that was clicked
$(document).on("click", ".rps", function ()
{
    var Playerchoice = $(this).text();

    if (PlayerNumber == 1)
    {
        database.ref("/Players").child("1").update({
            choice: Playerchoice
        });
        $(".player1-r").empty();
        $(".player1-p").empty();
        $(".player1-s").empty();

        $(".yourturn").remove();

        var h1Choice = $("<h1>");
        h1Choice.text(Playerchoice);
        $(".player1-r").append(h1Choice);
    }
    else if (PlayerNumber == 2)
    {
        database.ref("/Players").child("2").update({
            choice: Playerchoice
        });
        $(".player2-r").empty();
        $(".player2-p").empty();
        $(".player2-s").empty();

        var h1Choice = $("<h1>");
        h1Choice.text(Playerchoice);
        $(".player2-r").append(h1Choice);
        $(".yourturn").remove();
    }
});

var Player1Win = function (Player1Obj, Player2Obj)
{
    RoundOver = true;
    win = parseInt(Player1Obj.wins) + 1;
    lose = parseInt(Player2Obj.loses) + 1;

    var h1Result = $("<h1>");
    h1Result.text(Player1Obj.name + " Wins");
    $(".result").append(h1Result);

    PopulateOpponent(Player1Obj.choice, Player2Obj.choice);

    database.ref("/Players").child("1").update({
        choice: "",
        wins: win
    });

    database.ref("/Players").child("2").update({
        choice: "",
        loses: lose
    });

}

var Player2Win = function (Player1Obj, Player2Obj)
{
    RoundOver = true;
    win = parseInt(Player2Obj.wins) + 1;
    lose = parseInt(Player1Obj.loses) + 1;

    var h1Result = $("<h1>");
    h1Result.text(Player2Obj.name + " Wins");
    $(".result").append(h1Result);

    PopulateOpponent(Player1Obj.choice, Player2Obj.choice);

    database.ref("/Players").child("1").update({
        choice: "",
        wins: win
    });

    database.ref("/Players").child("2").update({
        choice: "",
        loses: lose
    });

}

var TieGame = function (Player1Obj, Player2Obj)
{
    RoundOver = true;
    var h1Result = $("<h1>");
    h1Result.text("Tie Game");
    $(".result").append(h1Result);

    PopulateOpponent(Player1Obj.choice, Player2Obj.choice);

    database.ref("/Players").child("1").update({
        choice: ""
    });

    database.ref("/Players").child("2").update({
        choice: ""
    });
}



database.ref("/Players").child(1).child("choice").on("value", function (Snapshot)
{
    console.log("Spefific child value change child1 child choice")
}, function (errorObject)
    {
        console.log("The read failed: " + errorObject.code);
    });

var addRPS = function (PlayerRef)
{
    var Jr;
    var Jp;
    var Js;
    if (PlayerRef == 1)
    {
        Jr = $(".player1-r");
        Jp = $(".player1-p");
        Js = $(".player1-s");

        Jr.empty();
        var h3r = $("<h4>");
        h3r.attr("class", "rps");
        h3r.text("Rock");
        Jr.append(h3r);

        Jp.empty();
        var h3p = $("<h4>");
        h3p.attr("class", "rps");
        h3p.text("Paper");
        Jp.append(h3p);

        Js.empty();
        var h3s = $("<h4>");
        h3s.attr("class", "rps");
        h3s.text("Scissors");
        Js.append(h3s);
    }
    else if (PlayerRef == 2)
    {
        Jr = $(".player2-r");
        Jp = $(".player2-p");
        Js = $(".player2-s");

        Jr.empty();
        var h3r = $("<h4>");
        h3r.attr("class", "rps");
        h3r.text("Rock");
        Jr.append(h3r);

        Jp.empty();
        var h3p = $("<h4>");
        h3p.attr("class", "rps");
        h3p.text("Paper");
        Jp.append(h3p);

        Js.empty();
        var h3s = $("<h4>");
        h3s.attr("class", "rps");
        h3s.text("Scissors");
        Js.append(h3s);
    }
}
var PopulateOpponent = function (choice1, choice2)
{
    if (PlayerNumber != 1)
    {
        $(".player1-r").empty();
        $(".player1-p").empty();
        $(".player1-s").empty();

        $(".yourturn").remove();

        var h1Choice = $("<h1>");
        h1Choice.text(choice1);
        $(".player1-r").append(h1Choice);
    }
    else if (PlayerNumber != 2)
    {
        $(".player2-r").empty();
        $(".player2-p").empty();
        $(".player2-s").empty();

        $(".yourturn").remove();

        var h1Choice = $("<h1>");
        h1Choice.text(choice2);
        $(".player2-r").append(h1Choice);

    }
}

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

