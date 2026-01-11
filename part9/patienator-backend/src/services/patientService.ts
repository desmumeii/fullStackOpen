import patients from "../data/patients";
import diagnoses from "../data/diagnoses";
import { Patient, NonSensitivePatient, Diagnosis, NewPatientEntry, Entry, NewEntry } from "../types";
import { v1 as uuid } from 'uuid';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const getPatients = (): Patient[] => {
  return patients;
};

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addEntry = (patientId: string, entry: NewEntry): Patient => {
  const patient = findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);
  return patient;
};


export default {
  getPatients,
  getNonSensitivePatients,
  getDiagnoses,
  addPatient,
  findById,
  addEntry
};