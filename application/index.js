var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, description, control) {
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        <h2>${title}</h2>
        ${description}
    </body>
    </html>
    `;
}

function templateList(filelist) {
    var list = '<ul>';

    for (var i = 0; i < filelist.length; i++) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list += '</ul>';

    return list;
}

var app = http.createServer((request, response) => {
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', (err, filelist) => {
                var title = 'Welcome';
                var list = templateList(filelist);
                var description = '<p> Hello, NodeJS</p>';
                var template = templateHTML(title, list, description, '<a href="/create">create</a>');

                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir('./data', (err, filelist) => {
                var list = templateList(filelist);

                fs.readFile(`data/${queryData.id}`, 'utf8', (error, description) => {
                    var title = queryData.id;
                    var template = templateHTML(title, list, '<p>' + description + '</p>', `<a href="/create">create</a> <a href="/update?id=${title}">update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>`);

                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else if (pathname === '/create') {
        fs.readdir('./data', (err, filelist) => {
            var title = 'WEB - create';
            var list = templateList(filelist);
            var description = fs.readFileSync('create.html', 'utf8');
            var template = templateHTML(title, list, description, '');

            response.writeHead(200);
            response.end(template);
        });
    } else if (pathname === '/create_process') {
        var body = '';

        request.on('data', (data) => {
            // 조각 조각 나눠서 데이터를 수신할 때마다 호출괴는 콜백 함수
            // 데이터를 처리하는 기능을 정의
            body += data;
        });
        request.on('end', () => {
            // 더이상 수신할 정보가 없으면 호출되는 콜백 함수
            // 데이터 처리를 마무리하는 기능을 정의
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            // 파일 생성
            fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    } else if (pathname === '/update') {
        fs.readdir('./data', (err, filelist) => {
            fs.readFile(`data/${queryData.id}`, 'utf8', (error, description) => {
                var title = queryData.id;
                var list = templateList(filelist);
                var update = `
                <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p>
                        <input type="text" name="title" placeholder="title" value="${title}">
                    </p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>    
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `;
                var template = templateHTML(title, list, update, `<a href="/create">create</a>`);

                response.writeHead(200);
                response.end(template);
            });
        });
    } else if (pathname === '/update_process') {
        var body = '';

        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;

            // 파일이름 변경
            fs.rename(`data/${id}`, `data/${title}`, (err) => {
                fs.writeFile(`data/${title}`, description, 'utf8', (error) => {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);