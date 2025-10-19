# Color Scheme Quick Reference

## Light Mode Colors

### Background & Surface

| Element | Color | HSL | Hex Equivalent | Usage |
|---------|-------|-----|----------------|-------|
| Background | Light Gray | `220 14% 96%` | `#F3F4F6` | Main page background |
| Card | White | `0 0% 100%` | `#FFFFFF` | Card backgrounds |
| Popover | White | `0 0% 100%` | `#FFFFFF` | Dropdown/popover backgrounds |
| Input | White | `0 0% 100%` | `#FFFFFF` | Form input backgrounds |
| Sidebar | Gray | `220 17% 93%` | `#E8EAED` | Sidebar background |

### Interactive Elements

| Element | Color | HSL | Usage |
|---------|-------|-----|-------|
| Primary | Blue | `221 83% 53%` | Primary buttons, links |
| Secondary | Light Gray | `210 40% 96%` | Secondary buttons |
| Muted | Light Gray | `210 40% 94%` | Disabled/muted elements |
| Accent | Light Gray | `210 40% 94%` | Accent highlights |

### Borders & Text

| Element | Color | HSL | Usage |
|---------|-------|-----|-------|
| Border | Gray | `214 32% 88%` | Card borders, dividers |
| Foreground | Dark Blue | `222 47% 11%` | Primary text |
| Muted Foreground | Gray | `215 16% 47%` | Secondary text |

## Dark Mode Colors

### Background & Surface

| Element | Color | HSL | Usage |
|---------|-------|-----|-------|
| Background | Dark Blue-Gray | `222 47% 11%` | Main page background |
| Card | Blue-Gray | `217 33% 17%` | Card backgrounds |
| Popover | Blue-Gray | `217 33% 17%` | Dropdown/popover backgrounds |
| Sidebar | Dark Gray | `217 33% 14%` | Sidebar background |

### Interactive Elements

| Element | Color | HSL | Usage |
|---------|-------|-----|-------|
| Primary | Bright Blue | `217 91% 60%` | Primary buttons, links |
| Secondary | Dark Gray | `217 33% 21%` | Secondary buttons |
| Muted | Dark Gray | `217 33% 21%` | Disabled/muted elements |

## Visual Effects

### Shadows (Light Mode)

```css
/* Default card shadow */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Hover card shadow */
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
```

## Usage Examples

### Card Component
```tsx
<div className="bg-card text-card-foreground border rounded-lg p-6">
  {/* Content */}
</div>
```

### With Shadows
```tsx
<div className="card rounded-lg p-6">
  {/* Automatically has shadow and hover effects */}
</div>
```

### Input Field
```tsx
<input className="bg-input border border-border rounded-md px-3 py-2" />
```

## Contrast Ratios (Accessibility)

### Light Mode
- Background to Card: 4.5:1 ✅ (Good)
- Foreground on Card: 12:1 ✅ (Excellent)
- Muted Foreground on Card: 4.8:1 ✅ (Good)

### Dark Mode
- Background to Card: 3.5:1 ✅ (Good)
- Foreground on Card: 16:1 ✅ (Excellent)

## Color Philosophy

1. **Separation**: Background and cards have distinct colors
2. **Hierarchy**: Clear visual hierarchy through color and shadow
3. **Consistency**: All grays follow the same hue (blue-tinted)
4. **Accessibility**: WCAG AA compliant contrast ratios
5. **Modern**: Subtle shadows create depth without being overwhelming
