var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer((request, response) => {
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', (err, filelist) => {
                var title = 'Welcome';
                var list = template.list(filelist);
                var description = '<p> Hello, NodeJS</p>';
                var html = template.HTML(title, list, description, '<a href="/create">create</a>');

                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir('./data', (err, filelist) => {
                var filteredId = path.parse(queryData.id).base;
                
                fs.readFile(`data/${filteredId}`, 'utf8', (error, description) => {
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizeedDescription = sanitizeHtml(description, {
                        allowedTags: ['h1']
                    });
                    var list = template.list(filelist);
                    var html = template.HTML(sanitizedTitle, list, '<p>' + sanitizeedDescription + '</p>', `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>`);

                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        fs.readdir('./data', (err, filelist) => {
            var title = 'WEB - create';
            var list = template.list(filelist);
            var description = fs.readFileSync('create.html', 'utf8');
            var html = template.HTML(title, list, description, '');

            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/create_process') {
        var body = '';

        request.on('data', (data) => {
            // ?????? ?????? ????????? ???????????? ????????? ????????? ???????????? ?????? ??????
            // ???????????? ???????????? ????????? ??????
            body += data;
        });
        request.on('end', () => {
            // ????????? ????????? ????????? ????????? ???????????? ?????? ??????
            // ????????? ????????? ??????????????? ????????? ??????
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            // ?????? ??????
            fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    } else if (pathname === '/update') {
        fs.readdir('./data', (err, filelist) => {
            var filteredId = path.parse(queryData.id).base;

            fs.readFile(`data/${filteredId}`, 'utf8', (error, description) => {
                var title = queryData.id;
                var list = template.list(filelist);
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
                var html = template.HTML(title, list, update, `<a href="/create">create</a>`);

                response.writeHead(200);
                response.end(html);
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

            // ???????????? ??????
            fs.rename(`data/${id}`, `data/${title}`, (err) => {
                fs.writeFile(`data/${title}`, description, 'utf8', (error) => {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
    } else if (pathname === '/delete_process') {
        var body = '';

        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;

            fs.unlink(`data/${filteredId}`, (err) => {
                response.writeHead(302, {Location: '/'});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);
