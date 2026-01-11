import express from "express";
import patientService from "../services/patientService";
import { Diagnosis } from "../types";
import { Response } from "express";

const router = express.Router();


router.get("/", (_req, res: Response<Diagnosis[]>) => {
  res.send(patientService.getDiagnoses());
});

export default router;