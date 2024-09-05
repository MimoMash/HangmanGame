const wordsList = ["Cat", "Kebab", "Fruit", "Coding", "Banana", "Life", "Glasses", "Monitor", "Ducky", "Statue", "Bed"];
//let randomNumber = getRandomNumber();
//let correctWord = wordsList[randomNumber];
let randomNumber = getRandomNumber();

function getRandomNumber() {
    let randomNumber = Math.floor(Math.random() * wordsList.length);
    return randomNumber
}

console.log(randomNumber);
