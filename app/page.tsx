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
  photos?: any[];
}

// Error Boundary Component - Add this before DatabaseManager class
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#f0f9ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>Application Error</h2>
            <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
              Something went wrong. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// SQLite Database Manager (Simulated with localStorage)
class DatabaseManager {
  private isInitialized = false;
  private projects = [];
  private notes = [];
  private auditLog = [];

  async init() {
    if (this.isInitialized) return true;
    
    try {
      // Initialize with default data instead of localStorage
      this.initializeDefaultData();
      this.isInitialized = true;
      console.log('✅ Database initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private initializeDefaultData() {
    // Initialize in-memory data instead of localStorage
      this.projects = [
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
      photos: [],
      updatedDate: '2024-06-01T09:00:00',
      isDeleted: 0
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
      photos: [],
      updatedDate: '2024-06-10T16:00:00',
      isDeleted: 0
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
      photos: [],
      updatedDate: '2024-06-03T10:15:00',
      isDeleted: 0
    }
  ];

  this.notes = [
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

  this.auditLog = [];
  
  this.metadata = {
    version: '1.0',
    created: new Date().toISOString(),
    lastMigration: new Date().toISOString()
  };
}

  // Project CRUD Operations
 async getAllProjects() {
  try {
    const projects = this.projects || [];
    return projects.filter(p => !p.isDeleted).map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        area: p.area,
        requestor: p.requestor,
        assignedTo: p.assignedTo,
        priority: p.priority,
        status: p.status,
        estCost: p.estCost,
        actualCost: p.actualCost,
        progress: p.progress,
        createdDate: p.createdDate,
        dueDate: p.dueDate,
        photos: p.photos || []
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async createProject(project) {
    try {
      const projects = this.projects || [];
      const newId = `PRJ-${String(projects.length + 1).padStart(3, '0')}`;
      
      const newProject = {
        ...project,
        id: newId,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        isDeleted: 0,
        photos: project.photos || []
      };

      projects.push(newProject);
      this.projects = projects;
      
      // Log audit trail
      await this.logAudit(newId, 'CREATE', null, null, JSON.stringify(newProject), 'Current User');
      
      console.log('✅ Project created:', newId);
      return {
        id: newProject.id,
        name: newProject.name,
        type: newProject.type,
        area: newProject.area,
        requestor: newProject.requestor,
        assignedTo: newProject.assignedTo,
        priority: newProject.priority,
        status: newProject.status,
        estCost: newProject.estCost,
        actualCost: newProject.actualCost,
        progress: newProject.progress,
        createdDate: newProject.createdDate,
        dueDate: newProject.dueDate,
        photos: newProject.photos
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id, updates) {
    try {
      const projects = this.projects || [];
      const projectIndex = projects.findIndex(p => p.id === id && !p.isDeleted);
      
      if (projectIndex === -1) {
        throw new Error(`Project ${id} not found`);
      }

      const oldProject = projects[projectIndex];
      const updatedProject = {
        ...oldProject,
        ...updates,
        updatedDate: new Date().toISOString()
      };

      // Log changes for audit trail
      for (const [field, newValue] of Object.entries(updates)) {
        if (oldProject[field] !== newValue) {
          await this.logAudit(id, 'UPDATE', field, 
            String(oldProject[field]), String(newValue), 'Current User');
        }
      }

      projects[projectIndex] = updatedProject;
      this.projects = projects;
      
      console.log('✅ Project updated:', id);
      return {
        id: updatedProject.id,
        name: updatedProject.name,
        type: updatedProject.type,
        area: updatedProject.area,
        requestor: updatedProject.requestor,
        assignedTo: updatedProject.assignedTo,
        priority: updatedProject.priority,
        status: updatedProject.status,
        estCost: updatedProject.estCost,
        actualCost: updatedProject.actualCost,
        progress: updatedProject.progress,
        createdDate: updatedProject.createdDate,
        dueDate: updatedProject.dueDate,
        photos: updatedProject.photos
      };
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      const projects = this.projects || [];
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        throw new Error(`Project ${id} not found`);
      }

      // Soft delete - mark as deleted instead of removing
      projects[projectIndex].isDeleted = 1;
      projects[projectIndex].deletedDate = new Date().toISOString();
      this.projects = projects;
      
      // Log audit trail
      await this.logAudit(id, 'DELETE', null, null, null, 'Current User');
      
      console.log('✅ Project soft deleted:', id);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Notes CRUD Operations
  async getNotesByProject(projectId) {
    try {
      const notes = this.notes || [];
      return notes.filter(n => n.projectId === projectId);
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  async createNote(note) {
    try {
      const notes = this.notes || [];
      const newNote = {
        ...note,
        id: notes.length + 1,
        timestamp: new Date().toISOString()
      };

      notes.push(newNote);
      this.notes = notes;
      
      // Log audit trail
      await this.logAudit(note.projectId, 'ADD_NOTE', 'notes', null, note.text, note.author);
      
      console.log('✅ Note created for project:', note.projectId);
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  // Audit Trail Operations
  async logAudit(projectId, action, field, oldValue, newValue, userId) {
    try {
      const auditLog = this.auditLog || [];
      const logEntry = {
        id: auditLog.length + 1,
        projectId,
        action,
        field,
        oldValue,
        newValue,
        userId,
        timestamp: new Date().toISOString()
      };

      auditLog.push(logEntry);
      this.auditLog = auditLog;
    } catch (error) {
      console.error('Error logging audit trail:', error);
    }
  }

  async getAuditTrail(projectId) {
    try {
      const auditLog = this.auditLog || [];
      return projectId 
        ? auditLog.filter(log => log.projectId === projectId)
        : auditLog;
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      return [];
    }
  }

  async backup() {
    const backup = {
      projects: this.projects,
      notes: this.notes,
      auditLog: this.auditLog,
      metadata: this.metadata,
      timestamp: new Date().toISOString()
    };
    
    console.log('💾 Database backup created');
    return JSON.stringify(backup);
  }
}

// Utility Functions
const getStatusColor = (status) => {
  const colors = {
    'Completed': { backgroundColor: '#dcfce7', color: '#166534' },
    'In Progress': { backgroundColor: '#dbeafe', color: '#1e40af' },
    'Not Started': { backgroundColor: '#f1f5f9', color: '#64748b' },
    'Awaiting Approval': { backgroundColor: '#fed7aa', color: '#ea580c' },
    'On-Hold': { backgroundColor: '#fecaca', color: '#dc2626' },
  };
  return colors[status] || { backgroundColor: '#f1f5f9', color: '#64748b' };
};

const getPriorityColor = (priority) => {
  const colors = {
    'High': { backgroundColor: '#fecaca', color: '#dc2626' },
    'Medium': { backgroundColor: '#fde68a', color: '#d97706' },
    'Low': { backgroundColor: '#dcfce7', color: '#16a34a' },
  };
  return colors[priority] || { backgroundColor: '#f1f5f9', color: '#64748b' };
};

// Database Status Component
const DatabaseStatus = ({ db, connectionStatus }) => {
  const [dbStats, setDbStats] = useState({ projects: 0, notes: 0, auditEntries: 0 });

  useEffect(() => {
    const updateStats = async () => {
      if (db) {
        try {
          const projects = await db.getAllProjects();
          const auditLog = await db.getAuditTrail();
          // Get all notes from all projects
          const allNotes = [];
          for (const project of projects) {
            const projectNotes = await db.getNotesByProject(project.id);
            allNotes.push(...projectNotes);
          }
          const notes = allNotes;
          
          setDbStats({
            projects: projects.length,
            notes: notes.length,
            auditEntries: auditLog.length
          });
        } catch (error) {
          console.error('Error updating stats:', error);
        }
      }
    };

    updateStats();
  }, [db]);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢';
      case 'connecting': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '1rem',
      border: `2px solid ${connectionStatus === 'connected' ? '#10b981' : connectionStatus === 'error' ? '#ef4444' : '#fbbf24'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{getStatusIcon()}</span>
          <span style={{ fontWeight: '600', color: '#374151' }}>
            Database: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
          <span>📊 {dbStats.projects} Projects</span>
          <span>📝 {dbStats.notes} Notes</span>
          <span>📋 {dbStats.auditEntries} Audit Entries</span>
        </div>
      </div>
    </div>
  );
};

// Budget Status Component
const BudgetStatusCard = ({ projects }) => {
  // Only include active projects in budget calculations
  const activeBudgetProjects = projects.filter(p => 
    p.status === 'In Progress' || p.status === 'Completed'
  );
  
  const totalEstimated = activeBudgetProjects.reduce((sum, p) => sum + p.estCost, 0);
  const totalActual = activeBudgetProjects.reduce((sum, p) => sum + p.actualCost, 0);
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
      borderLeft: `6px solid ${budgetStatus.color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: '700' }}>
          💰 Active Budget Status
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
      
      {/* Active Projects Count */}
      <div style={{ 
        marginTop: '1rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#6b7280'
      }}>
        📊 Based on {activeBudgetProjects.length} active project{activeBudgetProjects.length !== 1 ? 's' : ''} 
        (excludes pending/on-hold projects)
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
            outline: 'none'
          }}
        />
        <span style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
          fontSize: '1.1rem',
          pointerEvents: 'none'
        }}>
          🔍
        </span>
        {searchTerm && (
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
              padding: '0.25rem'
            }}
          >
            ✕
          </button>
        )}
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

// Main Component
function MaintenanceTrackerWithSQLite() {
  // Database instance
  const [db, setDb] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  // State
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  
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

  // Initialize database
  useEffect(() => {
    const initDatabase = async () => {
      try {
        setConnectionStatus('connecting');
        const dbInstance = new DatabaseManager();
        await dbInstance.init();
        setDb(dbInstance);
        setConnectionStatus('connected');
        
        // Load initial data
        await loadProjects(dbInstance);
      } catch (error) {
        console.error('Database initialization failed:', error);
        setConnectionStatus('error');
      }
    };

    initDatabase();
  }, []);

  const loadProjects = async (dbInstance) => {
    try {
      const projectsData = await dbInstance.getAllProjects();
      setProjects(projectsData);
      setFilteredProjects(projectsData);
      
      // Load notes for all projects
      const allNotes = [];
      for (const project of projectsData) {
        const projectNotes = await dbInstance.getNotesByProject(project.id);
        allNotes.push(...projectNotes);
      }
      setNotes(allNotes);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

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

  const handleDeleteProject = (project: Project) => {
    setDeleteProject(project);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
  if (deleteProject) {
    const updatedProjects = projects.filter(p => p.id !== deleteProject.id);
    setProjects(updatedProjects);
    setFilteredProjects(updatedProjects);
    // Also remove related notes when we add the notes system
    setDeleteProject(null);
    setShowDeleteConfirm(false);
    }
  }; 

  const handleAddProject = () => {
    setEditingProject(null);
    resetForm();
    setShowForm(true);
  };

  const handleEditProject = (project) => {
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

  const handleViewProject = async (project) => {
  setSelectedProject(project);
  if (db) {
    const projectNotes = await db.getNotesByProject(project.id);
    setNotes(projectNotes);
    
    // Load audit trail for this project
    const projectAuditTrail = await db.getAuditTrail(project.id);
    setAuditTrail(projectAuditTrail);
  }
  setShowDetails(true);
};

  const handleSaveProject = async () => {
    if (!db) {
      alert('Database not connected');
      return;
    }

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

    try {
      if (editingProject) {
        const updatedProject = await db.updateProject(editingProject.id, {
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
        });
        
        const updatedProjects = projects.map(p => 
          p.id === editingProject.id ? updatedProject : p
        );
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
      } else {
        const newProject = await db.createProject({
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
        });
        
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
      }
      
      setShowForm(false);
      setEditingProject(null);
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleAddNote = async () => {
  if (!newNote.trim() || !selectedProject || !db) return;

  try {
    const note = await db.createNote({
      projectId: selectedProject.id,
      text: newNote.trim(),
      author: 'Current User'
    });

    setNotes([...notes, note]);
    setNewNote('');
  } catch (error) {
    console.error('Error adding note:', error);
    alert('Failed to add note. Please try again.');
  }
};

const handlePhotoUpload = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0 || !selectedProject) return;

  try {
    const newPhotos = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" is not an image. Please upload only image files.`);
        continue;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Please upload images smaller than 5MB.`);
        continue;
      }
      
      // Convert to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      
      newPhotos.push({
        id: Date.now() + i,
        name: file.name,
        data: base64,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Current User',
        size: file.size
      });
    }
    
    if (newPhotos.length > 0) {
  const updatedPhotos = [...(selectedProject.photos || []), ...newPhotos];
  await updateProjectPhotos(updatedPhotos);
  
  // Log audit trail for photo uploads
  if (db) {
    for (const photo of newPhotos) {
      await db.logAudit(selectedProject.id, 'ADD_PHOTO', 'photos', null, photo.name, 'Current User');
    }
  }
}
    
    // Clear the input
    event.target.value = '';
  } catch (error) {
    console.error('Error uploading photos:', error);
    alert('Failed to upload photos. Please try again.');
  }
};

const handleDeletePhoto = async (photoId) => {
  if (!selectedProject) return;
  
  const photoToDelete = selectedProject.photos.find(photo => photo.id === photoId);
  const updatedPhotos = selectedProject.photos.filter(photo => photo.id !== photoId);
  await updateProjectPhotos(updatedPhotos);
  
  // Log audit trail for photo deletion
  if (db && photoToDelete) {
    await db.logAudit(selectedProject.id, 'DELETE_PHOTO', 'photos', photoToDelete.name, null, 'Current User');
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

  const updateProjectPhotos = async (photos) => {
    if (!selectedProject || !db) return;

    try {
      await db.updateProject(selectedProject.id, { photos });
      
      const updatedProjects = projects.map(p =>
        p.id === selectedProject.id ? { ...p, photos } : p
      );
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      setSelectedProject({ ...selectedProject, photos });
    } catch (error) {
      console.error('Error updating photos:', error);
      alert('Failed to update photos. Please try again.');
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

  const handleDatabaseBackup = async () => {
    if (!db) return;
    
    try {
      const backupData = await db.backup();
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maintenance-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Database backup created successfully!');
    } catch (error) {
      console.error('Backup error:', error);
      alert('Failed to create backup. Please try again.');
    }
  };

  if (connectionStatus === 'connecting') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f0f9ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🟡</div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Initializing Database...</h2>
          <p style={{ margin: 0, color: '#6b7280' }}>Setting up SQLite connections and loading data</p>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f0f9ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔴</div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#dc2626' }}>Database Connection Failed</h2>
          <p style={{ margin: 0, color: '#6b7280' }}>Unable to initialize SQLite database</p>
        </div>
      </div>
    );
  }

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
            Maintenance Project Tracker v3.5 - Vercel Edition
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: '#a7f3d0'
          }}>
            <span>💾 Vercel Database • 📋 Audit Trail • 🔍 Search enabled • 📸 Photo support</span>
          </div>
        </div>

        {/* Database Status */}
        <DatabaseStatus db={db} connectionStatus={connectionStatus} />
        
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

        {/* Budget and Priority Section */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '2rem',
          width: '100%'
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
  <div style={{
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    borderLeft: '6px solid #3b82f6',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }}>
    {/* Existing Budget Summary */}
    <BudgetStatusCard projects={projects} />
    
    {/* Budget Alerts Section */}
    <div style={{ marginTop: '1.5rem', flex: 1 }}>
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
          ⚠️ Budget Alerts
        </h3>
      </div>
      
      <div style={{ maxHeight: '180px', overflowY: 'scroll', overflowX: 'hidden' }}>
        {filteredProjects
          .filter(project => 
            (project.status === 'In Progress') && 
            ((project.actualCost - project.estCost) / project.estCost) * 100 > 0
)
          .sort((a, b) => {
            const aVariance = ((a.actualCost - a.estCost) / a.estCost) * 100;
            const bVariance = ((b.actualCost - b.estCost) / b.estCost) * 100;
            return bVariance - aVariance; // Sort by highest variance first
          })
          .slice(0, 4)
          .map(project => {
            const variance = ((project.actualCost - project.estCost) / project.estCost) * 100;
            const isOverBudget = variance > 10;
            const isApproaching = variance > 0 && variance <= 10;
            const isUnderBudget = variance <= 0;
            
            return (
              <div 
                key={project.id}
                onClick={() => handleViewProject(project)}
                style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${isOverBudget ? '#dc2626' : isApproaching ? '#f59e0b' : '#10b981'}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  border: `1px solid ${isOverBudget ? '#fecaca' : isApproaching ? '#fed7aa' : '#bbf7d0'}`,
                  marginBottom: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ 
                  fontWeight: '600', 
                  color: isOverBudget ? '#dc2626' : isApproaching ? '#d97706' : '#059669',
                  fontSize: '0.95rem',
                  marginBottom: '0.75rem'
                }}>
                  {isOverBudget ? '🚨' : isApproaching ? '⚠️' : '✅'} {project.name}
                </div>
                
                <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: '1.4' }}>
                  {/* Top row: Budget Status and Variance */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>
                      <strong style={{ color: '#111827' }}>Budget:</strong> ${project.estCost.toLocaleString()}
                    </span>
                    <span>
                      <strong style={{ color: '#111827' }}>Variance:</strong> 
                      <span style={{ 
                        color: isOverBudget ? '#dc2626' : isApproaching ? '#d97706' : '#059669',
                        fontWeight: '600',
                        marginLeft: '0.25rem'
                      }}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </span>
                    </span>
                  </div>
                  
                  {/* Bottom row: Actual Cost and Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>
                      <strong style={{ color: '#111827' }}>Actual:</strong> ${project.actualCost.toLocaleString()}
                    </span>
                    <span>
                      <strong style={{ color: '#111827' }}>Status:</strong> {project.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        {filteredProjects.filter(project => 
          project.status !== 'Completed' && 
          ((project.actualCost - project.estCost) / project.estCost) * 100 > 0
        ).length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#059669',
            fontSize: '0.8rem',
            padding: '1rem 0',
            fontStyle: 'italic'
          }}>
            ✅ All projects are currently under budget!
          </div>
        )}
        
      </div>
    </div>
  </div>
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
              
              <div style={{ maxHeight: '230px', overflowY: 'auto', overflowX: 'hidden' }}>
                {filteredProjects
                  .filter(project => (project.priority === 'High' || project.type === 'Emergency' || project.type === 'Safety') && project.status === 'In Progress')
                  .slice(0, 10)
                  .map(project => (
                    <div 
                      key={project.id}
                      onClick={() => handleViewProject(project)}
                      style={{
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        borderLeft: '4px solid #dc2626',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease',
                        border: '1px solid #fecaca',
                        marginBottom: '0.75rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#dc2626',
                        fontSize: '0.95rem',
                        marginBottom: '0.75rem'
                      }}>
                        {project.name}
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: '1.4' }}>
                        {/* Top row: Requestor and Progress */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span>
                            <strong style={{ color: '#111827' }}>Requestor:</strong> {project.requestor}
                          </span>
                          <span>
                            <strong style={{ color: '#111827' }}>Progress:</strong> 
                            <span style={{ color: '#059669', fontWeight: '600', marginLeft: '0.25rem' }}>
                              {project.progress}%
                            </span>
                          </span>
                        </div>
                        
                        {/* Bottom row: Priority and Due Date */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span>
                              <strong style={{ color: '#111827' }}>Type:</strong> 
                              <span style={{ 
                                color: project.type === 'Emergency' ? '#dc2626' : 
                                      project.type === 'Safety' ? '#f59e0b' : '#dc2626',
                                fontWeight: '600',
                                marginLeft: '0.25rem'
                              }}>
                                {project.type === 'Emergency' ? 'Emergency' : 
                                project.type === 'Safety' ? 'Safety' : 
                                'High Priority'}
                              </span>
                            </span>
                          <span>
                            <strong style={{ color: '#111827' }}>Due:</strong> {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {filteredProjects.filter(project => 
                  (project.priority === 'High' || project.type === 'Emergency' || project.type === 'Safety') && 
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
                disabled={connectionStatus !== 'connected'}
                style={{
                  backgroundColor: connectionStatus === 'connected' ? '#10b981' : '#9ca3af',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
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
              <button 
                onClick={handleDatabaseBackup}
                disabled={connectionStatus !== 'connected'}
                style={{
                  backgroundColor: connectionStatus === 'connected' ? '#8b5cf6' : '#9ca3af',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                💾 Backup DB
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
                          disabled={connectionStatus !== 'connected'}
                          style={{
                            backgroundColor: connectionStatus === 'connected' ? '#10b981' : '#9ca3af',
                            color: 'white',
                            padding: '0.4rem 0.8rem',
                            minWidth: '80px',
                            border: 'none',
                            borderRadius: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          disabled={connectionStatus !== 'connected'}
                          style={{
                            backgroundColor: connectionStatus === 'connected' ? '#ef4444' : '#9ca3af',
                            color: 'white',
                            padding: '0.4rem 0.8rem',
                            minWidth: '80px',
                            border: 'none',
                            borderRadius: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed'
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

         {/* Photo Viewer Modal */}
        {showPhotoViewer && selectedPhoto && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem'
          }}>
            <div style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              backgroundColor: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}>
              {/* Photo Viewer Header */}
              <div style={{
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '700' }}>
                    {selectedPhoto.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#d1d5db' }}>
                    Uploaded by {selectedPhoto.uploadedBy} • {new Date(selectedPhoto.uploadedAt).toLocaleString()} • {formatFileSize(selectedPhoto.size)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPhotoViewer(false);
                    setSelectedPhoto(null);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Photo Display */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb',
                minHeight: '400px',
                maxHeight: '70vh'
              }}>
                <img
                  src={selectedPhoto.data}
                  alt={selectedPhoto.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '0.5rem'
                  }}
                />
              </div>

              {/* Photo Actions */}
              <div style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <a
                  href={selectedPhoto.data}
                  download={selectedPhoto.name}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  💾 Download
                </a>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this photo?')) {
                      handleDeletePhoto(selectedPhoto.id);
                      setShowPhotoViewer(false);
                      setSelectedPhoto(null);
                    }
                  }}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  🗑️ Delete
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
              padding: '0',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}>
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #065f46, #047857)',
                color: 'white',
                padding: '2rem',
                borderRadius: '1rem 1rem 0 0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '800' }}>
                      {selectedProject.name}
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1rem', color: '#a7f3d0', fontWeight: '600' }}>
                        📋 {selectedProject.id}
                      </span>
                      <span style={{
                        backgroundColor: getPriorityColor(selectedProject.priority).backgroundColor,
                        color: getPriorityColor(selectedProject.priority).color,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        {selectedProject.priority} Priority
                      </span>
                      <span style={{
                        backgroundColor: getStatusColor(selectedProject.status).backgroundColor,
                        color: getStatusColor(selectedProject.status).color,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        {selectedProject.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div style={{ padding: '2rem' }}>
                {/* Project Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
                      📍 Project Details
                    </h3>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#1f2937' }}>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}><strong style={{ color: '#111827' }}>Type:</strong> {selectedProject.type}</p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}><strong style={{ color: '#111827' }}>Area:</strong> {selectedProject.area}</p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}><strong style={{ color: '#111827' }}>Requestor:</strong> {selectedProject.requestor}</p>
                      <p style={{ margin: '0', color: '#1f2937' }}><strong style={{ color: '#111827' }}>Assigned To:</strong> {selectedProject.assignedTo}</p>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f0f9ff',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #bae6fd'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
                      💰 Budget Information
                    </h3>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#1f2937' }}>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                        <strong style={{ color: '#111827' }}>Estimated:</strong> <span style={{ color: '#059669', fontWeight: '600' }}>${selectedProject.estCost.toLocaleString()}</span>
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                        <strong style={{ color: '#111827' }}>Actual:</strong> <span style={{ 
                          color: selectedProject.actualCost > selectedProject.estCost ? '#dc2626' : '#059669',
                          fontWeight: '600'
                        }}>
                          ${selectedProject.actualCost.toLocaleString()}
                        </span>
                      </p>
                      <p style={{ margin: '0', color: '#1f2937' }}>
                        <strong style={{ color: '#111827' }}>Variance:</strong> <span style={{ 
                          color: (selectedProject.actualCost - selectedProject.estCost) > 0 ? '#dc2626' : '#059669',
                          fontWeight: '600'
                        }}>
                          {selectedProject.actualCost - selectedProject.estCost > 0 ? '+' : ''}
                          ${(selectedProject.actualCost - selectedProject.estCost).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #bbf7d0'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: '700' }}>
                      📅 Timeline
                    </h3>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#1f2937' }}>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                        <strong style={{ color: '#111827' }}>Created:</strong> {new Date(selectedProject.createdDate).toLocaleDateString()}
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                        <strong style={{ color: '#111827' }}>Due Date:</strong> {selectedProject.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : 'Not set'}
                      </p>
                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#111827', fontWeight: '600' }}>Progress:</span>
                          <span style={{ fontWeight: '700', color: '#059669' }}>{selectedProject.progress}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${selectedProject.progress}%`,
                            height: '100%',
                            backgroundColor: '#10b981',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div style={{
                  backgroundColor: '#fffbeb',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #fed7aa',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.1rem', fontWeight: '700' }}>
                    📝 Project Notes
                  </h3>
                  
                  {/* Add Note */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note about this project..."
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.9rem'
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddNote();
                          }
                        }}
                      />
                      <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        style={{
                          backgroundColor: newNote.trim() ? '#10b981' : '#9ca3af',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: newNote.trim() ? 'pointer' : 'not-allowed',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        ➕ Add Note
                      </button>
                    </div>
                  </div>

                  {/* Notes List */}
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notes.length > 0 ? (
                      notes.map(note => (
                        <div key={note.id} style={{
                          backgroundColor: 'white',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          marginBottom: '0.75rem',
                          border: '1px solid #e5e7eb'
                        }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: '#374151', lineHeight: '1.5' }}>
                            {note.text}
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            fontSize: '0.75rem', 
                            color: '#6b7280' 
                          }}>
                            <span>👤 {note.author}</span>
                            <span>🕒 {new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        padding: '2rem 0'
                      }}>
                        No notes yet. Add the first note above! 📝
                      </div>
                    )}
                  </div>
                </div>

                {/* Photos Section */}
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #cbd5e1',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.1rem', fontWeight: '700' }}>
                    📸 Project Photos ({selectedProject.photos ? selectedProject.photos.length : 0})
                  </h3>
                  
                  {/* Upload Section */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '0.75rem',
                      padding: '2rem',
                      textAlign: 'center',
                      backgroundColor: 'white',
                      position: 'relative'
                    }}>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{ pointerEvents: 'none' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📷</div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>
                          Upload Photos
                        </h4>
                        <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>
                          Click here or drag and drop images<br/>
                          <span style={{ fontSize: '0.8rem' }}>Support: JPG, PNG, GIF (Max 5MB each)</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Photos Grid */}
                  {selectedProject.photos && selectedProject.photos.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: '1rem',
                      maxHeight: '400px',
                      overflowY: 'auto'
                    }}>
                      {selectedProject.photos.map(photo => (
                        <div key={photo.id} style={{
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{
                            position: 'relative',
                            paddingBottom: '75%', // 4:3 aspect ratio
                            overflow: 'hidden'
                          }}>
                            <img
                              src={photo.data}
                              alt={photo.name}
                              onClick={() => {
                                setSelectedPhoto(photo);
                                setShowPhotoViewer(true);
                              }}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this photo?')) {
                                  handleDeletePhoto(photo.id);
                                }
                              }}
                              style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                backgroundColor: 'rgba(220, 38, 38, 0.9)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title="Delete photo"
                            >
                              ✕
                            </button>
                          </div>
                          <div style={{ padding: '0.75rem' }}>
                            <p style={{
                              margin: '0 0 0.25rem 0',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {photo.name}
                            </p>
                            <div style={{
                              fontSize: '0.7rem',
                              color: '#6b7280',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                              <span>{formatFileSize(photo.size)}</span>
                              <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      color: '#6b7280',
                      fontStyle: 'italic',
                      padding: '2rem 0'
                    }}>
                      No photos uploaded yet. Use the upload area above to add photos! 📸
                    </div>
                  )}
                </div>

                {/* Audit Trail Section */}
                <div style={{
                  backgroundColor: '#fefce8',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #fde047',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.1rem', fontWeight: '700' }}>
                    📊 Audit Trail ({auditTrail.length} entries)
                  </h3>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {auditTrail.length > 0 ? (
                      auditTrail
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Most recent first
                        .map(entry => {
                          const getActionIcon = (action) => {
                            switch (action) {
                              case 'CREATE': return '🆕';
                              case 'UPDATE': return '✏️';
                              case 'DELETE': return '🗑️';
                              case 'ADD_NOTE': return '📝';
                              case 'ADD_PHOTO': return '📸';
                              case 'DELETE_PHOTO': return '🖼️';
                              default: return '📋';
                            }
                          };

                          const getActionColor = (action) => {
                            switch (action) {
                              case 'CREATE': return '#059669';
                              case 'UPDATE': return '#2563eb';
                              case 'DELETE': return '#dc2626';
                              case 'ADD_NOTE': return '#7c3aed';
                              case 'ADD_PHOTO': return '#0891b2';
                              case 'DELETE_PHOTO': return '#ea580c';
                              default: return '#6b7280';
                            }
                          };

                          const getActionDescription = (entry) => {
                            switch (entry.action) {
                              case 'CREATE':
                                return 'Project created';
                              case 'UPDATE':
                                if (entry.field === 'status') {
                                  return `Status changed from "${entry.oldValue}" to "${entry.newValue}"`;
                                }
                                if (entry.field === 'progress') {
                                  return `Progress updated from ${entry.oldValue}% to ${entry.newValue}%`;
                                }
                                if (entry.field === 'priority') {
                                  return `Priority changed from "${entry.oldValue}" to "${entry.newValue}"`;
                                }
                                if (entry.field === 'assignedTo') {
                                  return `Assigned to changed from "${entry.oldValue}" to "${entry.newValue}"`;
                                }
                                if (entry.field === 'actualCost') {
                                  return `Actual cost updated from $${Number(entry.oldValue).toLocaleString()} to $${Number(entry.newValue).toLocaleString()}`;
                                }
                                return `${entry.field} updated`;
                              case 'DELETE':
                                return 'Project deleted';
                              case 'ADD_NOTE':
                                return `Note added: "${entry.newValue}"`;
                              case 'ADD_PHOTO':
                                return `Photo uploaded: "${entry.newValue}"`;
                              case 'DELETE_PHOTO':
                                return `Photo deleted: "${entry.oldValue}"`;
                              default:
                                return entry.action;
                            }
                          };

                          return (
                            <div key={entry.id} style={{
                              backgroundColor: 'white',
                              padding: '1rem',
                              borderRadius: '0.5rem',
                              marginBottom: '0.75rem',
                              border: '1px solid #e5e7eb',
                              borderLeft: `4px solid ${getActionColor(entry.action)}`
                            }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <span style={{ 
                                  fontSize: '1.2rem',
                                  lineHeight: '1'
                                }}>
                                  {getActionIcon(entry.action)}
                                </span>
                                <div style={{ flex: 1 }}>
                                  <p style={{ 
                                    margin: '0 0 0.25rem 0', 
                                    color: '#374151', 
                                    lineHeight: '1.4',
                                    fontWeight: '500'
                                  }}>
                                    {getActionDescription(entry)}
                                  </p>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.75rem', 
                                    color: '#6b7280' 
                                  }}>
                                    <span>👤 {entry.userId}</span>
                                    <span>🕒 {new Date(entry.timestamp).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        fontStyle: 'italic',
                        padding: '2rem 0'
                      }}>
                        No audit trail entries yet. Changes will appear here! 📊
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleEditProject(selectedProject)}
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
                    ✏️ Edit Project
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    ❌ Close
                  </button>
                </div>
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
                      <option value="Plumbing Contractor">🌱 Plumbing Contractor</option>
                      <option value="Electrical Contractor">🌱 Electrical Contractor</option>

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
// Wrap the main component with error boundary
export default function App() {
  return (
    <ErrorBoundary>
      <MaintenanceTrackerWithSQLite />
    </ErrorBoundary>
  );
}  