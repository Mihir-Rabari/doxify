import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  FileText,
  Settings,
  Download,
  Trash2,
  Home,
  Check,
  Loader2,
  AlertCircle,
  GripVertical,
  Edit2,
  Moon,
  Sun,
} from 'lucide-react';
import { projectService } from '@/services/projectService';
import { pageService } from '@/services/pageService';
import { exportService } from '@/services/exportService';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useTheme } from '@/contexts/ThemeContext';
import Loading from '@/components/ui/Loading';
import WYSIWYGEditor from '@/components/Editor/WYSIWYGEditor';
import SearchBar from '@/components/SearchBar';
import toast from 'react-hot-toast';

// Types
interface Page {
  _id: string;
  title: string;
  content: string;
  section?: string;
  order?: number;
  metadata?: {
    author?: string;
    lastModified?: string;
  };
}

export default function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  // State
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSection, setNewPageSection] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        autoSave.manualSave();
        toast.success('Saved!');
      }
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: pageService.createPage,
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: ['pages', projectId] });
      setIsCreatePageModalOpen(false);
      setNewPageTitle('');
      setNewPageSection('');
      setSelectedPageId(newPage._id);
      toast.success('Page created!');
    },
  });

  // Update page mutation
  const updatePageMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pageService.updatePage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages', projectId] });
      toast.success('Updated!');
    },
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

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: exportService.buildProject,
    onSuccess: () => {
      toast.success('Export started!');
      window.open(exportService.getDownloadUrl(projectId!), '_blank');
    },
  });

  // Autosave
  const autoSave = useAutoSave({
    onSave: async (content) => {
      if (!selectedPageId) return;
      await pageService.updatePage(selectedPageId, { content });
      queryClient.invalidateQueries({ queryKey: ['pages', projectId] });
      queryClient.invalidateQueries({ queryKey: ['page', selectedPageId] });
    },
    delay: 2000,
    enabled: !!selectedPageId,
  });

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectId) {
      createPageMutation.mutate({
        projectId,
        title: newPageTitle,
        content: `# ${newPageTitle}\n\nStart writing...`,
      });
    }
  };

  const handleRenamePageSave = () => {
    if (editingPageId && editingTitle.trim()) {
      updatePageMutation.mutate({
        id: editingPageId,
        data: { title: editingTitle },
      });
      setEditingPageId(null);
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


  // Render save status
  const renderSaveStatus = () => {
    switch (autoSave.status) {
      case 'saving':
        return (
          <div className="flex items-center text-sm text-gray-600 dark:text-neutral-400">
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            Saving...
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
            <Check className="w-4 h-4 mr-1.5" />
            Saved
          </div>
        );
      case 'unsaved':
        return (
          <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
            <AlertCircle className="w-4 h-4 mr-1.5" />
            Unsaved
          </div>
        );
      default:
        return null;
    }
  };

  // Group pages by section
  const pages = pagesData?.data || [];
  const sections: { [key: string]: Page[] } = {};
  pages.forEach((page: Page) => {
    const section = page.section || 'General';
    if (!sections[section]) sections[section] = [];
    sections[section].push(page);
  });

  if (pagesLoading) return <Loading />;

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#0B0B0B]">
      {/* Top Navbar */}
      <nav className="h-[60px] bg-white dark:bg-[#0C0C0C] border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-gray-200 dark:bg-neutral-800" />
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">{project?.name}</h1>
        </div>

        <div className="flex items-center gap-3">
          {renderSaveStatus()}
          <div className="h-6 w-px bg-gray-200 dark:bg-neutral-800" />
          

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="h-9 px-4 border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Settings */}
          <Link to={`/project/${projectId}/settings`}>
            <button className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Pages */}
        {sidebarOpen && (
          <div className="w-64 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0C0C0C] flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-neutral-800 space-y-3">
              <button
                onClick={() => setIsCreatePageModalOpen(true)}
                className="w-full h-9 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Page
              </button>
              
              {/* Search Bar */}
              <SearchBar
                pages={pages}
                onSelectPage={(pageId: string) => setSelectedPageId(pageId)}
              />
            </div>

            {/* Pages List - Organized by Sections */}
            <div className="flex-1 overflow-y-auto p-2">
              {Object.keys(sections).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-neutral-500 text-center py-8">No pages yet</p>
              ) : (
                Object.entries(sections).map(([sectionName, sectionPages]) => (
                  <div key={sectionName} className="mb-4">
                    {/* Section Header */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider flex items-center justify-between group">
                      <span>{sectionName}</span>
                      <button
                        onClick={() => {
                          setNewPageSection(sectionName);
                          setIsCreatePageModalOpen(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-emerald-500 transition-all"
                        title="Add page to section"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Section Pages with Visual Hierarchy */}
                    <div className="space-y-0.5">
                      {sectionPages.map((page) => (
                        <div key={page._id} className="relative group">
                          {/* Vertical line for subsections */}
                          <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200 dark:bg-neutral-800" />
                          
                          <div
                            onClick={() => setSelectedPageId(page._id)}
                            className={`relative flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              selectedPageId === page._id
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-grab" />
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            
                            {editingPageId === page._id ? (
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onBlur={handleRenamePageSave}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleRenamePageSave();
                                  if (e.key === 'Escape') setEditingPageId(null);
                                }}
                                className="flex-1 text-sm bg-transparent border-none outline-none"
                                autoFocus
                              />
                            ) : (
                              <span className="flex-1 text-sm font-medium truncate">{page.title}</span>
                            )}

                            {/* Actions */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingPageId(page._id);
                                  setEditingTitle(page.title);
                                }}
                                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePage(page._id, page.title);
                                }}
                                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="p-3 border-t border-gray-200 dark:border-neutral-800 text-xs text-gray-500 dark:text-neutral-500 space-y-1">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">⌘K</kbd>
                <span>Search</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">⌘S</kbd>
                <span>Save</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">/</kbd>
                <span>Block menu</span>
              </div>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {selectedPage ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Page Header */}
              <div className="flex-shrink-0 px-6 pt-6 pb-3 border-b border-gray-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPage.title}</h2>
                <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1.5">
                  Type <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded text-xs">/</kbd> for commands • 
                  Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded text-xs">⌘S</kbd> to save
                </p>
              </div>

              {/* WYSIWYG Editor */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#0B0B0B]">
                <WYSIWYGEditor
                  content={autoSave.content}
                  onChange={(content) => autoSave.setContent(content)}
                  placeholder="Start writing..."
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-neutral-500">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-base mb-2">Select a page to start editing</p>
                <p className="text-sm text-gray-400 dark:text-neutral-600">
                  Choose a page from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Create Page Modal */}
      {isCreatePageModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900/80 backdrop-blur-xl border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-[400px]">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Create New Page</h2>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-6">Add a new page to your documentation</p>
            
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Getting Started"
                  className="w-full h-10 bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Section <span className="text-gray-400 dark:text-neutral-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={newPageSection}
                  onChange={(e) => setNewPageSection(e.target.value)}
                  placeholder="General"
                  className="w-full h-10 bg-white dark:bg-[#0B0B0B] border border-gray-300 dark:border-neutral-800 rounded-lg px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatePageModalOpen(false);
                    setNewPageTitle('');
                    setNewPageSection('');
                  }}
                  className="h-10 px-4 text-sm font-medium text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPageMutation.isPending}
                  className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {createPageMutation.isPending ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
