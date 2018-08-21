import Obstacle from './obstacle.js';

class ObstacleHandler {

    constructor(skier,gameWidth,gameHeight) {
        this.obstacles = [];
        this.mainSkier = skier;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    static getPlainObstacle()
    {
        return new Obstacle({x:0,y:0});
    }

    checkToPlaceObstacle() {
        if (this.mainSkier.isMoving())
        {
            this.placeNewObstacle(this.mainSkier.getDirection());
        }
    };

    drawObstacles(ctx) {
        var newObstacles = [];
        var skierPos = this.mainSkier.getPosition();
        var self = this;

        _.each(this.obstacles, function(obstacle) {
            var obstacleRect = obstacle.getObstacleRect();
            var x = obstacleRect.x - skierPos.x - obstacleRect.width / 2;
            var y = obstacleRect.y - skierPos.y - obstacleRect.height / 2;

            if(x < -100 || x > self.gameWidth + 50 || y < -100 || y > self.gameHeight + 50) {
                return;
            }

            obstacle.draw(ctx,x,y);

            newObstacles.push(obstacle);
        });

        this.obstacles = newObstacles;
    };

    placeInitialObstacles() {
        var numberObstacles = Math.ceil(_.random(5, 7) * (this.gameWidth / 800) * (this.gameHeight / 500));

        var minX = -50;
        var maxX = this.gameWidth + 50;
        var minY = this.gameHeight / 2 + 100;
        var maxY = this.gameHeight + 50;

        for(var i = 0; i < numberObstacles; i++) {
            this.placeRandomObstacle(minX, maxX, minY, maxY);
        }

        this.obstacles = _.sortBy(this.obstacles, function(obstacle) {
            var obstacleRect = obstacle.getObstacleRect();
            return obstacleRect.y + obstacleRect.height;
        });
    };

    placeNewObstacle(direction) {
        var shouldPlaceObstacle = _.random(1, 8);
        if(shouldPlaceObstacle !== 8) {
            return;
        }

        var skierPos = this.mainSkier.getPosition();
        var leftEdge = skierPos.x;
        var rightEdge = skierPos.x + this.gameWidth;
        var topEdge = skierPos.y;
        var bottomEdge = skierPos.y + this.gameHeight;

        switch(direction) {
            case 1: // left
            this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
            this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
            this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
            this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
            this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
            this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
            this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
            this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    };

   placeRandomObstacle(minX, maxX, minY, maxY) {
        var obstacleIndex = _.random(0, Obstacle.OBSTACLE_TYPES.length - 1);

        var position = this.calculateOpenPosition(minX, maxX, minY, maxY);

        this.obstacles.push(new Obstacle(position));
    };

    calculateOpenPosition(minX, maxX, minY, maxY) {
        var x = _.random(minX, maxX);
        var y = _.random(minY, maxY);

        var foundCollision = _.find(this.obstacles, function(obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if(foundCollision) {
            return this.calculateOpenPosition(minX, maxX, minY, maxY);
        }
        else {
            return {
                x: x,
                y: y
            }
        }
    };

    checkIfSkierHitObstacle() {
        var skierRect = this.mainSkier.getSkierRect(this.gameWidth,this.gameHeight);

        var collision = _.find(this.obstacles, function(obstacle) {
            var obstacleBounds = obstacle.getObstacleBounds();

            return ObstacleHandler.intersectRect(skierRect, obstacleBounds);
        });

        if(collision) {
            this.mainSkier.skierCrashed();
        }
    };

    static intersectRect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };
}

export default ObstacleHandler;
