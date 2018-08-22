'use strict';

/**
* rhino.js: Class representing the rhino
* 
*/

import GameObject from './gameobject.js';

class Rhino extends GameObject {

    constructor(gameWidth,gameHeight) {
        super();

        // Rhino has a mode, game width and height, and speed
        this.rhinoMode = RHINO_MODE.SLEEP;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.rhinoSpeed = 3;
        this.rhinoAsset = ASSET_ARRAY[0];

        this.assets = {
            'rhinoRunLeft': 'img/rhino_run_left.png',
            'rhinoRunLeft2': 'img/rhino_run_left_2.png',
            'rhinoLift' : 'img/rhino_lift.png',
            'rhinoLiftMouthOpen' : 'img/rhino_lift_mouth_open.png',
            'rhinoLiftEat1' : 'img/rhino_lift_eat_1.png',
            'rhinoLiftEat2' : 'img/rhino_lift_eat_2.png',
            'rhinoLiftEat3' : 'img/rhino_lift_eat_3.png',
            'rhinoLiftEat4' : 'img/rhino_lift_eat_4.png',
            'rhinoDefault' : 'img/rhino_default.png'
        };

        // Set rhino off screen and half way down
        this.y = this.gameHeight / 2;
        this.x = this.gameWidth + 20;
    }
    
    /**
    * reset(): reset rhino to sleep mode and original asset and position
    * 
    */
    reset () {
        this.y = this.gameHeight / 2;
        this.x = this.gameWidth + 20;
        this.rhinoAsset = ASSET_ARRAY[0];
        this.rhinoMode = RHINO_MODE.SLEEP;
    }

    /**
    * isRhinoEating(): is the rhino eating
    * 
    * @return {boolean} if rhino is in eat mode
    * 
    */
    isRhinoEating()
    {
        return (this.rhinoMode === RHINO_MODE.EAT || this.rhinoMode === RHINO_MODE.HAS_EATEN);
    }

    /**
    * isRhinoActive(): is the rhino active
    * 
    * @return {boolean} is the rhino not in sleep mode
    * 
    */
    isRhinoActive()
    {
        return (this.rhinoMode !== RHINO_MODE.SLEEP);
    }

    /**
    * rhinoRun(): puts the rhino in running mode and starts the running
    * animation until rhino reaches center screen
    * 
    */
    rhinoRun()
    {
        this.rhinoMode = RHINO_MODE.RUN;
        var runInterval = setInterval(() => {
            if(this.x <= this.gameWidth/2)
            {
                clearInterval(runInterval);
            }
            else
            {
                if (this.rhinoAsset === ASSET_ARRAY[0])
                {
                    this.rhinoAsset = ASSET_ARRAY[1];
                }
                else
                {
                    this.rhinoAsset = ASSET_ARRAY[0];
                }
            }
        },50);
    }

    /**
    * rhinoEat(): puts rhino in eating mode and starts eating animation
    * 
    */
    rhinoEat()
    {
        var eatCounter = 0;
        this.rhinoMode = RHINO_MODE.EAT;

        var eatInterval = setInterval(() => {
            if (eatCounter < RHINO_EAT.length)
            {
                this.rhinoAsset = RHINO_EAT[eatCounter];
                eatCounter++;
            }   
            else
            {
                this.rhinoMode = RHINO_MODE.HAS_EATEN;
                clearInterval(eatInterval);
            } 
        },500);
    }

    /**
    * getRhinoAsset(): gets the current rhino asset
    * 
    * @return {number} the current rhino asset
    * 
    */
    getRhinoAsset() {
        return this.rhinoAsset;
    }

    /**
    * draw(): draw the rhino
    * 
    * @param {object} ctx - canvas context
    * @param {multiple} args - not used
    * 
    */
    draw(ctx,...args) {
        var rhinoAssetName = this.getRhinoAsset();
        var rhinoImage = GameObject.loadedAssets[rhinoAssetName];
        var yCo = (this.gameHeight - rhinoImage.height) / 2;

        ctx.drawImage(rhinoImage, this.x, yCo, rhinoImage.width, rhinoImage.height);
    }

    /**
    * move(): move the rhino only x coord
    *  
    */
    move() {
        this.x -= Math.round(this.rhinoSpeed / 1.4142);   
    }


};


// Rhino asset array
const ASSET_ARRAY = ['rhinoRunLeft',
'rhinoRunLeft2',
'rhinoLift',
'rhinoLiftMouthOpen',
'rhinoLiftEat1',
'rhinoLiftEat2',
'rhinoLiftEat3',
'rhinoLiftEat4',
'rhinoDefault'];

Rhino.ASSET_ARRAY = ASSET_ARRAY;

// Rhino mode enum
const RHINO_MODE = {'SLEEP' : 0, 'RUN' : 1,
'EAT' : 2, 'HAS_EATEN' : 3};

Rhino.RHINO_MODE = RHINO_MODE;

// Rhino eat action asset array
const RHINO_EAT = ['rhinoLift',
'rhinoLiftMouthOpen',
'rhinoLiftEat1',
'rhinoLiftEat2',
'rhinoLiftEat3',
'rhinoLiftEat4',
'rhinoDefault'];

Rhino.RHINO_EAT = RHINO_EAT;

export default Rhino;