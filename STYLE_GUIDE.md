# 🎨 Premium Dashboard Style Guide

A complete reference for all CSS classes, components, and design patterns used in the ExpoInn Smart Booking Engine dashboard.

## 📚 Table of Contents

1. [Glass Panels](#glass-panels)
2. [Buttons](#buttons)
3. [Forms](#forms)
4. [Cards](#cards)
5. [Badges & Indicators](#badges--indicators)
6. [Typography](#typography)
7. [Utilities](#utilities)
8. [Animation Classes](#animation-classes)

## 🪟 Glass Panels

### Primary Glass Panel

```html
<div class="glass-panel p-8">
  <!-- Content -->
</div>
```

**Features**:

- 5% white overlay
- 20px backdrop blur
- 1px border with 10% white
- 8px soft shadow
- Smooth transitions
- Gold border on hover
- Translates up 4px on hover

**Nesting**: Pair second glass panels with `glass-panel-subtle`

```html
<div class="glass-panel-subtle p-4">
  <!-- Subtle content -->
</div>
```

**Features**:

- 8% emerald overlay
- 8px backdrop blur
- Emerald border
- No hover transform

### Use Cases

| Class                | Best For                      |
| -------------------- | ----------------------------- |
| `glass-panel`        | Main containers, cards, forms |
| `glass-panel-subtle` | Nested items, lists, details  |
| Both                 | Layered, premium appearance   |

## 🔘 Buttons

### Emerald Button (Primary)

```html
<button class="btn-premium btn-emerald text-white">Request Booking</button>
```

**Styling**:

- Emerald gradient (2d8659 → 1a4d3e)
- Shadow: 8px emerald/30%
- Hover: 25px shadow, translate -2px
- Width varies (can be full-width or fixed)

### Gold Button (Secondary)

```html
<button class="btn-premium btn-gold">View Full Pricing</button>
```

**Styling**:

- Gold gradient (e6c547 → d4af37)
- Dark text (0f1419)
- Same hover behavior
- Premium metallic feel

### Outline Button

```html
<button class="btn-premium btn-outline">Save as Draft</button>
```

**Styling**:

- Transparent background
- 1.5px gold border (50% opacity)
- Gold text
- Hover: 10% gold background, border glow

### Button Sizing

```html
<!-- Regular padding -->
<button class="btn-premium btn-emerald px-6 py-3">Medium Button</button>

<!-- Large -->
<button class="btn-premium btn-emerald px-8 py-4">Large Button</button>

<!-- Small -->
<button class="btn-premium btn-emerald px-4 py-2 text-sm">Small Button</button>
```

## 📝 Forms

### Input Wrapper with Floating Labels

```html
<div class="input-wrapper">
  <input type="text" name="eventType" placeholder=" " required />
  <label>Event Type</label>
</div>
```

**Features**:

- Floating labels (move up on focus)
- Gold label color (#d4af37)
- 5% override on focus
- Emerald border on focus
- 20px blur background
- Smooth transitions

### Required Inputs

```html
<div class="input-wrapper">
  <input type="email" name="email" placeholder=" " required />
  <label>Email Address *</label>
</div>
```

### Select Dropdowns

```html
<div class="input-wrapper">
  <select name="eventType" required>
    <option value="">Select an option</option>
    <option value="wedding">Wedding</option>
    <option value="corporate">Corporate</option>
  </select>
  <label>Event Type</label>
</div>
```

### Date/Time Pickers

```html
<div class="input-wrapper">
  <input type="date" name="eventDate" />
  <label>Event Date</label>
</div>

<div class="input-wrapper">
  <input type="time" name="eventTime" />
  <label>Start Time</label>
</div>
```

### Textarea

```html
<div class="input-wrapper">
  <textarea name="requirements" rows="4" placeholder=" "></textarea>
  <label>Special Requirements</label>
</div>
```

## 🎴 Cards

### Premium Card

```html
<div class="card-premium p-6">
  <h3 class="heading-md mb-4">Card Title</h3>
  <!-- Content -->
</div>
```

**Features**:

- 3% white overlay
- 15px blur
- Emerald border (20% opacity)
- Hover: gold border, shadow
- Rounded corners (1.25rem)

### Analytics Card (in Grid)

```html
<div class="glass-panel p-6 group cursor-pointer">
  <div class="flex items-start justify-between mb-4">
    <span class="text-3xl">📅</span>
    <span class="badge-gold">+12.5%</span>
  </div>
  <h3 class="text-2xl font-bold">2,847</h3>
  <div class="h-1 bg-white/5 rounded-full overflow-hidden">
    <div
      class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
      style="width: 75%"
    ></div>
  </div>
</div>
```

## 🎖️ Badges & Indicators

### Gold Badge

```html
<span class="badge-gold">Premium Plan</span>
```

**Styling**:

- Gold background (15% opacity)
- 1px gold border (30%)
- Gold text (#e6c547)
- 0.75rem padding
- Uppercase text
- 600 font weight

### Status Indicator

```html
<div class="status-indicator">
  <div class="status-dot"></div>
  <span>Active</span>
</div>
```

**Features**:

- Emerald background (15%)
- 1px emerald border
- Animated pulsing dot
- Rounded pill shape

## 📖 Typography

### Heading Styles

```html
<!-- Extra Large (2.5rem) -->
<h1 class="heading-xl">Welcome Back, Sarah</h1>

<!-- Large (1.875rem) -->
<h2 class="heading-lg">Event Details</h2>

<!-- Medium (1.25rem) -->
<h3 class="heading-md">Revenue Trends</h3>
```

### Text Variants

```html
<!-- Accent text (Gold) -->
<span class="text-accent">Premium Feature</span>

<!-- Muted text (65% white) -->
<p class="text-muted">Secondary information</p>

<!-- Body text -->
<p class="text-white">Main paragraph text</p>
```

### Line Heights & Spacing

```css
.heading-xl {
  line-height: 1.2;
  margin: 0;
  letter-spacing: -1.2px;
}

.text-muted {
  font-size: 0.9rem;
  opacity: 0.65;
}
```

## 🛠️ Utilities

### Flexbox Utilities

```html
<!-- Centered flex -->
<div class="flex-center">Centered content</div>

<!-- Space between -->
<div class="flex-between">
  <span>Left</span>
  <span>Right</span>
</div>
```

### Gap Spacing

```html
<div class="gap-sm">Small gap (0.75rem)</div>
<div class="gap-md">Medium gap (1.25rem)</div>
<div class="gap-lg">Large gap (1.875rem)</div>
```

### Shadow Effects

```html
<!-- Large shadow -->
<div class="shadow-lg">Content</div>

<!-- Glowing shadow -->
<div class="shadow-glow">Glowing content</div>
```

### Opacity

```html
<div class="opacity-80">80% opacity</div>
<div class="opacity-60">60% opacity</div>
```

## ✨ Animation Classes

### Entrance Animations

```html
<!-- Fade in from bottom -->
<div class="animate-fade-in-up">Content</div>

<!-- Slide from left -->
<div class="animate-slide-in-left">Content</div>

<!-- Slide from right -->
<div class="animate-slide-in-right">Content</div>
```

### Continuous Animations

```html
<!-- Pulsing glow effect -->
<div class="animate-pulse-glow">Glowing element</div>

<!-- Floating animation -->
<div class="animate-float">Floating icon</div>

<!-- Bounce animation -->
<button type="submit">
  <span class="animate-bounce">Loading...</span>
</button>
```

### Animation with Delay

```html
<!-- Stagger animations -->
<div class="animate-fade-in-up" style="animation-delay: '0s'">First</div>
<div class="animate-fade-in-up" style="animation-delay: '0.1s'">Second</div>
<div class="animate-fade-in-up" style="animation-delay: '0.2s'">Third</div>
```

## 🎯 Component Patterns

### Dashboard Card with Icon

```html
<div class="glass-panel p-6 group cursor-pointer hover:shadow-xl">
  <div class="flex items-start justify-between mb-4">
    <div class="text-3xl animate-float">📊</div>
    <div class="badge-gold">+18.2%</div>
  </div>
  <p class="text-muted mb-2">Metric Label</p>
  <h3 class="heading-md mb-3">$128,450</h3>
  <div class="h-1 bg-white/5 rounded-full overflow-hidden">
    <div class="h-full bg-gradient-emerald" style="width: 75%"></div>
  </div>
</div>
```

### Form Column Layout

```html
<div class="space-y-6">
  <div class="text-center">
    <h3 class="heading-md mb-6">Form Section</h3>
  </div>

  <div class="input-wrapper">
    <input type="text" placeholder=" " />
    <label>Field Label</label>
  </div>

  <div class="grid grid-cols-2 gap-6">
    <div class="input-wrapper">
      <input type="number" placeholder=" " />
      <label>Left Field</label>
    </div>
    <div class="input-wrapper">
      <input type="number" placeholder=" " />
      <label>Right Field</label>
    </div>
  </div>
</div>
```

### Status List Item

```html
<div class="glass-panel-subtle p-4 hover:bg-emerald-500/10 transition">
  <div class="flex items-center justify-between mb-3">
    <div class="flex-1">
      <h4 class="font-semibold text-white">Item Name</h4>
      <p class="text-xs text-muted mt-1">Subtitle</p>
    </div>
    <div class="text-right">
      <p class="font-bold text-gold">$45,200</p>
      <p class="text-xs text-emerald-400">↑ +12.5%</p>
    </div>
  </div>
  <div class="h-2 bg-white/5 rounded-full overflow-hidden">
    <div
      class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
      style="width: 75%"
    ></div>
  </div>
</div>
```

## 🎨 Color Application Reference

### Emerald (Primary)

- Buttons: `.btn-emerald`
- Borders: `border-emerald-500/20` to `border-emerald-400`
- Text: `text-emerald-400` (accent)
- Backgrounds: `bg-emerald-500/10` (hover)

### Gold (Secondary)

- Badges: `.badge-gold`
- Text Accents: `.text-accent`
- Borders: `border-gold/50`
- Buttons: `.btn-gold`

### Neutral

- Backgrounds: `bg-white/5` to `bg-white/10`
- Text: `text-white` (primary), `text-muted` (secondary)
- Borders: `border-white/10` to `border-white/20`

## 📋 CSS Variable Reference

```css
:root {
  --color-emerald: #1a4d3e;
  --color-emerald-light: #2d8659;
  --color-black: #0f1419;
  --color-gold: #d4af37;
  --color-gold-light: #e6c547;
  --color-white: #f8f9fa;
  --color-gray-dark: #1a1f2e;
  --color-gray-light: #e8eef2;
  --backdrop-blur: blur(20px);
  --transition-smooth: all 0.4s cubic-bezier(0.33, 0.66, 0.66, 1);
}
```

## 🎬 Animation Timing

- Fast: 0.3s (hover effects)
- Normal: 0.4s-0.6s (transitions, entrance)
- Slow: 2s-3s (infinite animations)
- Easing: `cubic-bezier(0.33, 0.66, 0.66, 1)` for smooth transitions

---

**Pro Tips**:

- Use `group` + `group-hover:` for parent hover effects
- Layer `glass-panel` with `shadow-glow` for depth
- Combine animations with `style={{ animationDelay: '0.1s' }}` for staggered effects
- Use Tailwind's arbitrary values for custom spacing: `px-[1.875rem]`
