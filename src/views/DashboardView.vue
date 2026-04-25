<template>
  <v-main class="bg-grey-lighten-4">
    <v-container fluid class="pa-6">
      <h1 class="text-h4 font-weight-bold mb-6">
        Dashboard de Inventario
      </h1>

      <v-row>
        <!-- TOTAL ACTIVOS -->
        <v-col cols="12" md="3">
          <v-card class="pa-4" rounded="xl" elevation="6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-subtitle-2 text-grey">Total de activos</div>
                <div class="text-h1 font-weight-bold text-primary">
                  {{ totalActivos }}
                </div>
              </div>

              <v-icon size="40" color="primary">
                mdi-server
              </v-icon>
            </div>
          </v-card>
        </v-col>

        <!-- CON SERVICIO -->
        <v-col cols="12" md="3">
          <v-card class="pa-4" rounded="xl" elevation="6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-subtitle-2 text-grey">Con servicio</div>
                <div class="text-h4 font-weight-bold text-success">
                  {{ totalConServicio }}
                </div>
              </div>

              <v-icon size="40" color="success">
                mdi-check-circle
              </v-icon>
            </div>
          </v-card>
        </v-col>

        <!-- REDUNDANCIA -->
        <v-col cols="12" md="6">
          <v-card class="pa-4" rounded="xl" elevation="6">
            <div class="text-subtitle-2 text-grey mb-2">
              Redundancia
            </div>

            <v-row>
              <v-col cols="6">
                <v-sheet class="pa-3 text-center" color="info-lighten-5" rounded="lg">
                  <div class="text-caption text-grey">Con redundancia</div>
                  <div class="text-h5 font-weight-bold text-info">
                    {{ totalRedundantes }}
                  </div>
                </v-sheet>
              </v-col>

              <v-col cols="6">
                <v-sheet class="pa-3 text-center" color="red-lighten-5" rounded="lg">
                  <div class="text-caption text-grey">Sin redundancia</div>
                  <div class="text-h5 font-weight-bold text-error">
                    {{ totalSinRedundancia }}
                  </div>
                </v-sheet>
              </v-col>
            </v-row>

          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="12" md="3">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <div class="text-subtitle-1">Activos por voltaje</div>

            <Pie :data="chartVoltaje" :options="{ responsive: true }" />
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <div class="text-subtitle-1">Activos con UPS</div>
            <Pie :data="chartUPS" :options="opcionesPie" />
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <div class="text-subtitle-1">Servicios por tipo</div>

            <Bar :data="chartServiciosTipo" :options="chartOptions" />
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <div class="text-subtitle-1">Configuraciones por tipo</div>

            <Pie :data="chartConfigPaso" :options="opcionesPie" />
          </v-card>
        </v-col>


        <v-col cols="12">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <div class="text-subtitle-1">Mantenimientos por tipo</div>
            <Bar :data="chartMantenimientosTipo" :options="chartOptions" />
          </v-card>
        </v-col>
      </v-row>






      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <h2 class="text-h6 mb-4">Activos por bodega</h2>
            <Bar :data="chartBodegas" :options="chartOptions" />
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <h2 class="text-h6 mb-4">Activos por marca</h2>
            <Bar :data="chartMarcas" :options="chartOptions" />
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <h2 class="text-h6 mb-4">Detalle de puertos</h2>

            <v-data-table :headers="headersPuertos" :items="puertos" density="comfortable" :items-per-page="5">
              <template #item.observaciones="{ item }">
                {{ item.observaciones || 'Sin observaciones' }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <h2 class="text-h6 mb-4">Detalle de mantenimientos</h2>

            <v-data-table :headers="headersMantenimientos" :items="mantenimientos" density="comfortable">
              <template #item.estado="{ item }">
                <v-chip :color="item.estado ? 'success' : 'warning'" variant="tonal">
                  {{ item.estado ? 'Finalizado' : 'Pendiente' }}
                </v-chip>
              </template>

              <template #item.cancelado="{ item }">
                <v-chip :color="item.cancelado ? 'error' : 'success'" variant="tonal">
                  {{ item.cancelado ? 'Sí' : 'No' }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <h2 class="text-h6 mb-4">Resumen de Activos</h2>

            <v-data-table :headers="headersResumen" :items="activosUnicos" density="comfortable" :items-per-page="5">

              <!-- Mejor presentación de IP -->
              <template #item.ip="{ item }">
                <v-chip color="primary" variant="tonal">
                  {{ item.ip }}
                </v-chip>
              </template>

              <!-- Voltaje con color -->
              <template #item.voltaje="{ item }">
                <v-chip :color="item.voltaje === '220V' ? 'orange' : 'blue'" variant="flat">
                  {{ item.voltaje }}
                </v-chip>
              </template>

              <!-- Tipo activo -->
              <template #item.tipo_Activo="{ item }">
                <v-chip color="green" variant="tonal">
                  {{ item.tipo_Activo }}
                </v-chip>
              </template>

            </v-data-table>

          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <h2 class="text-h6 mb-4">Listado de Red</h2>

            <v-data-table :headers="headersListadoRed" :items="listadoRed" density="comfortable" :items-per-page="5">
              <template #item.ip="{ item }">
                <v-chip color="primary" variant="tonal">
                  {{ item.ip }}
                </v-chip>
              </template>

              <template #item.vlans="{ item }">
                <v-chip color="purple" variant="tonal">
                  VLAN {{ item.vlans }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" rounded="xl" elevation="4">
            <v-data-table :headers="headersParcheos" :items="parcheos" density="comfortable" :items-per-page="5">
              <template #item.version_Anterior="{ item }">
                <v-chip color="orange" variant="tonal">
                  {{ item.version_Anterior }}
                </v-chip>
              </template>

              <template #item.version_Instalada="{ item }">
                <v-chip color="success" variant="tonal">
                  {{ item.version_Instalada }}
                </v-chip>
              </template>

              <template #item.descripcion="{ item }">
                {{ item.descripcion || 'Sin descripción' }}
              </template>

              <template #item.estado="{ item }">
                <v-chip :color="item.estado ? 'success' : 'error'" variant="flat">
                  {{ item.estado ? 'Activo' : 'Inactivo' }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>



    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import { dashboardApi } from '../api/dashboardApi'
import { ArcElement } from 'chart.js'
ChartJS.register(ArcElement)


import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const totalActivos = ref(0)
const servicio = ref([])
const redundancia = ref([])
const bodegas = ref([])
const marcas = ref([])
const puertos = ref([])
const voltajes = ref([])
const resumen = ref([])
const ups = ref([])
const serviciosTipo = ref([])
const mantenimientosTipo = ref([])
const listadoRed = ref([])
const parcheos = ref([])
const configuracionesPaso = ref([])



const mantenimientos = ref([])

const headersMantenimientos = [
  { title: 'ID', key: 'id_Mantenimiento' },
  { title: 'Activo', key: 'id_Activo' },
  { title: 'Tipo mantenimiento', key: 'tipo_Mantenimiento' },
  { title: 'Encargado', key: 'usuario_Encargado' },
  { title: 'Área solicitante', key: 'area_Solicitante' },
  { title: 'Estado', key: 'estado' },
  { title: 'Cancelado', key: 'cancelado' }
]

const headersPuertos = [
  { title: 'Activo', key: 'id_Activo' },
  { title: 'Tipo de puerto', key: 'tipo_Puerto' },
  { title: 'Total', key: 'cantidad_Total' },
  { title: 'Usados', key: 'cantidad_Usados' },
  { title: 'Libres', key: 'cantidad_Libres' },
  { title: 'Observaciones', key: 'observaciones' }
]

const headersResumen = [
  { title: 'Código', key: 'codigo' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Tipo', key: 'tipo_Activo' },
  { title: 'Marca', key: 'marca' },
  { title: 'Bodega', key: 'bodega' },
  { title: 'Responsable', key: 'responsable' },
  { title: 'IP', key: 'ip' },
  { title: 'Voltaje', key: 'voltaje' }
]

const headersListadoRed = [
  { title: 'Código', key: 'codigo' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'IP', key: 'ip' },
  { title: 'VLANs', key: 'vlans' },

]

const headersParcheos = [
  { title: 'ID', key: 'id_Parcheo' },
  { title: 'Activo', key: 'id_Activo' },
  { title: 'Versión anterior', key: 'version_Anterior' },
  { title: 'Versión instalada', key: 'version_Instalada' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Estado', key: 'estado' }
]

const totalConServicio = computed(() => {
  return servicio.value.find(x => x.estado_Servicio === 'Con servicio')?.total || 0
})

const totalRedundantes = computed(() => {
  return redundancia.value.find(x => x.fuentes_Redundantes === 'Sí')?.total || 0
})

const totalSinRedundancia = computed(() => {
  return redundancia.value.find(x => x.fuentes_Redundantes === 'No')?.total || 0
})

const chartBodegas = computed(() => ({
  labels: bodegas.value.map(x => x.bodega),
  datasets: [
    {
      label: 'Activos',
      data: bodegas.value.map(x => x.total_Activos),
      backgroundColor: '#3F51B5',
      borderColor: '#303F9F',
    }
  ]
}))

const chartMarcas = computed(() => ({
  labels: marcas.value.map(x => x.marca),
  datasets: [
    {
      label: 'Activos',
      data: marcas.value.map(x => x.total),
      backgroundColor: '#3F51B5', // 🔵 un solo color
      borderColor: '#303F9F',
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const cargarDashboard = async () => {
  try {
    const [
      resTotal,
      resServicio,
      resRedundancia,
      resBodegas,
      resMarcas,
      resPuertos,
      resMantenimientos,
      resVoltaje,
      resResumen,
      resUPS,
      resServiciosTipo,
      resMantenimientosTipo,
      resListadoRed,
      resParcheos,
      resConfigPaso 


    ] = await Promise.all([
      dashboardApi.totalActivos(),
      dashboardApi.activosServicio(),
      dashboardApi.fuentesRedundancia(),
      dashboardApi.activosPorBodega(),
      dashboardApi.activosPorMarca(),
      dashboardApi.detallePuertos(),
      dashboardApi.detalleMantenimientos(),
      dashboardApi.activosPorVoltaje(),
      dashboardApi.resumenActivos(),
      dashboardApi.activosPorUPS(),
      dashboardApi.serviciosPorTipo(),
      dashboardApi.mantenimientosPorTipo(),
      dashboardApi.listadoRed(),
      dashboardApi.detalleParcheos(),
      dashboardApi.detalleConfiguracionesPaso()


    ])

    totalActivos.value = resTotal.data[0]?.total_Activos || 0
    servicio.value = resServicio.data
    redundancia.value = resRedundancia.data
    bodegas.value = resBodegas.data
    marcas.value = resMarcas.data
    puertos.value = resPuertos.data
    mantenimientos.value = resMantenimientos.data
    voltajes.value = resVoltaje.data
    resumen.value = resResumen.data
    ups.value = resUPS.data
    serviciosTipo.value = resServiciosTipo.data
    mantenimientosTipo.value = resMantenimientosTipo.data
    listadoRed.value = resListadoRed.data
    parcheos.value = resParcheos.data
    configuracionesPaso.value = resConfigPaso.data




  } catch (error) {
    console.error('Error cargando dashboard:', error)
  }
}

const chartVoltaje = computed(() => ({
  labels: voltajes.value.map(x => x.voltaje),
  datasets: [
    {
      label: 'Voltaje',
      data: voltajes.value.map(x => x.total),
      backgroundColor: [
        '#42A5F5', // azul (110V)
        '#FF7043'  // naranja (220V)
      ],
    }
  ]
}))

const activosUnicos = computed(() => {
  const mapa = new Map()

  resumen.value.forEach(item => {
    if (!mapa.has(item.id_Activo)) {
      mapa.set(item.id_Activo, item)
    }
  })

  return Array.from(mapa.values())
})

const chartUPS = computed(() => ({
  labels: ups.value.map(x => x.estado_UPS),
  datasets: [
    {
      label: 'UPS',
      data: ups.value.map(x => x.total),
      backgroundColor: ups.value.map(x =>
        x.estado_UPS === 'Con UPS' ? '#4CAF50' : '#F44336'
      ),
      borderWidth: 1
    }
  ]
}))

const chartServiciosTipo = computed(() => ({
  labels: serviciosTipo.value.map(x => x.tipo_Servicio),
  datasets: [
    {
      label: 'Servicios',
      data: serviciosTipo.value.map(x => x.total),
      backgroundColor: [
        '#1976D2',
        '#43A047',
        '#FB8C00',
        '#8E24AA'
      ],
      borderWidth: 1
    }
  ]
}))

const chartMantenimientosTipo = computed(() => ({
  labels: mantenimientosTipo.value.map(x => x.tipo_Mantenimiento),
  datasets: [
    {
      label: 'Mantenimientos',
      data: mantenimientosTipo.value.map(x => x.total),
      backgroundColor: [
        '#1976D2',
        '#43A047',
        '#FB8C00',
        '#8E24AA',
        '#E53935',
        '#00ACC1',
        '#7CB342',
        '#FDD835',
        '#6D4C41',
        '#5E35B1',
        '#3949AB',
        '#00897B',
        '#C0CA33',
        '#F4511E',
        '#546E7A'
      ],
      borderWidth: 1
    }
  ]
}))

const configuracionesAgrupadas = computed(() => {
  const conteo = {}

  configuracionesPaso.value.forEach(item => {
    const tipo = item.tipo_Configuracion

    if (!conteo[tipo]) {
      conteo[tipo] = 0
    }

    conteo[tipo]++
  })

  return Object.keys(conteo).map(key => ({
    tipo: key,
    total: conteo[key]
  }))
})

const chartConfigPaso = computed(() => ({
  labels: configuracionesAgrupadas.value.map(x => x.tipo),
  datasets: [
    {
      data: configuracionesAgrupadas.value.map(x => x.total),
      backgroundColor: [
        '#1976D2',
        '#43A047',
        '#FB8C00',
        '#8E24AA',
        '#E53935',
        '#00ACC1'
      ]
    }
  ]
}))

onMounted(() => {
  cargarDashboard()
})
</script>

<style scoped>
.v-card {
  min-height: 140px;
}

canvas {
  max-height: 350px;
}
</style>