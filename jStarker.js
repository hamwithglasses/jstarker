//jStarker - Javascript Cello
//Uses the web audio API to create a playable cello with a QWERTY keyboard.
//Currently only works in Chrome.
//kegh.am

(function(window) {

	var context = new AudioContext(),
	oscillator;

	var jStarker = function(){
		var starker = {};
		var keysPressed = {};
		var active = {};

		//Sound object
		var note = (function(context){
			function note(frequency){
				this.frequency = frequency;
				this.oscillators = [];
			};

			note.prototype.start = function(){
				var n = context.createOscillator();
				n.type = 0;
				n.frequency.value = this.frequency;

				n.connect(context.destination);

				n.start(0);

				this.oscillators.push(n);
			}

			note.prototype.stop = function(){
				this.oscillators.forEach(function(oscillator) {
					oscillator.stop();
				});
			}

			return note;
		})(context);

		//keyCode to note on the cello
		var keyToString = {
			//A String
			48: 'A4',49:'A#4',50:'B4',51:'C5',52:'C#5',53:'D5',54:'D#5',55:'E5',56:'F5',57:'F#5',
			//D String
			80:'D4',81:'D#4',87:'E4',69:'F4',82:'F#4',84:'G4',89:'G#4',85:'A4',73:'A#4',79:'B4',
			//G String
			186:'G3',65:'G#3',83:'A3',68:'A#3',70:'B3',71:'C4',72:'C#4',74:'D4',75:'D#4',76:'E4',
			//C String
			191:'C3',90:'C#3',88:'D3',67:'D#3',86:'E3',66:'F3',78:'F#3',77:'G3',188:'G#3',190:'A3'
		}

		//Note hierarchy
		var aString = [57,56,55,54,53,52,51,50,49,48]
		var dString = [79,73,85,89,84,82,69,87,81,80]
		var gString = [76,75,74,72,71,70,68,83,65,186];
		var cString = [190,188,77,78,66,86,67,88,90,191];

		var keyStrings = {
			48:  [57,56,55,54,53,52,51,50,49,48],
			80:  [79,73,85,89,84,82,69,87,81,80],
			186: [76,75,74,72,71,70,68,83,65,186],
			191: [190,188,77,78,66,86,67,88,90,191]
		}

		//Note to Frequency gist from Stuart Memo: https://gist.github.com/stuartmemo/3766449
		var getFrequency = function (note) {
			var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
			octave,
			keyNumber;

			if (note.length === 3) {
				octave = note.charAt(2);
			} else {
				octave = note.charAt(1);
			}

			keyNumber = notes.indexOf(note.slice(0, -1));

			if (keyNumber < 3) {
				keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
			} else {
				keyNumber = keyNumber + ((octave - 1) * 12) + 1;
			}

			return 440 * Math.pow(2, (keyNumber- 49) / 12);
		};


		var getCelloNote = function (keyCode){
			keysPressed[keyCode] = true;

			string = keyStrings[keyCode];

			if(string){
				for(var i = 0; i < string.length; i++){
					if(keysPressed[string[i]]){
						return string[i];
					}
				}
			}
			return false;
		}

		var keyboardDown = function (key) {
			//This is here to block accidentally hitting extra keys eg: tab, enter
			key.preventDefault();

			if(!active[key.keyCode] && !keysPressed[key.keyCode] && keyToString[key.keyCode]){
				var n = getCelloNote(key.keyCode);

				if(n){
					var celloNote = new note(getFrequency(keyToString[n]));
					active[key.keyCode] = celloNote;
					celloNote.start();
				}
			}
		}

		var keyboardUp = function (key) {
			if(keysPressed[191] || keysPressed[80] || keysPressed[48] || keysPressed[186]){
				if(active[key.keyCode]){
					active[key.keyCode].stop();
					delete active[key.keyCode];
				}
			}
			delete keysPressed[key.keyCode];
		}



		window.onkeydown = keyboardDown;
		window.onkeyup = keyboardUp;

		return starker;
	}

	window.jStarker = jStarker;

})(window);