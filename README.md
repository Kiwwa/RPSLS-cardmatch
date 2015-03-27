Rock, Paper, Scissors, Lizard, Spock
====================================

The original [Rock Paper Scissors Lizard Spock](http://www.samkass.com/theories/RPSSL.html) (referred to henceforth as RPSLS) was designed as an extended version of the well known "Rock Paper Scissors" game by Sam Kass and Karen Bryla.

This implementation of RPSLS combines a card-flipping/memory-game mechanic with the core "one beats the other" of RPSLS. It is playable by any number of users, each given a unique colour to represent their correct plays.

Quickstart
----------

Single-Player:
Head to this link ([Example Game](http://kiwwa.github.io/RPSLS-cardmatch/)), choose singleplayer and start clicking squares!

Multi-Player:
Head to this link ([Example Game](http://kiwwa.github.io/RPSLS-cardmatch/)), choose multiplayer and either;
 * host-game (the gameID will be shown in the header) or
 * join-game (ask your friend for the gameID in their header)

Technologies
------------

Built using front-end stuffz (HTML and CSS) and powered by client-side Javascript, using FireBase for websockets transactions.

Todo
----

* Reponsive design (just make it work for an iPhone)
* Visual style de-uglying
* Cardflip animations
* Host "special powers"
* Draw link between pairs of flipped cards
* Refactor Javascript to not be terrible
* Refactor HTML and CSS to be less messy and be semantically accurate
* Add player profiles and scoring across some sort of "rounds"
* Add color+animal icons to represent user selections
*

Spec Built For
--------------

https://gist.github.com/epoch/fa926c32b366044093f8

