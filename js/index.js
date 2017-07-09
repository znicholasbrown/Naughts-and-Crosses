
  var game = game || {
    current_game: false,
    p1_score: 0,
    p2_score: 0,
    win_combos: [
      [1,2,3],
      [4,5,6],
      [7,8,9],
      [1,4,7],
      [2,5,8],
      [3,6,9],
      [1,5,9],
      [3,5,7]
    ],
    variables: function() {
      this.win_status = null;
      this.no_moves = 0;
      this.board_moves = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
      };
    },
    gameStart: function() {
      game.visuals.showGameType();
      game.variables();
      $('.game_type').click(function() {
        game.computerPlayer = game.functions.gameType(this.id);
        game.visuals.hideGameType();
        game.visuals.showTokenChoice();
        $('.tokens').click(game.functions.firstGame);
      });

      $('.reset').on("click", game.functions.gameReset);
    }

  };

  game.visuals = {
    showGameType: function(){
      $('.game_type').show();
      $('.messages').show();
      $('.game_type').stop().animate({opacity:'1'}, 1000);
    },
    hideGameType: function(){
      $('.game_type').stop().animate({opacity:'0'}, 1000);
      $('.game_type').hide();
      $('.messages').hide();
    },
    showTokenChoice: function(){
      $('.tokens').show();
      $('.messages').show();
      $('.tokens').stop().animate({opacity:'1'}, 1000);
    },
    hideTokenChoice: function(){
      $('.tokens').stop().animate({opacity:'0'}, 1000);
      $('.tokens').hide();
      $('.messages').hide();
    },
    showGameBoard: function () {
      $('.lines').removeClass('horizontal_animation_hide');
      $('.lines').addClass('horizontal_animation_reveal');
    },
    hideGameBoard: function () {
      $('.lines').addClass('horizontal_animation_hide');
      $('.lines').removeClass('horizontal_animation_reveal');
    },
    showPlayerScores: function () {
      $('#score_title').text('Score');
      $('.score1').text('Player 1: ' + game.p1_score);
      $('.score2').text('Player 2: ' + game.p2_score);
      $('.score1').show();
      $('.score2').show();
    },
    updatePlayerScores: function () {
      $('#score_title').text('Score');
      $('.score1').text('Player 1: ' + game.p1_score);
      $('.score2').text('Player 2: ' + game.p2_score);
    },
    hidePlayerScores: function () {
      $('#score_title').hide();
      $('.score1').hide();
      $('.score2').hide();
    },
    showWinMessagePVE: function() {
      $('.game_winner').text("Congratulations, you've won!");
      $('.game_winner').show();
      $('.messages').show();
    },
    showLossMessagePVE: function() {
      $('.game_winner').text("Sorry, you've lost.");
      $('.game_winner').show();
      $('.messages').show();
    },
    showWinMessagePVP: function() {
      $('.game_winner').text("Player " + game.turn + " wins!");
      $('.game_winner').show();
      $('.messages').show();
    },
    showDrawMessage: function() {
      $('.game_winner').text("Draw.");
      $('.game_winner').show();
      $('.messages').show();
    },
    hideWinMessage: function() {
      $('.game_winner').hide();
      $('.messages').hide();
    },
    showWinCombo(arr) {
      for (i = 0; i < arr.length; i ++) {
        $("#" + arr[i]).children().addClass('winner');
      }
    },
    boardClear: function () {
      for (i = 1; i < 10; i++) {
        $('#' + i).children().removeClass('X O winner');
      };

    },
    showNextGame: function () {
      $('#next_game').show();
      $('#next_game').stop().animate({opacity:'1'}, 1000);
    },
    hideNextGame: function () {
      $('#next_game').stop().animate({opacity:'0'}, 1000);
      $('#next_game').hide();
    },
    showPlayerTurn: function () {
      $('#player_turn').text('Player ' + game.turn + "'s turn")
      $('#player_turn').stop().animate({opacity:'1'}, 1000);
    },
    hidePlayerTurn: function () {
      $('#player_turn').stop().animate({opacity:'0'}, 1000);
    }
  }

  game.functions = {
    gameType: function (choice) {
      if (choice == 'two_players') {
        return false;
      } else return true;

    },
    firstGame: function () {
      game.p1token = $(this).text();
      game.p2token = game.p1token == 'X' ? 'O' : 'X';
      game.turn = 1;
      game.visuals.hideTokenChoice();
      game.visuals.showGameBoard();
      game.visuals.showPlayerScores();
      setTimeout(function() {
        game.functions.play();
      }, 1250);
    },
    play: function () {
      game.current_game = true;
      game.visuals.showPlayerTurn();
      if(game.turn === 2 && game.computerPlayer) {
        setTimeout(function() {
          game.functions.computerMoves();}, 1000);
      } else {
        $('.spaces').on("click", function() {
          game.functions.playerMoves(this.id)});
      }
    },
    playerMoves: function (space) {
      var token = game.turn === 1 ? game.p1token : game.p2token;
      if (game.board_moves[space] == '' && game.current_game) {
        game.functions.boardFill(space, token);
        game.functions.endTurn(token);
      }
    },
    computerMoves: function () {
      var token = game.p2token,
          token2 = token == 'X' ? 'O' : 'X';
      var space = game.computer.decide(token, token2);
      game.functions.boardFill(space, token);
      game.functions.endTurn(token);

    },
    boardFill: function (space, token) {
      game.board_moves[space] = token;
      $('#' + space).children().addClass(token);
    },
    endTurn: function (token) {
      game.visuals.hidePlayerTurn();
      game.no_moves += 1;
      var [win_status, winning_combo] = game.functions.winCheck(token);
      if (win_status == "We have a winner!") {
        if (game.turn === 2 && game.computerPlayer) {
          game.visuals.showLossMessagePVE();
          game.p2_score += 1;
        } else if (game.turn === 1 && game.computerPlayer) {
          game.visuals.showWinMessagePVE();
          game.p1_score += 1;
        } else if (game.turn === 2 && !game.computerPlayer) {
          game.visuals.showWinMessagePVP();
          game.p2_score += 1;
        } else if (game.turn === 1 && !game.computerPlayer) {
          game.visuals.showWinMessagePVP();
          game.p1_score += 1;
        }
        game.visuals.showWinCombo(winning_combo);
        game.visuals.showNextGame();
        game.visuals.updatePlayerScores();
        game.current_game = false;
        $('#next_game').on('click', game.functions.nextGame);
      } else if (win_status == "Draw") {
        game.visuals.showDrawMessage();
        game.visuals.showNextGame();
        game.current_game = false;
        $('#next_game').on('click', game.functions.nextGame);
      } else {
        game.turn = game.turn === 1 ? 2 : 1;
        game.functions.play();
      };
    },
    winCheck: function (token) {
      var winning_combo = [];
      for (i = 0; i < game.win_combos.length; i++) {
        for (j = 0; j < 3; j++) {
          if (game.board_moves[game.win_combos[i][0]] == token && game.board_moves[game.win_combos[i][1]] == token && game.board_moves[game.win_combos[i][2]] == token) {
            winning_combo.push(game.win_combos[i][0]);
            winning_combo.push(game.win_combos[i][1]);
            winning_combo.push(game.win_combos[i][2]);
            game.win_status = "We have a winner!";
          };
        };
      };

      if (game.no_moves >= 9 && game.win_status !== "We have a winner!") {
        game.win_status = "Draw";
      };
      return [game.win_status, winning_combo]
    },
    gameReset: function () {
      game.visuals.boardClear();
      game.visuals.hideWinMessage();
      game.visuals.hideNextGame();
      game.visuals.hidePlayerTurn();
      game.visuals.hidePlayerScores();
      game.p1token = null;
      game.p2token = null;
      game.p1_score = 0;
      game.p2_score = 0;
      game.current_game = false;
      game.visuals.hideGameBoard();
      game.variables();
      game.gameStart();
    },
    nextGame: function () {
      game.visuals.boardClear();
      game.visuals.hideNextGame();
      game.visuals.hideWinMessage();
      game.variables();
      game.visuals.showPlayerScores();
      game.visuals.hidePlayerTurn();
      game.functions.play();
    }

  }

  game.computer = {
    decide: function (token, token2) {
      if (game.no_moves === 0 || game.no_moves === 1 && game.board_moves[5] == token2) {
        return 1;
      } else if (game.no_moves === 1 && game.board_moves[5] == ''){
        return 5;
      } else {
        return game.computer.canWin(token, token2);
      }


    },
    canWin: function (token, token2) {
      for (i = 0; i < game.win_combos.length; i++) {
        if (game.board_moves[game.win_combos[i][0]] == token && game.board_moves[game.win_combos[i][1]] == token && game.board_moves[game.win_combos[i][2]] == "") {
          return game.win_combos[i][2];
        } else if (game.board_moves[game.win_combos[i][1]] == token && game.board_moves[game.win_combos[i][2]] == token && game.board_moves[game.win_combos[i][0]] == "") {
          return game.win_combos[i][0];
        } else if (game.board_moves[game.win_combos[i][0]] == token && game.board_moves[game.win_combos[i][2]] == token && game.board_moves[game.win_combos[i][1]] == "") {
          return game.win_combos[i][1];
        }
      }
      return game.computer.canBlock(token, token2);
    },
    canBlock: function (token, token2) {
      for (i = 0; i < game.win_combos.length; i++) {
        if (game.board_moves[game.win_combos[i][0]] == token2 && game.board_moves[game.win_combos[i][1]] == token2 && game.board_moves[game.win_combos[i][2]] == "") {
          return game.win_combos[i][2];
        } else if (game.board_moves[game.win_combos[i][1]] == token2 && game.board_moves[game.win_combos[i][2]] == token2 && game.board_moves[game.win_combos[i][0]] == "") {
          return game.win_combos[i][0];
        } else if (game.board_moves[game.win_combos[i][0]] == token2 && game.board_moves[game.win_combos[i][2]] == token2 && game.board_moves[game.win_combos[i][1]] == "") {
          return game.win_combos[i][1];
        }
      }
      return game.computer.canFork(token, token2);
    },
    canFork: function (token, token2) {
      if (game.board_moves[1] == token && game.board_moves[9] == token && game.board_moves[3] == '') {
        return 3;
      } else if (game.board_moves[1] == token && game.board_moves[9] == token && game.board_moves[7] == '') {
        return 7
      } else if (game.board_moves[3] == token && game.board_moves[7] == token && game.board_moves[1] == '') {
        return 1;
      } else if (game.board_moves[3] == token && game.board_moves[7] == token && game.board_moves[9] == '') {
        return 9;
      } else if (((game.board_moves[1] == token && game.board_moves[2] == token) || (game.board_moves[1] == token && game.board_moves[4] == token) || (game.board_moves[3] == token && game.board_moves[2] == token) || (game.board_moves[3] == token && game.board_moves[6] == token) || (game.board_moves[7] == token && game.board_moves[4] == token) || (game.board_moves[7] == token && game.board_moves[8] == token) || (game.board_moves[9] == token && game.board_moves[6] == token) || (game.board_moves[9] == token && game.board_moves[8] == token)) && game.board_moves[5] == '') {
        return 5;
      }
      return game.computer.canBlockFork(token, token2);
    },
    canBlockFork: function (token, token2) {
      if (game.board_moves[1] == token2 && game.board_moves[9] == token2 && game.board_moves[3] == '') {
        return 3;
      } else if (game.board_moves[1] == token2 && game.board_moves[9] == token2 && game.board_moves[7] == '') {
        return 7
      } else if (game.board_moves[3] == token2 && game.board_moves[7] == token2 && game.board_moves[1] == '') {
        return 1;
      } else if (game.board_moves[3] == token2 && game.board_moves[7] == token2 && game.board_moves[9] == '') {
        return 9;
      } else if (((game.board_moves[1] == token2 && game.board_moves[2] == token2) || (game.board_moves[1] == token2 && game.board_moves[4] == token2) || (game.board_moves[3] == token2 && game.board_moves[2] == token2) || (game.board_moves[3] == token2 && game.board_moves[6] == token2) || (game.board_moves[7] == token2 && game.board_moves[4] == token2) || (game.board_moves[7] == token2 && game.board_moves[8] == token2) || (game.board_moves[9] == token2 && game.board_moves[6] == token2) || (game.board_moves[9] == token2 && game.board_moves[8] == token2)) && game.board_moves[5] == '') {
        return 5;
      }
      return game.computer.canCenter(token, token2);
    },
    canCenter: function (token, token2) {
      if (game.board_moves[5] == '') {
        return 5;
      }
      return game.computer.oppositeCorner(token, token2);
    },
    oppositeCorner: function (token, token2) {
      if ((game.board_moves[1] == token2 || game.board_moves[9] == token2) && game.board_moves[3] == '') {
        return 3;
      } else if ((game.board_moves[1] == token2 || game.board_moves[9] == token2) && game.board_moves[7] == '') {
        return 7
      } else if ((game.board_moves[3] == token2 || game.board_moves[7] == token2) && game.board_moves[9] == '') {
        return 9;
      } else if ((game.board_moves[3] == token2 || game.board_moves[7] == token2) && game.board_moves[1] == '') {
        return 1;
      }
      return game.computer.emptyCorner(token, token2);
    },
    emptyCorner: function (token, token2) {
      var corners = [1,3,7,9];
      for (i = 0; i < 3; i++) {
        if (game.board_moves[corners[i]] == '') {
          return corners[i];
        }
      }
      return game.computer.emptySide(token, token2);
    },
    emptySide: function (token, token2) {
      var sides = [2,4,6,8];
      for (i = 0; i < 3; i++) {
        if (game.board_moves[sides[i]] == '') {
          return sides[i];
        }
      }
    }

  }


  $(document).ready(function() {
    game.gameStart();
  })