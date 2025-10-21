import { useEffect, useRef, useState } from 'react';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'idle';

interface UseAutoSaveOptions {
  onSave: (content: string) => Promise<void>;
  delay?: number; // milliseconds
  enabled?: boolean;
}

export function useAutoSave({ onSave, delay = 5000, enabled = true }: UseAutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [content, setContent] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousContentRef = useRef('');
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If content hasn't changed, don't save
    if (content === previousContentRef.current) {
      return;
    }

    // If content is empty or unchanged from initial, don't mark as unsaved
    if (content && previousContentRef.current !== '') {
      setStatus('unsaved');
    }

    // Set new timeout for autosave
    timeoutRef.current = setTimeout(async () => {
      if (content && content !== previousContentRef.current && !isSavingRef.current) {
        isSavingRef.current = true;
        setStatus('saving');
        
        try {
          await onSave(content);
          previousContentRef.current = content;
          setStatus('saved');
          
          // Reset to idle after 3 seconds
          setTimeout(() => {
            setStatus('idle');
          }, 3000);
        } catch (error) {
          console.error('Autosave failed:', error);
          setStatus('unsaved');
        } finally {
          isSavingRef.current = false;
        }
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, onSave, delay, enabled]);

  const manualSave = async () => {
    if (isSavingRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (content && content !== previousContentRef.current) {
      isSavingRef.current = true;
      setStatus('saving');
      
      try {
        await onSave(content);
        previousContentRef.current = content;
        setStatus('saved');
        
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      } catch (error) {
        console.error('Manual save failed:', error);
        setStatus('unsaved');
      } finally {
        isSavingRef.current = false;
      }
    }
  };

  const reset = (newContent: string) => {
    setContent(newContent);
    previousContentRef.current = newContent;
    setStatus('idle');
  };

  return {
    status,
    content,
    setContent,
    manualSave,
    reset,
    hasUnsavedChanges: status === 'unsaved' || status === 'saving',
  };
}
