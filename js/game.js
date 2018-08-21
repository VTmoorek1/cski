import Skier from './skier.js';
import GameObject from './gameobject.js';
import ObstacleHandler from './obstaclehandler.js';
import Rhino from './rhino.js';

$(document).ready(function () {

    // Score variables
    var score = 0;
    const SCORE_INCREMENT = 1;
    const BONUS_SCORE_INCREMENT = 10;
    var highScore = 0;
    loadHighScore();

    // Ski counter
    var skiCounter = 0;
    const RHINO_COUNT = 200; //_.random(5000,10000);

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

    function drawScore() {
        ctx.font = "16px Jua";
        ctx.fillStyle = "blue";
        ctx.fillText("Score: " + score, canvas[0].width - (canvas[0].width / 6), 20);
    }

    var clearCanvas = function () {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    // Updates score as skier progresses down mountain
    function calculateScore() {
        //Only change score if skier is pointed down hill
        if (mainSkier.isJumping()) {
            score += BONUS_SCORE_INCREMENT;
        }
        else if (mainSkier.isMoving()) {
            score += SCORE_INCREMENT;
        }
    }

    function loadHighScore() {
        var highScoreStr = window.localStorage.getItem("highScore");

        if (highScoreStr) {
            highScore = parseInt(highScoreStr);
            $("#highScore").text("" + highScore);
        }
    }

    function saveHighScore() {
        if (score > highScore) {
            highScore = score;
            window.localStorage.setItem("highScore", highScore + "");
            $("#highScore").text("" + highScore);
        }
    }

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

    function togglePause() {
        if (mainSkier.getDirection() !== Skier.DIRECTION.CRASHED) {
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

    function reset() {
        score = 0;
        obstacleHandler.reset();
        mainSkier.reset();
        rhino.reset();
        clearCanvas();
        obstacleHandler.placeInitialObstacles();
        requestAnimationFrame(gameLoop);
    }

    function checkGameOver() {

        var contentMessage;

        if (mainSkier.getDirection() === Skier.DIRECTION.CRASHED) {
            saveHighScore();
            contentMessage = 'YARD SALE!!!!!';
        }
        else if (rhino.rhinoMode === Rhino.RHINO_MODE.HAS_EATEN)
        {
            contentMessage = 'YOU HAVE BEEN EATEN BY THE HUNGRY RHINO!!!!';
        }

        if (contentMessage)
        {
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

    function calculateSkiCounter() {
        if (mainSkier.isMoving()) {
            skiCounter++;
        }
        else {
            skiCounter = 0;
        }
    }

    function checkDrawRhino(ctx) {

        if (skiCounter > RHINO_COUNT) {
            if (rhino.x <= gameWidth / 2 && rhino.rhinoMode !== Rhino.RHINO_MODE.EAT &&
                rhino.rhinoMode !== Rhino.RHINO_MODE.HAS_EATEN) {
                rhino.rhinoEat();
            }
            else if (rhino.rhinoMode === Rhino.RHINO_MODE.SLEEP || 
                rhino.rhinoMode === Rhino.RHINO_MODE.RUN) {
                rhino.moveRhino();

                if (rhino.rhinoMode !== Rhino.RHINO_MODE.RUN) {
                    rhino.rhinoRun();
                }
            }

            rhino.draw(ctx);
        }
    }

    var gameLoop = function () {

        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        clearCanvas();

        if (rhino.rhinoMode !== Rhino.RHINO_MODE.EAT && 
            rhino.rhinoMode !== Rhino.RHINO_MODE.HAS_EATEN) {
            mainSkier.moveSkier();

            obstacleHandler.checkToPlaceObstacle();

            obstacleHandler.checkIfSkierHitObstacle();

            mainSkier.draw(ctx, gameWidth, gameHeight);

            calculateScore();
        }

        obstacleHandler.drawObstacles(ctx);

        drawScore();

        calculateSkiCounter();

        checkDrawRhino(ctx);

        checkGameOver();

        ctx.restore();

        if (mainSkier.getDirection() !== Skier.DIRECTION.CRASHED && !paused && 
                rhino.rhinoMode !== Rhino.RHINO_MODE.HAS_EATEN) {
            requestAnimationFrame(gameLoop);
        }
    };

    function isInputAllowed() {
        return !paused && mainSkier.isJumping() === false;
    }

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

                    // Cant pause while jumping or if rhino is eating
                    if (mainSkier.isJumping() === false && rhino.isRhinoEating() === false) {
                        togglePause();
                    }
                    event.preventDefault();
                    break;
            }
        });
    };

    var initGame = function () {
        setupKeyhandler();

        GameObject.loadGameObjectAssets(() => {
            obstacleHandler.placeInitialObstacles();

            requestAnimationFrame(gameLoop);
        }, mainSkier, ObstacleHandler.getPlainObstacle(), rhino);
    };

    initGame(gameLoop);
});