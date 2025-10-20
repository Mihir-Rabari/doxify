import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  FileText,
  Settings,
  Download,
  Trash2,
  Eye,
  Code,
  Home,
  Menu,
  X,
  Check,
  Loader2,
  AlertCircle,
  List,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { projectService } from '@/services/projectService';
import { pageService } from '@/services/pageService';
import { exportService } from '@/services/exportService';
import { useAutoSave } from '@/hooks/useAutoSave';
import SearchBar from '@/components/SearchBar';
import { TocSidebar } from '@/components/TableOfContents';
import ThemeToggle from '@/components/ThemeToggle';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tocOpen, setTocOpen] = useState(true);
  const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');

  // Fetch project
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(projectId!),
    enabled: !!projectId,
  });

  // Fetch pages
  const { data: pagesData, isLoading: pagesLoading } = useQuery({
    queryKey: ['pages', projectId],
    queryFn: () => pageService.getPages(projectId!),
    enabled: !!projectId,
  });

  // Fetch selected page
  const { data: selectedPage } = useQuery({
    queryKey: ['page', selectedPageId],
    queryFn: () => pageService.getPage(selectedPageId!),
    enabled: !!selectedPageId,
  });

  // Update editor when page is selected
  useEffect(() => {
    if (selectedPage) {
      autoSave.reset(selectedPage.content);
    }
  }, [selectedPage]);

  // Auto-select first page
  useEffect(() => {
    if (pagesData?.data && pagesData.data.length > 0 && !selectedPageId) {
      setSelectedPageId(pagesData.data[0]._id);
    }
  }, [pagesData, selectedPageId]);

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: pageService.createPage,
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: ['pages', projectId] });
      setIsCreatePageModalOpen(false);
      setNewPageTitle('');
      setSelectedPageId(newPage._id);
      toast.success('Page created successfully!');
    },
  });

  // Autosave with status
  const autoSave = useAutoSave({
    onSave: async (content) => {
      if (!selectedPageId) return;
      await pageService.updatePage(selectedPageId, { content });
      queryClient.invalidateQueries({ queryKey: ['pages', projectId] });
      queryClient.invalidateQueries({ queryKey: ['page', selectedPageId] });
    },
    delay: 2000, // Save 2 seconds after user stops typing
    enabled: !!selectedPageId,
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: pageService.deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages', projectId] });
      setSelectedPageId(null);
      toast.success('Page deleted!');
    },
  });

  // Export project mutation
  const exportMutation = useMutation({
    mutationFn: exportService.buildProject,
    onSuccess: () => {
      toast.success('Export started!');
      window.open(exportService.getDownloadUrl(projectId!), '_blank');
    },
  });

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectId) {
      createPageMutation.mutate({
        projectId,
        title: newPageTitle,
        content: '# ' + newPageTitle + '\n\nStart writing your documentation...',
      });
    }
  };

  const handleSavePage = () => {
    autoSave.manualSave();
  };

  // Render save status indicator
  const renderSaveStatus = () => {
    switch (autoSave.status) {
      case 'saving':
        return (
          <div className="flex items-center text-sm text-blue-600">
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            Saving...
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center text-sm text-green-600">
            <Check className="w-4 h-4 mr-1" />
            Saved
          </div>
        );
      case 'unsaved':
        return (
          <div className="flex items-center text-sm text-orange-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            Unsaved
          </div>
        );
      default:
        return null;
    }
  };

  const handleDeletePage = (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      deletePageMutation.mutate(id);
    }
  };

  const handleExport = () => {
    if (projectId) {
      exportMutation.mutate(projectId);
    }
  };

  if (pagesLoading) return <Loading />;

  const pages = pagesData?.data || [];

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Back to Dashboard">
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{project?.name}</h1>
          <SearchBar pages={pages} onSelectPage={setSelectedPageId} />
        </div>

        <div className="flex items-center space-x-3">
          {renderSaveStatus()}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
          <ThemeToggle />
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setTocOpen(!tocOpen)}
            title="Toggle Table of Contents"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowPreview(!showPreview)} title={showPreview ? 'Code only' : 'Show preview'}>
            {showPreview ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport} isLoading={exportMutation.isPending}>
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          <Link to={`/project/${projectId}/settings`}>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'w-72' : 'w-0'
          } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden flex-shrink-0`}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <Button size="md" className="w-full shadow-sm" onClick={() => setIsCreatePageModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Page
              </Button>
            </div>

            {/* Pages List */}
            <div className="flex-1 overflow-y-auto p-2">
              {pages.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No pages yet</p>
              ) : (
                pages.map((page) => (
                  <div
                    key={page._id}
                    className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                      selectedPageId === page._id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => setSelectedPageId(page._id)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm truncate">{page.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page._id, page.title);
                      }}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-72 top-24 -ml-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md z-10 transition-all"
          style={{ left: sidebarOpen ? '18rem' : '0' }}
        >
          {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Editor Area */}
        {selectedPageId ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col`}>
              <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Editor
                </h2>
              </div>
              <textarea
                value={autoSave.content}
                onChange={(e) => autoSave.setContent(e.target.value)}
                className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 leading-relaxed"
                placeholder="# Start writing your docs...\n\nMarkdown is fully supported!\n\n- Use **bold** and *italic*\n- Create lists\n- Add code blocks\n- And more!"
                spellCheck={false}
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="w-1/2 bg-white dark:bg-gray-900 overflow-y-auto flex flex-col">
                <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                  <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </h2>
                </div>
                <div className="flex-1 p-8">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{autoSave.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Table of Contents */}
            <TocSidebar content={autoSave.content} isOpen={tocOpen} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center max-w-md">
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 mb-6">
                <FileText className="w-20 h-20 text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No page selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a page from the sidebar or create a new one to start editing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      <Modal
        isOpen={isCreatePageModalOpen}
        onClose={() => setIsCreatePageModalOpen(false)}
        title="Create New Page"
      >
        <form onSubmit={handleCreatePage} className="space-y-4">
          <Input
            label="Page Title"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            placeholder="Getting Started"
            required
          />
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setIsCreatePageModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createPageMutation.isPending}>
              Create Page
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
