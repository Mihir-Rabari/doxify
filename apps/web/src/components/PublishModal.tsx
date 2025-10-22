import { useState, useEffect } from 'react';
import { X, Globe, Check, ExternalLink, Settings } from 'lucide-react';
import { publishService, PublishSettings } from '../services/publishService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export default function PublishModal({ isOpen, onClose, project }: PublishModalProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Partial<PublishSettings>>({
    seoTitle: project?.name || '',
    seoDescription: project?.description || '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (project?.publishSettings) {
      setSettings({
        seoTitle: project.publishSettings.seoTitle || project.name,
        seoDescription: project.publishSettings.seoDescription || project.description,
        customDomain: project.publishSettings.customDomain || '',
        analytics: project.publishSettings.analytics || {},
      });
    }
  }, [project]);

  const publishMutation = useMutation({
    mutationFn: () => publishService.publishProject(project._id, settings),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project', project._id] });
      onClose();
      // Open published site in new tab
      window.open(data.project.publicUrl, '_blank');
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: () => publishService.unpublishProject(project._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project._id] });
      onClose();
    },
  });

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishMutation.mutateAsync();
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (confirm('Are you sure you want to unpublish this documentation?')) {
      await unpublishMutation.mutateAsync();
    }
  };

  if (!isOpen) return null;

  const isPublished = project?.publishSettings?.isPublished;
  const publicUrl = `${window.location.origin}/sites/${project?.slug}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isPublished ? 'Manage Published Site' : 'Publish Documentation'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {isPublished ? 'Your docs are live!' : 'Share your documentation with the world'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Published Status */}
          {isPublished && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                    Documentation is live!
                  </p>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 break-all"
                  >
                    {publicUrl}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                  {project.publishSettings.publishedAt && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      Published on {new Date(project.publishSettings.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Public URL Preview */}
          {!isPublished && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Public URL
              </label>
              <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
                <p className="text-sm text-gray-600 dark:text-neutral-400 break-all">
                  {publicUrl}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-500 mt-2">
                Your documentation will be accessible at this URL
              </p>
            </div>
          )}

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-xl transition-colors mb-4"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-600 dark:text-neutral-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {showSettings ? 'Hide' : 'Show'} Advanced Settings
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-neutral-500">
              SEO, Analytics
            </span>
          </button>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
              {/* SEO Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={settings.seoTitle || ''}
                  onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                  placeholder={project.name}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
                />
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  SEO Description
                </label>
                <textarea
                  value={settings.seoDescription || ''}
                  onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                  placeholder="Describe your documentation..."
                  rows={3}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 resize-none"
                />
              </div>

              {/* Google Analytics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Google Analytics ID (Optional)
                </label>
                <input
                  type="text"
                  value={settings.analytics?.googleAnalyticsId || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      analytics: { ...settings.analytics, googleAnalyticsId: e.target.value },
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50">
          {isPublished ? (
            <>
              <button
                onClick={handleUnpublish}
                disabled={unpublishMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {unpublishMutation.isPending ? 'Unpublishing...' : 'Unpublish'}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  Close
                </button>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Site
                </a>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || publishMutation.isPending}
                className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {isPublishing || publishMutation.isPending ? 'Publishing...' : 'Publish Now'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
