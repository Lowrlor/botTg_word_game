require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const fs = require('fs');


function isWordInFile(filename, wordToCheck) {
    const words = fs.readFileSync(filename, 'utf-8').split('\n');
    return words.includes(wordToCheck.toLowerCase());
}

function findWordStartingWith(letter, filename) {
    const words = fs.readFileSync(filename, 'utf-8').split('\n');
    const matchingWords = words.filter((word) => {
        return word.toLowerCase().startsWith(letter.toLowerCase());
    });
  
    return matchingWords;
}
function getRandomWord(wordsArray) {
    const randomIndex = Math.floor(Math.random() * wordsArray.length);
    return wordsArray[randomIndex];
}
function isWordUsed(word) {
    return usedWords.includes(word.toLowerCase());
}
const filename = 'sorted_list.txt';
let startLetter = ''
let usedWords = [];
let attempts = 0;
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if(msg.text === '/start') return bot.sendMessage(chatId, 'Гра почалась напиши будь-яке існуюче слово!');
    if(startLetter === msg.text[msg.text.length -1]) {
        const result = isWordInFile('sorted_list.txt', msg.text)
        const matchingWords = findWordStartingWith(msg.text[msg.text.length -1], filename);
        let randomWord;
        do {
            randomWord = getRandomWord(matchingWords);
            attempts++;
        } while (isWordUsed(randomWord) && attempts < 1000)
        startLetter = randomWord[randomWord.length -1]
        
        usedWords.push(randomWord.toLowerCase());
        if(attempts === 1000) return bot.sendMessage(chatId, 'Здаюся')
        if(result) bot.sendMessage(chatId, randomWord);
        else bot.sendMessage(chatId, 'Такого слова немає');
    }
    if(startLetter.length != 0 && startLetter != msg.text[msg.text.length -1]) {
        bot.sendMessage(chatId, `Слово не вичинається з букви '${startLetter}'`);
    }
    if(startLetter.length == 0) {
        const result = isWordInFile('sorted_list.txt', msg.text)
        const matchingWords = findWordStartingWith(msg.text[msg.text.length -1], filename);
        const randomWord = getRandomWord(matchingWords);
        startLetter = randomWord[randomWord.length -1]
        usedWords.push(randomWord.toLowerCase());
        if(result) bot.sendMessage(chatId, 'Такого слова немає');
        else bot.sendMessage(chatId, randomWord);
    }
  });

