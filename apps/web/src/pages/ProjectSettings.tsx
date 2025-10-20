import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Palette, Save } from 'lucide-react';
import { projectService } from '@/services/projectService';
import { themeService } from '@/services/themeService';
import { Theme, UpdateProjectData } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

export default function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3ECF8E');
  const [darkMode, setDarkMode] = useState(false);
  const [font, setFont] = useState('Inter');
  const [codeTheme, setCodeTheme] = useState('dracula');

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

  // Load project data
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectDescription(project.description || '');
    }
  }, [project]);

  // Load theme data
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
      toast.success('Project updated!');
    },
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: (data: Partial<Theme>) => themeService.updateTheme(projectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme', projectId] });
      toast.success('Theme updated!');
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: () => projectService.deleteProject(projectId!),
    onSuccess: () => {
      toast.success('Project deleted!');
      navigate('/dashboard');
    },
  });

  const handleSaveProject = () => {
    updateProjectMutation.mutate({
      name: projectName,
      description: projectDescription,
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
    if (confirm(`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`)) {
      deleteProjectMutation.mutate();
    }
  };

  if (projectLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to={`/project/${projectId}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Link>
          <h1 className="text-2xl font-bold text-dark-900 mt-2">Project Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">General</h2>
          <div className="space-y-4">
            <Input
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Textarea
              label="Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveProject} isLoading={updateProjectMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 mr-2 text-primary" />
            <h2 className="text-lg font-semibold text-dark-900">Theme</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-900 mb-2">Primary Color</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-900 mb-2">Font Family</label>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-900 mb-2">Code Theme</label>
              <select
                value={codeTheme}
                onChange={(e) => setCodeTheme(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="dracula">Dracula</option>
                <option value="github">GitHub</option>
                <option value="monokai">Monokai</option>
                <option value="nord">Nord</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="darkMode" className="ml-2 text-sm font-medium text-dark-900">
                Enable Dark Mode
              </label>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveTheme} isLoading={updateThemeMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Theme
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete a project, there is no going back. Please be certain.
          </p>
          <Button
            variant="danger"
            onClick={handleDeleteProject}
            isLoading={deleteProjectMutation.isPending}
          >
            Delete Project
          </Button>
        </div>
      </div>
    </div>
  );
}
