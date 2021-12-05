import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class Tokenizer():
    def __init__(self):
        pass
    
    def tokenize(self, dirty_paragraph):
        clean_paragraph = self.preprocess(dirty_paragraph)
        return self.paragraph_tokenize(clean_paragraph)
    
    def preprocess(self, paragraph):
        # Remove common abbrivations containing stop tokens
        paragraph = paragraph.replace('i.e.', 'ie')
        paragraph = paragraph.replace('e.g.', 'eg')
        paragraph = paragraph.replace('...', '.')
        # Remove special tokens
        paragraph = paragraph.replace(',', '')
        paragraph = paragraph.replace('(', '')
        paragraph = paragraph.replace(')', '')
        # Expand concatinations
        paragraph = paragraph.replace('can\'t', 'cannot')
        paragraph = paragraph.replace('ain\'t', 'is not')
        paragraph = paragraph.replace('won\'t', 'would not')
        paragraph = paragraph.replace('n\'t', ' not')
        paragraph = paragraph.replace('\'ll', ' will')
        return paragraph

    def paragraph_tokenize(self, paragraph):
        # split on stop tokens
        sentences = re.split('\.|!|\?', paragraph)
        return [sentence_tokenize(sentence) for sentence in sentences]

    def sentence_tokenize(self, sentence):
        words = sentence.split(' ')
        return [word_tokenize(word) for word in words if word != '']

    def word_tokenize(self, word):
        return word.lower()


def get_prediction(text):
    analyzer = SentimentIntensityAnalyzer()
    tokenizer = Tokenizer()
    tokenized_paragraph = tokenizer.tokenize(paragraph)
    sentences = [' '.join(sentence) for sentence in tokenized_paragraph]
    neg, pos = 0, 0
    for sentence in sentences:
        vs = analyzer.polarity_scores(sentence)
        neg += vs['neg']
        pos += vs['pos']

    return int(pos >= neg)
