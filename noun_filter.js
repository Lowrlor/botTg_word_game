const fs = require('fs');

// Зчитування вмісту файлу
const content = fs.readFileSync('dict_corp_lt.txt', 'utf-8');

// Розбиття тексту на слова
const words = content.split(/\s+/);

// Фільтрація слів з тегом "noun:inanim:m:v_zna"
const filteredWords = words.filter((word, index, array) => {
  if (array[index + 2] === 'noun:inanim:m:v_zna') {
    // Якщо через два слова вперед - тег, повертаємо поточне слово
    return word;
  }
});

// Запис відфільтрованих слів в новий файл
const outputFile = 'noun_words.txt';
fs.writeFileSync(outputFile, filteredWords.join('\n'));

console.log(`Відфільтровані слова збережено у файлі: ${outputFile}`);
