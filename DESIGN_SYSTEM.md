# SupplyFlow AI - Design System & Component Usage Guide

## Color Palette

Our design system uses semantic color tokens that automatically adapt to light and dark modes:

### Core Colors
- `background` - Main background color
- `foreground` - Main text color
- `card` - Card background
- `card-foreground` - Card text
- `primary` - Primary brand color
- `primary-foreground` - Primary text
- `secondary` - Secondary brand color
- `secondary-foreground` - Secondary text
- `muted` - Muted background
- `muted-foreground` - Muted text
- `accent` - Accent color
- `accent-foreground` - Accent text
- `destructive` - Error/danger color
- `destructive-foreground` - Error text
- `border` - Border color
- `input` - Input border color
- `ring` - Focus ring color

### Supply Chain Specific Colors
- `supply-primary` - Purple-blue for AI/tech features
- `supply-secondary` - Cyan for data/analytics
- `supply-accent` - Orange for alerts/actions
- `supply-success` - Green for success states
- `supply-warning` - Yellow for warnings
- `supply-error` - Red for errors
- `supply-info` - Blue for information

## Component Usage Guidelines

### Button Component
```tsx
// Primary action
<Button className="bg-supply-primary hover:bg-supply-primary/90">
  Primary Action
</Button>

// Secondary action
<Button variant="secondary">
  Secondary Action
</Button>

// Destructive action
<Button variant="destructive">
  Delete
</Button>

// Outline button
<Button variant="outline">
  Cancel
</Button>
```

### Card Component
```tsx
// Standard card
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-foreground">Title</CardTitle>
    <CardDescription className="text-muted-foreground">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>

// Semi-transparent card (for overlays)
<Card className="bg-card/50 border-border">
  <CardContent>
    Overlay content
  </CardContent>
</Card>
```

### Badge Component
```tsx
// Default badge
<Badge>Default</Badge>

// Secondary badge
<Badge variant="secondary">Secondary</Badge>

// Destructive badge
<Badge variant="destructive">Error</Badge>

// Outline badge
<Badge variant="outline">Outline</Badge>
```

### Supply Chain Feature Cards
```tsx
// Feature with semantic color
<Card className="bg-card/50 border-border hover:border-supply-primary/50">
  <CardHeader>
    <div className="bg-supply-primary/20 text-supply-primary w-12 h-12 rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6" />
    </div>
    <CardTitle className="text-foreground">Feature Title</CardTitle>
    <CardDescription className="text-muted-foreground">
      Feature description
    </CardDescription>
  </CardHeader>
</Card>
```

## Color Usage Patterns

### Status Indicators
- **Success**: Use `supply-success` for completed operations, successful states
- **Warning**: Use `supply-warning` for caution states, potential issues
- **Error**: Use `supply-error` for failures, critical issues
- **Info**: Use `supply-info` for informational content, data insights

### Feature Categories
- **AI/ML Features**: Use `supply-primary` (purple-blue)
- **Analytics/Data**: Use `supply-secondary` (cyan)
- **Alerts/Actions**: Use `supply-accent` (orange)
- **General Info**: Use `supply-info` (blue)

### Interactive Elements
- **Hover states**: Add `/90` opacity to reduce intensity
- **Focus states**: Use `ring-supply-primary` or appropriate semantic color
- **Active states**: Use `/80` opacity for pressed appearance

## Typography
- **Headings**: Use `text-foreground` for primary headings
- **Body text**: Use `text-foreground` for main content
- **Secondary text**: Use `text-muted-foreground` for less important content
- **Captions**: Use `text-muted-foreground` with smaller font size

## Layout Guidelines
- Use `bg-background` for main page backgrounds
- Use `bg-card` for content containers
- Use `border-border` for consistent borders
- Use semantic spacing with Tailwind's spacing scale

## Dark Mode Considerations
- All colors automatically adapt to dark mode
- Test components in both light and dark modes
- Ensure sufficient contrast ratios
- Use opacity modifiers (`/20`, `/50`, `/80`) for layering

## Common Patterns

### Gradient Backgrounds
```tsx
// Primary gradient
className="bg-gradient-to-r from-supply-primary to-supply-secondary"

// Subtle gradient for cards
className="bg-gradient-to-r from-supply-primary/20 to-supply-secondary/20"
```

### Interactive Cards
```tsx
className="bg-card/50 border-border hover:border-supply-primary/50 transition-all duration-300"
```

### Status Messages
```tsx
// Error message
className="bg-destructive/20 border border-destructive/50 text-destructive"

// Success message
className="bg-supply-success/20 border border-supply-success/50 text-supply-success"
```

## Accessibility
- Maintain WCAG AA contrast ratios
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

## Best Practices
1. Always use design tokens instead of hardcoded colors
2. Test components in both light and dark modes
3. Use semantic color names that describe purpose, not appearance
4. Maintain consistency across similar components
5. Follow the established patterns for new components
6. Document any new color usage patterns