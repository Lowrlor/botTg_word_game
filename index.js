const fs = require('fs');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Функція для отримання базової форми слова
function getBaseForm(word) {
    if(word) {
        const tokens = tokenizer.tokenize(word);
        const stemmer = natural.PorterStemmer;
        return stemmer.stem(tokens[0]);
    }
}

// Читаємо вміст першого файлу
const data = fs.readFileSync('noun_words.txt', 'utf8');
const lines = data.split('\n');

// Відкриваємо файл для запису
const outputFile = 'sorted_list.txt';
const outputStream = fs.createWriteStream(outputFile);

// Змінна для збереження останнього слова
let lastWord = null;

// Функція для перевірки, чи слово є формою іншого слова
function isWordForm(word, baseWord) {
    if(word) {
        return getBaseForm(word) == baseWord;
    }
}

// Цикл по кожному рядку у першому файлі
lines.forEach(line => {
    // Розділяємо рядок за допомогою пробілу
    const words = line.split(' ');
    // Беремо лише перше слово
    const firstWord = words[0];
    // Перевіряємо, чи слово є формою останнього слова
    const isForm = lastWord && isWordForm(firstWord, lastWord);
    // Якщо слово не є формою останнього слова, додаємо його до списку та файлу
    if (!isForm) {
        // Записуємо перше слово у новий файл
        outputStream.write(`${firstWord}\n`);

        // Оновлюємо останнє слово
        lastWord = getBaseForm(firstWord);
    }
});

// Закриваємо потік для запису
outputStream.end();

// console.log(`Слова, які не є формами останнього слова, були записані у файл: ${outputFile}`);
