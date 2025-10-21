import { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface SectionHeaderProps {
  name: string;
  onAddPage: () => void;
  onRename?: (newName: string) => void;
  onDelete?: () => void;
  isDefault?: boolean;
}

export default function SectionHeader({
  name,
  onAddPage,
  onRename,
  onDelete,
  isDefault = false,
}: SectionHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [showMenu, setShowMenu] = useState(false);

  const handleSaveRename = () => {
    if (editName.trim() && editName !== name && onRename) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && confirm(`Delete section "${name}"? All pages will be moved to General.`)) {
      onDelete();
    }
    setShowMenu(false);
  };

  return (
    <div className="px-2 py-1.5 flex items-center justify-between group relative">
      {isEditing ? (
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSaveRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveRename();
            if (e.key === 'Escape') {
              setEditName(name);
              setIsEditing(false);
            }
          }}
          className="flex-1 text-xs font-semibold uppercase tracking-wider bg-transparent border-none outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1 text-gray-600 dark:text-neutral-400"
          autoFocus
        />
      ) : (
        <span className="text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wider">
          {name}
        </span>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onAddPage}
          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-emerald-500 transition-colors"
          title="Add page to section"
        >
          <Plus className="w-4 h-4" />
        </button>

        {!isDefault && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Section options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-6 z-20 w-40 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
