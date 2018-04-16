# jStarker
jStarker is a javascript virtual instrument that turns your QWERTY keyboard into a playable cello.


## Playing the Cello

### How to Play
While you can use jStarker with any QWERTY keyboard, it's best to use an external keyboard. I personally use an Apple corded keyboard, but any thin keyboard with very little bezel should do the trick.

1. Hold your keyboard upright with your left hand while placing your right hand below in range of the `/ ; P 0` keys (string keys). Because the keys on the keyboard are at an angle, your positioning will actually feel more like playing a ukulele. Ultimately, go with a keyboard position that feels the most comfortable to you while allowing you to access all of the string keys.

2. The `/ ; P 0` keys represent the `C G D A` strings on the cello respectively. These lower keys serve as the strings you 'pluck' to play notes. To make some sweet tunes, press and hold a key you'd like to play and press its corresponding string key.

### Play Styles
There are two different styles available to play with jStarker.

- Pizz Style: This style is very forgiving and closely emulates playing pizzicato on the cello. Each new note that you want to play needs to be initiated with a string key press. Because of this, playback is rigid and requires a lot more keypresses and fast passages can be challenging.

- Bow Style: This style is less forgiving and better emulates actually playing a cello. Pressing a string key leaves the string open for you to play other notes on the string. With this style you can pull off glissandos (albeit rigid ones), trills, and ornaments with ease. However, since the string key stays open, your fingering and pressing of string keys needs to be timed and executed more precisely.


## Additional Controls
**Tenor Clef**: Pressing the `DELETE` key toggles tenor clef mode. This mode allows the instrument to play all notes a fifth higher.


## Limitations
jStarker currently uses the [Web Audio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html) to create sound, so be aware that this instrument will only work in modern browsers. To implement your own sound playback edit the `playNote()` function.

**Beware of ghosting!** [Go here](http://www.microsoft.com/appliedsciences/antighostingexplained.mspx) to learn more about ghosting and to visually see what key combinations may cause issues for you.


## More to Come
A default UI is in the works as well as a visual playthrough guide that'll streamline the learning curve for playing and reading cello music.
