'use strict';

import GameObject from './gameobject.js';

/**
* skier.js: Class representing the skier in the game
* 
*/
class Skier extends GameObject {

    constructor() {
        super();

        // Skier has direction and speed
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
    
    /**
    * reset(): reset skier to original position direction and speed
    *  
    */
    reset () {
        this.skierDirection = DIRECTION.RIGHT;
        this.skierSpeed = 8;
        this.x = 0;
        this.y = 0;
    }

    /**
    * jumpSkier(): set the skier direction to jump and start the jump animation
    *  
    */
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

    /**
    * isJumping(): is the skier jumping
    *  
    * @return {boolean} is the skier diection jump
    */
    isJumping()
    {
        return (this.skierDirection === DIRECTION.JUMP);
    }

    /**
    * getSkierAsset(): get the skier asset based on direction or jump asset
    *  
    * @return {string} the current skier asset
    */
    getSkierAsset() {

        var skierAsset = ASSET_ARRAY[this.skierDirection];

        if (this.skierDirection === DIRECTION.JUMP)
        {
            skierAsset = this.skierJumpAsset; 
        }

        return skierAsset;
    }

    /**
    * getSkierRect(): get the skier rect
    *  
    * @param {number} gameWidth - the width of the game window
    * @param {number} gameHeight - the height of the game window
    */
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

    /**
    * draw(): draw the skier
    * 
    * @param {object} ctx - canvas context
    * @param {multiple} args - first 2 args should be gamewidth and gameheight  
    * 
    */
    draw(ctx,...args) {
        var gameWidth = args[0];
        var gameHeight = args[1];
        var skierAssetName = this.getSkierAsset();
        var skierImage = GameObject.loadedAssets[skierAssetName];
        var xCo = (gameWidth - skierImage.width) / 2;
        var yCo = (gameHeight - skierImage.height) / 2;

        ctx.drawImage(skierImage, xCo, yCo, skierImage.width, skierImage.height);
    }

    /**
    * move(): move the skier position based on direction and speed
    *  
    */
    move() {
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
                // Needed to add rounding here for unintended x,y values
                this.x += Math.round(this.skierSpeed / 1.4142);
                this.y += Math.round(this.skierSpeed / 1.4142);
                break;
        }
    }

    /**
    * changeDirectionLeft(): move the skier direction left or move left
    *  
    */
    changeDirectionLeft()
    {
        if(this.skierDirection === DIRECTION.LEFT) {
            this.x -= this.skierSpeed;
        }
        else if (this.skierDirection === DIRECTION.CRASHED) {
            // reset skier left if skier is crashed
            this.skierDirection = DIRECTION.LEFT;
        }
        else
        {
            this.skierDirection--;
        }
    }

    /**
    * changeDirectionRight(): change skier direction right or move right
    *  
    */
    changeDirectionRight() 
    {
        if(this.skierDirection === DIRECTION.RIGHT) {
            this.x+= this.skierSpeed;
        }
        else {
            this.skierDirection++;
        }
    }

    /**
    * changeDirectionDown(): move the skier direction down
    *  
    */
    changeDirectionDown()
    {
        this.skierDirection = DIRECTION.DOWN;
    }

    /**
    * skierCrashed(): set the skier direction to crashed
    *  
    */
    skierCrashed()
    {
        this.skierDirection = DIRECTION.CRASHED;
    }

    /**
    * getDirection(): move the skier direction left if able
    * 
    * @return {number} representing skier direction  
    */
    getDirection()
    {
        return this.skierDirection;
    }

    /**
    * isMoving(): is the skier moving downhill
    * 
    * @return {boolean} is direction left down, down, or right down  
    */
    isMoving()
    {
        return (this.skierDirection === DIRECTION.LEFT_DOWN || this.skierDirection === DIRECTION.DOWN ||
            this.skierDirection === DIRECTION.RIGHT_DOWN);
    }

};

// Direction enum for readability
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

// The skiers assets 
const ASSET_ARRAY = ['skierCrash','skierLeft','skierLeftDown','skierDown',
    'skierRightDown','skierRight','skierJump'];

Skier.ASSET_ARRAY = ASSET_ARRAY;

// Ski jump assets in order of animation
const SKI_JUMP = ['skierJump1','skierJump2','skierJump3',
    'skierJump4'];

Skier.SKI_JUMP = SKI_JUMP;

export default Skier;
