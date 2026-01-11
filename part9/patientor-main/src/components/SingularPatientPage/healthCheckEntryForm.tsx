import { useState, FormEvent } from "react";
import { HealthCheckRating, Patient, Diagnosis } from "../../types";
import axios from "axios";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
  Alert,
} from "@mui/material";

interface Props {
  patientId: string;
  diagnoses: Diagnosis[];
  onSuccess: (updatedPatient: Patient) => void;
}

const HealthCheckEntryForm = ({ patientId, diagnoses, onSuccess }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newEntry = {
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes: selectedDiagnosisCodes.length > 0 ? selectedDiagnosisCodes : undefined,
    };

    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `http://localhost:3001/api/patients/${patientId}/entries`,
        newEntry
      );
      onSuccess(updatedPatient);
      // reset form
      setDescription("");
      setDate("");
      setSpecialist("");
      setSelectedDiagnosisCodes([]);
      setHealthCheckRating(0);
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to add entry");
      } else {
        setError("Failed to add entry");
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add HealthCheck Entry
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      {/* Multiple select for diagnosis codes */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Diagnosis Codes</InputLabel>
        <Select
          multiple
          value={selectedDiagnosisCodes}
          onChange={e => setSelectedDiagnosisCodes(e.target.value as string[])}
          input={<OutlinedInput label="Diagnosis Codes" />}
          renderValue={(selected) => selected.join(", ")}
        >
          {diagnoses.map(d => (
            <MenuItem key={d.code} value={d.code}>
              <Checkbox checked={selectedDiagnosisCodes.indexOf(d.code) > -1} />
              <ListItemText primary={`${d.code} - ${d.name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Health Check Rating</InputLabel>
        <Select
          value={healthCheckRating}
          label="Health Check Rating"
          onChange={(e) => setHealthCheckRating(Number(e.target.value))}
        >
          <MenuItem value={0}>Healthy</MenuItem>
          <MenuItem value={1}>Low Risk</MenuItem>
          <MenuItem value={2}>High Risk</MenuItem>
          <MenuItem value={3}>Critical Risk</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" type="submit">
        Add Entry
      </Button>
    </Box>
  );
};

export default HealthCheckEntryForm;
