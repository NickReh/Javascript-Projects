function NODE(NumberOfNodes){
	this.Output;
	this.Weight = [];
	this.WeightDiff = [];
	for(var i = 0; i < NumberOfNodes; i++){
		this.Weight.push(-1 + 2 * Math.random());
		this.WeightDiff.push(0.0);
	}
	this.Threshold = -1 + 2 * Math.random();
	this.ThresholdDiff = 0;
	this.SignalError;
}

function LAYER(NumberOfNodes, NumberOfInputs){
	var Net;
	this.Input = [];
	for(var j_c = 0; j_c < NumberOfInputs; j_c++){
		this.Input.push(0.0);
	}
	this.Node = [];
	for(var i_c = 0; i_c < NumberOfNodes; i_c++){
		this.Node.push(new NODE(NumberOfInputs));
	}
	this.FeedForward = function(){
		for(var i = 0; i < this.Node.length; i++){
			this.Net = this.Node[i].Threshold;
			for(var j = 0; j < this.Node[i].Weight.length; j++){
				this.Net += this.Input[j] * this.Node[i].Weight[j];
			}
			this.Node[i].Output = Sigmoid(this.Net);
		}
	}
	function Sigmoid(Net){
		return 1 / (1 + Math.exp(-Net));
	}
	this.OutputVector = function(){
		var Vector = [];
		for(var i = 0; i < this.Node.length; i++){
			Vector.push(this.Node[i].Output);
		}
		return Vector;
	}
}

function BackPropagation(NumberOfNodes, LearnRate, Moment, MinError){
	//variables and setup
	//var die = false;
	var OverallError;
	var MinimumError = MinError;
	var LearningRate = LearnRate;
	var Momentum = Moment;
	var NumberOfLayers = NumberOfNodes.length;
	this.Layer = [];
	this.Layer.push(new LAYER(NumberOfNodes[0], NumberOfNodes[0]));
	for(var i = 1; i < NumberOfLayers; i++){
		this.Layer.push(new LAYER(NumberOfNodes[i], NumberOfNodes[i - 1]));
	}
	this.ActualOutput = new Array(this.Layer[NumberOfLayers - 1].Node.length);
	
	//Methods
	this.FeedForward = function(){
		for(var i = 0; i < this.Layer[0].Node.length; i++){
			this.Layer[0].Node[i].Output = this.Layer[0].Input[i];
		}
		this.Layer[1].Input = this.Layer[0].Input;
		for(var j = 1; j < NumberOfLayers; j++){
			this.Layer[j].FeedForward();
			if(j != NumberOfLayers - 1){
				this.Layer[j + 1].Input = this.Layer[j].OutputVector();
			}
		}
	}
	this.UpdateWeights = function(Output){
		this.CalculateSignalErrors(Output);
		this.BackPropagateError();
	}
	this.CalculateSignalErrors = function(Output){
		var Sum;
		var OutputLayer = NumberOfLayers - 1;
		for(var n = 0; n < this.Layer[OutputLayer].Node.length; n++){
			this.Layer[OutputLayer].Node[n].SignalError = (Output[n] - this.Layer[OutputLayer].Node[n].Output) *
															this.Layer[OutputLayer].Node[n].Output * (1 - this.Layer[OutputLayer].Node[n].Output);
		}
		for(var i = NumberOfLayers - 2; i > 0; i--){
			for(var j = 0; j < this.Layer[i].Node.length; j++){
				Sum = 0;
				for(var k = 0; k < this.Layer[i + 1].Node.length; k++){
					Sum = Sum + this.Layer[i + 1].Node[k].Weight[j] * this.Layer[i + 1].Node[k].SignalError;
				}
				this.Layer[i].Node[j].SignalError = this.Layer[i].Node[j].Output * (1 - this.Layer[i].Node[j].Output) * Sum;
			}
		}
	}
	this.BackPropagateError = function(){
		for(var i = NumberOfLayers - 1; i > 0; i--){
			for(var j = 0; j < this.Layer[i].Node.length; j++){
				this.Layer[i].Node[j].ThresholdDiff = LearningRate * this.Layer[i].Node[j].SignalError + Momentum * this.Layer[i].Node[j].ThresholdDiff;
				this.Layer[i].Node[j].Threshold += this.Layer[i].Node[j].ThresholdDiff;
				for(var k = 0; k < this.Layer[i].Input.length; k++){
					this.Layer[i].Node[j].WeightDiff[k] = LearningRate * this.Layer[i].Node[j].SignalError * this.Layer[i - 1].Node[k].Output + Momentum * this.Layer[i].Node[j].WeightDiff[k];
					this.Layer[i].Node[j].Weight[k] += this.Layer[i].Node[j].WeightDiff[k];
				}
			}
		}
	}
	this.CalculateOverallError = function(ExpectedOutput){
		OverallError = 0;
		for(var j = 0; j < this.Layer[NumberOfLayers - 1].Node.length; j++){
			OverallError += 0.5 * (math.pow(ExpectedOutput[j] - this.ActualOutput[j], 2));
		}
	}
	this.TrainNetwork = function(Input, Output){
		if(Input.length != this.Layer[0].Node.length)
			return;
							
		for(var i = 0; i < this.Layer[0].Node.length; i++){
			this.Layer[0].Input[i] = Input[i];
		}
		this.FeedForward();
		for(var j = 0; j < this.Layer[NumberOfLayers - 1].Node.length; j++){
			this.ActualOutput[j] = this.Layer[NumberOfLayers - 1].Node[j].Output;
		}
		this.UpdateWeights(Output);
		
		/*if(die){
			if(parent != null){
				parent.net_done();
			}
			return;
		}
		if(parent != null){
			parent.draw();
		}
		
		if(parent != null){
			parent.draw();
			parent.net_done();
		}*/
	}
	this.Test = function(input){
		var winner = 0;
		var output_nodes;
		for(var j = 0; j < this.Layer[0].Node.length; j++){
			this.Layer[0].Input[j] = input[j];
		}
		this.FeedForward();
		output_nodes = (this.Layer[this.Layer.length - 1]).Node;
		for(var k = 0; k < output_nodes.length; k++){
			if(output_nodes[winner].Output < output_nodes[k].Output){
				winner = k;
			}
		}
		return winner;
	}
	this.GetError = function(ExpectedOutput){
		this.CalculateOverallError(ExpectedOutput);
		return OverallError;
	}
	this.ToJson = function(){
		var net = {"layers" : []};
		
		var win = 0
		for(var k = 0; k < (this.Layer[this.Layer.length - 1]).Node.length; k++){
			if((this.Layer[this.Layer.length - 1]).Node[win].Output < (this.Layer[this.Layer.length - 1]).Node[k].Output){
				win = k;
			}
		}
		net.winner = win;
		
		net.layers.push({"nodes" : this.Layer[0].Input});
		for(var i = 1; i < this.Layer.length; i++){
			net.layers.push({"nodes" : []});
			for(var j = 0; j < this.Layer[i].Node.length; j++){
				net.layers[i].nodes.push({"weights" : this.Layer[i].Node[j].Weight, "output" : this.Layer[i].Node[j].Output});
			}
		}
		return net;
	}
	/*this.Run = function(){
		TrainNetwork();
	}
	this.Kill = function(){
		die = true;
	}*/
	
	//XOR
	/*var neurons= [];
	neurons[0] = 2;
	neurons[1] = 3;
	neurons[2] = 1;
	
	var net = new BackPropagation(neurons, 0.3, 0.9, 0.01);
	var outputString = "Input:";
	var Input1 = [1,0];
	var Input2 = [0,1];
	var Input3 = [1,1];
	var Input4 = [0,0];
	var Output1 = [1];
	var Output2 = [1];
	var Output3 = [0];
	var Output4 = [0];
	for(var i = 0; i < 200; i++){
		console.log("Input 1:0, Ideal 1, Output = " + net.Test(Input1));
		console.log("Input 0:1, Ideal 1, Output = " + net.Test(Input2));
		console.log("Input 1:1, Ideal 0, Output = " + net.Test(Input3));
		console.log("Input 0:0, Ideal 0, Output = " + net.Test(Input4));
		net.TrainNetwork(Input1, Output1);
		net.TrainNetwork(Input2, Output2);
		net.TrainNetwork(Input3, Output3);
		net.TrainNetwork(Input4, Output4);
	}*/
}