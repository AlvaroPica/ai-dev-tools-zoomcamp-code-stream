# Design Guidelines: Real-Time Collaborative Coding Interview Platform

## Design Approach
**Selected Framework:** Design System Approach inspired by VS Code, Linear, and CodeSandbox
**Rationale:** Utility-focused productivity tool requiring clarity, performance, and minimal visual distractions. Developers need consistent, predictable interfaces optimized for long coding sessions.

## Core Design Principles
1. **Function Over Form:** Every visual element serves the coding workflow
2. **Maximum Readability:** High contrast, clear typography for extended use
3. **Minimal Cognitive Load:** Clean layouts that don't compete with code content
4. **Professional Aesthetics:** Polished but understated—trust and competence

---

## Typography System

**Primary Font:** Inter or system-ui (UI elements, labels, buttons)
**Monospace Font:** JetBrains Mono or Fira Code (code editor, output panel)

**Scale:**
- Headings: text-2xl (24px) - sparingly used
- Body/Labels: text-sm (14px) - primary UI text
- Code: text-sm (14px) - editor content
- Small/Meta: text-xs (12px) - timestamps, status indicators

**Weights:** Regular (400) for body, Medium (500) for labels, Semibold (600) for emphasis

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Tight spacing: p-2, gap-2 (component internals)
- Standard spacing: p-4, gap-4 (between related elements)
- Section spacing: p-6, p-8 (major layout divisions)

**Home Page Layout:**
- Centered container (max-w-4xl)
- Vertical stack with breathing room (py-16)
- Prominent "Create New Session" card with shadow and hover effect
- Optional: Recent sessions list below (if implementing session history)

**Session Page Layout (Primary Interface):**
```
┌─────────────────────────────────────────┐
│ Header Bar (h-14)                       │
│ Session ID • Active Users • Run Button  │
├─────────────────┬───────────────────────┤
│                 │                       │
│  Code Editor    │   Output Panel        │
│  (60% width)    │   (40% width)         │
│                 │                       │
│  Monaco/CM6     │   Execution Results   │
│  Full height    │   Error Display       │
│                 │   Console Logs        │
└─────────────────┴───────────────────────┘
```

**Critical Measurements:**
- Header: h-14 (56px) - fixed height
- Editor/Output: calc(100vh - 56px) - fills remaining viewport
- Split ratio: 60/40 for editor/output (resizable with drag handle)
- No additional padding inside editor/output containers - maximize code space

---

## Component Library

### Navigation Header
- Background: subtle elevated surface
- Height: h-14, px-6 horizontal padding
- Flex layout: justify-between items-center
- Left: Session ID badge (rounded-full, px-3, py-1, text-xs)
- Center: Active users indicator with avatar dots
- Right: "Run Code" button (primary action style)

### Code Editor Container
- Border: right border only (1px subtle)
- No padding - Monaco/CodeMirror handles internal spacing
- Line numbers enabled
- Minimap enabled (Monaco) for navigation
- Bracket matching, auto-closing pairs

### Output Panel
- Padding: p-4 for content area
- Background: slightly different from editor for visual separation
- Scrollable: overflow-y-auto
- Sections: "Output", "Errors", "Console" with text-xs labels
- Monospace font for all output text
- Error messages: red accent, inline code formatting

### Buttons
**Primary (Run Code):**
- px-4, py-2, rounded-md
- Medium weight text
- Hover: subtle brightness increase
- Loading state: spinner + "Running..." text

**Secondary (Create Session):**
- px-6, py-3, rounded-lg
- Larger for home page prominence
- Shadow: shadow-lg with hover lift (shadow-xl)

### Status Indicators
- Active users: Small circular avatars (w-8 h-8) with online dot
- Connection status: Text label + dot indicator (green/red)
- Loading states: Subtle spinner (w-4 h-4) inline with text

### Collaboration Indicators
- Remote cursor: Thin vertical line (2px) with name label floating above
- Selection highlight: Semi-transparent overlay on selected code
- User badge: Small tag showing "User 2 is typing..." in editor footer

---

## Interaction Patterns

**Split Pane Resize:**
- Draggable divider (w-1) between editor and output
- Hover state: increased width (w-2) + cursor-col-resize
- Min widths: 40% editor, 30% output

**Code Execution Flow:**
1. Click "Run Code" → button disabled, spinner appears
2. Output panel scrolls to top automatically
3. Results stream in with timestamps
4. Button re-enables on completion

**WebSocket Connection:**
- Connecting: Yellow dot + "Connecting..." in header
- Connected: Green dot + "Connected • 2 users"
- Disconnected: Red dot + "Reconnecting..." with retry indicator

---

## Responsive Behavior

**Desktop (lg and above):** Split pane layout as designed

**Tablet/Mobile (below lg):**
- Stack vertically: Editor on top, output below
- Editor: min-height: 50vh
- Output: Collapsible panel with toggle button
- Header wraps to two rows if needed
- "Run Code" becomes full-width button below editor

---

## Visual Hierarchy

**Focus States:**
- Active editor gets subtle highlight on container border
- Keyboard focus rings on all interactive elements (ring-2, ring-offset-2)

**Empty States:**
- Output panel before execution: Centered message "Run code to see output"
- Icon + text, muted styling

**Error States:**
- Execution errors: Red accent border on output section
- Inline error messages with icon prefix

---

## Images
**No images required.** This is a productivity tool interface focused on code content. All visual interest comes from the editor interface, syntax highlighting, and clean component design.

---

## Performance Considerations

- Minimize animations - only subtle transitions (150-200ms) on hover/focus
- No decorative animations during code execution
- Editor syntax highlighting handled by Monaco/CodeMirror themes
- Smooth scrolling in output panel only

---

## Accessibility
- All interactive elements keyboard navigable
- ARIA labels for status indicators and dynamic content
- Focus trap in modal/dialog components (if any)
- Sufficient contrast ratios for all text (WCAG AA minimum)
- Screen reader announcements for connection status changes