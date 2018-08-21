import GameObject from './gameobject.js';

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

    isJump()
    {
        return (this.obstacleType === 4);
    }

    getObstacleRect() {
        var obstacleImage = GameObject.loadedAssets[OBSTACLE_TYPES[this.obstacleType]];

        return {
            x: this.x,
            y: this.y,
            width: obstacleImage.width,
            height: obstacleImage.height
        };
    }

    getObstacleBounds() {
        var obstacleImage = GameObject.loadedAssets[OBSTACLE_TYPES[this.obstacleType]];

        return {
            left: this.x,
            right: this.x + obstacleImage.width,
            top: this.y + obstacleImage.height - 5,
            bottom: this.y + obstacleImage.height
        };
    }

    draw(ctx,...args) {
        var x = args[0];
        var y = args[1];
        var obstacleImage = GameObject.loadedAssets[OBSTACLE_TYPES[this.obstacleType]];
        ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);
    }

}

// Direction enum and freeze object changes
const OBSTACLE_TYPES = [
    'tree',
    'treeCluster',
    'rock1',
    'rock2',
    'jumpRamp'
];

Obstacle.OBSTACLE_TYPES = OBSTACLE_TYPES;

export default Obstacle;