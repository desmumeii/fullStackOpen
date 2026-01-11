import React from "react";
import { Diagnosis, HealthCheckEntry, HealthCheckRating } from "../../types";
import FavoriteIcon from "@mui/icons-material/Favorite";

const ratingColor = (rating: HealthCheckRating) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return "green";
    case HealthCheckRating.LowRisk:
      return "yellow";
    case HealthCheckRating.HighRisk:
      return "orange";
    case HealthCheckRating.CriticalRisk:
      return "red";
  }
};
interface Props {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}
const HealthCheckEntryDetails: React.FC<Props> = ({ entry, diagnoses }) => (
  <div style={{ border: "1px solid lightgray", padding: "5px", marginBottom: "5px" }}>
    <p>
      <strong>{entry.date}</strong> <FavoriteIcon style={{ color: ratingColor(entry.healthCheckRating) }} />
    </p>
    <p>{entry.description}</p>
    {entry.diagnosisCodes && (
      <ul>
        {entry.diagnosisCodes.map((code) => (
          <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
        ))}
      </ul>
    )}
    {entry.healthCheckRating !== undefined && (
      <p>Health Check Rating: {HealthCheckRating[entry.healthCheckRating]}</p>
    )}
    <p>Specialist: {entry.specialist}</p>
  </div>
);

export default HealthCheckEntryDetails;
