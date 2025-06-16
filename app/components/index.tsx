// app/components/index.tsx
import React from 'react';

// Types (copy these first)
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

// REAL ControlPanel Component
export const ControlPanel = ({ 
  onAddProject, 
  onRefresh, 
  isRefreshing, 
  onExportCSV 
}: {
  onAddProject: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportCSV: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
            📊 Project Overview
          </button>
          <button
            onClick={onAddProject}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            ➕ Add Project
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onExportCSV}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            📥 Export to CSV
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`px-4 py-2 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md ${
              isRefreshing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isRefreshing ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};

// REAL ProjectTable Component
export const ProjectTable = ({ 
  projects, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewDetails: (project: Project) => void;
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'In Progress': return 'text-blue-600 bg-blue-50';
      case 'Not Started': return 'text-gray-600 bg-gray-50';
      case 'Awaiting Approval': return 'text-orange-600 bg-orange-50';
      case 'On-Hold': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-green-800 to-green-900 text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Project ID</th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Project Name</th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Priority</th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Est. Cost</th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Progress</th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors border-b border-gray-100`}>
              <td className="px-3 py-3 font-medium text-xs">{project.id}</td>
              <td className="px-3 py-3 text-xs font-medium">{project.name}</td>
              <td className="px-3 py-3 text-xs">{project.type}</td>
              <td className="px-3 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </td>
              <td className="px-3 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </td>
              <td className="px-3 py-3 text-xs font-medium">${project.estCost.toLocaleString()}</td>
              <td className="px-3 py-3">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 font-medium">{project.progress}%</span>
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onViewDetails(project)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200 text-xs font-medium"
                  >
                    📋 View
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-200 text-xs font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(project)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-200 text-xs font-medium"
                  >
                    🗑️ Del
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Placeholder components for now
export const NotesPanel = () => <div>Notes Panel</div>;
export const ProjectForm = () => <div>Project Form</div>;
export const ProjectDetailsModal = () => <div>Project Details Modal</div>;
export const DeleteModal = () => <div>Delete Modal</div>;