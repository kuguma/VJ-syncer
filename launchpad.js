//-----io-----

inlets = 1
outlets = 3
//out0 = data
//out1 = noteout
//out2 = CC(to midiout)


//-----LP-----

var LP = {
	keyMap : [],
	set : function(type,position,colormap,ex){
		switch (type) {
			case "button" :
				var k = new buttonKey(position,colormap)
				break
			case "toggle" :
				var k = new toggleKey(position,colormap)
				break
			case "selectorM" :
				var k = new selectorKeyM(position,colormap,ex)
				break
			case "selectorS" :
				var k = new selectorKeyS(position,colormap,ex)
				break
		}
		this.keyMap[position] = k
	},
	push : function(position,velocity) {
		this.keyMap[position].push(velocity)
	},
	flash : function(position) {
		this.keyMap[position].flash()
	}
}


function mapping() {
	//hard reset
	outlet(2,[176,0,0])

	//all reset
	for (var j=0; j<8; j++) {
		for (var i=0; i<9; i++) {
			LP.set("button",j*16+i,[0,17])
		}
	}
	
	//object1
	LP.set("toggle",0,[16,51])
	LP.set("toggle",1,[16,51])
	LP.set("button",3,[16,3])
	LP.set("button",4,[16,3])
	LP.set("toggle",7,[16,51])
	LP.set("toggle",8,[16,3])
	
	//object2
	LP.set("toggle",16,[16,51])
	LP.set("selectorM",18,[16,51],[18,19,20])
	LP.set("selectorM",21,[16,51],[21,22,23])
	LP.set("toggle",24,[16,3])
	
	//background1
	LP.set("toggle",64,[16,51])
	LP.set("selectorM",66,[16,51],[66,67,68])
	LP.set("toggle",70,[16,51])
	LP.set("toggle",71,[16,51])
	LP.set("toggle",72,[16,3])
	
	
	//flash
	for (var j=0; j<8; j++) {
		for (var i=0; i<9; i++) {
			LP.flash(j*16+i)
		}
	}
	
	post("LP setup done!\n")
}
	


//-----Keys-----
/*
//Key:super
var Key = function(colormap) {
	this.data = 0
	this.colormap = colormap
}
*/

//button
var buttonKey = function(position,colormap) {
	this.position = position
	this.colormap = colormap
}
buttonKey.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			outlet(0,[this.position,1]) //data
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}else{
			outlet(1,[this.position,this.colormap[0]]) //noteout
		}
	},
	flash : function() {
		outlet(0,[this.position,0]) //data
		outlet(1,[this.position,this.colormap[0]]) //noteout
	}
}

//toggle
var toggleKey = function(position,colormap) {
	this.position = position
	this.data = 0
	this.colormap = colormap
}
toggleKey.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			if (this.data==0) this.data = 1
			else this.data = 0
			outlet(0,[this.position,this.data]) //data
			outlet(1,[this.position,this.colormap[this.data]]) //noteout
		}else{
			outlet(1,[this.position,this.colormap[this.data]]) //noteout
		}
	},
	flash : function() {
		outlet(0,[this.position,0]) //data
		outlet(1,[this.position,this.colormap[0]]) //noteout
	}
}

//selector-master
var selectorKeyM = function(position,colormap,ex) {
	this.position = position
	this.colormap = colormap
	this.ex = ex
	this.data = 0
	for(var i=1; i<ex.length; i++) {
		LP.set("selectorS",this.ex[i],this.colormap,this.ex)
	}

}
selectorKeyM.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			for(var i=1; i<this.ex.length; i++) {
				LP.keyMap[this.ex[i]].off()
			}
			outlet(0,[this.position,this.data]) //data
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}else{
			for(var i=1; i<this.ex.length; i++) {
				LP.keyMap[this.ex[i]].off()
			}
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}
	},
	flash : function() {
		outlet(0,[this.position,0]) //data
		outlet(1,[this.position,this.colormap[1]]) //noteout
	},
	off : function () {
		outlet(1,[this.position,this.colormap[0]]) //noteout
	}
}

//selector-slave
var selectorKeyS = function(position,colormap,ex) {
	this.position = position
	this.colormap = colormap
	this.ex = ex
	for(var i=0; i<this.ex.length; i++) {
		if(this.ex[i] == this.position) this.data = i
	}
}
selectorKeyS.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			for(var i=0; i<this.ex.length; i++) {
				if(i!=this.data) LP.keyMap[this.ex[i]].off()
			}
			outlet(0,[this.position,this.data]) //data
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}else{
			for(var i=0; i<this.ex.length; i++) {
				if(i!=this.data) LP.keyMap[this.ex[i]].off()
			}
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}
	},
	flash : function() {
		outlet(0,[this.position,0]) //data
		outlet(1,[this.position,this.colormap[0]]) //noteout
	},
	off : function () {
		outlet(1,[this.position,this.colormap[0]]) //noteout
		
	}
}



//-----common-----

function loadbang() {
	mapping()
}

function bang() {}
function msg_int() {}
function msg_float() {}

function reset() {
	mapping()
}

function anything() {
		var position = arguments[0]
		var velocity = arguments[1]
		LP.push(position,velocity)
}
	
