//-----------------------------------------------------------------
// Constants and Globals
//-----------------------------------------------------------------


//-----------------------------------------------------------------
// Helper Functions
//-----------------------------------------------------------------

function randomPair(collection) {
  var result = [];
  var arr = jQuery.extend(true, [], collection);
  arr = _.shuffle(arr);
  result.push(arr.pop());
  result.push(arr.pop());
  return result;
}

function resetTwoCards(cardOneID, cardTwoID) {
  $("#" + cardOneID).css("background", "black");
  $("#" + cardTwoID).css("background", "black");
}

//-----------------------------------------------------------------
// Game Object
//-----------------------------------------------------------------

var game = {
  NUM_CARDS: 20,
  CARD_OPTIONS: ['rock', 'paper', 'scissors', 'lizard', 'spock'],
  cards: [],
  cardOne: '',
  cardOneClicked: false,

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

  genCardClickListener: function(cardID) {
    $('#' + cardID).click(function() {
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
          },800);
        }
        game.cardOneClicked = false;
        game.cardOne = '';
      }
    });
  }
}

game.generateDeck();
console.log(game.cards);

$(document).ready(function() {
  for (var i = 0; i < game.cards.length; i++) {
    var boxContents = game.cards[i];
    var appendText = '<div class="card-box" id="box-' + i + '">' + boxContents + "</div>";
    $('#card-container').append(appendText);
    game.genCardClickListener("box-" + i);
  }
});

