//jStarker - Javascript Cello
//Uses the web audio API to create a playable cello with a QWERTY keyboard.
//kegh.am
(function(window) {
	var context;

	if (typeof AudioContext === 'function')
		context = new AudioContext();
	else
		context = new webkitAudioContext();

	var jStarker = function() {
			var keysPressed = {}, active = {},
				isTenor = false, masterVolume = 1;

			//EN keyboard mapping
			var keyToString = {
				//A String
				48: 'A4',49:'A#4',50:'B4',51:'C5',52:'C#5',53:'D5',54:'D#5',55:'E5',56:'F5',57:'F#5',
				//D String
				80:'D4',81:'D#4',87:'E4',69:'F4',82:'F#4',84:'G4',89:'G#4',85:'A4',73:'A#4',79:'B4',
				//G String
				186:'G3',65:'G#3',83:'A3',68:'A#3',70:'B3',71:'C4',72:'C#4',74:'D4',75:'D#4',76:'E4',
				//C String
				191:'C3',90:'C#3',88:'D3',67:'D#3',86:'E3',66:'F3',78:'F#3',77:'G3',188:'G#3',190:'A3'
			};

			//Checks if FF: http://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js
			var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

			//Helps handle any browser/keyboard differences
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

			//Takes a keyboard keycode and returns the highest key pressed on teh string
			//Keycode being passed should be a string key: 0 p ; /
			var getCelloNote = function(keyCode) {
				//Note hierarchy for each string
				var noteOrder = {
					48: [57, 56, 55, 54, 53, 52, 51, 50, 49, 48],
					80: [79, 73, 85, 89, 84, 82, 69, 87, 81, 80],
					186: [76, 75, 74, 72, 71, 70, 68, 83, 65, 186],
					191: [190, 188, 77, 78, 66, 86, 67, 88, 90, 191]
				};

				//Makes sure key pressed is a string key
				var string = noteOrder[keyCode];
				if (string) {
					for (var i = 0; i < string.length; i++) {
						if (keysPressed[string[i]])
							return string[i];
					}
				}
				return false;
			};

			var keyboardDown = function(key) {
				key.preventDefault();
				var keyCode = keyboardSupport(key.keyCode);

				//Checks if we're dealing with a supported note key
				if(keyToString[keyCode]){

					//Makes sure the key is not pressed and the string is not playing
					if (!active[keyCode] && !keysPressed[keyCode]) {
						keysPressed[keyCode] = true;

						var n = getCelloNote(keyCode);
						if (n) {
							var oscillator = context.createOscillator();
							playNote(oscillator, getFrequency(keyToString[n]));
							active[keyCode] = oscillator;
						}
					}
				}else if(keyCode == 8){
					//Toggles tenor clef state
					isTenor = !isTenor;
					console.log('Tenor clef: ' + isTenor);
				}
			};

			var keyboardUp = function(key) {
				var keyCode = keyboardSupport(key.keyCode);

				//Only stops note if string key is lifted
				if (keysPressed[191] || keysPressed[80] || keysPressed[48] || keysPressed[186]) {
					if (active[keyCode]) {
						active[keyCode].stop(0);
						delete active[keyCode];
					}
				}
				delete keysPressed[keyCode];
			};

			//Add sound generation/playing here
			var playNote = function(osc, frequency){
				osc.type = 'square';
				osc.frequency.value = frequency;

				var gain = context.createGain();
				gain.gain.value = masterVolume;

				osc.connect(gain);
				gain.connect(context.destination);

				osc.start(0);
			};

			window.onkeydown = keyboardDown;
			window.onkeyup = keyboardUp;
		};

		window.jStarker = jStarker;
})(window);