import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  FormHelperText,
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

interface RegisterFormProps {
  open: boolean;
  onClose: () => void;
}

const departments = ['HR', 'Development', 'QA', 'Sales'];
const employmentTypes = ['Full-time', 'Contract'];

const RegisterForm: React.FC<RegisterFormProps> = ({ open, onClose }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDepartments(event.target.value as string[]);
  };

  const handleEmploymentTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEmploymentType(event.target.value as string);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstname) newErrors.firstname = 'Firstname is required';
    if (!lastname) newErrors.lastname = 'Lastname is required';
    if (!employmentType) newErrors.employmentType = 'Employment type is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is not valid';
    }
    if (!selectedDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFirstname('');
    setLastname('');
    setAddress('');
    setEmail('');
    setSelectedDepartments([]);
    setEmploymentType('');
    setSelectedDate(null);
    setErrors({});
  };

  const handleRegister = () => {
    if (validate()) {
      const formData = {
        firstname,
        lastname,
        address,
        email,
        selectedDepartments,
        employmentType,
        startDate: selectedDate ? selectedDate.toISOString() : null,
      };
      localStorage.setItem('registerFormData', JSON.stringify(formData));
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="register-dialog-title">
      <DialogTitle id="register-dialog-title">Register</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="first-name"
          label="Firstname"
          type="text"
          fullWidth
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          error={!!errors.firstname}
          helperText={errors.firstname}
        />
        <TextField
          margin="dense"
          id="last-name"
          label="Lastname"
          type="text"
          fullWidth
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          error={!!errors.lastname}
          helperText={errors.lastname}
        />
        <TextField
          margin="dense"
          id="address"
          label="Address"
          type="text"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          margin="dense"
          id="email"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            margin="dense"
            id="start-date"
            label="Start Date"
            format="MM/dd/yyyy"
            data-testid="test-date"
            value={selectedDate}
            onChange={handleDateChange}
            fullWidth
            error={!!errors.startDate}
            helperText={errors.startDate}
          />
        </MuiPickersUtilsProvider>
        <FormControl fullWidth margin="dense" data-testid="department-control">
          <InputLabel htmlFor="department">Department</InputLabel>
          <Select
            data-testid="department-select"
            labelId="department-label"
            id="department"
            multiple
            value={selectedDepartments}
            onChange={handleDepartmentChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {departments.map((department) => (
              <MenuItem key={department} value={department}>
                <Checkbox checked={selectedDepartments.indexOf(department) > -1} />
                <ListItemText primary={department} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense" data-testid="employment-control" error={!!errors.employmentType}>
          <InputLabel>Employment Type</InputLabel>
          <Select
            data-testid="employment-select"
            labelId="employment-type-label"
            id="employment-type"
            value={employmentType}
            onChange={handleEmploymentTypeChange}
          >
            {employmentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {errors.employmentType && <FormHelperText>{errors.employmentType}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRegister} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterForm;