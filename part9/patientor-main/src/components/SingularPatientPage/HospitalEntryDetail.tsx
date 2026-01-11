import React from "react";
import type { Diagnosis, HospitalEntry } from "../../types";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

interface Props {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}

const HospitalEntryDetails: React.FC<Props> = ({ entry, diagnoses }) => (
  <div style={{ border: "1px solid lightgray", padding: "5px", marginBottom: "5px" }}>
    <p>
      <strong>{entry.date}</strong> <LocalHospitalIcon />
    </p>
    <p>{entry.description}</p>
    <p>
      <strong>Discharge:</strong> {entry.discharge.date} - {entry.discharge.criteria}
    </p>
    {entry.diagnosisCodes && (
      <ul>
        {entry.diagnosisCodes.map((code) => (
          <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
        ))}
      </ul>
    )}
  </div>
);

export default HospitalEntryDetails;
