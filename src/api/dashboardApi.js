import axios from 'axios'

const api = axios.create({
  baseURL: 'https://biosysapi.somee.com'
})

export const dashboardApi = {
  totalActivos: () => api.get('/api/dashboard/total-activos'),
  activosServicio: () => api.get('/api/dashboard/activos-con-sin-servicio'),
  fuentesRedundancia: () => api.get('/api/dashboard/activos-fuentes-redundancia'),
  activosPorBodega: () => api.get('/api/dashboard/activos-por-bodega'),
  activosPorMarca: () => api.get('/api/dashboard/activos-por-marca'),
  detallePuertos: () => api.get('/api/activos/detalle-puertos'),
  //detalleMantenimientos: () => api.get('/api/activos/detalle-puertos'),
  detalleMantenimientos: () => api.get('/api/activos/detalle-mantenimientos'),
  activosPorVoltaje: () => api.get('/api/dashboard/activos-por-voltaje'),
  resumenActivos: () => api.get('/api/activos/resumen'),
  activosPorUPS: () => api.get('api/dashboard/activos-ups'),
  serviciosPorTipo: () => api.get('/api/dashboard/servicios-por-tipo'),
  mantenimientosPorTipo: () => api.get('/api/dashboard/mantenimientos-por-tipo'),
  listadoRed: () => api.get('/api/activos/listado-red'),
  detalleParcheos: () => api.get('/api/activos/detalle-parcheos'),
  detalleConfiguracionesPaso: () => api.get('/api/activos/detalle-configuraciones-paso'),



}

