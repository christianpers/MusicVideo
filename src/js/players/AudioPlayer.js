//AudioPlayer.js

function AudioPlayer(){};

var p = AudioPlayer.prototype;

p.init = function(ctx, onBufferLoadedCallback, callbackScope){

	this._ctx = ctx;
	this._buffer = null;
	this._sourceNode = null;
	this.paused = false;
	this.pausedTimestamp = undefined;
	this.startedTimestamp = undefined;
	this.triggeredPlay = false;

	this.isLoaded = false;

	this._onBufferLoadedCallback = onBufferLoadedCallback;
	this._callbackScope = callbackScope;

	

};

p.load = function(url){

	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	var self = this;
	request.onload = function() {
	    self._ctx.decodeAudioData(request.response, self.onBufferLoaded.bind(self), self.onBufferError.bind(self));
	};
	request.send();

};

p.onBufferLoaded = function(buffer){


	// var leftPCM = buffer.getChannelData(0);
	// var rightPCM = buffer.getChannelData(1);

	// console.log(leftPCM.length);
	// debugger;

	// var firstHalf = leftPCM.slice(0, 1000000);

	// var str = firstHalf.join('%20');
	// var params = "array=" + str;
	// var http = new XMLHttpRequest();
	// http.open("POST", "save.php", true);

	// //Send the proper header information along with the request
	// http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// // http.setRequestHeader("Content-length", params.length);
	// // http.setRequestHeader("Connection", "close");

	// http.onreadystatechange = function() {
	//     if(http.readyState == 4 && http.status == 200) {
	//         // Do something on success?
	//         debugger;
	//     }
	// }
	// http.send(params);
	// // console.table(leftPCM)
	// debugger;
	// // console.log(buffer);

	this._buffer = buffer;
	this.isLoaded = true;
	this._onBufferLoadedCallback.call(this._callbackScope);
	
};

p.onBufferError = function(){


};

p.pause = function(){

	this._sourceNode.stop(0);
	this.pausedTimestamp = Date.now() - this.startedTimestamp;
	this.paused = true;

};

p.reset = function(){

	this.pausedTimestamp = undefined;

};

p.getSourceNode = function(){

	return this._sourceNode;
};

p.play = function(wait){

	this.triggeredPlay = true;

	this._sourceNode = this._ctx.createBufferSource();
	this._sourceNode.connect(this._ctx.destination);
	this._sourceNode.buffer = this._buffer;
	this.paused = false;

	if (this.pausedTimestamp !== undefined){
		this.startedTimestamp = Date.now() - this.pausedTimestamp;
		this._sourceNode.start(0, this.pausedTimestamp / 1000);
	}else{

		if (wait){
			var self = this;
			setTimeout(function(){
				self.startedTimestamp = Date.now();
				self._sourceNode.start(0);

			},wait);
		}else{
			this.startedTimestamp = Date.now();
			this._sourceNode.start(0);
		}
		
	}

};

module.exports = AudioPlayer;