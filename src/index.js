require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const clinicaRoutes = require('./modules/clinica/clinicaRoutes');
const pacienteCompletoController = require('./modules/pacientes/pacienteCompletoRoutes');
const pacienteRoutes = require('./modules/pacientes/pacienteRoutes');
const examenRoutes = require('./modules/examenesOrales/examenRoutes');
const antecedentesRoutes = require('./modules/antecedentes/antecedentesRoutes');
const agendaRoutes = require('./modules/agenda/agendaRoutes');
const citasRoutes = require('./modules/citas/citasRoutes');
const errorHandler = require('./middlewares/errorHandler');
const dentistasRoutes = require('./modules/dentistas/dentistasRoutes');
const consultasRoutes = require('./modules/consultas/consultasRoutes');
const tratamientosRoutes = require('./modules/tratamientos/tratamientosRoutes');
const catalogoProcedimientosRoutes = require('./modules/catalogoProcedimientos/catalogoProcedimientosRoutes');
const planesPagoRoutes = require('./modules/pagos/planesPago/planesPagoRputes');
const odontogramaRoutes = require('./modules/odontogramas/odontogramaRoutes');
const diagnosticosRoutes = require('./modules/diagnosticos/diagnosticosRoutes');
const pagosRoutes = require('./modules/pagos/pagosRoutes');
const cuotasRoutes = require('./modules/cuotas/cuotasRoutes');
const productosRoutes = require('./modules/inventario/productos/productosRoutes');
const lotesRoutes = require('./modules/inventario/lotes/lotesRoutes');
const ConfiguracionClinica = require('./modules/clinica/configuracion_clinica/configuracionClinicaRoutes');
const movimientosProductosRoutes = require('./modules/inventario/movimientos_productos/mpRoutes');
const rolesRoutes = require('./routes/rolesRoutes'); 
const usuariosRoutes = require('./routes/usuariosRoutes');
const archivosRoutes = require("./modules/archivos/archivosRoutes");
const app = express();

app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

const corsOptions = {
  origin: ['https://asist-dental.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));

app.use('/clinicas', clinicaRoutes);
app.use('/api', pacienteCompletoController);
app.use('/pacientes', pacienteRoutes);
app.use('/examenes', examenRoutes);
app.use('/antecedentes', antecedentesRoutes);
app.use('/agenda', agendaRoutes);
app.use('/citas', citasRoutes);
app.use('/dentistas', dentistasRoutes);
app.use('/consultas', consultasRoutes);
app.use('/tratamientos', tratamientosRoutes);
app.use('/catalogo-procedimientos', catalogoProcedimientosRoutes);
app.use('/pagos', pagosRoutes);
app.use('/cuotas', cuotasRoutes);
app.use('/planes-pago', planesPagoRoutes);
app.use('/odontogramas', odontogramaRoutes);
app.use('/diagnosticos', diagnosticosRoutes);
app.use('/productos', productosRoutes);
app.use('/lotes', lotesRoutes);
app.use('/configuracionClinica', ConfiguracionClinica);
app.use('/movimientos-productos', movimientosProductosRoutes);
app.use('/roles', rolesRoutes);
app.use('/usuarios', usuariosRoutes);
// app.use("/uploads", express.static("/var/www/uploads"));
app.use('/uploads', cors(corsOptions), express.static('uploads'));
app.use("/api/archivos", archivosRoutes);


app.get('/', (req, res) => {
  res.send('API AsistDental Backend funcionando correctamente');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});;
