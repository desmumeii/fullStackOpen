import express from "express";
import patientService from "../services/patientService";
import { NonSensitivePatient, Patient, NewPatientEntry } from "../types";
import { Response } from "express";
import { Request, NextFunction } from "express";
import { newPatientSchema, entrySchema } from "../utils";
import { z } from "zod";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    newPatientSchema.parse(req.body);
    console.log(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
  const addedPatient = patientService.addPatient(req.body);
  res.json(addedPatient);
});

router.get("/:id", (req: Request, res: Response<Patient | { error: string }>) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: "Patient not found" });
  }
});

router.post("/:id/entries", (req: Request, res: Response) => {
  try {
    const parsedEntry = entrySchema.parse(req.body);
    const updatedPatient = patientService.addEntry(
      req.params.id,
      parsedEntry
    );

    res.json(updatedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

router.use(errorMiddleware);
export default router;