const tm = require('text-miner');
const data1 = require('./data/dataP12.json');
const data2 = require('./data/dataClarin.json');

//console.log(data)
//console.log(data[0])

var my_corpus_titles = new tm.Corpus([]);

data1.map( noticia => {
    my_corpus_titles.addDoc(noticia.title)
})

data2.map( noticia => {
    my_corpus_titles.addDoc(noticia.title)
})

my_corpus_titles.removeWords( tm.STOPWORDS.ES , true ).removeInterpunctuation().clean().toLower();

console.log(my_corpus_titles.documents)


//var terms = new tm.DocumentTermMatrix( my_corpus );

//console.log( my_corpus.removeWords( tm.STOPWORDS.ES ))