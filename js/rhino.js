import GameObject from './gameobject.js';

class Rhino extends GameObject {

    constructor(gameWidth,gameHeight) {
        super();

       // this.skierJumpAsset = 'skierJump1';
        this.rhinoMode = RHINO_MODE.SLEEP;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.rhinoSpeed = 3;
        this.rhinoAsset = ASSET_ENUM[0];

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

        this.y = this.gameHeight / 2;
        this.x = this.gameWidth + 20;
    }
    
    reset () {
        this.y = this.gameHeight / 2;
        this.x = this.gameWidth + 20;
        this.rhinoAsset = ASSET_ENUM[0];
        this.rhinoMode = RHINO_MODE.SLEEP;
    }

    isRhinoEating()
    {
        return (this.rhinoMode === RHINO_MODE.EAT);
    }

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
                if (this.rhinoAsset === ASSET_ENUM[0])
                {
                    this.rhinoAsset = ASSET_ENUM[1];
                }
                else
                {
                    this.rhinoAsset = ASSET_ENUM[0];
                }
            }
        },50);
    }

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

    isJumping()
    {
        return (this.skierDirection === DIRECTION.JUMP);
    }

    getRhinoAsset() {
        return this.rhinoAsset;
    }

    draw(ctx,...args) {
        var rhinoAssetName = this.getRhinoAsset();
        var rhinoImage = GameObject.loadedAssets[rhinoAssetName];
        var yCo = (this.gameHeight - rhinoImage.height) / 2;

        ctx.drawImage(rhinoImage, this.x, yCo, rhinoImage.width, rhinoImage.height);
    }

    moveRhino() {
        this.x -= Math.round(this.rhinoSpeed / 1.4142);   
    }

    skierCrashed()
    {
        this.skierDirection = 0;
    }

    isMoving()
    {
        return (this.skierDirection === DIRECTION.LEFT_DOWN || this.skierDirection === DIRECTION.DOWN ||
            this.skierDirection === DIRECTION.RIGHT_DOWN);
    }

};


// Image name enum 
const ASSET_ENUM = ['rhinoRunLeft',
'rhinoRunLeft2',
'rhinoLift',
'rhinoLiftMouthOpen',
'rhinoLiftEat1',
'rhinoLiftEat2',
'rhinoLiftEat3',
'rhinoLiftEat4',
'rhinoDefault'];

Rhino.ASSET_ENUM = ASSET_ENUM;

// Image name enum 
const RHINO_MODE = {'SLEEP' : 0, 'RUN' : 1,
'EAT' : 2, 'HAS_EATEN' : 3};

Rhino.RHINO_MODE = RHINO_MODE;

const RHINO_EAT = ['rhinoLift',
'rhinoLiftMouthOpen',
'rhinoLiftEat1',
'rhinoLiftEat2',
'rhinoLiftEat3',
'rhinoLiftEat4',
'rhinoDefault'];

Rhino.RHINO_EAT = RHINO_EAT;

export default Rhino;