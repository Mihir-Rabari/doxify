import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Palette, Save, Trash2, AlertTriangle } from 'lucide-react';
import { projectService } from '@/services/projectService';
import { themeService } from '@/services/themeService';
import { Theme, UpdateProjectData } from '@/types';
import { Button, Input, Textarea, Modal } from '@/components/ui';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

export default function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#00E093');
  const [darkMode, setDarkMode] = useState(false);
  const [font, setFont] = useState('Inter');
  const [codeTheme, setCodeTheme] = useState('dracula');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch project
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(projectId!),
    enabled: !!projectId,
  });

  // Fetch theme
  const { data: theme } = useQuery({
    queryKey: ['theme', projectId],
    queryFn: () => themeService.getTheme(projectId!),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectDescription(project.description || '');
    }
  }, [project]);

  useEffect(() => {
    if (theme) {
      setPrimaryColor(theme.primary);
      setDarkMode(theme.darkMode);
      setFont(theme.font);
      setCodeTheme(theme.codeTheme);
    }
  }, [theme]);

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: (data: UpdateProjectData) => projectService.updateProject(projectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      toast.success('Project updated');
    },
    onError: () => {
      toast.error('Failed to update project');
    },
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: (data: Partial<Theme>) => themeService.updateTheme(projectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme', projectId] });
      toast.success('Theme updated');
    },
    onError: () => {
      toast.error('Failed to update theme');
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: () => projectService.deleteProject(projectId!),
    onSuccess: () => {
      toast.success('Project deleted');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      toast.error('Project name is required');
      return;
    }
    updateProjectMutation.mutate({
      name: projectName.trim(),
      description: projectDescription.trim(),
    });
  };

  const handleSaveTheme = () => {
    updateThemeMutation.mutate({
      primary: primaryColor,
      darkMode,
      font,
      codeTheme,
    });
  };

  const handleDeleteProject = () => {
    deleteProjectMutation.mutate();
    setShowDeleteModal(false);
  };

  if (projectLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0B]">
      {/* Header */}
      <div className="h-[60px] bg-white dark:bg-[#0C0C0C] border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 md:px-8 h-full flex items-center justify-between">
          <Link
            to={`/project/${projectId}`}
            className="inline-flex items-center text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Link>
          <button
            onClick={handleSaveProject}
            disabled={updateProjectMutation.isPending}
            className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {updateProjectMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 md:px-8 py-12 space-y-8">
        {/* Page Header */}
        <header>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Project Settings</h1>
          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">Manage your project configuration and theme</p>
        </header>

        {/* General Settings */}
        <section className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
          
          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-10 bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                placeholder="My Documentation Project"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
                className="w-full bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-none"
                placeholder="A brief description..."
              />
            </div>
          </div>
        </section>

        {/* Theme Settings */}
        <section className="border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Theme Customization</h2>
          </div>

          <div className="space-y-4">
            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 dark:border-neutral-800 cursor-pointer bg-white dark:bg-[#0B0B0B]"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 h-10 bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  placeholder="#00E093"
                />
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Font Family
              </label>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full h-10 bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
              >
                <option value="Inter">Inter</option>
                <option value="Geist">Geist Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>

            {/* Code Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Code Block Theme
              </label>
              <select
                value={codeTheme}
                onChange={(e) => setCodeTheme(e.target.value)}
                className="w-full h-10 bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
              >
                <option value="dracula">Dracula</option>
                <option value="github">GitHub</option>
                <option value="monokai">Monokai</option>
                <option value="nord">Nord</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-neutral-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mt-0.5">Enable dark theme for documentation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Save Theme Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveTheme}
                disabled={updateThemeMutation.isPending}
                className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateThemeMutation.isPending ? 'Saving...' : 'Save Theme'}
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border-2 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
              <p className="text-sm text-gray-700 dark:text-neutral-300 mt-1">
                Once you delete a project, there is no going back. Please be certain.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Project
          </button>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900/80 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-[400px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delete Project</h2>
                <p className="text-sm text-gray-600 dark:text-neutral-400">This cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-neutral-300 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold">"{project?.name}"</span>? 
              All content will be permanently removed.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="h-10 px-4 text-sm font-medium text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={deleteProjectMutation.isPending}
                className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
