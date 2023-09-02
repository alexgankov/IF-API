"use strict";

function loaded(){
	statLog = document.getElementById("status");
	panels = document.getElementsByClassName("panel");

    autofunction.loadButtonHTML();

	const select = document.getElementById("voices");
	const voices = speechSynthesis.getVoices();
	for(let i = 0, length = voices.length; i < length; i++) {
		const newOption = new Option(voices[i].lang, i);
		select.add(newOption)
	}

	socket.emit("test", response => {
		statLog.innerText = response;
		console.log(response);
	});
}

function bridge(){
    setHidden(true);

	let address = document.getElementById("address").value;
	const parts = address.split(".");

	if(address !== ""){
		if(parts.length < 2){
			address = "1." + address;
		}
		if(parts.length < 3){
			address = "168." + address;
		}
		if(parts.length < 4){
			address = "192." + address;
		}
	}

    socket.emit("bridge", address, response => {
        statLog.innerText = response;
        console.log(response);
    });
}

function closeBridge(){
	reset();

    socket.emit("break", response => {
        statLog.innerText = response;
        console.log(response);
    });
}

function read(command, callback = () => {}){
    socket.emit("read", command, value => {
		callback(value);
	});
}

function readAsync(command, callback = () => {}){
    socket.emit("readAsync", command, value => {
		callback(value);
	});
}

function readLog(command){
    read(command, value => {console.log(value);});
}

function write(command, value){
    socket.emit("write", command, value);
}

function setHidden(hidden){
	for(let i = 1, length =  panels.length; i < length; i++){
		panels[i].hidden = hidden;
	}
}

function reset(){
	setHidden(true);

    autofunctions.forEach(autofunc => {
		if(autofunc.active){
            autofunc.active = false;
        }
	});
}

function writeLocal(id, value){
    localStorage[id] = JSON.stringify(value);
};

function readLocal(id){
    return JSON.parse(localStorage[id]);
}

function writeSession(id, value){
	sessionStorage[id] = JSON.stringify(value);
};

function readSession(id){
	return JSON.parse(sessionStorage[id]);
};

function debugLogging(type, value){
	const currentTime = Date.now();
	let milliseconds = parseInt(currentTime%1000);
	let seconds = parseInt((currentTime/1000)%60);
	let minutes = parseInt((currentTime/(1000*60))%60);
	let hours = parseInt((currentTime/(1000*60*60))%24);

	milliseconds = (milliseconds < 100) ? "0" + milliseconds : milliseconds;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	hours = (hours < 10) ? "0" + hours : hours;

	const time = "[" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + "]";
	
	const id = time + " - " + type
	console.log(time, "Log Recorded Successfully!");
	writeSession(id, value)
};

let statLog;
let panels;

const socket = io();

socket.on("ready", address => {
	document.getElementById("address").value = address;
    setHidden(false);
});

socket.on("log", response => {
    statLog.innerText = response;
    console.log(response);
});
