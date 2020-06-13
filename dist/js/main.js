// Initializing SpeechSynthesis(Text-to-Speech) API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const voiceSelect = document.querySelector('#voice-select');
const body = document.querySelector('body');

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Fetching voices using API
let voices = [];

const getVoices = () => {
  // reaches into speech synthesis api, and is called asynchronously and we need to wait for an event called onvoiceschanged to happen
  voices = synth.getVoices();
  // console.log(voices); // will return empty array

  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';

    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    // take each itr and append option
    voiceSelect.appendChild(option);
  });
};


getVoices();

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  // This will happen if the button is clicked, during the process of speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    // Add background animation
    body.style.background = '#040404 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x'; // repeat horizontally
    body.style.backgroundSize = '100% 100%';

    // Get the text from i/p field
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // When speaking is done
    speakText.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#040404'; //to close the animation after speaking is done
    };

    // Error while speaking
    speakText.onerror = e => {
      console.error('An error occurred!');
    };

    // Selecting the voice from options, not from api
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );

    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set frequency and pitch
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Speak
    synth.speak(speakText);
  }
};

// Event Listeners

// Text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault(); // prevent from submitting to file
  speak();
  textInput.blur();
});

// Frequency value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener('change', e => speak());
