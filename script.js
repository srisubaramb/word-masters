const letters = document.querySelectorAll('.scoreboard-letter');
const heading = document.querySelector('.heading');
const info = document.querySelector('.info');
const sprial = document.querySelector('.sprial');
const MAX_WORD_LEN = 5;
const MAX_ROW = 6;

async function init() {
    let word = '';
    let rowIn = 0;
    updateInfo();
    function isLetter(str) {
        return str.length === 1 && str.match(/[A-Z]/i);
    }
    function updateScoreBoradLetter(val) {
        letters[rowIn * MAX_WORD_LEN + word.length - 1].textContent = val;
    }
    function updateScoreboardLetters(letter) {
        if(word.length < MAX_WORD_LEN) 
            word += letter;
        else 
            word = word.substring(0, 4) + letter;
        updateScoreBoradLetter(letter);
    }
    function updateInfo() {
        info.textContent = `${MAX_ROW - rowIn} guesses left `;
    }

    async function fetchWord() {
        const response = await fetch('https://words.dev-apis.com/word-of-the-day');
        const data = await response.json();
        return data.word.toUpperCase();
    }

    async function checkWord(guess) {
       const word = await fetchWord();
       console.log(word);
       const wordPart = word.split('');
       const wordPartMap = mapLetter(wordPart);

       const guessPart = guess.split('');
       let keepTrack = 0;
       for(let i = 0; i < MAX_WORD_LEN; i++) {
        if(guessPart[i] === wordPart[i]) {
            letters[rowIn * MAX_WORD_LEN + i].classList.add('correct');
            wordPartMap[wordPart[i]]--;
            keepTrack++;
        }
       }
       //if all letters matched !!
       if(keepTrack === MAX_WORD_LEN) {
            console.log('You won!');
            heading.classList.add('raindow-animation');
            info.classList.remove('hidden');
            info.classList.add('info-success');
            info.textContent = 'You Win🥳';
            return;
       } 
       for(let i = 0; i < MAX_WORD_LEN; i++) {
        if(guessPart[i] === wordPart[i]) continue;
        else if(wordPart.includes(guessPart[i]) && wordPartMap[guessPart[i]] > 0) {
            letters[rowIn * MAX_WORD_LEN + i].classList.add('present');
            wordPartMap[guessPart[i]]--;
        }
       }
       info.classList.remove('hidden');
       if(keepTrack >= 3) {
            info.textContent = `Pretty close!`;
       } else {
            info.textContent = 'Try again!';
       }
       setTimeout(updateInfo, 2250);
    }

    async function enterHandler() {
        if(word.length === 5) {
            sprial.classList.remove('hidden');
            sprial.classList.add('loading');
            await checkWord(word);
            sprial.classList.add('hidden');
            sprial.classList.remove('loading');
            rowIn++;
            word = '';
        }
        else console.log('Balance letters?')
    }
    function backspaceHandle() {
        if(word.length > 0) {
            //since wlen - 1 updating scoreboard letter before
            updateScoreBoradLetter('');
            word = word.substring(0, word.length - 1);
        }
    }
    document.addEventListener('keydown', function keypressHandler(event) {
        const key = event.key.toUpperCase();
        if(isLetter(key)) 
                updateScoreboardLetters(key);
        else if(key === 'ENTER') 
                enterHandler();
        else if(key === 'BACKSPACE')
                backspaceHandle();
        else { }
    })
}
init();

function mapLetter(array) {
    const obj = {};
    for(let i = 0; i < array.length; i++){
        const letter = array[i];
        if(obj[letter]) {
            obj[letter]++;
        }
        else {
            obj[letter] = 1;
        }
    }
    return obj;
}