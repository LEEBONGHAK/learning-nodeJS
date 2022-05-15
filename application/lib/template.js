var template = {
    HTML: function (title, list, description, control) {
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
    },
    list: function (filelist) {
        var list = '<ul>';
    
        for (var i = 0; i < filelist.length; i++) {
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += '</ul>';
    
        return list;
    }
}

module.exports = template;