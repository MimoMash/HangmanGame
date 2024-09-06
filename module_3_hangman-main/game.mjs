//#region Dont look behind the curtain
// Do not worry about the next two lines, they just need to be there. 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}

//#endregion

import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';

const wordsList = ["Cat", "Kebab", "Fruit", "Coding", "Banana", "Life", "Glasses", "Monitor", "Ducky", "Statue", "Bed"];
let randomNumber;
let correctWord = wordsList[getRandomNumber()].toLowerCase();
let numberOfCharInWord = correctWord.length; 
const noMagicString = {
    emptySpace: "",
    underscore: "_",
    space: " "
}
const textToPlayer = {
    winMessage: "Congratulations, winner winner chicken dinner!",
    gameOver: "Game Over!",
    requestGuess: "Guess a character or the word : ",
    playAgain: "Do you wish to play again? y/n : ",
    yes: "y",
    endOfGame: "Until next time!",
    wrongGuess: "You guessed wrong",
    times: "time(s)"
}
let guessedWord = noMagicString.emptySpace.padStart(correctWord.length, noMagicString.underscore);
let wordDisplay;
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];



function getRandomNumber() {
    randomNumber = Math.floor(Math.random() * wordsList.length); 
    return randomNumber
}

function ifPlayerGuessedLetter(answer) {
    return answer.length == 1
}

function drawWordDisplay() {

    wordDisplay = noMagicString.emptySpace;

    for (let i = 0; i < numberOfCharInWord; i++) {
        if (guessedWord[i] != noMagicString.underscore) {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay += guessedWord[i] + noMagicString.space;
        wordDisplay += ANSI.RESET;
    }

    return wordDisplay;
}

function displayWrongGuesses(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + noMagicString.space;
    }

    return output + ANSI.RESET;
}


function resetGame() {
    correctWord = wordsList[getRandomNumber()].toLowerCase();
    numberOfCharInWord = correctWord.length;
    guessedWord = noMagicString.emptySpace.padStart(correctWord.length, noMagicString.underscore);
    wordDisplay = noMagicString.emptySpace;
    isGameOver = false;
    wasGuessCorrect = false;
    wrongGuesses = [];
}

async function playGame() {
    resetGame();

    while (isGameOver == false) {

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(displayWrongGuesses(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuesses.length]);

    const answer = (await askQuestion(textToPlayer.requestGuess)).toLowerCase();

    if (answer == correctWord) {
        isGameOver = true;
        wasGuessCorrect = true;
    } else if (ifPlayerGuessedLetter(answer)) {

        let org = guessedWord;
        guessedWord = noMagicString.emptySpace;

        let isCorrect = false;
        for (let i = 0; i < correctWord.length; i++) {
            if (correctWord[i] == answer) {
                guessedWord += answer;
                isCorrect = true;
            } else {
            
                guessedWord += org[i];
            }
        }

        if (isCorrect == false) {
            wrongGuesses.push(answer);
        } else if (guessedWord == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        }
    }

    else {
        console.log(ANSI.COLOR.RED + ANSI.RESET);
        wrongGuesses.push(answer);
    }

    if (wrongGuesses.length == (HANGMAN_UI.length - 1)) {
        isGameOver = true;
    }

}


console.log(ANSI.CLEAR_SCREEN);
if (wasGuessCorrect == true) {
   console.log(ANSI.COLOR.GREEN + correctWord); 
} else {
    console.log(drawWordDisplay());
}
console.log(displayWrongGuesses(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);

if (wasGuessCorrect) {
    console.log(ANSI.COLOR.YELLOW + textToPlayer.winMessage);
}
console.log(ANSI.COLOR.RED + textToPlayer.wrongGuess + noMagicString.space + wrongGuesses.length + noMagicString.space + textToPlayer.times + ANSI.RESET);

let answerToPlayingAgain = (await askQuestion(textToPlayer.playAgain)).toLowerCase();
const playAgain = textToPlayer.yes;
if (answerToPlayingAgain == playAgain) {
    await playGame();
} else {
    console.log(textToPlayer.endOfGame)
    process.exit();
}

}

await playGame();
