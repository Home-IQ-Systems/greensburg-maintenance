'use client';
import React, { useState, useEffect } from 'react';

// Types
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
  createdDate: string;
  dueDate?: string;
  photos?: string[];
}

interface Note {
  id: number;
  projectId: string;
  text: string;
  author: string;
  timestamp: string;
}

// Utility Functions
const generateId = (projects: Project[]) => `PRJ-${String(projects.length + 1).padStart(3, '0')}`;

const getStatusColor = (status: string) => {
  const colors = {
    'Completed': { backgroundColor: '#dcfce7', color: '#166534' },
    'In Progress': { backgroundColor: '#dbeafe', color: '#1e40af' },
    'Not Started': { backgroundColor: '#f1f5f9', color: '#64748b' },
    'Awaiting Approval': { backgroundColor: '#fed7aa', color: '#ea580c' },
    'On-Hold': { backgroundColor: '#fecaca', color: '#dc2626' },
  };
  return colors[status] || { backgroundColor: '#f1f5f9', color: '#64748b' };
};

const getPriorityColor = (priority: string) => {
  const colors = {
    'High': { backgroundColor: '#fecaca', color: '#dc2626' },
    'Medium': { backgroundColor: '#fde68a', color: '#d97706' },
    'Low': { backgroundColor: '#dcfce7', color: '#16a34a' },
  };
  return colors[priority] || { backgroundColor: '#f1f5f9', color: '#64748b' };
};

// Budget Status Component
const BudgetStatusCard = ({ projects }) => {
  const totalEstimated = projects.reduce((sum, p) => sum + p.estCost, 0);
  const totalActual = projects.reduce((sum, p) => sum + p.actualCost, 0);
  const variance = totalActual - totalEstimated;
  const percentVariance = totalEstimated ? ((variance / totalEstimated) * 100) : 0;
  
  const getBudgetColor = () => {
    if (Math.abs(percentVariance) <= 5) return { bg: '#dcfce7', color: '#166534', status: 'On Track' };
    if (percentVariance > 5) return { bg: '#fecaca', color: '#dc2626', status: 'Over Budget' };
    return { bg: '#dbeafe', color: '#1e40af', status: 'Under Budget' };
  };

  const budgetStatus = getBudgetColor();

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      borderLeft: `6px solid ${budgetStatus.color}`,
      gridColumn: 'span 2'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: '700' }}>
          💰 Budget Status
        </h3>
        <span style={{
          backgroundColor: budgetStatus.bg,
          color: budgetStatus.color,
          padding: '0.4rem 0.8rem',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: '700'
        }}>
          {budgetStatus.status}
        </span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>ESTIMATED</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>
            ${totalEstimated.toLocaleString()}
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>ACTUAL</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' }}>
            ${totalActual.toLocaleString()}
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>VARIANCE</p>
          <p style={{ 
            margin: '0.25rem 0 0 0', 
            fontSize: '1.5rem', 
            fontWeight: '900',
            color: variance >= 0 ? '#dc2626' : '#16a34a'
          }}>
            {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
          </p>
          <p style={{ 
            margin: '0.25rem 0 0 0', 
            fontSize: '0.8rem', 
            color: variance >= 0 ? '#dc2626' : '#16a34a',
            fontWeight: '600'
          }}>
            ({percentVariance.toFixed(1)}%)
          </p>
        </div>
      </div>
    </div>
  );
};

// Search Component
const SearchBar = ({ searchTerm, setSearchTerm, projects, setFilteredProjects }) => {
  useEffect(() => {
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.requestor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects, setFilteredProjects]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
      <div style={{ 
        position: 'relative',
        maxWidth: '400px',
        minWidth: '300px'
      }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 2.5rem 0.75rem 2.5rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            fontSize: '0.9rem',
            backgroundColor: 'white',
            color: '#1f2937',
            transition: 'all 0.2s',
            outline: 'none',
            position: 'relative',
            zIndex: 1
          }}
        />
        <span style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
          fontSize: '1.1rem',
          pointerEvents: 'none',
          zIndex: 0
        }}>
          🔍
        </span>
        <button
          onClick={() => setSearchTerm('')}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0.25rem',
            display: searchTerm ? 'block' : 'none'
          }}
        >
          ✕
        </button>
      </div>
      
      <div style={{
  fontSize: '0.85rem',
  color: '#374151',
  lineHeight: '1.4',
  marginTop: '0',
  maxWidth: '300px',
  backgroundColor: '#f9fafb',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  border: '1px solid #e5e7eb',
  alignSelf: 'flex-start'
}}>
  <strong>Search by:</strong> Project ID, Name, Type, Area, Priority, Status, Requestor, or Assigned To
</div>
    </div>
  );
};

// Photo Upload Component
const PhotoUpload = ({ projectId, photos, onPhotosUpdate }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    // Simulate file upload with base64 conversion
    Promise.all(
      files.map((file, index) => {
        return new Promise((resolve, reject) => {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            reject(new Error(`${file.name} is not an image file`));
            return;
          }
          
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            reject(new Error(`${file.name} is too large (max 5MB)`));
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              url: e.target.result,
              uploadDate: new Date().toISOString(),
              size: file.size
            });
          };
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });
      })
    ).then(newPhotos => {
      onPhotosUpdate([...(photos || []), ...newPhotos]);
      setUploading(false);
    }).catch(error => {
      console.error('Photo upload error:', error);
      alert(error.message);
      setUploading(false);
    });
  };

  const removePhoto = (photoId) => {
    if (confirm('Are you sure you want to remove this photo?')) {
      const updatedPhotos = (photos || []).filter(photo => photo.id !== photoId);
      onPhotosUpdate(updatedPhotos);
    }
  };

  const viewPhotoFullSize = (photo) => {
    // Create a modal to view full-size photo
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
      background: rgba(0,0,0,0.9); display: flex; align-items: center; 
      justify-content: center; z-index: 2000; cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = photo.url;
    img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain;';
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.onclick = () => document.body.removeChild(modal);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
          📸 Project Photos
        </h4>
        <label style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          cursor: 'pointer',
          border: 'none'
        }}>
          {uploading ? '⏳ Uploading...' : '📎 Add Photos'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>

      {photos && photos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '0.75rem'
        }}>
          {photos.map(photo => (
            <div key={photo.id} style={{
              position: 'relative',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              border: '2px solid #e5e7eb',
              cursor: 'pointer'
            }}>
              <img
                src={photo.url}
                alt={photo.name}
                onClick={() => viewPhotoFullSize(photo)}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white',
                padding: '0.25rem',
                fontSize: '0.7rem',
                textAlign: 'center'
              }}>
                {photo.name.length > 15 ? photo.name.substring(0, 12) + '...' : photo.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(photo.id);
                }}
                style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.25rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '1.5rem',
                  height: '1.5rem',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Remove photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
export default function MaintenanceTracker() {
  const defaultProjects: Project[] = [
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
      progress: 75,
      createdDate: '2024-06-01T09:00:00',
      dueDate: '2024-06-15T17:00:00',
      photos: []
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
      progress: 100,
      createdDate: '2024-06-05T14:30:00',
      dueDate: '2024-06-10T16:00:00',
      photos: []
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
      progress: 0,
      createdDate: '2024-06-03T10:15:00',
      dueDate: '2024-07-01T17:00:00',
      photos: []
    }
  ];

  const defaultNotes: Note[] = [
    {
      id: 1,
      projectId: 'PRJ-001',
      text: 'Started aeration process on holes 1-3. Weather conditions are optimal.',
      author: 'Head Groundskeeper',
      timestamp: '2024-06-08T09:30:00'
    },
    {
      id: 2,
      projectId: 'PRJ-001',
      text: 'Completed holes 4-6. Some areas need additional seed treatment.',
      author: 'Maintenance Team A',
      timestamp: '2024-06-09T14:15:00'
    },
    {
      id: 3,
      projectId: 'PRJ-002',
      text: 'HVAC system fully operational. Temperature control restored.',
      author: 'HVAC Contractor',
      timestamp: '2024-06-10T16:45:00'
    }
  ];

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newNote, setNewNote] = useState('');
  
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
    progress: 0,
    dueDate: '',
    photos: []
  });

  // Load data from memory (replacing localStorage)
  useEffect(() => {
    // Check if we already have data to prevent resetting on re-renders
    if (projects.length === 0) {
      setProjects(defaultProjects);
      setFilteredProjects(defaultProjects);
    }
    if (notes.length === 0) {
      setNotes(defaultNotes);
    }
  }, []);

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
      progress: 0,
      dueDate: '',
      photos: []
    });
  };

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
      progress: project.progress,
      dueDate: project.dueDate ? new Date(project.dueDate).toISOString().slice(0, 16) : '',
      photos: project.photos || []
    });
    setShowForm(true);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  const handleSaveProject = () => {
    if (!formData.name.trim()) {
      alert('Project name is required');
      return;
    }

    if (formData.estCost < 0 || formData.actualCost < 0) {
      alert('Costs cannot be negative');
      return;
    }

    if (formData.progress < 0 || formData.progress > 100) {
      alert('Progress must be between 0 and 100');
      return;
    }

    if (editingProject) {
      const updatedProjects = projects.map(p => 
        p.id === editingProject.id 
          ? { 
              ...editingProject, 
              ...formData,
              dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
            }
          : p
      );
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
    } else {
      const newProject: Project = {
        id: generateId(projects),
        ...formData,
        createdDate: new Date().toISOString(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
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
      const updatedProjects = projects.filter(p => p.id !== deleteProject.id);
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      setNotes(notes.filter(n => n.projectId !== deleteProject.id));
      setDeleteProject(null);
      setShowDeleteConfirm(false);
    }
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

  const updateProjectPhotos = (photos) => {
    if (selectedProject) {
      const updatedProjects = projects.map(p =>
        p.id === selectedProject.id ? { ...p, photos } : p
      );
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      setSelectedProject({ ...selectedProject, photos });
    }
  };

  const exportToCSV = () => {
    try {
      const csv = [
        'Project ID,Name,Type,Area,Requestor,Assigned To,Priority,Status,Est Cost,Actual Cost,Progress,Created Date,Due Date',
        ...filteredProjects.map(p => 
          `${p.id},"${p.name.replace(/"/g, '""')}",${p.type},${p.area},"${p.requestor}","${p.assignedTo}",${p.priority},${p.status},${p.estCost},${p.actualCost},${p.progress},"${p.createdDate}","${p.dueDate || ''}"`
        )
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `greensburg-projects-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f9ff',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      < div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            Maintenance Project Tracker v2.4
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: '#a7f3d0'
          }}>
            <span>💾 Data in memory • 📝 Click projects for details • 🔍 Search enabled • 📸 Photo support</span>
          </div>
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
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>📊 TOTAL PROJECTS</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>{projects.length}</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '6px solid #10b981'
          }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>✅ COMPLETED</h3>
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
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>⚡ IN PROGRESS</h3>
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
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>🔥 HIGH PRIORITY</h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>
              {projects.filter(p => p.priority === 'High').length}
            </p>
          </div>
        </div>  

            {/* Budget and Priority Section - 2 columns */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '2rem',
          width: '100%'
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <BudgetStatusCard projects={projects} />
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Priority Projects Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '6px solid #dc2626',
            height: '100%'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '1.1rem', 
                color: '#1e293b', 
                fontWeight: '700'
              }}>
                🚨 Priority Projects
              </h3>
            </div>
            
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {/* High Priority Items */}
              {filteredProjects
                .filter(project => project.priority === 'High' && project.status !== 'Completed')
                .slice(0, 3)
                .map(project => (
                  <div 
                    key={`high-${project.id}`}
                    onClick={() => {
                      setSelectedProject(project);
                      setShowDetails(true);
                    }}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      borderRadius: '0.5rem',
                      transition: 'background-color 0.2s',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Left Side - Project Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#1f2937', 
                        fontSize: '0.9rem',
                        marginBottom: '0.25rem'
                      }}>
                        {project.name}
                      </div>
                      <div style={{ 
                        color: '#6b7280', 
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        <strong>Assigned to:</strong> {project.assignedTo}
                      </div>
                    </div>

                    {/* Right Side - Details Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '0.75rem',
                      fontSize: '0.7rem',
                      textAlign: 'right',
                      minWidth: '200px'
                    }}>
                      <div>
                        <div style={{ color: '#6b7280', fontWeight: '700', marginBottom: '0.125rem' }}>
                          <strong>Requestor</strong>
                        </div>
                        <div style={{ color: '#374151' }}>
                          {project.requestor || 'N/A'}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#6b7280', fontWeight: '700', marginBottom: '0.125rem' }}>
                          <strong>Created Date</strong>
                        </div>
                        <div style={{ color: '#374151' }}>
                          {project.createdDate ? new Date(project.createdDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#6b7280', fontWeight: '700', marginBottom: '0.125rem' }}>
                          <strong>Priority</strong>
                        </div>
                        <div style={{ 
                          color: '#ef4444',
                          fontWeight: '600',
                          backgroundColor: '#fef2f2',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem',
                          border: '1px solid #fecaca',
                          fontSize: '0.65rem'
                        }}>
                          HIGH
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#6b7280', fontWeight: '700', marginBottom: '0.125rem' }}>
                          <strong>Progress</strong>
                        </div>
                        <div style={{ 
                          color: '#059669',
                          fontWeight: '600'
                        }}>
                          {project.progress !== undefined ? `${project.progress}%` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              
              {/* Emergency Items */}
              {filteredProjects
                .filter(project => project.type === 'Emergency' && project.status !== 'Completed')
                .slice(0, 2)
                .map(project => (
                  <div 
                    key={`emergency-${project.id}`}
                    onClick={() => {
                      setSelectedProject(project);
                      setShowDetails(true);
                    }}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      borderRadius: '0.5rem',
                      transition: 'background-color 0.2s',
                      marginBottom: '0.5rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                    }}
                  >
                    {/* Left Side - Project Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#1f2937', 
                        fontSize: '0.9rem',
                        marginBottom: '0.25rem'
                      }}>
                        {project.name}
                      </div>
                      <div style={{ 
                        color: '#6b7280', 
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        <strong>Assigned to:</strong> {project.assignedTo}
                      </div>
                    </div>

                    {/* Right Side - Details Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '0.75rem',
                      fontSize: '0.7rem',
                      textAlign: 'right',
                      minWidth: '200px'
                    }}>
                      <div>
                        <div style={{ color: '#6b7280', fontWeight: '700', marginBottom: '0.125rem' }}>
                          <strong>Requestor</strong>
                        </div>
                        <div style={{ color: '#374151' }}>
                          {project.requestor || 'N/A'}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#6b7280', fontWeight: '700', marginBottom: '0.125rem' }}>
                          <strong>Created Date</strong>
                        </div>
                        <div style={{ color: '#374151' }}>
                          {project.createdDate ? new Date(project.createdDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#6b7280', fontWeight: '700', marginBottom: '0.125rem' }}>
                          <strong>Priority</strong>
                        </div>
                        <div style={{ 
                          color: 'white',
                          fontWeight: '700',
                          backgroundColor: '#dc2626',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.65rem'
                        }}>
                          🚨 EMERGENCY
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#6b7280', fontWeight: '700', marginBottom: '0.125rem' }}>
                          <strong>Progress</strong>
                        </div>
                        <div style={{ 
                          color: '#059669',
                          fontWeight: '600'
                        }}>
                          {project.progress !== undefined ? `${project.progress}%` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              
              {/* Show message if no priority items */}
              {filteredProjects.filter(project => 
                (project.priority === 'High' || project.type === 'Emergency') && 
                project.status !== 'Completed'
              ).length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '0.8rem',
                  padding: '1rem 0',
                  fontStyle: 'italic'
                }}>
                  No priority items ✅
                </div>
              )}
            </div>
          </div>
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
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '800', 
                margin: '0 0 1rem 0',
                color: '#1e293b'
              }}>

                📋 Current Projects
              </h2>
              <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                projects={projects}
                setFilteredProjects={setFilteredProjects}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button 
                onClick={handleAddProject}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
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
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>PROJECT ID</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>PROJECT NAME</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>TYPE</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>PRIORITY</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>STATUS</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>COST</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>PROGRESS</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>DUE DATE</th>
                <th style={{ color: 'white', padding: '1rem', textAlign: 'left', fontWeight: '700' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => {
                const statusColors = getStatusColor(project.status);
                const priorityColors = getPriorityColor(project.priority);
                const projectNotes = notes.filter(n => n.projectId === project.id);
                const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && project.status !== 'Completed';
                
                return (
                  <tr key={project.id} style={{ 
                    backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <td style={{ padding: '1rem', fontWeight: '700', color: '#1e293b' }}>
                      {project.id}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <button
                          onClick={() => handleViewProject(project)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0,
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          {project.name}
                        </button>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                          {projectNotes.length > 0 && (
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              📝 {projectNotes.length} note{projectNotes.length !== 1 ? 's' : ''}
                            </span>
                          )}
                          {project.photos && project.photos.length > 0 && (
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              📸 {project.photos.length} photo{project.photos.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      {project.type}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: priorityColors.backgroundColor,
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
                        backgroundColor: statusColors.backgroundColor,
                        color: statusColors.color,
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
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
                      {project.dueDate ? (
                        <div>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: isOverdue ? '#dc2626' : '#64748b',
                            fontWeight: isOverdue ? '700' : '500'
                          }}>
                            {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                          {isOverdue && (
                            <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: '600' }}>
                              ⚠️ Overdue
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>No due date</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleEditProject(project)}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '0.4rem 0.8rem',
                            minWidth: '80px',
                            border: 'none',
                            borderRadius: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '0.4rem 0.8rem',
                            minWidth: '80px',
                            border: 'none',
                            borderRadius: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Project Details Modal with Notes and Photos */}
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
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                  📋 {selectedProject.name}
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
                    📊 Project Information
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

                    {/* Date Information */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Created Date
                        </span>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#374151' }}>
                          {new Date(selectedProject.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Due Date
                        </span>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#374151' }}>
                          {selectedProject.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : 'Not set'}
                        </p>
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

                  {/* Photo Upload Section */}
                  <PhotoUpload 
                    projectId={selectedProject.id}
                    photos={selectedProject.photos}
                    onPhotosUpdate={updateProjectPhotos}
                  />
                </div>

                {/* Project Notes */}
                <div>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#374151' }}>
                    📝 Project Notes
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
                        ➕ Add Note
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

        {/* Add/Edit Project Form Modal */}
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
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                {editingProject ? '✏️ Edit Project' : '➕ Add New Project'}
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Type</label>
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Area</label>
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
                      <option value="Golf Course">🏌️ Golf Course</option>
                      <option value="Clubhouse">🏢 Clubhouse</option>
                      <option value="Pro Shop">🛍️ Pro Shop</option>
                      <option value="Driving Range">🎯 Driving Range</option>
                      <option value="Cart/Storage">🚗 Cart/Storage</option>
                      <option value="Pickleball Courts">🏓 Pickleball Courts</option>
                      <option value="Halfway">☕ Halfway</option>
                      <option value="Pool/Cabana">🏖️ Pool/Cabana</option>
                      <option value="Bar">🍺 Bar</option>
                      <option value="Kitchen/Dining">🍽️ Kitchen/Dining</option>

                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Priority</label>
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
                      <option value="High">🔥 High</option>
                      <option value="Medium">⚡ Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Status</label>
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
                      <option value="Not Started">⏸️ Not Started</option>
                      <option value="In Progress">▶️ In Progress</option>
                      <option value="Completed">✅ Completed</option>
                      <option value="Awaiting Approval">⏳ Awaiting Approval</option>
                      <option value="On-Hold">⏹️ On-Hold</option>
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
                      <option value="Head Groundskeeper">👨‍🌾 Head Groundskeeper</option>
                      <option value="Facility Manager">🏢 Maintenance Manager</option>
                      <option value="Pro Shop Manager">🛍️ Pro Shop Manager</option>
                      <option value="General Manager">👔 General Manager</option>
                      <option value="Member">👤 Member Suggestion</option>
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
                      <option value="Maintenance Team A">🔧 Maintenance Team A</option>
                      <option value="Maintenance Team B">🔧 Maintenance Team B</option>
                      <option value="External Contractor">🏗️ External Contractor</option>
                      <option value="HVAC Contractor">❄️ HVAC Contractor</option>
                      <option value="Landscaping Team">🌱 Landscaping Team</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  />
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
                  ❌ Cancel
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
                  {editingProject ? '💾 Update Project' : '➕ Add Project'}
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
                This will also delete all notes and photos for this project.
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
                  ❌ Cancel
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
                  🗑️ Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}