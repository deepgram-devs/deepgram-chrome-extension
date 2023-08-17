import React, {  } from 'react';
import {  FormControl, Stack, Select, MenuItem } from '@mui/material';
import './Panel.css'

export const Header = ({ projects, selectedProject, setSelectedProject, modes, mode, setMode }) => {

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
    }

    const handleModeChange = (e) => {
      setMode(e.target.value);
    }

    const toolbarItems = () => {
      if (projects.length > 0) {
        return (
          <Stack direction="row" alignContent="left" spacing={2}>
          <FormControl>
            <Select
              labelId="project-label"
              id="projects"
              value={selectedProject}
              onChange={handleProjectChange}
              label="Select Project"
              style={{
                backgroundColor: "#101014",
                color: "#E1E1E5"
              }}
            >
            {projects.map((project) => (
              <MenuItem 
              key={project.project_id} 
              value={project.project_id}
              style={{
                backgroundColor: "#101014",
                color: "#E1E1E5"
              }}
              >
              {project.name}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          <FormControl >
            <Select
              id="modes"
              value={mode}
              onChange={handleModeChange}
              style={{
                backgroundColor: "#101014",
                color: "#E1E1E5"
              }}
            >
            {modes.map((mode, index) => (
              <MenuItem 
                key={index} 
                value={mode}
                style={{
                  backgroundColor: "#101014",
                  color: "#E1E1E5"
                }}
                >
              {mode}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
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