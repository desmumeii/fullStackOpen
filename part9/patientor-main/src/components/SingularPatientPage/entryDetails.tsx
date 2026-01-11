import React from "react";
import { Diagnosis, Entry } from "../../types";
import HospitalEntryDetails from "./HospitalEntryDetail";
import OccupationalHealthcareEntryDetails from "./OccupationalHealthcareEntryDetails";
import HealthCheckEntryDetails from "./HealthCheckEntryDetails";

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
