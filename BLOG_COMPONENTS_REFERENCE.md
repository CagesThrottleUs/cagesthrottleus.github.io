# Blog Components Reference

> **Note:** Copy this file to the `blog` branch as `COMPONENTS.md` for blog author reference.

This document describes all available MDX components you can use when writing blog posts.

## Overview

Blog posts are written in MDX (Markdown + JSX), which allows you to use custom React components alongside regular markdown. Instead of using CSS class names, you can use semantic component names that are pre-styled.

---

## Available Components

### 1. `<Redacted>`

Hide classified or censored information with a redacted visual style.

**Props:**
- `children`: The text to redact

**Example:**
```mdx
This information is <Redacted>classified</Redacted> and cannot be disclosed.
```

**Renders as:**
```
This information is [████████████] and cannot be disclosed.
```

---

### 2. `<CallOut>`

Highlight important information with visual emphasis boxes.

**Props:**
- `type`: `"info"` | `"warning"` | `"error"` | `"success"` (default: `"info"`)
- `children`: The content to highlight

**Examples:**

```mdx
<CallOut type="info">
This is general information about the mission parameters.
</CallOut>

<CallOut type="warning">
⚠️ Critical: All operatives must maintain radio silence.
</CallOut>

<CallOut type="error">
ALERT: Unauthorized access detected in sector 7.
</CallOut>

<CallOut type="success">
✓ Mission objectives successfully completed.
</CallOut>
```

**Visual Style:**
- **info**: Green border, subtle green background
- **warning**: Amber border, subtle amber background  
- **error**: Red border, subtle red background
- **success**: Bright green border, green background

---

### 3. `<SectionMarker>`

Create mission-style section headers with numbered markers.

**Props:**
- `number`: Section number (e.g., "1.0", "2.1", "3.0")
- `children`: Section title

**Example:**
```mdx
<SectionMarker number="1.0">Mission Overview</SectionMarker>

This is the mission overview content...

<SectionMarker number="2.0">Technical Specifications</SectionMarker>

Technical details go here...
```

**Renders as:**
```
§ 1.0  MISSION OVERVIEW
────────────────────────
```

**Note:** You can also use regular markdown headers (`## § 1.0 TITLE`) for the same effect.

---

### 4. `<ImageWithCaption>`

Display images with classification-style captions.

**Props:**
- `src`: Image URL or path (required)
- `caption`: Caption text (required)
- `alt`: Alternative text for accessibility (optional, defaults to caption)

**Example:**
```mdx
<ImageWithCaption 
  src="/blog/assets/diagram.png" 
  caption="Fig 1.1: Operational deployment schematic (CLASSIFIED)"
  alt="Deployment diagram showing system architecture"
/>
```

**Renders as:**
A bordered image with an italicized caption below it, all within a subtle container.

**Image Path Conventions:**
- Use relative paths from the blog branch root
- Store images in `/blog/assets/` or post-specific folders
- Supported formats: JPG, PNG, SVG

---

### 5. `<Highlight>`

Emphasize important text with terminal-style highlighting.

**Props:**
- `children`: Text to highlight

**Example:**
```mdx
The target coordinates are <Highlight>41.8781° N, 87.6298° W</Highlight> and must be confirmed.
```

**Renders as:**
Text with a bright green highlighted background, making it stand out from surrounding text.

---

## Complete Example Post

Here's a complete example showing all components in action:

```mdx
---
title: OPERATION NIGHTFALL: MISSION BRIEFING
classification: TOP SECRET // NOFORN
abstract: Covert operation parameters for infiltration of target facility. All personnel must maintain operational security.
publishDate: 2025-11-29
version: 1.0
thumbnail: thumbnails/nightfall.svg
---

<SectionMarker number="1.0">Mission Overview</SectionMarker>

Operation Nightfall involves the <Redacted>extraction of classified materials</Redacted> from the target facility located at coordinates <Highlight>51.5074° N, 0.1278° W</Highlight>.

<CallOut type="warning">
All operatives must maintain complete radio silence during infiltration phase.
</CallOut>

### 1.1 Operational Parameters

The mission will commence at <Redacted>2300 hours local time</Redacted> under cover of darkness. Primary objectives include:

- Secure perimeter access
- Locate target materials  
- Execute extraction protocol
- Exfiltrate without detection

<SectionMarker number="2.0">Equipment Specifications</SectionMarker>

<ImageWithCaption 
  src="thumbnails/equipment-layout.jpg"
  caption="Fig 2.1: Standard issue equipment configuration"
/>

Each operative will be equipped with:
- Night vision apparatus
- Communication device (encrypted)
- <Redacted>Specialized extraction tools</Redacted>

<CallOut type="success">
All equipment has been tested and certified for this operation.
</CallOut>

<SectionMarker number="3.0">Contingency Protocols</SectionMarker>

<CallOut type="error">
In case of compromise, activate emergency extraction immediately.
</CallOut>

Fallback coordinates: <Redacted>CLASSIFIED</Redacted>

---

**END OF BRIEFING**
```

## Best Practices

### 1. **Use Components Semantically**
Choose components based on their meaning, not just appearance:
- Use `<Redacted>` for classified/censored information
- Use `<Highlight>` for important data points
- Use `<CallOut>` for notices that need attention

### 2. **Don't Overuse Components**
Too many callouts or highlights reduce their effectiveness. Use sparingly for maximum impact.

### 3. **Combine with Regular Markdown**
You can mix components with standard markdown:

```mdx
## Regular Heading

Normal paragraph with **bold** and *italic* text.

<CallOut type="info">
Special notice here with markdown **formatting** inside!
</CallOut>

More normal text with [links](https://example.com).
```

### 4. **Component Names are Case-Sensitive**
Always use exact capitalization:
- ✅ `<Redacted>`
- ❌ `<redacted>`
- ❌ `<REDACTED>`

### 5. **Close All Components**
MDX requires proper closing tags:
- ✅ `<Redacted>text</Redacted>`
- ✅ `<CallOut type="info">content</CallOut>`
- ❌ `<Redacted>text` (missing closing tag)

## Component Styling

All components automatically inherit the Cold War classified document aesthetic:
- Monospace typography
- Red/green terminal color scheme
- Border styling with classification markings
- Consistent spacing and alignment

You don't need to worry about CSS or styling - just use the components!

## Need Help?

If you need a new component or have suggestions for improvements:
1. Create an issue in the main repository
2. Describe the use case and desired appearance
3. The component will be added to the library

## Version History

- **v1.0** (2025-11-29): Initial component library
  - Redacted
  - CallOut
  - SectionMarker
  - ImageWithCaption
  - Highlight

