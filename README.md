#jStarker
jStarker is a javascript virtual instrument that turns your QWERTY keyboard into a playable cello.


##How to Play
While you can use jStarker with any QWERTY keyboard, it's best to use an external keyboard. I personally use an Apple corded keyboard, but any thin keyboard with very little bezel should do the trick.

1. Hold your keyboard upright with your left hand while placing your right hand below in range of the `/ ; P 0` keys (string keys). Because the keys on the keyboard are at an angle, your positioning will actually feel more like playing a ukulele. Ultimately, go with a keyboard position that feels the most comfortable to you while allowing you to access all of the string keys.

2. The `/ ; P 0` keys represent the `C G D A` strings on the cello respectively. These lower keys serve as the strings you 'pluck' to play notes. To make some sweet tunes, press and hold a key you'd like to play and press its corresponding string key.


##Additional Controls
**Tenor Clef**: Pressing the `DELETE` key toggles tenor clef mode. This mode allows the instrument to play all notes a fifth higher.


##Limitations
jStarker currently uses the [Web Audio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html) to create sound, so be aware that this instrument will only work in modern browsers. To implement your own sound playback edit the `playNote()` function.

**Beware of ghosting!** [Go here](http://www.microsoft.com/appliedsciences/antighostingexplained.mspx) to learn more about ghosting and to visually see what key combinations may cause issues for you.


##More to Come
A default UI is in the works as well as a visual playthrough guide that'll streamline the learning curve for playing and reading cello music.