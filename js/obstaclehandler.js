'use strict';

/**
* obstaclehandler.js: Maintains and conatins obstacles in game. Also controls collisions with skier
* 
*/

import Obstacle from './obstacle.js';
import Skier from './skier.js';

class ObstacleHandler {

    constructor(skier, gameWidth, gameHeight) {

        // Contains all of the obstacles, the game dimensions, and game skier
        this.obstacles = [];
        this.mainSkier = skier;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    /**
    * reset(): reset by clearing obstacle array
    * 
    */
    reset() {
        this.obstacles = [];
    }

    /**
    * getPlainObstacle(): get obstacle with no position 
    * 
    * @return {object} - obstacle with 0 pos
    * 
    */
    static getPlainObstacle() {
        return new Obstacle({ x: 0, y: 0 });
    }

    /**
    * checkToPlaceObstacle(): A simple check to place a new obstacle if
    * skier is moving downhill
    * 
    */
    checkToPlaceObstacle() {
        if (this.mainSkier.isMoving()) {
            this.placeNewObstacle(this.mainSkier.getDirection());
        }
    };

    /**
    * draw(): draw obstacles based on obstacle and skier position 
    * 
    * @param {object} ctx - canvas context
    * 
    */
    draw(ctx) {
        var newObstacles = [];
        var skierPos = this.mainSkier.getPosition();
        var self = this;

        _.each(this.obstacles, function (obstacle) {
            var obstacleRect = obstacle.getObstacleRect();
            var x = obstacleRect.x - skierPos.x - obstacleRect.width / 2;
            var y = obstacleRect.y - skierPos.y - obstacleRect.height / 2;

            if (x < -100 || x > self.gameWidth + 50 || y < -100 || y > self.gameHeight + 50) {
                return;
            }

            obstacle.draw(ctx, x, y);

            newObstacles.push(obstacle);
        });

        this.obstacles = newObstacles;
    };

    /**
    * placeIntialObstacles(): Create intial obstacles at random 
    * 
    */
    placeInitialObstacles() {
        var numberObstacles = Math.ceil(_.random(5, 7) * (this.gameWidth / 800) * (this.gameHeight / 500));

        var minX = -50;
        var maxX = this.gameWidth + 50;
        var minY = this.gameHeight / 2 + 100;
        var maxY = this.gameHeight + 50;

        for (var i = 0; i < numberObstacles; i++) {
            this.placeRandomObstacle(minX, maxX, minY, maxY);
        }

        this.obstacles = _.sortBy(this.obstacles, function (obstacle) {
            var obstacleRect = obstacle.getObstacleRect();
            return obstacleRect.y + obstacleRect.height;
        });
    };

    /**
    * placeNewObstacle(): Create new obstacle based on skier direction 
    * 
    * @param {number} direction - direction of skier travel
    */
    placeNewObstacle(direction) {
        var shouldPlaceObstacle = _.random(1, 8);
        if (shouldPlaceObstacle !== 8) {
            return;
        }

        var skierPos = this.mainSkier.getPosition();
        var leftEdge = skierPos.x;
        var rightEdge = skierPos.x + this.gameWidth;
        var topEdge = skierPos.y;
        var bottomEdge = skierPos.y + this.gameHeight;

        switch (direction) {
            case Skier.DIRECTION.LEFT: // left
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case Skier.DIRECTION.LEFT_DOWN: // left down
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case Skier.DIRECTION.DOWN: // down
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case Skier.DIRECTION.RIGHT_DOWN: // right down
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case Skier.DIRECTION.RIGHT: // right
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
        }
    };

    /**
    * placeRandomObstacle(): Create random obstacle based on open postion and bounds 
    * 
    * @param {number} minX - minimum X coord to place obstacle
    * @param {number} minY - minimum Y coord to place obstacle
    * @param {number} maxX - maximum X coord to place obstacle
    * @param {number} maxY - maximum Y coord to place obstacle
    * 
    */
    placeRandomObstacle(minX, maxX, minY, maxY) {

        var position = this.calculateOpenPosition(minX, maxX, minY, maxY);

        this.obstacles.push(new Obstacle(position));
    };

    /**
    * calculateOpenPositon(): find a position within bounds that does not collide with other objects 
    * 
    * @param {number} minX - minimum X coord to place obstacle
    * @param {number} minY - minimum Y coord to place obstacle
    * @param {number} maxX - maximum X coord to place obstacle
    * @param {number} maxY - maximum Y coord to place obstacle
    * 
    */
    calculateOpenPosition(minX, maxX, minY, maxY) {
        var x = _.random(minX, maxX);
        var y = _.random(minY, maxY);

        var foundCollision = _.find(this.obstacles, function (obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if (foundCollision) {
            return this.calculateOpenPosition(minX, maxX, minY, maxY);
        }
        else {
            return {
                x: x,
                y: y
            }
        }
    };

    /**
    * checkIfSkierHitObstacle(): check if the skier hit an obstacle 
    *  
    */
    checkIfSkierHitObstacle() {
        var skierRect = this.mainSkier.getSkierRect(this.gameWidth, this.gameHeight);

        var collision = _.find(this.obstacles, function (obstacle) {
            var obstacleBounds = obstacle.getObstacleBounds();

            return ObstacleHandler.intersectRect(skierRect, obstacleBounds);
        });

        // If there is a collision while skier is not jump then
        // jump skier if obstacle is a jump or crash them
        if (collision && this.mainSkier.isJumping() === false) {
            if (collision.isJump()) {
                // Jump skier
                this.mainSkier.jumpSkier();
            }
            else {
                this.mainSkier.skierCrashed();
            }
        }
    };

    /**
    * intersectRect(): check if the rectangles intersect 
    *  
    * @param {object} r1 - first rectangle to check
    * @param {object} r2 - second rectangle to check
    * @return {boolean} true or false if rectangles intersect
    */
    static intersectRect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };
}

export default ObstacleHandler;
