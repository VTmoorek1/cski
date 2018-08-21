class GameObject {
    
    constructor () {
        this.assets = {};
        this.x = 0;
        this.y = 0;
    }

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

    draw(ctx,...args) {
        throw new Error('You have to implement the method draw');
    }

    getPosition()
    {
        return {x : this.x, y : this.y};
    }

};

const loadedAssets = {};

GameObject.loadedAssets = loadedAssets;

export default GameObject;