'use client';
import React, { useState } from 'react';

// COMPLETE SELF-CONTAINED MAINTENANCE TRACKER
// Save this as app/complete-tracker.tsx

interface Project {
  id: string;
  name: string;
  type: string;
  area: string;
  requestor: string;
  assignedTo: string;
  priority: string;
  status: string;
  estCost: number;
  actualCost: number;
  progress: number;
}

interface Note {
  id: number;
  projectId: string;
  text: string;
  author: string;
  timestamp: string;
}

export default function CompleteMaintenanceTracker() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'PRJ-001',
      name: 'Greens Aeration - Holes 1-9',
      type: 'Preventive',
      area: 'Golf Course',
      requestor: 'Head Groundskeeper',
      assignedTo: 'Maintenance Team A',
      priority: 'High',
      status: 'In Progress',
      estCost: 2500,
      actualCost: 2200,
      progress: 75
    },
    {
      id: 'PRJ-002',
      name: 'Clubhouse HVAC Repair',
      type: 'Emergency',
      area: 'Clubhouse',
      requestor: 'Facility Manager',
      assignedTo: 'HVAC Contractor',
      priority: 'High',
      status: 'Completed',
      estCost: 3500,
      actualCost: 3750,
      progress: 100
    },
    {
      id: 'PRJ-003',
      name: 'Cart Path Resurfacing',
      type: 'Budgeted',
      area: 'Golf Course',
      requestor: 'Pro Shop Manager',
      assignedTo: 'External Contractor',
      priority: 'Medium',
      status: 'Awaiting Approval',
      estCost: 15000,
      actualCost: 0,
      progress: 0
    }
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      projectId: 'PRJ-001',
      text: 'Started aeration process. Weather conditions optimal.',
      author: 'Head Groundskeeper',
      timestamp: '2024-06-08 09:30:00'
    },
    {
      id: 2,
      projectId: 'PRJ-001',
      text: 'Completed holes 6-9. Some areas need additional seed treatment.',
      author: 'Maintenance Team A',
      timestamp: '2024-06-09 14:15:00'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Preventive',
    area: 'Golf Course',
    requestor: 'Head Groundskeeper',
    assignedTo: 'Maintenance Team A',
    priority: 'Medium',
    status: 'Not Started',
    estCost: 0,
    actualCost: 0,
    progress: 0
  });

  const [newNote, setNewNote] = useState('');

  // Helper functions
  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Preventive',
      area: 'Golf Course',
      requestor: 'Head Groundskeeper',
      assignedTo: 'Maintenance Team A',
      priority: 'Medium',
      status: 'Not Started',
      estCost: 0,
      actualCost: 0,
      progress: 0
    });
  };

  const generateId = () => `PRJ-${String(projects.length + 1).padStart(3, '0')}`;

  // Project operations
  const handleAddProject = () => {
    setEditingProject(null);
    resetForm();
    setShowForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      type: project.type,
      area: project.area,
      requestor: project.requestor,
      assignedTo: project.assignedTo,
      priority: project.priority,
      status: project.status,
      estCost: project.estCost,
      actualCost: project.actualCost,
      progress: project.progress
    });
    setShowForm(true);
  };

  const handleSaveProject = () => {
    if (!formData.name.trim()) return;

    if (editingProject) {
      // Update existing project
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...editingProject, ...formData }
          : p
      ));
    } else {
      // Add new project
      const newProject: Project = {
        id: generateId(),
        ...formData
      };
      setProjects([...projects, newProject]);
    }
    
    setShowForm(false);
    setEditingProject(null);
    resetForm();
  };

  const handleDeleteProject = (project: Project) => {
    setDeleteProject(project);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteProject) {
      setProjects(projects.filter(p => p.id !== deleteProject.id));
      setNotes(notes.filter(n => n.projectId !== deleteProject.id));
      setDeleteProject(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedProject) return;

    const note: Note = {
      id: notes.length + 1,
      projectId: selectedProject.id,
      text: newNote.trim(),
      author: 'Current User',
      timestamp: new Date().toISOString()
    };

    setNotes([...notes, note]);
    setNewNote('');
  };

  const exportToCSV = () => {
    const csv = [
      'Project ID,Name,Type,Area,Requestor,Assigned To,Priority,Status,Est Cost,Actual Cost,Progress',
      ...projects.map(p => 
        `${p.id},"${p.name}",${p.type},${p.area},${p.requestor},${p.assignedTo},${p.priority},${p.status},${p.estCost},${p.actualCost},${p.progress}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'greensburg-maintenance-projects.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: '#dcfce7', color: '#166534' };
      case 'In Progress': return { bg: '#dbeafe', color: '#1e40af' };
      case 'Not Started': return { bg: '#f1f5f9', color: '#64748b' };
      case 'Awaiting Approval': return { bg: '#fed7aa', color: '#ea580c' };
      case 'On-Hold': return { bg: '#fecaca', color: '#dc2626' };
      default: return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return { bg: '#fecaca', color: '#dc2626' };
      case 'Medium': return { bg: '#fde68a', color: '#d97706' };
      case 'Low': return { bg: '#dcfce7', color: '#16a34a' };
      default: return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f9ff',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #065f46, #047857, #059669)',
          color: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '900', 
            margin: 0,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🏌️ Greensburg Country Club
          </h1>
          <p style={{ 
            color: '#a7f3d0', 
            margin: '0.5rem 0 0 0',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            Maintenance Project Tracker
          </p>
        </div>
        
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '6px solid #3b82f6'
          }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>TOTAL PROJECTS</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>{projects.length}</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '6px solid #10b981'
          }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>COMPLETED</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>
              {projects.filter(p => p.status === 'Completed').length}
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '6px solid #f59e0b'
          }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>IN PROGRESS</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>
              {projects.filter(p => p.status === 'In Progress').length}
            </p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '6px solid #ef4444'
          }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>HIGH PRIORITY</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>
              {projects.filter(p => p.priority === 'High').length}
            </p>
          </div>
        </div>
        
        {/* Control Panel */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              margin: 0,
              color: '#1e293b'
            }}>
              📋 Current Projects
            </h2>
            <div>
              <button 
                onClick={handleAddProject}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  marginRight: '1rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                ➕ Add Project
              </button>
              <button 
                onClick={exportToCSV}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                📊 Export CSV
              </button>
            </div>
          </div>
        </div>
        
        {/* Projects Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                background: 'linear-gradient(135deg, #065f46, #047857)',
              }}>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem' }}>PROJECT ID</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem' }}>PROJECT NAME</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem' }}>TYPE</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem' }}>PRIORITY</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem' }}>STATUS</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem' }}>COST</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem' }}>PROGRESS</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => {
                const statusColors = getStatusColor(project.status);
                const priorityColors = getPriorityColor(project.priority);
                
                return (
                  <tr key={project.id} style={{ 
                    backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <td style={{ padding: '1rem', fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                      {project.id}
                    </td>
                    <td style={{ padding: '1rem', color: '#334155', fontWeight: '600', fontSize: '0.95rem' }}>
                      {project.name}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                      {project.type}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: priorityColors.bg,
                        color: priorityColors.color,
                        padding: '0.3rem 0.6rem',
                        borderRadius: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {project.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.color,
                        padding: '0.3rem 0.6rem',
                        borderRadius: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {project.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '700', color: '#1e293b' }}>
                      ${project.estCost.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{
                        width: '60px',
                        height: '8px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          width: `${project.progress}%`,
                          height: '100%',
                          backgroundColor: '#10b981',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                        {project.progress}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleViewProject(project)}
                          style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Actual Cost ($)
                  </label>
                  <input
                    type="number"
                    value={formData.actualCost}
                    onChange={(e) => setFormData({...formData, actualCost: Number(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                  resetForm();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                disabled={!formData.name.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: formData.name.trim() ? '#10b981' : '#9ca3af',
                  color: 'white',
                  fontWeight: '600',
                  cursor: formData.name.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                {editingProject ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showDetails && selectedProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                Project Details: {selectedProject.name}
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Project Information */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#374151' }}>
                  Project Information
                </h3>
                <div style={{ space: '1rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Project ID
                        </span>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: '700', color: '#1e293b' }}>
                          {selectedProject.id}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Type
                        </span>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#374151' }}>
                          {selectedProject.type}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Area
                        </span>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#374151' }}>
                          {selectedProject.area}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Priority
                        </span>
                        <p style={{ margin: '0.25rem 0 0 0' }}>
                          <span style={{
                            ...getPriorityColor(selectedProject.priority),
                            padding: '0.3rem 0.6rem',
                            borderRadius: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            {selectedProject.priority}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Status
                        </span>
                        <p style={{ margin: '0.25rem 0 0 0' }}>
                          <span style={{
                            ...getStatusColor(selectedProject.status),
                            padding: '0.3rem 0.6rem',
                            borderRadius: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            {selectedProject.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Progress
                        </span>
                        <div style={{ marginTop: '0.25rem' }}>
                          <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            marginBottom: '4px'
                          }}>
                            <div style={{
                              width: `${selectedProject.progress}%`,
                              height: '100%',
                              backgroundColor: '#10b981',
                              borderRadius: '4px'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
                            {selectedProject.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Requestor
                    </span>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#374151' }}>
                      {selectedProject.requestor}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      Assigned To
                    </span>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#374151' }}>
                      {selectedProject.assignedTo}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                        Estimated Cost
                      </span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: '700', color: '#1e293b' }}>
                        ${selectedProject.estCost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                        Actual Cost
                      </span>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: '700', color: '#1e293b' }}>
                        ${selectedProject.actualCost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                        Difference
                      </span>
                      <p style={{ 
                        margin: '0.25rem 0 0 0', 
                        fontWeight: '700',
                        color: selectedProject.actualCost - selectedProject.estCost >= 0 ? '#dc2626' : '#16a34a'
                      }}>
                        ${(selectedProject.actualCost - selectedProject.estCost).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Notes */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#374151' }}>
                  Project Notes
                </h3>
                
                {/* Add Note */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this project..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                      resize: 'vertical',
                      minHeight: '80px'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Posting as: Current User
                    </span>
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '0.4rem',
                        backgroundColor: newNote.trim() ? '#10b981' : '#9ca3af',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: newNote.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Notes List */}
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notes.filter(note => note.projectId === selectedProject.id).length > 0 ? (
                    <div style={{ space: '0.75rem' }}>
                      {notes
                        .filter(note => note.projectId === selectedProject.id)
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(note => (
                          <div key={note.id} style={{
                            backgroundColor: '#f8fafc',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid #10b981',
                            marginBottom: '0.75rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: '600', color: '#047857', fontSize: '0.9rem' }}>
                                {note.author}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {new Date(note.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p style={{ margin: 0, color: '#374151', lineHeight: '1.5' }}>
                              {note.text}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>No notes yet for this project.</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>Add the first note above to start documenting progress.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowDetails(false);
                  handleEditProject(selectedProject);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit Project
              </button>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚠️</div>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: '700', color: '#1e293b' }}>
                Confirm Delete
              </h2>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Are you sure you want to delete this project?
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: '#dc2626' }}>
                {deleteProject.name}
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#991b1b' }}>
                Project ID: {deleteProject.id}
              </p>
            </div>
            
            <p style={{ 
              margin: '0 0 1.5rem 0', 
              fontSize: '0.8rem', 
              color: '#dc2626', 
              fontWeight: '600',
              textAlign: 'center'
            }}>
              This action cannot be undone and all project data will be permanently lost.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteProject(null);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.3rem 0.6rem',
                            border: 'none',
                            borderRadius: '0.3rem',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '0.3rem 0.6rem',
                            border: 'none',
                            borderRadius: '0.3rem',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '0.3rem 0.6rem',
                            border: 'none',
                            borderRadius: '0.3rem',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Enter project name"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Budgeted">Budgeted</option>
                    <option value="Expense">Expense</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Area
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Golf Course">Golf Course</option>
                    <option value="Clubhouse">Clubhouse</option>
                    <option value="Pro Shop">Pro Shop</option>
                    <option value="Driving Range">Driving Range</option>
                    <option value="Cart Storage">Cart Storage</option>
                    <option value="Maintenance Facility">Maintenance Facility</option>
                    <option value="Swimming Pool">Swimming Pool</option>
                    <option value="Tennis Courts">Tennis Courts</option>
                    <option value="Parking Lot">Parking Lot</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Requestor
                  </label>
                  <select
                    value={formData.requestor}
                    onChange={(e) => setFormData({...formData, requestor: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Head Groundskeeper">Head Groundskeeper</option>
                    <option value="Facility Manager">Facility Manager</option>
                    <option value="Pro Shop Manager">Pro Shop Manager</option>
                    <option value="General Manager">General Manager</option>
                    <option value="Maintenance Supervisor">Maintenance Supervisor</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Assigned To
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Maintenance Team A">Maintenance Team A</option>
                    <option value="Maintenance Team B">Maintenance Team B</option>
                    <option value="HVAC Contractor">HVAC Contractor</option>
                    <option value="External Contractor">External Contractor</option>
                    <option value="Electrical Team">Electrical Team</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Awaiting Approval">Awaiting Approval</option>
                    <option value="On-Hold">On-Hold</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Estimated Cost ($)
                  </label>
                  <input
                    type="number"
                    value={formData.estCost}
                    onChange={(e) => setFormData({...formData, estCost: Number(e.target.value)})}
                    style={{
                