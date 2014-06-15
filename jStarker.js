/*
jStarker - cello keyboard v0.2
Uses the web audio API to create a playable cello with a QWERTY keyboard.

Copyright 2014, Kegham Bedoyan
 */

(function(window) {
	var CONTEXT;

	if (typeof AudioContext === 'function')
		CONTEXT = new AudioContext();
	else
		CONTEXT = new webkitAudioContext();

	var jStarker = function(settings) {
			var drawCello = true, playStyle = 'bow',masterVolume = .5,//default settings
				keysPressed = {}, active = {},//note tracking
				isTenor = false

			if(settings){
				if(settings['drawCello'] !== undefined)
					drawCello = settings['drawCello'];
				if(settings['playStyle'] !== undefined)
					playStyle = settings['playStyle'];
				if(settings['masterVolume'] !== undefined)
					masterVolume = settings['masterVolume'];
			}

			//The master keyboard mapping (EN)
			//Any keyboard variations/differences should be handled in keyboardSupport()
			var keyToString = {
				48: 'A4',49:'A#4',50:'B4',51:'C5',52:'C#5',53:'D5',54:'D#5',55:'E5',56:'F5',57:'F#5',//A String
				80:'D4',81:'D#4',87:'E4',69:'F4',82:'F#4',84:'G4',89:'G#4',85:'A4',73:'A#4',79:'B4',//D String
				186:'G3',65:'G#3',83:'A3',68:'A#3',70:'B3',71:'C4',72:'C#4',74:'D4',75:'D#4',76:'E4',//G String
				191:'C3',90:'C#3',88:'D3',67:'D#3',86:'E3',66:'F3',78:'F#3',77:'G3',188:'G#3',190:'A3'//C String
			};

			//Note hierarchy for each string
			//Only supports 9 halfsteps per string
			var noteOrder = {
				48: [57, 56, 55, 54, 53, 52, 51, 50, 49, 48],
				80: [79, 73, 85, 89, 84, 82, 69, 87, 81, 80],
				186: [76, 75, 74, 72, 71, 70, 68, 83, 65, 186],
				191: [190, 188, 77, 78, 66, 86, 67, 88, 90, 191]
			};

			//Checks if the keyCode being passed is a string key
			//Expected string keys are / ; p 0
			var isStringKey = function(keyCode){
				return keyCode == 186 || keyCode == 191 || keyCode == 48 || keyCode == 80;
			}

			//Checks if FF: http://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js
			var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

			//Helps handle any browser/keyboard differences
			//Refer to the keyToString mapping to resolve any differences
			var keyboardSupport = function(keyCode){
				//FF has a different keycode for the ';' key
				if(isFirefox && keyCode == 59)
					return 186;

				return keyCode;
			};

			//Note to Frequency gist: https://gist.github.com/hamwithglasses/5e7a9713691b025ed59e
			var getFrequency = function(note) {
				var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
					octave, keyNumber, mod = 0;
				if (note.length === 3)
					octave = note.charAt(2);
				else
					octave = note.charAt(1);

				//Modifier for tenor clef
				if(isTenor)
					mod = 7;

				keyNumber = notes.indexOf(note.slice(0, -1)) + mod + ((octave - 1) * 12) + 4;
				return 440 * Math.pow(2, (keyNumber - 49) / 12);
			};

			//Updates the frequency for the bow style of playing (default)
			//This style keeps the string key open, allowing for trills, slurs, gliss, etc.
			//Due to the open string, this style is far less forgiving technically. However, this is definitely the best style to use to vary articulation.
			var updateBowFreq = function(){
				if(playStyle == 'bow'){
					for(string in noteOrder){
						updateFreq(noteOrder[string], active[string]);
					}
				}
			}

			//Updates the frequency for the pizz style of playing
			//The pizz style is far more forgiving than the bow style since it only allows for one note to play per press of a string key. However, play back is rigid and requires significantly more interaction with the string keys.
			var updatePizzFreq = function(keyCode){
				if(playStyle == 'pizz'){
					var order = noteOrder[keyCode];
					if (order) {
						updateFreq(order, active[keyCode]);
					}
				}
			}

			//Changes the frequency of a note being played
			var updateFreq = function(order, activeNote){
				var newFreq = false;
				for (var i = 0; i < order.length; i++) {
					if (keysPressed[order[i]]){
						newFreq = order[i];
						newFreq = getFrequency(keyToString[newFreq]);
						if(activeNote)
							activeNote.frequency.setValueAtTime(newFreq, CONTEXT.currentTime);
						break;
					}
				}
			}

			//Creates a basic square sound
			var playNote = function(osc, frequency){
				osc.type = 'square';
				osc.frequency.value = frequency;

				var gain = CONTEXT.createGain();
				gain.gain.value = masterVolume;

				osc.connect(gain);
				gain.connect(CONTEXT.destination);

				osc.start(0);
			};

			var keyboardDown = function(key){
				key.preventDefault();
				var keyCode = keyboardSupport(key.keyCode);

				if(keyToString[keyCode]){
					keysPressed[keyCode] = true;
					updateUI();

					if(isStringKey(keyCode)){
						if(!active[keyCode]){
							var oscillator = CONTEXT.createOscillator();
							playNote(oscillator, getFrequency(keyToString[keyCode]));
							active[keyCode] = oscillator;
							updatePizzFreq(keyCode);
						}
					}
					updateBowFreq();
				}else if(keyCode == 8){
					//Toggles tenor clef state
					isTenor = !isTenor;
					console.log('Tenor clef: ' + isTenor);
				}
			}

			var keyboardUp = function(key){
				var keyCode = keyboardSupport(key.keyCode);

				if(keyToString[keyCode]){
					delete keysPressed[keyCode];
					updateUI();

					if(isStringKey(keyCode)){
						active[keyCode].stop(0);
						delete active[keyCode];
					}
					updateBowFreq();
				}
			}




			//UI Stuff

			//jQuery-like hasClass addClass removeClass: http://toddmotto.com/creating-jquery-style-functions-in-javascript-hasclass-addclass-removeclass-toggleclass/
			function hasClass(elem, className) {
				return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
			}
			function addClass(elem, className) {
				if (!hasClass(elem, className)) {
					elem.className += ' ' + className;
				}
			}
			function removeClass(elem, className) {
				var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
				if (hasClass(elem, className)) {
					while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
						newClass = newClass.replace(' ' + className + ' ', ' ');
					}
					elem.className = newClass.replace(/^\s+|\s+$/g, '');
				}
			}

			//Updates the current state of the keyboard UI
			var updateUI = function(){
				if(drawCello){
					//key pressing toggling
					var clearPressed = document.querySelector('#jStarker .pressed');
					while(clearPressed){
						removeClass(clearPressed, 'pressed');
						clearPressed = document.querySelector('#jStarker .pressed');
					}
					for(key in keysPressed){
						var k = document.getElementById('key' + key)
						if(k){
							addClass(k, 'pressed');
						}
					}
				}
			}

			//Draws base keyboard UI
			var drawKeyboard = function(){
				var ul = document.createElement('ul');
				ul.id = 'jStarker';
				ul.style.listStyle = 'none';
				ul.style.padding = 0;
				ul.style['-webkit-user-select'] = 'none';

				ul.appendChild(drawString(191, 'c'));
				ul.appendChild(drawString(186, 'g'));
				ul.appendChild(drawString(80, 'd'));
				ul.appendChild(drawString(48, 'a'));

				document.body.appendChild(ul);
			}

			var drawString = function(keyCode, stringName){
				var fingering = ['0', '-', '1', '2', '3', '4', '+'];
				var li = document.createElement('li');

				var notes = noteOrder[keyCode];

				var stringUL = document.createElement('ul');
				stringUL.id = stringName + '-string';
				stringUL.style.listStyle = "none";
				stringUL.style.padding = 0;

				for(var i = 1; i < 7 + 1; i++){

					var key = document.createElement('li');
					key.style.cursor = 'pointer';

					if(i == 7){
						key.innerHTML = fingering[0];
						key.id = 'key' + notes[notes.length - 1];
					}else{
						key.innerHTML = fingering[i];
						key.id = 'key' + notes[notes.length - 1 - i];
					}
					stringUL.appendChild(key);
				}
				return li.appendChild(stringUL);
			}

			if(drawCello)
				drawKeyboard();

			window.onkeydown = keyboardDown;
			window.onkeyup = keyboardUp;
		};

		window.jStarker = jStarker;
})(window);