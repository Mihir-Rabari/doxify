# Doxify UI Component Library

Standardized, reusable UI components based on our design system.

## 🎨 Design System

All components follow the Vercel-inspired dark theme design with:
- **Colors**: Emerald primary, Neutral grays
- **Rounded**: Generous border-radius (lg, xl, 2xl)
- **Shadows**: Subtle shadows with proper dark mode support
- **Transitions**: Smooth 200ms transitions
- **States**: Hover, focus, disabled, loading states

---

## 📦 Components

### Modal
Flexible modal dialog with header, content, and footer.

```tsx
import { Modal } from '@/components/ui';
import { Globe } from 'lucide-react';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Publish Documentation"
  description="Share your docs with the world"
  icon={Globe}
  iconColor="emerald"
  maxWidth="2xl"
  footer={
    <div className="flex justify-between w-full">
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      <Button variant="primary" onClick={onConfirm}>Confirm</Button>
    </div>
  }
>
  <p>Modal content goes here</p>
</Modal>
```

**Props:**
- `isOpen` - Boolean to control visibility
- `onClose` - Function to close modal
- `title` - Modal title
- `description` - Optional subtitle
- `icon` - Optional Lucide icon component
- `iconColor` - Icon background color (emerald, blue, red, yellow, purple)
- `maxWidth` - Modal width (sm, md, lg, xl, 2xl)
- `footer` - Optional footer content
- `children` - Modal body content

---

### Button
Versatile button component with variants, sizes, icons, and loading states.

```tsx
import { Button } from '@/components/ui';
import { Save } from 'lucide-react';

<Button
  variant="primary"
  size="md"
  icon={Save}
  iconPosition="left"
  isLoading={isSaving}
  onClick={handleSave}
>
  Save Changes
</Button>
```

**Variants:**
- `primary` - Emerald background (main actions)
- `secondary` - Gray background (secondary actions)
- `danger` - Red background (destructive actions)
- `ghost` - Transparent (subtle actions)
- `outline` - Border only (alternative actions)

**Sizes:**
- `sm` - Small (px-3 py-1.5 text-sm)
- `md` - Medium (px-4 py-2 text-sm)
- `lg` - Large (px-6 py-3 text-base)

**Props:**
- `variant` - Button style variant
- `size` - Button size
- `icon` - Optional Lucide icon
- `iconPosition` - Icon placement (left, right)
- `isLoading` - Show loading spinner
- `disabled` - Disable button
- All standard HTML button attributes

---

### Input
Styled input field with label, icons, error states, and helper text.

```tsx
import { Input } from '@/components/ui';
import { Mail } from 'lucide-react';

<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  icon={Mail}
  iconPosition="left"
  error={errors.email}
  helperText="We'll never share your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Props:**
- `label` - Input label
- `error` - Error message (red styling)
- `helperText` - Help text below input
- `icon` - Optional Lucide icon
- `iconPosition` - Icon placement (left, right)
- All standard HTML input attributes

---

### Textarea
Styled textarea with label, error states, and helper text.

```tsx
import { Textarea } from '@/components/ui';

<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={4}
  error={errors.description}
  helperText="Max 500 characters"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

**Props:**
- `label` - Textarea label
- `error` - Error message (red styling)
- `helperText` - Help text below textarea
- All standard HTML textarea attributes

---

### Alert
Contextual alert messages with variants and icons.

```tsx
import { Alert } from '@/components/ui';

<Alert variant="success" title="Success!">
  Your changes have been saved successfully.
</Alert>

<Alert variant="error" title="Error">
  Something went wrong. Please try again.
</Alert>

<Alert variant="warning" title="Warning">
  This action cannot be undone.
</Alert>

<Alert variant="info">
  This is an informational message.
</Alert>
```

**Variants:**
- `success` - Green (success messages)
- `error` - Red (error messages)
- `warning` - Yellow (warning messages)
- `info` - Blue (informational messages)

**Props:**
- `variant` - Alert style
- `icon` - Optional custom icon
- `title` - Optional alert title
- `children` - Alert content

---

### Badge
Small status indicators and labels.

```tsx
import { Badge } from '@/components/ui';
import { Check } from 'lucide-react';

<Badge variant="success" icon={Check} size="md">
  Published
</Badge>

<Badge variant="default">
  Draft
</Badge>
```

**Variants:**
- `success` - Green
- `error` - Red
- `warning` - Yellow
- `info` - Blue
- `default` - Gray

**Sizes:**
- `sm` - Small (text-xs)
- `md` - Medium (text-sm)
- `lg` - Large (text-base)

**Props:**
- `variant` - Badge style
- `size` - Badge size
- `icon` - Optional Lucide icon
- `children` - Badge text

---

### Loading
Simple loading spinner.

```tsx
import { Loading } from '@/components/ui';

<Loading />
```

---

## 🎯 Usage Guidelines

### Import
```tsx
// Import individual components
import { Modal, Button, Input } from '@/components/ui';

// Or import specific component
import Modal from '@/components/ui/Modal';
```

### Consistency
- Use `primary` variant for main actions
- Use `danger` variant for destructive actions
- Use `ghost` variant for subtle/tertiary actions
- Always provide proper `label` for form inputs
- Use `error` prop for validation messages
- Use `helperText` for input guidance

### Accessibility
- All components support keyboard navigation
- Proper ARIA labels where applicable
- Focus states clearly visible
- Color contrast meets WCAG standards

### Dark Mode
- All components automatically support dark mode
- Uses Tailwind's `dark:` variants
- Consistent color scheme across components

---

## 🚀 Examples

### Login Form
```tsx
<form onSubmit={handleLogin}>
  <Input
    label="Email"
    type="email"
    icon={Mail}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={errors.email}
  />
  
  <Input
    label="Password"
    type="password"
    icon={Lock}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    error={errors.password}
  />
  
  <Button
    variant="primary"
    size="lg"
    type="submit"
    isLoading={isLoading}
    className="w-full"
  >
    Sign In
  </Button>
</form>
```

### Confirmation Modal
```tsx
<Modal
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  title="Delete Project"
  description="This action cannot be undone"
  icon={AlertTriangle}
  iconColor="red"
  maxWidth="md"
  footer={
    <div className="flex justify-end gap-3 w-full">
      <Button variant="ghost" onClick={() => setShowDelete(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  }
>
  <Alert variant="warning">
    Are you sure you want to delete this project? All pages and content will be permanently removed.
  </Alert>
</Modal>
```

### Status Badge
```tsx
<div className="flex items-center gap-2">
  <span>Status:</span>
  {isPublished ? (
    <Badge variant="success" icon={Check}>Published</Badge>
  ) : (
    <Badge variant="default">Draft</Badge>
  )}
</div>
```

---

## 💡 Tips

1. **Button Loading States**: Use `isLoading` prop instead of manually disabling
2. **Form Validation**: Pass error messages to `error` prop for automatic styling
3. **Icons**: Use Lucide React icons for consistency
4. **Spacing**: Components handle their own internal spacing
5. **Dark Mode**: All components work automatically in dark mode

---

## 🔄 Migration

### Old Code
```tsx
<div className="fixed inset-0 bg-black/60...">
  <div className="bg-white dark:bg-neutral-900...">
    <button className="px-4 py-2 bg-emerald-600...">
      Save
    </button>
  </div>
</div>
```

### New Code
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Settings">
  <Button variant="primary" onClick={onSave}>
    Save
  </Button>
</Modal>
```

**Result**: 70% less code, 100% consistent!

---

Built with ❤️ for Doxify
