let express = require('express');

let app = express();

app.use(express.static(__dirname + 'www'));

app.get('/*', (req, resp) => {
    resp.sendFile(__dirname + '/www/index.html');
});

app.listen(process.env.PORT || 4200);