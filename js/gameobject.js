'use strict';

/**
* gameobject.js - Base class for Game Objects   
* 
*/

class GameObject {
    
    constructor () {

        // All game objects have its own assets and position
        this.assets = {};
        this.x = 0;
        this.y = 0;
    }

    /**
    * loadGameObjectAssets(): Load each game objects assets
    * 
    * @param {function} done - Callback function once all assets are loaded
    * @param {function} gameObjects - Game objects for assets to be loaded   
    * 
    */
    static loadGameObjectAssets(done,...gameObjects)
    {

        var assetPromises = [];

        gameObjects.map((gObject) => {
            assetPromises = assetPromises.concat(GameObject.getAssetPromises(gObject));
        });

        $.when.apply($, assetPromises).then(function() {
            done();
        });
    }

    /**
    * getAssetPromises(): Get promises to load game object assets async
    * 
    * @param {function} gameObject - Game object for assets to be loaded
    * @return {array} of promises to resolve once ready   
    * 
    */
    static getAssetPromises(gameObject) {
        var assetPromises = [];

        function imageLoader(asset, assetName) {
            var assetImage = new Image();
            var assetDeferred = new $.Deferred();

            assetImage.onload = function() {
                assetImage.width /= 2;
                assetImage.height /= 2;

                GameObject.loadedAssets[assetName] = assetImage;
                assetDeferred.resolve();
            };

            assetImage.src = asset;

            assetPromises.push(assetDeferred.promise());
        }
        
        _.each(gameObject.assets,imageLoader);

        return assetPromises;
    }

    // Must be implemented in sub class
    draw(ctx,...args) {
        throw new Error('You have to implement the method draw');
    }

    // Must be implemented in sub class
    reset() {
        throw new Error('You have to implement the method reset');
    }

    // Must be implemented in sub class
    move() {
        throw new Error('You have to implement the method move');   
    }

    /**
    * getPosition(): getter for objects position
    * 
    * @return {object} with x and y coords
    */
    getPosition()
    {
        return {x : this.x, y : this.y};
    }

    /**
    * setPosition(): setter for objects position
    * 
    * @param {number} x - x coord for object
    * @param {number} y - y coord for object   
    * 
    */
    setPosition(x,y)
    {
        this.x = x;
        this.y = y;
    }

};

// Static variable to keep loaded assets in memory for sub classes
const loadedAssets = {};

GameObject.loadedAssets = loadedAssets;

export default GameObject;