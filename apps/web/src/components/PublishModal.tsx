import { useState, useEffect } from 'react';
import { Globe, ExternalLink, Settings } from 'lucide-react';
import { publishService, PublishSettings } from '../services/publishService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Button, Input, Textarea, Alert } from './ui';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export default function PublishModal({ isOpen, onClose, project }: PublishModalProps) {
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
    await publishMutation.mutateAsync();
  };

  const handleUnpublish = async () => {
    if (confirm('Are you sure you want to unpublish this documentation?')) {
      await unpublishMutation.mutateAsync();
    }
  };

  const isPublished = project?.publishSettings?.isPublished;
  const publicUrl = `${window.location.origin}/sites/${project?.slug}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPublished ? 'Manage Published Site' : 'Publish Documentation'}
      description={isPublished ? 'Your docs are live!' : 'Share your documentation with the world'}
      icon={Globe}
      iconColor="emerald"
      footer={
        <div className="flex items-center justify-between w-full">
          {isPublished ? (
            <>
              <Button
                variant="danger"
                onClick={handleUnpublish}
                isLoading={unpublishMutation.isPending}
              >
                Unpublish
              </Button>
              <Button
                variant="secondary"
                onClick={handlePublish}
                isLoading={publishMutation.isPending}
              >
                Update Settings
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePublish}
                isLoading={publishMutation.isPending}
                icon={Globe}
              >
                Publish Now
              </Button>
            </>
          )}
        </div>
      }
    >
      <div>
        {/* Published Status */}
        {isPublished && (
          <Alert variant="success" title="Documentation is live!" className="mb-6">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 break-all"
            >
              {publicUrl}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
            {project.publishSettings.publishedAt && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Published on {new Date(project.publishSettings.publishedAt).toLocaleDateString()}
              </p>
            )}
          </Alert>
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
              <Input
                label="SEO Title"
                type="text"
                value={settings.seoTitle || ''}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                placeholder={project.name}
              />

              {/* SEO Description */}
              <Textarea
                label="SEO Description"
                value={settings.seoDescription || ''}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                placeholder="Describe your documentation..."
                rows={3}
              />

              {/* Google Analytics */}
              <Input
                label="Google Analytics ID (Optional)"
                type="text"
                value={settings.analytics?.googleAnalyticsId || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    analytics: { ...settings.analytics, googleAnalyticsId: e.target.value },
                  })
                }
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          )}
      </div>
    </Modal>
  );
}
