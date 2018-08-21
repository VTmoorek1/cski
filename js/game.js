import Skier from './skier.js';
import GameObject from './gameobject.js';
import ObstacleHandler from './obstaclehandler.js';

$(document).ready(function() {

    // Score variables
    var score = 0;
    const SCORE_INCREMENT = 1;
       
    // Game and canvas variables
    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight;
    var canvas = $('<canvas></canvas>')
        .attr('width', gameWidth * window.devicePixelRatio)
        .attr('height', gameHeight * window.devicePixelRatio)
        .css({
            width: gameWidth + 'px',
            height: gameHeight + 'px'
        });
    $('body').append(canvas);
    var ctx = canvas[0].getContext('2d');

    // Game Object variables
    var mainSkier = new Skier();    
    var obstacleHandler = new ObstacleHandler(mainSkier,gameWidth,gameHeight)

    function drawScore()
    {
        ctx.font = "16px Jua";
        ctx.fillStyle = "blue";
        ctx.fillText("Score: " + score, canvas[0].width - (canvas[0].width/6), 20);
    }

    var clearCanvas = function() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    // Updates score as skier progresses down mountain
    function calculateScore()
    {
        //Only change score if skier is pointed down hill
        if (mainSkier.isMoving())
            {
                score += SCORE_INCREMENT;
            }
    }

    function reset() {
        score = 0;
        obstacleHandler.reset();
        mainSkier.reset();
        clearCanvas();
        obstacleHandler.placeInitialObstacles();
        requestAnimationFrame(gameLoop);
    }

    function checkGameOver() {

        if (mainSkier.getDirection() === Skier.DIRECTION.CRASHED)
        {
            $.confirm({
                title: 'GAME OVER!',
                content: 'YARD SALE!',
                boxWidth: '200px',
                useBootstrap: false,
                buttons: {
                    "Play Again": function () {
                        // Reset and save high score
                        reset();
                    }
                }
            });
        }
    }

    var gameLoop = function() {

        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        clearCanvas();

        mainSkier.moveSkier();

        obstacleHandler.checkToPlaceObstacle();

        obstacleHandler.checkIfSkierHitObstacle();

        mainSkier.draw(ctx,gameWidth,gameHeight);

        obstacleHandler.drawObstacles(ctx);

        calculateScore();

        drawScore();

        checkGameOver();

        ctx.restore();

        if (mainSkier.getDirection() !== Skier.DIRECTION.CRASHED)
        {
            requestAnimationFrame(gameLoop);
        }
    };
   

    var setupKeyhandler = function() {
        $(window).keydown(function(event) {

            var skierDirection = mainSkier.getDirection();

            switch(event.which) {
                case 37: // left
                    mainSkier.changeDirectionLeft();

                    if(skierDirection === Skier.DIRECTION.LEFT) {
                        obstacleHandler.placeNewObstacle(skierDirection);
                    }
                    event.preventDefault();
                    break;
                case 39: // right
                    mainSkier.changeDirectionRight();

                    if(skierDirection === Skier.DIRECTION.RIGHT) {
                        obstacleHandler.placeNewObstacle(skierDirection);
                    }
                    event.preventDefault();
                    break;
                case 40: // down
                    mainSkier.changeDirectionDown();
                    event.preventDefault();
                    break;
            }
        });
    };

    var initGame = function() {
        setupKeyhandler();

        GameObject.loadGameObjectAssets(() => {
            obstacleHandler.placeInitialObstacles();

            requestAnimationFrame(gameLoop);
        },mainSkier,ObstacleHandler.getPlainObstacle());
    };

    initGame(gameLoop);
});