'use client';

import React, { useState, useEffect } from 'react';
import { 
  ControlPanel, 
  ProjectTable, 
  NotesPanel, 
  ProjectForm, 
  ProjectDetailsModal, 
  DeleteModal 
} from './components';

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
  createdAt?: string;
  updatedAt?: string;
}

interface Note {
  id: number;
  projectId: string;
  text: string;
  author: string;
  timestamp: string;
}

// Constants
const CONSTANTS = {
  userRoles: ['Admin', 'General Manager', 'Dept Manager', 'Facility Manager', 'Supervisor', 'Staff Member']
};

// Utility functions
const exportToCSV = (projects: Project[]) => {
  const headers = ['Project ID', 'Project Name', 'Type', 'Area', 'Requestor', 'Assigned To', 'Priority', 'Status', 'Est. Cost', 'Actual Cost', 'Difference', 'Progress'];
  const csvData = projects.map(p => [
    p.id, p.name, p.type, p.area, p.requestor, p.assignedTo, p.priority, p.status, 
    p.estCost, p.actualCost, p.actualCost - p.estCost, `${p.progress}%`
  ]);
  
  const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'greensburg-maintenance-projects.csv';
  a.click();
  URL.revokeObjectURL(url);
};

// API functions
const api = {
  async getProjects(): Promise<Project[]> {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
  },

  async getProjectNotes(projectId: string): Promise<Note[]> {
    const response = await fetch(`/api/projects/${projectId}/notes`);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  async addNote(projectId: string, text: string, author: string): Promise<Note> {
    const response = await fetch(`/api/projects/${projectId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, author }),
    });
    if (!response.ok) throw new Error('Failed to add note');
    return response.json();
  },
};

// Header Component
const Header = ({ currentUser, onUserChange }: { currentUser: string; onUserChange: (user: string) => void }) => {
  return (
    <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-lg shadow-xl p-4 mb-4 border-b-4 border-green-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-white bg-green-600 rounded-full p-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2M12 12C13.1 12 14 11.1 14 10S13.1 8 12 8 10 8.9 10 10 10.9 12 12 12M19 19H5V17L8 14L11 17L14 14L17 17V19Z"/>
            </svg>
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold tracking-wide">Greensburg Country Club</h1>
            <p className="text-lg font-medium opacity-90">Maintenance Tracking System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-white text-xs text-right">
            <div className="font-medium">Build: 2025.06.11</div>
            <div className="font-medium">Version: Next.js + SQLite</div>
          </div>
          <select
            value={currentUser}
            onChange={(e) => onUserChange(e.target.value)}
            className="px-3 py-2 bg-green-100 border border-green-300 text-green-800 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none text-sm font-medium shadow-sm"
          >
            {CONSTANTS.userRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Statistics Cards Component
const StatisticsCards = ({ projects }: { projects: Project[] }) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const highPriorityProjects = projects.filter(p => p.priority === 'High').length;
  const budgetVariance = projects
    .filter(p => p.actualCost > 0)
    .reduce((sum, p) => sum + (p.actualCost - p.estCost), 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border border-gray-200">
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-700 mb-1">Total Projects</h3>
              <p className="text-2xl font-bold text-blue-800">{totalProjects}</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-700 mb-1">Active Projects</h3>
              <p className="text-2xl font-bold text-green-800">{activeProjects}</p>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17L7,12L8.41,10.59L12,14.17L15.59,10.59L17,12L12,17Z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-purple-700 mb-1">Completed Projects</h3>
              <p className="text-2xl font-bold text-purple-800">{completedProjects}</p>
            </div>
            <div className="text-purple-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-red-700 mb-1">High Priority</h3>
              <p className="text-2xl font-bold text-red-800">{highPriorityProjects}</p>
            </div>
            <div className="text-red-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2L13.09,8.26L20,9L13.09,9.74L12,16L10.91,9.74L4,9L10.91,8.26L12,2M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17Z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className={`${budgetVariance <= 0 ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500' : 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500'} p-4 rounded-lg shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-semibold mb-1 ${budgetVariance <= 0 ? 'text-green-700' : 'text-red-700'}`}>Budget Variance</h3>
              <p className={`text-2xl font-bold ${budgetVariance <= 0 ? 'text-green-800' : 'text-red-800'}`}>${budgetVariance.toLocaleString()}</p>
            </div>
            <div className={budgetVariance <= 0 ? 'text-green-500' : 'text-red-500'}>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    <span className="ml-3 text-green-600 font-medium">Loading projects...</span>
  </div>
);

// Main Application
export default function MaintenanceTracker() {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal states
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Selected items
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectNotes, setProjectNotes] = useState<Note[]>([]);

  // Load projects when component mounts
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await api.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      alert('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectNotes = async (projectId: string) => {
    try {
      const notes = await api.getProjectNotes(projectId);
      setProjectNotes(notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      alert('Failed to load project notes.');
    }
  };

  // Event handlers
  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleSaveProject = async (projectData: any) => {
    try {
      if (editingProject) {
        const updatedProject = await api.updateProject(editingProject.id, projectData);
        setProjects(prev => prev.map(p => 
          p.id === editingProject.id ? updatedProject : p
        ));
      } else {
        const newProject = await api.createProject(projectData);
        setProjects(prev => [...prev, newProject]);
      }
      setShowProjectForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await api.deleteProject(projectToDelete.id);
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
        setShowDeleteModal(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleViewDetails = async (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
    await loadProjectNotes(project.id);
  };

  const handleAddNote = async (noteData: { text: string; author: string }) => {
    if (selectedProject) {
      try {
        const newNote = await api.addNote(selectedProject.id, noteData.text, noteData.author);
        setProjectNotes(prev => [newNote, ...prev]);
      } catch (error) {
        console.error('Error adding note:', error);
        alert('Failed to add note. Please try again.');
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Close all modals
    setShowProjectForm(false);
    setShowProjectDetails(false);
    setShowDeleteModal(false);
    setEditingProject(null);
    setSelectedProject(null);
    setProjectToDelete(null);
    
    await loadProjects();
    setIsRefreshing(false);
  };

  const handleExportCSV = () => {
    exportToCSV(projects);
  };

  // Show loading spinner while initial data loads
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Header currentUser={currentUser} onUserChange={setCurrentUser} />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Render main application
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Header currentUser={currentUser} onUserChange={setCurrentUser} />
        
        <ControlPanel 
          onAddProject={handleAddProject}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onExportCSV={handleExportCSV}
        />
        
        <StatisticsCards projects={projects} />
        
        <ProjectTable 
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onViewDetails={handleViewDetails}
        />

        {/* Modals */}
        {showProjectForm && (
          <ProjectForm
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={() => {
              setShowProjectForm(false);
              setEditingProject(null);
            }}
          />
        )}

        {showProjectDetails && (
          <ProjectDetailsModal
            project={selectedProject}
            notes={projectNotes}
            onClose={() => {
              setShowProjectDetails(false);
              setSelectedProject(null);
            }}
            onEdit={handleEditProject}
            onAddNote={handleAddNote}
            currentUser={currentUser}
          />
        )}

        {showDeleteModal && (
          <DeleteModal
            project={projectToDelete}
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setProjectToDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
}