import { Gender } from "./types";
import { z } from "zod";

const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
  entries: z.array(z.any()).optional().default([]),
});

const baseEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.number().min(0).max(3),
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});

export const entrySchema = z.union([
  healthCheckEntrySchema,
  occupationalHealthcareEntrySchema,
  hospitalEntrySchema,
]);


export { healthCheckEntrySchema, occupationalHealthcareEntrySchema, hospitalEntrySchema };

export { newPatientSchema };