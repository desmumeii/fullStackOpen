import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Diagnosis, Patient } from "../../types";
import axios from "axios";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import WcIcon from "@mui/icons-material/Wc";
import { Box, MenuItem, Select, InputLabel, FormControl, Typography } from "@mui/material";
import EntryDetails from "./entryDetails";
import HealthCheckEntryForm from "./healthCheckEntryForm";
import HospitalEntryForm from "./hospitalEntryForm";
import OccupationalHealthcareEntryForm from "./occupationalHealthcareEntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

type EntryTypeOption = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const SingularPatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntryType, setSelectedEntryType] = useState<EntryTypeOption>("HealthCheck");

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      default:
        return <WcIcon />;
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Patient>(`http://localhost:3001/api/patients/${id}`);
        setPatient(data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Failed to fetch patient");
        } else {
          setError("Failed to fetch patient");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchPatient();
  }, [id]);

  if (loading) return <div>Loading patient...</div>;
  if (error) return <div>{error}</div>;
  if (!patient) return <div>Patient not found</div>;

  const renderEntryForm = () => {
    switch (selectedEntryType) {
      case "HealthCheck":
        return <HealthCheckEntryForm patientId={patient.id} onSuccess={setPatient} diagnoses={diagnoses}/>;
      case "Hospital":
        return <HospitalEntryForm patientId={patient.id} onSuccess={setPatient} diagnoses={diagnoses}/>;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntryForm patientId={patient.id} onSuccess={setPatient} diagnoses={diagnoses}/>;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>Gender: {patient.gender} {getGenderIcon(patient.gender)}</p>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>

      <Typography variant="h6" sx={{ mt: 2 }}>Entries</Typography>
      <ul>
        {patient.entries.map((entry) => (
          <li key={entry.id}>
            <EntryDetails entry={entry} diagnoses={diagnoses} />
          </li>
        ))}
      </ul>

      <Box sx={{ mt: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Entry Type</InputLabel>
          <Select
            value={selectedEntryType}
            label="Entry Type"
            onChange={(e) => setSelectedEntryType(e.target.value as EntryTypeOption)}
          >
            <MenuItem value="HealthCheck">HealthCheck</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </Select>
        </FormControl>

        {renderEntryForm()}
      </Box>
    </div>
  );
};

export default SingularPatientPage;
