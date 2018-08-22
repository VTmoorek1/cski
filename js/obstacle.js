'use strict';

import GameObject from './gameobject.js';

/**
* obstacle.js - Class for an obstacle object which could be a tree/trees,
* a rock or a jump
* 
*/
class Obstacle extends GameObject {

    constructor(position) {
        super();

        this.assets = {
            'tree': 'img/tree_1.png',
            'treeCluster': 'img/tree_cluster.png',
            'rock1': 'img/rock_1.png',
            'rock2': 'img/rock_2.png',
            'jumpRamp' : 'img/jump_ramp.png'
        };

        this.obstacleType = _.random(0, OBSTACLE_TYPES.length - 1);
        this.x = position.x;
        this.y = position.y;
    }

    /**
    * reset(): Just resets coords
    * 
    */
    reset () {
        this.x = 0;
        this.y = 0;
    }

    // This particular gameobject does not move
    move() {   
    }

    /**
    * isJump(): Is the obstacle a jump which is obstacle type 4
    * 
    * @return {boolean} is the obstacle type 4
    * 
    */
    isJump()
    {
        return (this.obstacleType === 4);
    }

    /**
    * getObsctacleRect(): get rectangle of obstacle
    * 
    * @return {object} - x,y, width, and height 
    * 
    */
    getObstacleRect() {
        var obstacleImage = GameObject.loadedAssets[OBSTACLE_TYPES[this.obstacleType]];

        return {
            x: this.x,
            y: this.y,
            width: obstacleImage.width,
            height: obstacleImage.height
        };
    }

    /**
    * getObsctacleBounds(): get bounds of obstacle
    * 
    * @return {object} - left,right,top,bottom 
    * 
    */
    getObstacleBounds() {
        var obstacleImage = GameObject.loadedAssets[OBSTACLE_TYPES[this.obstacleType]];

        return {
            left: this.x,
            right: this.x + obstacleImage.width,
            top: this.y + obstacleImage.height - 5,
            bottom: this.y + obstacleImage.height
        };
    }

    /**
    * draw(): draw the obstacle
    * 
    * @param {object} ctx - canvas context
    * @param {multiple} args - first 2 args should be a calculated x and y on screen from game 
    * 
    */
    draw(ctx,...args) {
        var x = args[0];
        var y = args[1];
        var obstacleImage = GameObject.loadedAssets[OBSTACLE_TYPES[this.obstacleType]];
        ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);
    }

}

// Obstacle type enum
const OBSTACLE_TYPES = [
    'tree',
    'treeCluster',
    'rock1',
    'rock2',
    'jumpRamp'
];

Obstacle.OBSTACLE_TYPES = OBSTACLE_TYPES;

export default Obstacle;