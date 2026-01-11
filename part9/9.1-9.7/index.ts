import express from "express";
import { calculatedbmi } from "./bmiCalculator";
import { calculateExercise } from "./exerciseCalculator";
const app = express();
app.use(express.json());
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/bmi', (req: express.Request, res: express.Response) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || !weight) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }

  const bmi = calculatedbmi(height, weight);
  res.send({ weight, height, bmi });
});

app.post('/exercises', (req: express.Request, res: express.Response) => {
  const { daily_exercises, target } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    res.status(400).send({ error: "parameters missing" });
    return;
  }

  if (!Array.isArray(daily_exercises)) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }

  const dailyExercisesNumbers = daily_exercises.map(Number);
  if (dailyExercisesNumbers.some(isNaN)) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }

  try {
    const result = calculateExercise(target, dailyExercisesNumbers);
    res.send(result);
  } catch (error) {
    res.status(400).send({ error: "malformatted parameters" });
  }
});

