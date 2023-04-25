const express = require('express');
const path = require('path');

const app = express();

// Servir los archivos estáticos de la carpeta "www/dist"
app.use(express.static(path.join(__dirname, 'www')));

// Manejar todas las demás rutas con el archivo "index.html"
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
