
const pool = require('./conexion');
const format = require('pg-format'); 


const obtenerJoyas = async ({ limits = 10, order_by = 'id_ASC', page = 1 } = {}) => {
  const [campo, direccion] = order_by.split('_'); 
  const offset = (page - 1) * limits;
  const consulta = format(
    'SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s',
    campo, direccion, limits, offset
  );
  const { rows: joyas } = await pool.query(consulta);
  return joyas;
};


const prepararHATEOAS = (joyas) => {
  const results = joyas.map(j => ({
    name: j.nombre,
    href: `/joyas/joya/${j.id}`
  }));
  const total = joyas.length;
  return { total, results };
};


const obtenerJoyasPorFiltros = async ({ precio_min, precio_max, categoria, metal } = {}) => {
  let filtros = [];
  const values = [];

  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const index = filtros.length + 1;
    filtros.push(`${campo} ${comparador} $${index}`);
  };


  if (precio_min) agregarFiltro('precio', '>=', precio_min);
  if (precio_max) agregarFiltro('precio', '<=', precio_max);
  if (categoria) agregarFiltro('categoria', '=', categoria);
  if (metal) agregarFiltro('metal', '=', metal);

  let consulta = 'SELECT * FROM inventario';
  if (filtros.length > 0) {
    consulta += ' WHERE ' + filtros.join(' AND ');
  }

  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;
};

module.exports = { obtenerJoyas, prepararHATEOAS, obtenerJoyasPorFiltros };
