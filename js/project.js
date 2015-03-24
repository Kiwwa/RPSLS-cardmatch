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

//-----------------------------------------------------------------
// Game Object
//-----------------------------------------------------------------

var game = {
  NUM_CARDS: 20,
  CARD_OPTIONS: ['rock', 'paper', 'scissors', 'lizard', 'spock'],
  cards: [],

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
      console.log("in here");
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
      else if (_.contains(["rock", "spock"], playerTwo)) { return "win"; }
      else { return "error" }
      break;
    }
  }
}

game.generateDeck();
console.log(game.cards);

$(document).ready(function(){
  for (var i = 0; i < game.cards.length; i++) {
    var boxContents = game.cards[i];
    var appendText = '<div class="card-box" id="box-' + i + '">' + boxContents + "</div>";
    $('#card-container').append(appendText);
  }
});

