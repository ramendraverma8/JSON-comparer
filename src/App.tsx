import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Divider, Typography, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import JsonComparison from './JsonComparison';
import RegisterForm from './RegisterForm';
import './App.css'; // Import the CSS file for additional styling
import Table from './table';
import MyTabs from './tab';

const App: React.FC = () => {
  const [jsons, setJsons] = useState<Record<string, any>[]>([]);
  const [jsonString, setJsonString] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isRegisterFormOpen, setRegisterFormOpen] = useState(false);

  useEffect(() => {
    const savedJsons = localStorage.getItem('jsons');
    if (savedJsons) {
      setJsons(JSON.parse(savedJsons));
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file || null);
  };

  const handleJsonStringChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(event.target.value);
  };

  const handleAddJsonString = () => {
    if (jsonString && file) {
      alert('Please provide either a JSON string or upload a JSON file, not both.');
      return;
    }

    if (jsonString) {
      try {
        const json = JSON.parse(jsonString);
        const newJsons = Array.isArray(json) ? [...jsons, ...json] : [...jsons, json];
        setJsons(newJsons);
        localStorage.setItem('jsons', JSON.stringify(newJsons));
        setJsonString('');
        setOpen(false);
      } catch (err) {
        console.error('Invalid JSON string:', err);
        alert('The entered string is not a valid JSON.');
      }
    } else if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          const newJsons = Array.isArray(json) ? [...jsons, ...json] : [...jsons, json];
          setJsons(newJsons);
          localStorage.setItem('jsons', JSON.stringify(newJsons));
          setFile(null);
          setOpen(false);
        } catch (err) {
          console.error('Invalid JSON file:', err);
          alert('The uploaded file is not a valid JSON.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please enter a JSON string or upload a JSON file.');
    }
  };

  const handleNewComparison = () => {
    setJsons([]);
    setJsonString('');
    localStorage.removeItem('jsons');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRegisterOpen = () => {
    setRegisterFormOpen(true);
  };
  const handleRegisterClose = () => {
    setRegisterFormOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleNewComparison}>
            New Comparison
          </Button>
          <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginLeft: '20px' }} startIcon={<AddIcon />}>
            Add New
          </Button>
          <Button variant="contained" onClick= {handleRegisterOpen}>
            Register
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add JSON</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
            <TextField
              label="Enter JSON string"
              multiline
              rows={4}
              value={jsonString}
              onChange={handleJsonStringChange}
              variant="outlined"
              fullWidth
              style={{ marginBottom: '20px' }}
            />
            <Divider>
              <Typography variant="body1" color="textSecondary">
                Or
              </Typography>
            </Divider>
            <input
              type="file"
              accept="application/JSON"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="contained" component="span" style={{ marginTop: '20px' }}>
                Upload JSON File
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddJsonString} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <div data-testid="json-container">
        {jsons.length > 0 && <JsonComparison jsons={jsons} />}
      </div>
      <RegisterForm open={isRegisterFormOpen} onClose={handleRegisterClose} />
      <MyTabs />
      <Table />
    </div>
   
  );
};

export default App;