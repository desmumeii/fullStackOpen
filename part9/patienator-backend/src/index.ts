import express from 'express';
import cors from 'cors';
import patientRouter from './routes/patientRoutes';
import diagnosisRouter from './routes/diagnosisRoutes';
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/patients', patientRouter);
app.use('/api/diagnoses', diagnosisRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});