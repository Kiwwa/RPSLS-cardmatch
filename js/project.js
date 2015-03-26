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
  result = DB.child(path).on('value', callback);
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

function makeid(len)
{
  var result = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for( var i=0; i < len; i++ )
      result += possible.charAt(Math.floor(Math.random() * possible.length));
  return result;
}

//-----------------------------------------------------------------
// Game Object
//-----------------------------------------------------------------

var game = {
  NUM_CARDS: 24,
  CARD_OPTIONS: ['rock', 'paper', 'scissors', 'lizard', 'spock'],
  cards: [],
  cardOne: '',
  cardOneClicked: false,
  multiplayerID: '',

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
      $(this).css("background", "transparent");
      if (game.cardOneClicked === false) {
        game.cardOneClicked = true;
        game.cardOneID = $( this ).attr('id');
      } else if (game.cardOneClicked === true) {
        var $cardOne = $( "#" + game.cardOneID );
        var $cardTwo = $( this );

        // test cards against each other
        var flipResult = game.rpslsWinner($cardOne.text(), $cardTwo.text());
        console.log(flipResult);

        // if win:  unbind events so cards become unclickable
        // if lose: show both card values, then after timeout set back to black
        if (flipResult === "win") {
          $cardOne.unbind('click');
          $cardTwo.unbind('click');
        } else {
          $(this).css("background", "transparent");
          setTimeout(function(){
            $cardOne.css("background", "black");
            $cardTwo.css("background", "black");
          },700);
        }
        game.cardOneClicked = false;
        game.cardOne = '';
      }
    });
  },

  displayCards: function() {
    $("#card-container").empty();
    for (var i = 0; i < game.cards.length; i++) {
      var boxContents = game.cards[i];
      var appendText = '<div class="card-box" id="box-' + i + '">' + boxContents + "</div>";
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
    $("#hover-2").hide();
    $("#hover-3").show();
    $('#submit-join-gameid').on('click', function() {
      game.multiplayerID = $("#join-game-textbox").val();
      $("#hover-background").hide();
      $("#hover-3").hide();
      fireBaseValue(fireBaseDB, game.multiplayerID, function(snapshot){
        game.cards = snapshot.val().deck;
        game.displayCards();
      });
    });
  },

  multiplayerHostInit: function() {
    game.multiplayerID = makeid(5);
    var gameObject = {
      deck: game.cards,
      flips: game.cards,
    }
    fireBaseDB.child(game.multiplayerID).set(gameObject);

    $("h1").text("RPSLS - GameID #" + game.multiplayerID);
    $("#hover-2").hide();
    $("#hover-background").hide();
  }
}

$(document).ready(function() {
  game.generateDeck();
  game.displayCards();

  // starting game menu-system
  genericOnClick('singleplayer', function() { game.singleplayerInit(); });
  genericOnClick('multiplayer', function() {
    $("#hover-1").hide();
    $("#hover-2").show();
  });
  genericOnClick('host-multi', function() { game.multiplayerHostInit(); });
  genericOnClick('join-multi', function() { game.multiplayerJoinInit(); });
});

