inlets = 3
outlets = 2

var tempo = 120

function loadbang(){}
	
function set_tempo(val){

}

function msg_int(val){
	if (inlet==0) {
		tempo = val
		outlet(0,tempo)
		outlet(1,1)
	}
}

function bang(){
	if (inlet==1) {
		tempo = tempo-1
		outlet(0,tempo)
	}
	if (inlet==2) {
		tempo = tempo+1
		outlet(0,tempo)
	}
}
