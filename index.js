
const express = require('express');
const cors = require('cors');
const { obtenerJoyas, prepararHATEOAS, obtenerJoyasPorFiltros } = require('./consultas');
const reportMiddleware = require('./reportes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(reportMiddleware); 


app.get('/joyas', async (req, res) => {
  try {
    const queryStrings = req.query; 
    const joyas = await obtenerJoyas(queryStrings);
    const HATEOAS = prepararHATEOAS(joyas);
    res.json(HATEOAS);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener joyas' });
  }
});


app.get('/joyas/filtros', async (req, res) => {
  try {
    const queryStrings = req.query;
    const joyas = await obtenerJoyasPorFiltros(queryStrings);
    res.json(joyas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al filtrar joyas' });
  }
});


app.use((req, res) => {
  res.status(404).send('Esta ruta no existe');
});


app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
