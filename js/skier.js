import GameObject from './gameobject.js';

class Skier extends GameObject {

    constructor() {
        super();

        this.skierDirection = 5;
        this.skierSpeed = 8;

        this.assets = {
            'skierCrash': 'img/skier_crash.png',
            'skierLeft': 'img/skier_left.png',
            'skierLeftDown': 'img/skier_left_down.png',
            'skierDown': 'img/skier_down.png',
            'skierRightDown': 'img/skier_right_down.png',
            'skierRight': 'img/skier_right.png',
        };
    }
    
    reset () {
        this.skierDirection = 5;
        this.skierSpeed = 8;
        this.x = 0;
        this.y = 0;
    }

    getSkierAsset() {
        return ASSET_ENUM[this.skierDirection];
    }

    getSkierRect(gameWidth,gameHeight) {
        var skierAssetName = this.getSkierAsset();
        var skierImage = GameObject.loadedAssets[skierAssetName];
        var skierRect = {
            left: this.x + gameWidth / 2,
            right: this.x + skierImage.width + gameWidth / 2,
            top: this.y + skierImage.height - 5 + gameHeight / 2,
            bottom: this.y + skierImage.height + gameHeight / 2
        };

        return skierRect;
    }

    draw(ctx,...args) {
        var gameWidth = args[0];
        var gameHeight = args[1];
        var skierAssetName = this.getSkierAsset();
        var skierImage = GameObject.loadedAssets[skierAssetName];
        var xCo = (gameWidth - skierImage.width) / 2;
        var yCo = (gameHeight - skierImage.height) / 2;

        ctx.drawImage(skierImage, xCo, yCo, skierImage.width, skierImage.height);
    }

    moveSkier() {
        switch(this.skierDirection) {
            case DIRECTION.LEFT_DOWN:
                this.x -= Math.round(this.skierSpeed / 1.4142);
                this.y += Math.round(this.skierSpeed / 1.4142);
                break;
            case DIRECTION.DOWN:
                this.y += this.skierSpeed;
                break;
            case DIRECTION.RIGHT_DOWN:
                this.x += this.skierSpeed / 1.4142;
                this.y += this.skierSpeed / 1.4142;
                break;
        }
    }

    changeDirectionLeft()
    {
        if(this.skierDirection === DIRECTION.LEFT) {
            this.x -= this.skierSpeed;
        }
        else if (this.skierDirection === DIRECTION.CRASHED) {
            this.skierDirection = DIRECTION.LEFT;
        }
        else
        {
            this.skierDirection--;
        }
    }

    changeDirectionRight() 
    {
        if(this.skierDirection === DIRECTION.RIGHT) {
            this.x+= this.skierSpeed;
        }
        else {
            this.skierDirection++;
        }
    }

    changeDirectionDown()
    {
        this.skierDirection = 3;
    }

    skierCrashed()
    {
        this.skierDirection = 0;
    }

    getDirection()
    {
        return this.skierDirection;
    }

    isMoving()
    {
        return (this.skierDirection === DIRECTION.LEFT_DOWN || this.skierDirection === DIRECTION.DOWN ||
            this.skierDirection === DIRECTION.RIGHT_DOWN);
    }

};

// Direction enum and freeze object changes
const DIRECTION = {
    "CRASHED": 0,
    "LEFT": 1,
    "LEFT_DOWN": 2,
    "DOWN": 3,
    "RIGHT_DOWN": 4,
    "RIGHT": 5,
    "UP": 6
};

Skier.DIRECTION = DIRECTION;

// Image name enum 
const ASSET_ENUM = ['skierCrash','skierLeft','skierLeftDown','skierDown',
    'skierRightDown','skierRight'];

Skier.ASSET_ENUM = ASSET_ENUM;

export default Skier;
