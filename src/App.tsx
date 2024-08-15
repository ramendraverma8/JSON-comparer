import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Divider, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import JsonComparison from './JsonComparison';
import './App.css'; // Import the CSS file for additional styling

const App: React.FC = () => {
  const [jsons, setJsons] = useState<Record<string, any>[]>([]);
  const [jsonString, setJsonString] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

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
        if (Array.isArray(json)) {
          setJsons((prevJsons) => [...prevJsons, ...json]);
        } else {
          setJsons((prevJsons) => [...prevJsons, json]);
        }
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
          if (Array.isArray(json)) {
            setJsons((prevJsons) => [...prevJsons, ...json]);
          } else {
            setJsons((prevJsons) => [...prevJsons, json]);
          }
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
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="button-container">
        
        <Button variant="contained" color="secondary" onClick={handleNewComparison} >
          New Comparison
        </Button>
        <Button variant="contained" color="primary" onClick={handleClickOpen}style={{ marginLeft: '20px' }} startIcon={<AddIcon />}>
          Add New
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add JSON</DialogTitle>
        <DialogContent>
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
          <input type="file" accept="application/JSON" onChange={handleFileUpload} style={{ display: 'block', marginTop: '20px' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddJsonString} color="primary">
            Add JSON
          </Button>
        </DialogActions>
      </Dialog>
      {jsons.length > 0 && <JsonComparison jsons={jsons} />}
    </div>
  );
};

export default App;