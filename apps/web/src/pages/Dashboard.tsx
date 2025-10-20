import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { projectService } from '@/services/projectService';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Loading from '@/components/ui/Loading';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

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
      setIsCreateModalOpen(false);
      setProjectName('');
      setProjectDescription('');
      toast.success('Project created successfully!');
      // Navigate to the newly created project
      navigate(`/project/${project._id}`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create project';
      toast.error(errorMessage);
      console.error('Create project error:', error);
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
      const errorMessage = error.response?.data?.message || 'Failed to delete project';
      toast.error(errorMessage);
      console.error('Delete project error:', error);
    },
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    
    if (user) {
      createMutation.mutate({
        name: projectName.trim(),
        description: projectDescription.trim(),
        userId: user._id,
      });
    }
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;

  console.log('🔷 [DASHBOARD] projectsData:', projectsData);
  const projects = projectsData?.data || [];
  console.log('🔷 [DASHBOARD] projects array:', projects);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary-600 via-emerald-500 to-teal-500 dark:from-primary-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">
              My Projects
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">Build beautiful documentation in minutes ✨</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-medium hover:shadow-glow transition-all duration-200 hover:scale-105 active:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              New Project
            </span>
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Card className="relative max-w-2xl mx-auto border-2 border-dashed border-gray-300 dark:border-slate-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
              <CardHeader className="pb-8 pt-16">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-primary-500 to-emerald-500 dark:from-primary-400 dark:to-emerald-400 rounded-2xl flex items-center justify-center shadow-glow">
                  <FileText className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
                <CardTitle className="text-3xl mb-2">No projects yet</CardTitle>
                <CardDescription className="text-lg">
                  Create your first documentation project and start building beautiful, professional docs in minutes
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pb-12">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-medium hover:shadow-glow transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  Create Your First Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {projects.map((project, index) => (
              <Card
                key={project._id}
                className="group relative cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-500/10 hover:-translate-y-2 overflow-hidden"
                onClick={() => navigate(`/project/${project._id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Color accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: `linear-gradient(to right, ${project.theme.primary}, ${project.theme.primary}DD)` }}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {project.name}
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-xs">
                        {project.slug}
                      </Badge>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl shadow-soft flex items-center justify-center flex-shrink-0 ml-3"
                      style={{ backgroundColor: project.theme.primary }}
                    >
                      <FileText className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  {project.description && (
                    <CardDescription className="line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </CardDescription>
                  )}

                  <div className="flex items-center justify-between text-xs mb-4 pb-4 border-b border-border">
                    <span className="text-muted-foreground font-medium">Updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center gap-2 pt-0">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-medium text-sm rounded-lg hover:bg-secondary/80 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project/${project._id}/settings`);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    className="p-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project._id, project.name);
                    }}
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Documentation"
            required
          />
          <Textarea
            label="Description (optional)"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="A brief description of your project..."
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
