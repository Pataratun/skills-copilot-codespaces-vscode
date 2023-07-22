//create web server
//create http server
var http = require('http');
//create file system
var fs = require('fs');
//create url
var url = require('url');
//create querystring
var querystring = require('querystring');
//create template module
var template = require('./lib/template.js');
//create db module
var db = require('./lib/db.js');
//create sanitize-html module
var sanitizeHtml = require('sanitize-html');

//create server
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url,true).pathname;
    //console.log(url.parse(_url,true));
    //console.log(pathname);
    //console.log(queryData);
    
    if(pathname === '/'){
        if(queryData.id === undefined){
            db.query(`SELECT * FROM topic`, function(error, topics){
                //console.log(topics);
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(topics);
                var html = template.html(title,list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        }else{
            db.query(`SELECT * FROM topic`, function(error, topics){
                if(error){
                    throw error;
                }
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], function(error2, topic){
                    if(error2){
                        throw error2;
                    }
                    //console.log(topic[0].title);
                    //console.log(topic[0].name);
                    var title = topic[0].title;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var html = template.html(title,list,
                        `<h2>${sanitizeHtml(title)}</h2>
                        ${sanitizeHtml(description)}
                        <p>by ${sanitizeHtml(topic[0].name)}</p>`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${queryData.id}">
