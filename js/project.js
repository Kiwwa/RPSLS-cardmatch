//-----------------------------------------------------------------
// Constants and Globals
//-----------------------------------------------------------------

var fireBaseDB = new Firebase('https://burning-fire-8027.firebaseio.com/');

//-----------------------------------------------------------------
// Helper Functions
//-----------------------------------------------------------------

function genericOnClick(id, callback) {
  $("#" + id).on('click', callback);
}

function fireBaseValue(DB, path, callback) {
  var ref = DB.child(path);
  var result = ref.on('value', callback);
  ref.off();
  return result;
}

function randomPair(collection) {
  var result = [];
  var arr = jQuery.extend(true, [], collection);
  arr = _.shuffle(arr);
  result.push(arr.pop());
  result.push(arr.pop());
  return result;
}

function makeid(len) {
  var result = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for( var i=0; i < len; i++ )
      result += possible.charAt(Math.floor(Math.random() * possible.length));
  return result;
}

function flipCard(id) {
  $(this).css("background", "transparent");
}

//-----------------------------------------------------------------
// Game Object
//-----------------------------------------------------------------

var game = {
  NUM_CARDS: 40,
  CARD_OPTIONS: ['rock', 'paper', 'scissors', 'lizard', 'spock'],
  PLAYER_COLORS: ["Black", "Navy", "DarkBlue", "MediumBlue", "Blue",
    "DarkGreen", "Green", "Teal", "DarkCyan", "DeepSkyBlue",
    "DarkTurquoise", "MediumSpringGreen", "Lime", "SpringGreen",
    "Aqua", "Cyan", "MidnightBlue", "DodgerBlue",
    "LightSeaGreen", "ForestGreen", "SeaGreen",
    "DarkSlateGray", "LimeGreen", "MediumSeaGreen",
    "Turquoise", "RoyalBlue", "SteelBlue", "DarkSlateBlue",
    "MediumTurquoise", "Indigo", "DarkOliveGreen",
    "CadetBlue", "CornflowerBlue", "RebeccaPurple",
    "MediumAquaMarine", "DimGray", "SlateBlue", "OliveDrab",
    "SlateGray", "LightSlateGray", "MediumSlateBlue",
    "LawnGreen", "Chartreuse", "Aquamarine", "Maroon",
    "Purple", "Olive", "Gray", "SkyBlue", "LightSkyBlue",
    "BlueViolet", "DarkRed", "DarkMagenta", "SaddleBrown",
    "DarkSeaGreen", "LightGreen", "MediumPurple", "DarkViolet",
    "PaleGreen", "DarkOrchid", "YellowGreen", "Sienna",
    "Brown", "DarkGray", "LightBlue", "GreenYellow",
    "PaleTurquoise", "LightSteelBlue", "PowderBlue",
    "FireBrick", "DarkGoldenRod", "MediumOrchid", "RosyBrown",
    "DarkKhaki", "Silver", "MediumVioletRed", "IndianRed",
    "Peru", "Chocolate", "Tan", "LightGray", "Thistle",
    "Orchid", "GoldenRod", "PaleVioletRed", "Crimson",
    "Gainsboro", "Plum", "BurlyWood", "LightCyan",
    "Lavender", "DarkSalmon", "Violet", "PaleGoldenRod",
    "LightCoral", "Khaki", "AliceBlue", "HoneyDew",
    "Azure", "SandyBrown", "Wheat", "Beige", "WhiteSmoke",
    "MintCream", "GhostWhite", "Salmon", "AntiqueWhite",
    "Linen", "LightGoldenRodYellow", "OldLace", "Red",
    "Fuchsia", "Magenta", "DeepPink", "OrangeRed", "Tomato",
    "HotPink", "Coral", "DarkOrange", "LightSalmon",
    "Orange", "LightPink", "Pink", "Gold", "PeachPuff",
    "NavajoWhite", "Moccasin", "Bisque", "MistyRose",
    "BlanchedAlmond", "PapayaWhip", "LavenderBlush",
    "SeaShell", "Cornsilk", "LemonChiffon", "FloralWhite",
    "Snow", "Yellow", "LightYellow", "Ivory", "White"],
  PLAYER_ANIMALS: ['dog', 'cat', 'elephant', 'ardvark', 'horse', 'alligator',
    "ant", "bird"],
  cards: [],
  cardOne: '',
  cardOneClicked: false,
  multiplayerID: '',
  playerColor: '',
  playerAnimal: '',

  generateDeck: function() {
    for (var i = 0; i < Math.floor(this.NUM_CARDS) / 2; i++) {
      this.cards = this.cards.concat(randomPair(this.CARD_OPTIONS));
    }
  },

  rpslsWinner: function(playerOne, playerTwo) {

    // all logic determined from playerOne POV
    if (playerOne === playerTwo) { return "draw"; }

    switch (playerOne) {
      case "rock":
        if (_.contains(["paper", "spock"], playerTwo)) { return "lose"; }
        else if (_.contains(["scissors", "lizard"], playerTwo)) { return "win"; }
        else { return "error" }
      break;
      case "paper":
        if (_.contains(["scissors", "lizard"], playerTwo)) { return "lose"; }
        else if (_.contains(["rock", "spock"], playerTwo)) { return "win"; }
        else { return "error" }
        break;
      case "scissors":
        if (_.contains(["rock", "spock"], playerTwo)) { return "lose"; }
        else if (_.contains(["paper", "lizard"], playerTwo)) { return "win"; }
        else { return "error" }
        break;
      case "lizard":
        if (_.contains(["rock", "scissors"], playerTwo)) { return "lose"; }
        else if (_.contains(["paper", "spock"], playerTwo)) { return "win"; }
        else { return "error" }
        break;
      case "spock":
        if (_.contains(["paper", "lizard"], playerTwo)) { return "lose"; }
        else if (_.contains(["rock", "scissors"], playerTwo)) { return "win"; }
        else { return "error" }
        break;
    }
  },

  generateCardClickListener: function(cardID) {
    $('#' + cardID).click(function() {
      game.cardShow(this);
      var cardUpdateObj = {};
      cardUpdateObj[cardID] = game.playerColor;

      fireBaseDB.child( game.multiplayerID + "/flips" ).update(cardUpdateObj);
      $(this).css("background", "transparent");
      $(this).find("img").css("visibility", "visible");
      if (game.cardOneClicked === false) {
        game.cardOneClicked = true;
        game.cardOneID = $( this ).attr('id');
      } else if (game.cardOneClicked === true) {
        var $cardOne = $( "#" + game.cardOneID );
        var $cardTwo = $( this );

        // test cards against each other
        var flipResult = game.rpslsWinner($cardOne.find("img").attr("id"), $cardTwo.find("img").attr("id"));

        // if win:  unbind events so cards become unclickable
        // if lose: show both card values, then after timeout set back to black
        if (flipResult === "win") {

          // Update cards to go transparent if won on ANY machine
          var wonCardOne = {};
          wonCardOne[$cardOne.attr('id')] = game.playerColor;
          fireBaseDB.child( game.multiplayerID + "/won/" ).update(wonCardOne);

          var wonCardTwo = {};
          wonCardTwo[$cardTwo.attr('id')] = game.playerColor;
          fireBaseDB.child( game.multiplayerID + "/won/" ).update(wonCardTwo);
          $cardOne.unbind('click');
          $cardTwo.unbind('click');
        } else {
          $(this).css("background", "transparent");
          setTimeout(function(){
            fireBaseDB.child(game.multiplayerID + "/flips/" + $cardOne.attr('id')).remove();
            fireBaseDB.child(game.multiplayerID + "/flips/" + $cardTwo.attr('id')).remove();
            $cardOne.css("background", "black");
            $cardOne.find("img").css("visibility", "hidden");
            $cardTwo.css("background", "black");
            $cardTwo.find("img").css("visibility", "hidden");
          },700);
        }
        game.cardOneClicked = false;
        game.cardOne = '';
      }
    });
  },

  displayCards: function() {
    $("#card-container").empty();

    var cardImages = {
      rock: "img/rock.png",
      paper: "img/paper.png",
      scissors: "img/scissors.png",
      lizard: "img/lizard.png",
      spock: "img/spock.png"
    }

    for (var i = 0; i < game.cards.length; i++) {
      var boxContents = game.cards[i];
      var appendText = '<div class="card-box" id="box-' + i + '"><img src=" ' + cardImages[game.cards[i]] + '" id="' + game.cards[i] + '"></div>';
      $('#card-container').append(appendText);
      game.generateCardClickListener("box-" + i);
    }
  },

  cardShow: function($card) {
    $($card).css("background", "transparent");
  },

  singleplayerInit: function() {
    $("#hover-1").hide();
    $("#hover-background").hide();
  },

  multiplayerJoinInit: function() {
    console.log("testing");
    $("#hover-2").hide();
    $("#hover-3").show();
    $('#submit-join-gameid').on('click', function() {
      game.multiplayerID = $("#join-game-textbox").val();
      $("#hover-3").hide();

      // sync the board for this local instance from the DB
      var ref = fireBaseDB.child(game.multiplayerID);
      ref.on('value', function(snapshot){
        setTimeout(function(){
          game.cards = snapshot.val().deck;
          game.displayCards();
        }, 400);
      });

      // MORE timeout code ensuring that we don't remove the link before
      // downloading the data to sync the board.
      //        TODO: This is a serious issue now.
      setTimeout(function(){
        ref.off();
      }, 500);

      // this is here to allow the Listener time to catch up to the
      // board update above; otherwise listeners fail to attach
      //   TODO: This is a bad solution.
      //   TODO: Actually, now that we don't allow clicks until AFTER
      //         the listeners are setup, I don't mind it so much...
      setTimeout(function(){
        game.multiplayerListeners();
        $("#hover-background").hide();
      },1200);
    });
  },

  multiplayerHostInit: function() {
    game.multiplayerID = makeid(5);
    var gameObject = {
      deck: game.cards,
    }

    // set the deck for others to sync with
    fireBaseDB.child(game.multiplayerID).update(gameObject);

    $("h1").text("RPSLS - GameID #" + game.multiplayerID);
    $("#hover-2").hide();
    $("#hover-background").hide();
    game.multiplayerListeners();
  },

  multiplayerListeners: function() {
    fireBaseDB.child(game.multiplayerID + "/flips").on("child_added", function(snapshot) {
      var targetDiv = "#" + snapshot.key();
      console.log("ADDING: ", targetDiv, snapshot.val());
      $("#" + snapshot.key()).css("border", '4px solid ' + snapshot.val());
    });

    fireBaseDB.child(game.multiplayerID + "/flips").on("child_removed", function(snapshot){
      var targetDiv = "#" + snapshot.key();
      console.log("REMOVE: ", targetDiv, snapshot.val());
      $("#" + snapshot.key()).css("border", '2px solid black');
    });


    fireBaseDB.child(game.multiplayerID + "/won").on("child_added", function(snapshot){
      var targetDiv = "#" + snapshot.key();
      console.log("CARDWON: ", targetDiv, snapshot.val());
      $("#" + snapshot.key()).css("background", snapshot.val());
      $("#" + snapshot.key()).css("border", '2px solid black');
      $("#" + snapshot.key()).find('img').css("visibility", "visible");
    });

  }
}

$(document).ready(function() {
  game.generateDeck();
  game.displayCards();
  game.playerColor = _.sample(game.PLAYER_COLORS);
  game.playerAnimal = _.sample(game.PLAYER_ANIMALS);

  // starting game menu-system
  genericOnClick('singleplayer', function() { game.singleplayerInit(); });
  genericOnClick('multiplayer', function() {
    $("#hover-1").hide();
    $("#hover-2").show();
  });
  genericOnClick('host-multi', function() { game.multiplayerHostInit(); });
  genericOnClick('join-multi', function() { game.multiplayerJoinInit(); });
});

