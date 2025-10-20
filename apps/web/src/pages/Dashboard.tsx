import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText, Settings, Trash2, LogOut, Moon, Sun, Bell } from 'lucide-react';
import { projectService } from '@/services/projectService';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/contexts/ThemeContext';
import toast from 'react-hot-toast';
import Loading from '@/components/ui/Loading';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, setAuth } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Fetch projects
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', user?._id],
    queryFn: () => projectService.getProjects(user!._id),
    enabled: !!user,
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowNewProjectModal(false);
      setNewProjectName('');
      setNewProjectDescription('');
      toast.success('Project created successfully!');
      navigate(`/project/${project._id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    if (user) {
      createMutation.mutate({
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        userId: user._id,
      });
    }
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleLogout = () => {
    setAuth(null, null);
    navigate('/login');
  };

  if (isLoading) return <Loading />;

  const projects = projectsData?.data || [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0B]">
      {/* Navbar - Vercel Style */}
      <nav className="h-[60px] bg-white dark:bg-[#0C0C0C] border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-full flex items-center justify-between">
          {/* Left */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <FileText className="w-5 h-5 text-emerald-500" strokeWidth={2} />
            </div>
            <span className="text-base font-semibold text-gray-900 dark:text-white">Doxify</span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-neutral-800" />
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12 space-y-8">
        {/* Header */}
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Your Projects</h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">Create and manage documentation projects</p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-lg h-10 px-4 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </header>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="border border-dashed border-gray-300 dark:border-neutral-800 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>
            <p className="text-gray-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              Get started by creating your first documentation project
            </p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-lg h-10 px-6 inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Project
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="group border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-neutral-400 font-mono mt-0.5 truncate">
                        {project.slug}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-md flex-shrink-0">
                    Active
                  </span>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-6">
                    {project.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-neutral-800">
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    Updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/project/${project._id}/settings`);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(e, project._id, project.name)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Create Project Modal - Vercel Style */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900/80 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-[400px] shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Create New Project</h2>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-6">Start building your documentation</p>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My Documentation"
                  className="w-full h-10 bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  required
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Description <span className="text-gray-400 dark:text-neutral-500 font-normal">(optional)</span>
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="A brief description..."
                  rows={3}
                  className="w-full bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProjectModal(false);
                    setNewProjectName('');
                    setNewProjectDescription('');
                  }}
                  className="h-10 px-4 text-sm font-medium text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
