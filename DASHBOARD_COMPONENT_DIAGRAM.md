# Zesty ISP Dashboard - Component Diagram

## Visual Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                          HEADER (dashboard-header)                   │
│  ┌──────────────┐                              ┌────────┬─────────┐ │
│  │  Zesty ISP   │                              │   🔔   │   👤    │ │
│  │    (logo)    │                              │ (bell) │ (user)  │ │
│  └──────────────┘                              └────────┴─────────┘ │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│                   NAVIGATION TABS (dashboard-nav)                    │
│  ┌──────────────────┬──────────────┬────────────────┐               │
│  │ Promotion mgmt   │   Cohorts    │    Products    │               │
│  │   (active tab)   │              │                │               │
│  └──────────────────┴──────────────┴────────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
┌──────────────────┬──────────────────────────────────────────────────┐
│                  │                                                   │
│    SIDEBAR       │         ACTION WINDOW (action-window)            │
│ (dashboard-      │                                                   │
│   sidebar)       │  ┌──────────────────────────────────────────┐   │
│                  │  │  Action Window Header                     │   │
│ ┌──────────────┐ │  │  ┌─────────────────┐  ┌──────────────┐  │   │
│ │  A-OK Chat   │ │  │  │ Page Title      │  │ + Create New │  │   │
│ │    agent     │ │  │  └─────────────────┘  └──────────────┘  │   │
│ │              │ │  └──────────────────────────────────────────┘   │
│ └──────────────┘ │                                                   │
│                  │  ┌──────────────────────────────────────────┐   │
│ ┌──────────────┐ │  │                                           │   │
│ │              │ │  │         ACTION CONTENT                    │   │
│ │ Chat         │ │  │         (action-content)                  │   │
│ │ Messages     │ │  │                                           │   │
│ │              │ │  │  • Stats Cards (stat-card)                │   │
│ │              │ │  │  • Data Tables (promotions-table)         │   │
│ │              │ │  │  • Content Placeholders                   │   │
│ │              │ │  │                                           │   │
│ └──────────────┘ │  │                                           │   │
│                  │  └──────────────────────────────────────────┘   │
│ ┌──────────────┐ │                                                   │
│ │ Chat Input   │ │                                                   │
│ └──────────────┘ │                                                   │
│                  │                                                   │
└──────────────────┴──────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### 1. **HEADER** (`dashboard-header`)
**Location:** Top of page, full width  
**CSS Class:** `.dashboard-header`  
**Contains:**
- **Logo Section** (`.header-left`)
  - `<h1 className="dashboard-logo">Zesty ISP</h1>`
- **User Controls** (`.header-right`)
  - Notification Button (`.icon-button`)
  - User Profile (`.user-profile`)

**Purpose:** Branding and quick access to notifications/profile

---

### 2. **NAVIGATION TABS** (`dashboard-nav`)
**Location:** Below header, full width  
**CSS Class:** `.dashboard-nav`  
**Contains:**
- Tab 1: "Promotion management" (`.nav-tab`)
- Tab 2: "Cohorts" (`.nav-tab`)
- Tab 3: "Products" (`.nav-tab`)
- Active tab has `.nav-tab.active` class

**Purpose:** Switch between different management sections

**State Variable:** `activeTab` ('promotion' | 'cohorts' | 'products')

---

### 3. **SIDEBAR** (`dashboard-sidebar`)
**Location:** Left side, below navigation  
**CSS Class:** `.dashboard-sidebar`  
**Width:** 350px (280px on tablets)  
**Contains:**

#### 3.1 **Sidebar Header** (`.sidebar-header`)
- Title: "A-OK Chat agent"
- Toggle Button (`.sidebar-toggle`) - collapses/expands sidebar

#### 3.2 **Chat Content** (`.chat-content`)
- **Chat Messages** (`.chat-messages`)
  - Individual messages (`.chat-message.bot`)
  - Message avatar (`.message-avatar`)
  - Message content (`.message-content`)
- **Chat Input Container** (`.chat-input-container`)
  - Text input (`.chat-input`)
  - Send button (`.chat-send-button`)

**Purpose:** AI assistant interface for user support

**State Variable:** `isChatOpen` (boolean)

**States:**
- Open: `.dashboard-sidebar.open`
- Closed: `.dashboard-sidebar.closed`

---

### 4. **ACTION WINDOW** (`action-window`)
**Location:** Right side (main content area)  
**CSS Class:** `.action-window`  
**Background:** Mauve/rose tinted  
**Contains:**

#### 4.1 **Action Window Header** (`.action-window-header`)
- Page Title (`<h2>`)
- Primary Action Button (`.primary-button`) - "Create New"

#### 4.2 **Action Content** (`.action-content`)
**Dynamic content based on active tab:**

##### For "Promotion Management" Tab:
- **Stats Cards Grid** (`.content-grid`)
  - **Stat Card 1** (`.stat-card`) - Active Promotions
    - Icon (`.stat-icon`)
    - Info (`.stat-info`)
      - Title, Value, Change indicator
  - **Stat Card 2** (`.stat-card`) - Revenue Impact
  - **Stat Card 3** (`.stat-card`) - Conversion Rate

- **Promotions Table** (`.promotions-table`)
  - Table headers (`<thead>`)
  - Table rows (`<tbody>`)
  - Status badges (`.badge.badge-active`, `.badge.badge-scheduled`)
  - Action buttons (`.action-btn`)

##### For "Cohorts" & "Products" Tabs:
- **Content Placeholder** (`.content-placeholder`)
  - Icon
  - Heading
  - Description text

**Purpose:** Main workspace for managing ISP operations

---

## Component State Management

### Current State Variables:
```javascript
const [activeTab, setActiveTab] = useState('promotion')
// Values: 'promotion' | 'cohorts' | 'products'

const [isChatOpen, setIsChatOpen] = useState(true)
// Values: true | false
```

---

## Key CSS Classes Reference

| Component | CSS Class | Description |
|-----------|-----------|-------------|
| **Layout** |
| Dashboard Container | `.dashboard-container` | Main wrapper |
| Header | `.dashboard-header` | Top navigation bar |
| Navigation | `.dashboard-nav` | Tab navigation |
| Sidebar | `.dashboard-sidebar` | Left chat panel |
| Action Window | `.action-window` | Main content area |
| **Header Components** |
| Logo | `.dashboard-logo` | Zesty ISP branding |
| Icon Button | `.icon-button` | Notification bell |
| User Profile | `.user-profile` | Profile avatar |
| **Navigation** |
| Nav Tab | `.nav-tab` | Individual tab |
| Active Tab | `.nav-tab.active` | Currently selected tab |
| **Sidebar Components** |
| Sidebar Header | `.sidebar-header` | Chat agent title bar |
| Sidebar Toggle | `.sidebar-toggle` | Collapse button |
| Chat Content | `.chat-content` | Chat interface |
| Chat Messages | `.chat-messages` | Message history |
| Chat Message | `.chat-message.bot` | Individual message |
| Chat Input | `.chat-input` | Text input field |
| Chat Send Button | `.chat-send-button` | Send icon button |
| **Action Window Components** |
| Window Header | `.action-window-header` | Title and actions |
| Primary Button | `.primary-button` | Create New button |
| Action Content | `.action-content` | Dynamic content area |
| Content Grid | `.content-grid` | Stats card container |
| **Stat Cards** |
| Stat Card | `.stat-card` | Metric card |
| Stat Icon | `.stat-icon` | Icon container |
| Stat Info | `.stat-info` | Text content |
| Stat Value | `.stat-value` | Large number |
| Stat Change | `.stat-change` | Change indicator |
| **Table Components** |
| Promotions Table | `.promotions-table` | Data table wrapper |
| Badge | `.badge` | Status indicator |
| Badge Active | `.badge-active` | Active status |
| Badge Scheduled | `.badge-scheduled` | Scheduled status |
| Action Button | `.action-btn` | Edit button |
| **Placeholders** |
| Content Placeholder | `.content-placeholder` | Empty state view |

---

## Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) {
  .dashboard-sidebar { width: 280px; }
}

/* Mobile */
@media (max-width: 768px) {
  .dashboard-main { flex-direction: column; }
  .dashboard-sidebar { width: 100%; }
}
```

---

## File Structure

```
src/
├── pages/
│   ├── Login.jsx           # Login page component
│   ├── Login.css           # Login page styles
│   ├── Dashboard.jsx       # Dashboard page component
│   └── Dashboard.css       # Dashboard page styles
├── App.jsx                 # Main app with routing
├── App.css                 # Global app styles
└── index.css               # Root styles
```

---

## Quick Reference for Common Tasks

### Change Active Tab
```javascript
setActiveTab('promotion')  // or 'cohorts' or 'products'
```

### Toggle Chat Sidebar
```javascript
setIsChatOpen(!isChatOpen)
```

### Access Components by Class
```javascript
document.querySelector('.dashboard-header')
document.querySelector('.action-window')
document.querySelector('.sidebar-header')
```

---

## Color Palette

| Element | Color/Gradient |
|---------|----------------|
| Primary Gradient | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` |
| Secondary Gradient | `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` |
| Accent Gradient | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` |
| Background | `linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)` |
| Action Window BG | `rgba(167, 139, 150, 0.15)` (mauve/rose tint) |
| Card Background | `rgba(255, 255, 255, 0.05)` |
| Border | `rgba(255, 255, 255, 0.1)` |
| Text Primary | `#fff` |
| Text Secondary | `#e2e8f0` |
| Text Muted | `#a0aec0` |
| Success | `#48bb78` |

---

## Notes

- The dashboard uses **glassmorphism** design with backdrop blur effects
- All interactive elements have **hover states** and **transitions**
- The layout is **fully responsive** and adapts to mobile screens
- The "A-OK Chat agent" can be collapsed to save space
- Active promotions data is currently **hardcoded** for demo purposes

