const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require("./config");

const TOTAL_NEWS = config.numberArticles;
const PORTADA = 'https://www.perfil.com/';
const uniqueElements = arr => [...new Set(arr)];

async function getNews() {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();
   // scrapeo la home de pagina 12
    await page.goto(PORTADA);
   //saco las urls de links y filtro para eliminar las que no son de pag 12
   
   const assetUrls = await page.$$eval('article a', assetLinks => assetLinks.map(link => link.href).filter(link => link.indexOf('perfil') != -1 && link.indexOf('autor') == -1 && link.indexOf('columnistas') == -1 && link.indexOf('seccion') == -1 ));
  
    //filtro las 10 primeras urls 
    const firstUrls = uniqueElements(assetUrls).slice(0, TOTAL_NEWS );

   //escribo las urls en un file para tener el control
   await writeArrayFile(firstUrls);
   //aca obtengo el contenido de todas esas notas TITLE -BODY -SUMMARY 
   const bodyInfo = await getNewInfo(firstUrls) 

   await writeJson(bodyInfo)
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
            let todos = document.querySelectorAll("#bodytext p");
            var summary;
            try{ summary = document.querySelector('header h2').textContent } catch (error){ summary = " "; };
            let title;
            try{ title = document.querySelector('header h1').textContent; } catch (error) { title = " " };
            let body; 
            try{  body = Array.prototype.map.call(todos, function(t) { return t.textContent; }).join(''); } catch (error) { body = " "}
            return  {title , summary, body}
        })
        assetUrls.url = url;
        data.push(assetUrls)
   };
    
    await browser.close()
    return data

}

async function writeJson(yourArray){
    var myJsonString = JSON.stringify(yourArray);
    fs.writeFile('./data/dataPerfil.json', myJsonString , function(err) {
        if(err) { return console.log(err); } console.log("The file was saved!");
    }
    );
}


async function writeArrayFile(first10url) {
    var file = fs.createWriteStream('urlsPerfil.txt');
    file.on('error', function (err) {
        /* error handling */ });
    first10url.forEach(function (v) {
        file.write(v + '\n');
    });
    file.end();
}