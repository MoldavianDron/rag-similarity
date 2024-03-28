function removePatternsFromEnds(word) {
    const pattern = /^[^\w\s]+|[^\w\s]+$/g;

    // Use replace to remove patterns at the beginning and the end of the word
    const cleanedWord = word.replace(pattern, '');

    return cleanedWord;
}

function removeWordIfPatternMetTwice(word) {
    const pattern = /[^\w\s]/g;

    // Find all matches of the pattern in the word
    const matches = word.match(pattern);

    // Check if the pattern is encountered at least 2 times
    if (matches && matches.length >= 2) {
        return false;
    } else {
        return true;
    }
}

function replacePunctuationWithSpaceAndRemoveOneLetterWord(word) {
    const replacedWord = word.replace(/[^\w\s]|_/g, ' ');
    const replacedWordArr = replacedWord.split(' ');
    const withoutOneLetter = replacedWordArr.filter(word => word.length > 1);
    return withoutOneLetter.join(' ');
}

export function cleanData(text) {
    // const lowerText = text.toLowerCase();
    const lowerText = text
    const textWords = lowerText.split(' ');

    const noPunctuation = textWords.map(removePatternsFromEnds);
    const textWordsWithoutPunctuationPatternMetTwice = noPunctuation.filter(removeWordIfPatternMetTwice);
    // const textWordsWithoutPunctuation = textWordsWithoutPunctuationPatternMetTwice.map(replacePunctuationWithSpaceAndRemoveOneLetterWord);
    const textWordsWithoutPunctuation = textWordsWithoutPunctuationPatternMetTwice

    const noNumberedWords = textWordsWithoutPunctuation.filter(word => !/\d/.test(word));

    const stringWordsWithoutPunctuation = noNumberedWords.join(' ');

    const stringNoMultipleWhitespaces = stringWordsWithoutPunctuation.replace(/ +/g, ' ').trim();

    return stringNoMultipleWhitespaces;
}
