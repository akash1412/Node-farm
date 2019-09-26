const fs = require('fs');
const http = require('http');
const url = require('url');


////////////////////////////////////
//*FILES
// Blocking ,Synchronus way
// const data = fs.readFileSync('./starter/txt/input.txt', 'utf-8');

// console.log(data);

// const textOut = `data regarding avacado : ${data}\n created on ${Date.now()}`;

// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('file Written')

//NON-Blocking

fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log(err);
    fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
        if (err) throw err;
        fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data3) => {
            if (err) throw err;
            fs.readFile('./starter/txt/input.txt', 'utf-8', (err, data4) => {
                if (err) throw err;
                fs.readFile('./starter/txt/output.txt', 'utf-8', (err, data5) => {
                    if (err) throw err;
                    fs.readFile('./starter/txt/final.txt', 'utf-8', (err, data6) => {
                        if (err) throw err;
                        fs.writeFile('./starter/txt/async.txt', `${data4+'\n'+data3}`, 'utf-8', err => {
                            if (err) throw err;
                            console.log('file written 🙂')
                        });
                    });
                })
            });
        });
    });
});

// const p = new Promise((reject, resolve) => {
//     fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data) => {
//         if (err) reject('File Not Found😢')
//         fs.readFile('./starter/txt/read-this.txt', 'utf-8', (err, data) => {
//             if (err) reject('File Not Found 😭');
//             fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data) => {
//                 if (err) reject('File Not Found 😰');
//                 fs.readFile('./starter/txt/async.txt', 'utf-8', (err, data) => {
//                     if (err) reject('File Not Found 😰')
//                 });
//             });
//         });
//     });
// });
// p.then(res => {
//     console.log(res)
// }).catch(err => {
//     console.log(err)
// })
// C:\Users\LENOVO\Desktop\1-node-farm\starter\dev-data\data.json
// * SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}


const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8') //fs.readFileSync(`${__dirname}/starter/dev-data/data-json,'utf-8'`);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {
        query,
        pathname
    } = url.parse(req.url);

    // console.log(query, pathName)

    //* OVERVIEW
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const q1 = query.split('=');
        const q2 = parseInt(q1[1])
        const product = dataObj[q2];
        // console.log(product)
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'Application/json'
        });
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        })
        res.end('<h1>PAGE NOT FOUND</h1>');
    }
    // console.log('.');

})

server.listen(80, '127.0.0.1');