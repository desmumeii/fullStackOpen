import React from "react";
import type { Diagnosis, OccupationalHealthcareEntry } from "../../types";
import WorkIcon from "@mui/icons-material/Work";
  
interface Props {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}
const OccupationalHealthcareEntryDetails: React.FC<Props> = ({ entry, diagnoses }) => (
  <div style={{ border: "1px solid lightgray", padding: "5px", marginBottom: "5px" }}>
    <p>
      <strong>{entry.date}</strong> <WorkIcon /> {entry.employerName}
    </p>
    <p>{entry.description}</p>
    {entry.sickLeave && (
      <p>
        Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
      </p>
    )}
    {entry.diagnosisCodes && (
      <ul>
        {entry.diagnosisCodes.map((code) => (
          <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
        ))}
      </ul>
    )}
  </div>
);

export default OccupationalHealthcareEntryDetails;
