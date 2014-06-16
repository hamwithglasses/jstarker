javascript: (function () {var starkerContext;if(typeof AudioContext==="function")starkerContext=new AudioContext;else starkerContext=new webkitAudioContext;var jStarker=function(e){var t="bow",n=.5,r={},i={},s=false;if(e){if(e.playStyle!==undefined)t=e.playStyle;if(e.masterVolume!==undefined)n=e.masterVolume}var o={48:"A4",49:"A#4",50:"B4",51:"C5",52:"C#5",53:"D5",54:"D#5",55:"E5",56:"F5",57:"F#5",80:"D4",81:"D#4",87:"E4",69:"F4",82:"F#4",84:"G4",89:"G#4",85:"A4",73:"A#4",79:"B4",186:"G3",65:"G#3",83:"A3",68:"A#3",70:"B3",71:"C4",72:"C#4",74:"D4",75:"D#4",76:"E4",191:"C3",90:"C#3",88:"D3",67:"D#3",86:"E3",66:"F3",78:"F#3",77:"G3",188:"G#3",190:"A3"};var u={48:[57,56,55,54,53,52,51,50,49,48],80:[79,73,85,89,84,82,69,87,81,80],186:[76,75,74,72,71,70,68,83,65,186],191:[190,188,77,78,66,86,67,88,90,191]};var a=function(e){return e==186||e==191||e==48||e==80};var f=navigator.userAgent.toLowerCase().indexOf("firefox")>-1;var l=function(e){if(f&&e==59)return 186;return e};var c=function(e){var t=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],n,r,i=0;if(e.length===3)n=e.charAt(2);else n=e.charAt(1);if(s)i=7;r=t.indexOf(e.slice(0,-1))+i+(n-1)*12+4;return 440*Math.pow(2,(r-49)/12)};var h=function(){if(t=="bow"){for(var e in u){d(u[e],i[e])}}};var p=function(e){if(t=="pizz"){var n=u[e];if(n){d(n,i[e])}}};var d=function(e,t){var n=false;for(var i=0;i<e.length;i++){if(r[e[i]]){n=e[i];n=c(o[n]);if(t)t.frequency.setValueAtTime(n,starkerContext.currentTime);break}}};var v=function(e,t){e.type="square";e.frequency.value=t;var r=starkerContext.createGain();r.gain.value=n;e.connect(r);r.connect(starkerContext.destination);e.start(0)};var m=function(e){var t=l(e.keyCode);if(t!=33&&t!=34&&t!=38&&t!=40)e.preventDefault();if(o[t]){r[t]=true;if(a(t)){if(!i[t]){var n=starkerContext.createOscillator();v(n,c(o[t]));i[t]=n;p(t)}}h()}};var g=function(e){var t=l(e.keyCode);if(o[t]){delete r[t];if(a(t)){i[t].stop(0);delete i[t]}h()}else if(t==8){s=!s;console.log("Tenor clef: "+s)}};var y=starkerContext.createOscillator();v(y,440);y.stop(0);window.onkeydown=m;window.onkeyup=g};window.jStarker=jStarker;var cello = new jStarker();alert("jStarker has been enabled.");}());