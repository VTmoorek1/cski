import GameObject from './gameobject.js';

class Skier extends GameObject {

    constructor() {
        super();

        this.skierDirection = DIRECTION.RIGHT;
        this.skierSpeed = 8;
        this.skierJumpAsset = 'skierJump1';

        this.assets = {
            'skierCrash': 'img/skier_crash.png',
            'skierLeft': 'img/skier_left.png',
            'skierLeftDown': 'img/skier_left_down.png',
            'skierDown': 'img/skier_down.png',
            'skierRightDown': 'img/skier_right_down.png',
            'skierRight': 'img/skier_right.png',
            'skierJump1': 'img/skier_jump_1.png',
            'skierJump2': 'img/skier_jump_2.png',
            'skierJump3': 'img/skier_jump_3.png',
            'skierJump4': 'img/skier_jump_5.png',
        };
    }
    
    reset () {
        this.skierDirection = DIRECTION.RIGHT;
        this.skierSpeed = 8;
        this.x = 0;
        this.y = 0;
    }

    jumpSkier()
    {
        this.skierDirection = DIRECTION.JUMP;
        var skiJumpCounter = 0;

        var jumpInterval = setInterval(() => {
            
            if (skiJumpCounter < SKI_JUMP.length)
            {
                this.skierJumpAsset = SKI_JUMP[skiJumpCounter];
                skiJumpCounter++;   
            }
            else {
                this.skierDirection = DIRECTION.DOWN;
                clearInterval(jumpInterval);
            }
        },250);
    }

    isJumping()
    {
        return (this.skierDirection === DIRECTION.JUMP);
    }

    getSkierAsset() {

        var skierAsset = ASSET_ENUM[this.skierDirection];

        if (this.skierDirection === DIRECTION.JUMP)
        {
            skierAsset = this.skierJumpAsset; 
        }

        return skierAsset;
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
            case DIRECTION.JUMP:
                this.y += this.skierSpeed;
                break;
            case DIRECTION.RIGHT_DOWN:
                this.x += Math.round(this.skierSpeed / 1.4142);
                this.y += Math.round(this.skierSpeed / 1.4142);
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
    "JUMP": 6
};

Skier.DIRECTION = DIRECTION;

// Image name enum 
const ASSET_ENUM = ['skierCrash','skierLeft','skierLeftDown','skierDown',
    'skierRightDown','skierRight','skierJump'];

Skier.ASSET_ENUM = ASSET_ENUM;

const SKI_JUMP = ['skierJump1','skierJump2','skierJump3',
    'skierJump4'];

Skier.SKI_JUMP = SKI_JUMP;

export default Skier;
