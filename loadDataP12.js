const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require("./config");

const TOTAL_NEWS = config.numberArticles;
const PORTADA = 'https://www.pagina12.com.ar';

async function getNews() {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();
   // scrapeo la home de pagina 12
    await page.goto(PORTADA);
   //saco las urls de links y filtro para eliminar las que no son de pag 12
    const assetUrls = await page.$$eval('article .article-title a', assetLinks => assetLinks.map(link => link.href).filter(link => link.indexOf('pagina') != -1));
   //filtro las 10 primeras urls 
    const firstUrls = assetUrls.slice(0, TOTAL_NEWS );
   //escribo las urls en un file para tener el control
   // writeArrayFile(firstUrls);
   //aca obtengo el contenido de todas esas notas TITLE -BODY -SUMMARY 
    const bodyInfo = await getNewInfo(firstUrls) 
   
    writeJson(bodyInfo)
    await browser.close()
}

getNews();

async function getNewInfo(urls){
    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();
    const data = [];

    for (let url of urls) {
        await page.goto(url);
        const assetUrls = await page.evaluate(()=>{
            let todos = document.querySelectorAll(".article-text p");
            var summary;
            try{ summary = document.querySelector('.article-summary').textContent } catch (error){
                summary = "";
        };
            let title = document.querySelector('.article-title').textContent;
            let body = Array.prototype.map.call(todos, function(t) { return t.textContent; }).join('');
            return  {title , summary, body}
        })
        assetUrls.url = url;
        data.push(assetUrls)
   };
    
    await browser.close()
    return data

}

function writeJson(yourArray){
    var myJsonString = JSON.stringify(yourArray);
    fs.writeFile('./data/dataP12.json', myJsonString ,  function(err) {
        if(err) { return console.log(err); } console.log("The file was saved!");
    });
}


function writeArrayFile(first10url) {
    var file = fs.createWriteStream('urlsP12.txt');
    file.on('error', function (err) {
        /* error handling */ });
    first10url.forEach(function (v) {
        file.write(v + '\n');
    });
    file.end();
}