'use strict';

/**
 * game.js: Main game module 
 * 
 */

import Skier from './skier.js';
import GameObject from './gameobject.js';
import ObstacleHandler from './obstaclehandler.js';
import Rhino from './rhino.js';

$(document).ready(function () {

    // Score variables and load high score if in browser local storage
    var score = 0;
    const SCORE_INCREMENT = 1;
    const BONUS_SCORE_INCREMENT = 10;
    var highScore = 0;
    loadHighScore();

    // Ski counter
    var skiCounter = 0;

    // Randomize when rhino eats 
    const RHINO_COUNT = _.random(500,1000);

    // Game and canvas variables
    const HEADER_HEIGHT = 70;
    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight - HEADER_HEIGHT;
    var canvas = $('<canvas></canvas>')
        .attr('width', gameWidth * window.devicePixelRatio)
        .attr('height', gameHeight * window.devicePixelRatio)
        .css({
            width: gameWidth + 'px',
            height: gameHeight + 'px'
        });
    $('body').append(canvas);
    var ctx = canvas[0].getContext('2d');
    var pauseDialog;
    createPauseDialog();
    var paused = false;

    // Game Object variables
    var mainSkier = new Skier();
    var obstacleHandler = new ObstacleHandler(mainSkier, gameWidth, gameHeight);
    var rhino = new Rhino(gameWidth, gameHeight);

    /**
    * drawScore(): Draws the current score on the last 1/6th of the canvas
    * 
    */
    function drawScore() {
        ctx.font = "16px Jua";
        ctx.fillStyle = "blue";
        ctx.fillText("Score: " + score, canvas[0].width - (canvas[0].width / 6), 20);
    }

    var clearCanvas = function () {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };


    /**
    * calculateScore(): Update score as skier is moving or jumping
    * 
    */ 
    function calculateScore() {

        // Only change score if skier is pointed down hill or 
        // bonus score while jumping
        if (mainSkier.isJumping()) {
            score += BONUS_SCORE_INCREMENT;
        }
        else if (mainSkier.isMoving()) {
            score += SCORE_INCREMENT;
        }
    }

    /**
    * loadHighScore(): Load high score from browser local score and place in 
    * high score element
    * 
    */ 
    function loadHighScore() {
        var highScoreStr = window.localStorage.getItem("highScore");

        if (highScoreStr) {
            highScore = parseInt(highScoreStr);
            $("#highScore").text("" + highScore);
        }
    }

    /**
    * saveHighScore(): Save high score in browser local storage if current score
    * is greater than the high score and update high score element  
    * 
    */ 
    function saveHighScore() {
        if (score > highScore) {
            highScore = score;
            window.localStorage.setItem("highScore", highScore + "");
            $("#highScore").text("" + highScore);
        }
    }

    /**
    * createPauseDialog(): Create JConfirm pause dialog. Must call multiple times
    * since resources are released when close() is called.
    * 
    */ 
    function createPauseDialog() {
        pauseDialog = $.confirm({
            lazyOpen: true,
            title: 'Paused!',
            content: '',
            boxWidth: '200px',
            useBootstrap: false,
            buttons: {
                "Continue": function () {
                    togglePause();
                }
            }
        });
    }

    /**
    * togglePause(): Pauses game if able
    * 
    */
    function togglePause() {

        // Cant pause while jumping or if rhino is eating or crashed
        if (mainSkier.getDirection() !== Skier.DIRECTION.CRASHED &&
                 mainSkier.isJumping() === false && rhino.isRhinoEating() === false) {
            paused = !paused;

            if (!paused) {
                // Continue
                pauseDialog.close();
                createPauseDialog();
                requestAnimationFrame(gameLoop);
            }
            else {
                // Pause
                pauseDialog.open();
            }
        }
    }

    /**
    * reset(): Reset original game state and seset game objects to start over 
    * 
    */
    function reset() {
        score = 0;
        obstacleHandler.reset();
        mainSkier.reset();
        rhino.reset();
        clearCanvas();
        obstacleHandler.placeInitialObstacles();
        requestAnimationFrame(gameLoop);
    }

    /**
    * checkGameOver(): If the skier is crashed or the rhino has eaten then its 
    * game over. Save the high score, show the game over dialog and reset if play
    * again button is pressed 
    * 
    */
    function checkGameOver() {

        var contentMessage;

        if (mainSkier.getDirection() === Skier.DIRECTION.CRASHED) {
            contentMessage = 'YARD SALE!!!!!';
        }
        else if (rhino.rhinoMode === Rhino.RHINO_MODE.HAS_EATEN)
        {
            contentMessage = 'YOU HAVE BEEN EATEN BY THE HUNGRY RHINO!!!!';
        }

        if (contentMessage)
        {
            saveHighScore();
            $.confirm({
                title: 'GAME OVER!',
                content: contentMessage,
                boxWidth: '200px',
                useBootstrap: false,
                buttons: {
                    "Play Again": function () {
                        // Reset
                        reset();
                    }
                }
            });
        }
    }

    /**
    * calculateSkiCounter(): Update ski counter which tracks how long the skier has been 
    * skiing or reset if you jump or stop and rhino is not active 
    * 
    */
    function calculateSkiCounter() {
        if (mainSkier.isMoving()) {
            skiCounter++;
        }
        else if (rhino.isRhinoActive() === false){
            skiCounter = 0;
        }
    }

    /**
    * checkDrawRhino(): Check if the rhino should start to run. If its running then check
    * if it should eat. 
    * 
    * @param {object} ctx - canvas context to draw on 
    * 
    */
    function checkDrawRhino(ctx) {

        // Skier count activates rhino 
        if (skiCounter > RHINO_COUNT) {

            // Only eat animate once if rhino reaches skier and hasnt eaten 
            if (rhino.x <= gameWidth / 2 && rhino.rhinoMode !== Rhino.RHINO_MODE.EAT &&
                rhino.rhinoMode !== Rhino.RHINO_MODE.HAS_EATEN) {
                rhino.rhinoEat();
            }
            else if (rhino.rhinoMode === Rhino.RHINO_MODE.SLEEP || 
                rhino.rhinoMode === Rhino.RHINO_MODE.RUN) {

                // Only move if rhino was sleeping or is running    
                rhino.move();

                // Only animate once if rhino hasnt run
                if (rhino.rhinoMode !== Rhino.RHINO_MODE.RUN) {
                    rhino.rhinoRun();
                }
            }

            rhino.draw(ctx);
        }
    }

    /**
    * gameLoop(): Main game loop. Move and draw game objects
    *
    */
    var gameLoop = function () {

        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        clearCanvas();

        // Dont move canvas if rhino is eating
        if (rhino.rhinoMode !== Rhino.RHINO_MODE.EAT && 
            rhino.rhinoMode !== Rhino.RHINO_MODE.HAS_EATEN) {
            mainSkier.move();

            obstacleHandler.checkToPlaceObstacle();

            obstacleHandler.checkIfSkierHitObstacle();

            mainSkier.draw(ctx, gameWidth, gameHeight);

            calculateScore();
        }

        obstacleHandler.draw(ctx);

        drawScore();

        calculateSkiCounter();

        checkDrawRhino(ctx);

        checkGameOver();

        ctx.restore();

        // Only continue game loop if not paused and not game over condition
        if (mainSkier.getDirection() !== Skier.DIRECTION.CRASHED && !paused && 
                rhino.rhinoMode !== Rhino.RHINO_MODE.HAS_EATEN) {
            requestAnimationFrame(gameLoop);
        }
    };

    /**
    * isInputAllowed(): Check if the rhino should start to run. If its running then check
    * if it should eat. 
    * 
    * @return ctx {Boolean} Is not paused and skier is not jumping 
    * 
    */
    function isInputAllowed() {
        return !paused && mainSkier.isJumping() === false;
    }

    /**
    * setupKeyHandler(): Grab left, down, right, and space key down events to move skier
    * and pause 
    * 
    */
    var setupKeyhandler = function () {
        $(window).keydown(function (event) {

            var skierDirection = mainSkier.getDirection();

            switch (event.which) {
                case 37: // left

                    if (isInputAllowed()) {
                        mainSkier.changeDirectionLeft();

                        if (skierDirection === Skier.DIRECTION.LEFT) {
                            obstacleHandler.placeNewObstacle(skierDirection);
                        }
                    }
                    event.preventDefault();
                    break;
                case 39: // right
                    if (isInputAllowed()) {
                        mainSkier.changeDirectionRight();

                        if (skierDirection === Skier.DIRECTION.RIGHT) {
                            obstacleHandler.placeNewObstacle(skierDirection);
                        }
                    }
                    event.preventDefault();
                    break;
                case 40: // down
                    if (isInputAllowed()) {
                        mainSkier.changeDirectionDown();
                    }
                    event.preventDefault();
                    break;
                case 32: // space
                    togglePause();
                    event.preventDefault();
                    break;
            }
        });
    };

    /**
    * showInfoThenStart(): Show the game rules to user and then start the game
    * 
    * @param {function} start - Callback function to start the game   
    * 
    */
    function showInfoThenStart(start)
    {

        var contentMessage = "Here is the scoop: " +
            "Ski down the mountain and don't hit the obstacles to increase your score. " +
            "Hit cool jumps and jump over obstacles for bonus points. " +
            "Ski for too long without taking a break or hitting a " +
            "jump and you will be eaten. You can pause by hitting space";

        $.confirm({
            title: 'Hi There!',
            content: contentMessage,
            boxWidth: '200px',
            useBootstrap: false,
            buttons: {
                "Start": function () {
                    // Start
                    start();
                }
            }
        });
    }

    /**
    * initGame(): Add key handler, load game assets from game objects, place initial obstacles
    * and start game loop  
    * 
    */
    var initGame = function () {
        setupKeyhandler();

        showInfoThenStart(() => {
            GameObject.loadGameObjectAssets(() => {
                obstacleHandler.placeInitialObstacles();
    
                requestAnimationFrame(gameLoop);
            }, mainSkier, ObstacleHandler.getPlainObstacle(), rhino);
        }); 
    };

    initGame(gameLoop);
});