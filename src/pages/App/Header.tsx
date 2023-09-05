import React from 'react';
import {  FormControl, Stack, Select, MenuItem } from '@mui/material';
import './App.css'

export const Header = ({ projects, selectedProject, setSelectedProject, modes, mode, setMode }) => {

    const handleProjectChange = (e) => {
        console.log("handle project change: ", e.target.value);
        setSelectedProject(e.target.value);
    }

    const handleModeChange = (e) => {
      console.log("handle mode change: ", e.target.value);
      setMode(e.target.value);
    }

    const toolbarItems = () => {
      if (projects.length > 0) {
        return (
          <Stack direction="row" alignContent="left" spacing={2}>
            <select
              id="projects"
              value={selectedProject}
              onChange={handleProjectChange}
            >
            {projects.map((project) => (
              <option 
              key={project.project_id} 
              value={project.project_id}
              >
              {project.name}
              </option>
            ))}
            </select>
  
            <select
              id="modes"
              value={mode}
              onChange={handleModeChange}
            >
            {modes.map((mode, index) => (
              <option 
                key={index} 
                value={mode}
                >
              {mode}
              </option>
            ))}
            </select>
          </Stack>
        );
      }
    }

    return (
      <>
        {toolbarItems()}
      </>
  )
};