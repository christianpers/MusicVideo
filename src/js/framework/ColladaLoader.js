//ColladaLoader.js

function ColladaLoader(){};

var p = ColladaLoader.prototype;


p.load = function(path, type, onLoadedCallback, callbackScope){

	this.type = type;
	this.onLoadedCallback = onLoadedCallback;
	this.callbackScope = callbackScope;

	this.dataLoaded = false;

	this.childrenData = [];
	this.parentData = [];
	this.animationData = [];

	Collada.dataPath = 'imports/';
	Collada.load( path, this._onLoaded.bind(this) );

	
};

p.getParentData = function(){

	return this.parentData.slice(0);
};

p._onLoaded = function(e){

	var root = e.root;
	var subViews = [];
	for (var key in root){

		if (key == 'animations'){
			// animationID = root[key];
			// this._animation = new ViewAnimation();
			// this._animation.init(e.resources[root['animations']]);

			this.animationData.push(e.resources[root['animations']]);

		}

		if (key == 'children'){
			
			if (root[key].length > 0){
				var parent = root[key];

				for (var i=0;i<parent.length;i++){
					// if (root['animations']){
					// 	animation = e.resources[root['animations']];
					// }

					// var parentView = new ViewTest();
					// parentView.init(vertPath, fragPath, children[i], undefined, undefined);
					// this._parentView = parentView;
					// this._parentView.transforms = this.transforms;
					
					// var mesh = e.meshes

					// debugger;

					
					if (parent[i].children.length == 0){
						var mesh = e.meshes[parent[i].mesh];
						var material = e.materials[parent[i].material];

						this.parentData.push({id: parent[i].id, meshData: mesh, materialData: material, children: []});
						// this.parentData = {meshData: mesh, materialData: material};

					}else{
						var parentObj = {};

						parentObj.id = parent[i].id;
						var mesh = e.meshes[parent[i].mesh];
						var material = e.materials[parent[i].material];

						// parentObj.meshData = mesh;
						// parentObj.materialData = material;
						parentObj.children = [];
						for (var q=0;q<parent[i].children.length;q++){

							var childrenObj = {};

							var subViewData = parent[i].children[q];

							var mesh = e.meshes[subViewData.mesh];
							var material = e.materials[subViewData.material];

							childrenObj.meshData = mesh;
							childrenObj.materialData = material;
							childrenObj.id = subViewData.id;

							parentObj.children.push(childrenObj);
				
						}

						this.parentData.push(parentObj);
					}
				
				}

			}

		}

	}

	// this._animation.views[this._parentView.data.id] = this._parentView;
	// for (var i=0;i<subViews.length;i++){
	// 	this._animation.views[subViews[i].data.id] = subViews[i];
	// }

	// debugger;

	this.dataLoaded = true;

	this.onLoadedCallback.call(this.callbackScope, this);

	// var self = this;
	// setTimeout(function(){

	// 	self._animation.start();
	// },2000);
};


module.exports = ColladaLoader;