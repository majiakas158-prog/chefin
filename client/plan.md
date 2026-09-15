ChefIn — Notification System & UI Redesign Plan
Goal
Replace the current basic notification system with a polished notification experience that matches the ChefIn Home Dashboard.
The system has two connected parts:
Notification Bell + Popup — recent unread notifications available from the dashboard header.
Full Notifications Page — complete history with filters, read/unread controls, grouping, and actions.
---
1. Design Language
Keep Notifications visually consistent with the Home Dashboard.
Dark navy sidebar
White notification cards
Very light gray background
ChefIn orange for primary actions
Rounded corners
Soft shadows
Clean typography
Small status colors
Smooth animations
Colors
```text
Primary Orange: #FF6B35
Dark Navy:      #10182F
Background:     #F7F9FC
White:          #FFFFFF
Dark Text:      #17213A
Gray Text:      #667085
Border:         #E6EAF0
Success:        #22C55E
Warning:        #F59E0B
Info:           #3B82F6
Danger:         #EF4444
```
---
2. Notification Bell
Place the bell in the same top header as the Home Dashboard.
Example:
```text
🔔  5
```
The orange badge shows unread notifications.
Touch effect
```text
scale: 1 → 0.94 → 1
```
Duration: 200–300ms.
A very small bell shake can be used, but avoid excessive animation.
---
3. Notification Popup
Clicking/touching the bell opens a modern popup.
```text
┌───────────────────────────────────────┐
│ 🔔 Notifications      Mark all read X │
├───────────────────────────────────────┤
│ [All] [Jobs] [Messages] [System]      │
├───────────────────────────────────────┤
│ 👜 New job match for you!         •  │
│    Head Chef at The Food House       │
│    matches your profile.             │
│    2 min ago                         │
│                                      │
│ 💬 New message                    •  │
│    Ritu Das sent you a message.     │
│    12 min ago                        │
│                                      │
│ 🔖 Job saved                         │
│    You saved Spice Garden.           │
│    1 hour ago                        │
│                                      │
│ 📄 Application update             • │
│    Your application was shortlisted. │
│    2 hours ago                       │
├───────────────────────────────────────┤
│       View all notifications →        │
└───────────────────────────────────────┘
```
Desktop target:
```text
Width: 380–430px
Maximum height: 600px
Border radius: 18–20px
```
---
4. Popup Animation
Opening:
```text
opacity: 0 → 1
scale: 0.98 → 1
translateY: -8px → 0
```
Duration:
```text
200–250ms
```
Closing reverses the animation.
Do not use browser `alert()` dialogs.
---
5. Notification Categories
Use:
```text
All
Jobs
Messages
Applications
System
```
Active tab:
```text
ChefIn orange
White text
```
Filtering should happen without page reload.
---
6. Notification Types
New Job Match
```text
New job match for you!

Head Chef at The Food House
matches your profile.

2 min ago
```
Action: Open Job Details
New Message
```text
New message

Ritu Das sent you a message.

"Hi, are you available for an interview..."
```
Action: Open Messages
Application Update
```text
Application update

Your application for Chinese Chef
at Dragon Kitchen is now shortlisted.

2 hours ago
```
Action: Open Application
Job Saved
```text
Job saved

You saved Spice Garden —
Sous Chef to your saved jobs.
```
Action: Open Saved Jobs
Profile Reminder
```text
Complete your profile

Your profile is 85% complete.
Add your portfolio to improve your chances.
```
Action: Open My Profile
---
7. Notification Card
Each notification contains:
```text
[Icon]  Title
        Description
        Time
                         [Unread dot]
```
Unread
Stronger title
White/highlighted card
Orange unread dot
Read
Normal text
No unread dot
Softer background
---
8. Notification Interaction
Desktop hover:
```text
Slight background change
Small shadow increase
```
Touch:
```text
scale: 1 → 0.99
```
When an unread notification opens:
```text
Unread → Read
```
Update the unread count immediately.
---
9. Notification Actions
```text
Job Match        → Job Details
Message          → Messages
Application      → Application Details
Saved Job        → Saved Jobs
Profile Reminder → My Profile
System           → System Details
```
---
10. Mark All as Read
Add:
```text
Mark all as read
```
Flow:
```text
Unread notifications
        ↓
All become read
        ↓
Badge becomes 0
```
Show:
```text
✓ All notifications marked as read
```
as a small toast.
---
11. Full Notifications Page
Route:
```text
/notifications
```
Use the same Sidebar and Header as the Home Dashboard.
Header
```text
Notifications

Stay updated with your jobs, applications and conversations.

                         Mark all as read
```
Optional:
```text
Notification settings
```
---
12. Full Page Layout
```text
┌─────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                        │
│         ├──────────────────────────────────────────────┤
│         │ Notifications                    Mark all read│
│         │ Stay updated with jobs and applications.     │
│         │                                              │
│         │ [All] [Jobs] [Messages] [Applications]       │
│         │                                              │
│         │ TODAY                                        │
│         │ ┌──────────────────────────────────────────┐ │
│         │ │ 👜 New job match                       • │ │
│         │ │    Head Chef at The Food House           │ │
│         │ │    2 min ago                             │ │
│         │ └──────────────────────────────────────────┘ │
│         │                                              │
│         │ ┌──────────────────────────────────────────┐ │
│         │ │ 💬 New message                           │ │
│         │ │    Ritu Das sent you a message.          │ │
│         │ └──────────────────────────────────────────┘ │
│         │                                              │
│         │ YESTERDAY                                    │
│         │ ┌──────────────────────────────────────────┐ │
│         │ │ 📄 Application update                     │ │
│         │ │    You have been shortlisted.             │ │
│         │ └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```
---
13. Notification Grouping
Group by:
```text
Today
Yesterday
Earlier this week
Older
```
Use small uppercase/semibold section labels.
---
14. Empty State
When there are no notifications:
```text
             🔔

       You're all caught up!

There are no new notifications right now.
We'll let you know when something happens.

        [ Explore Jobs ]
```
Never show a blank page.
---
15. Loading State
Show 4–6 skeleton notification cards while loading.
Do not show a blank screen.
---
16. Error State
```text
Unable to load notifications

Something went wrong while loading
your notifications.

[ Try again ]
```
The button retries the request.
---
17. Mobile Notification UI
On mobile, replace the desktop dropdown with a bottom sheet.
```text
┌──────────────────────────────────┐
│          Dashboard               │
├──────────────────────────────────┤
│              ━━━                 │
│ 🔔 Notifications              X │
│                                  │
│ [All] [Jobs] [Messages]          │
│                                  │
│ 👜 New job match              • │
│    Head Chef at The Food House   │
│    2 min ago                     │
│                                  │
│ 💬 New message                   │
│    Ritu Das sent a message.      │
│    12 min ago                    │
│                                  │
│ [ View all notifications → ]     │
└──────────────────────────────────┘
```
Animation:
```text
translateY(100%) → translateY(0)
```
Support:
Tap outside to close
Swipe down to close
Swipe up to expand
Large touch targets
No horizontal scrolling
---
18. Toast Feedback
Use small toast messages for quick actions.
```text
✓ Notification marked as read
✓ All notifications marked as read
✓ Job saved
✓ Application submitted
```
Desktop:
```text
Bottom-right
```
Mobile:
```text
Bottom-center
```
Duration:
```text
2500–3500ms
```
---
19. Three-Dot Menu
Each notification may have:
```text
•••
```
Unread notification:
```text
Mark as read
Delete
```
Read notification:
```text
Mark as unread
Delete
```
Keep Delete secondary.
---
20. Notification Data
Use one reusable data structure.
```js
const notifications = [
  {
    id: 1,
    type: "job",
    title: "New job match for you!",
    message: "Head Chef at The Food House matches your profile.",
    time: "2 min ago",
    read: false,
    target: "/job/1"
  },
  {
    id: 2,
    type: "message",
    title: "New message",
    message: "Ritu Das sent you a message.",
    time: "12 min ago",
    read: false,
    target: "/messages"
  },
  {
    id: 3,
    type: "saved",
    title: "Job saved",
    message: "You saved Spice Garden — Sous Chef.",
    time: "1 hour ago",
    read: true,
    target: "/saved-jobs"
  },
  {
    id: 4,
    type: "application",
    title: "Application update",
    message: "Your Chinese Chef application is now shortlisted.",
    time: "2 hours ago",
    read: false,
    target: "/applications"
  },
  {
    id: 5,
    type: "profile",
    title: "Complete your profile",
    message: "Your profile is 85% complete.",
    time: "3 hours ago",
    read: true,
    target: "/profile"
  }
];
```
---
21. State Management
If using React:
```js
const [notifications, setNotifications] = useState([]);
const [activeFilter, setActiveFilter] = useState("all");
const [isNotificationOpen, setIsNotificationOpen] = useState(false);
```
Also maintain:
```text
unreadCount
selectedNotification
isLoading
error
```
If using plain JavaScript, keep one reusable notification system instead of duplicate popup code.
---
22. Recommended Components
If using React:
```text
components/
│
├── notifications/
│   ├── NotificationBell.jsx
│   ├── NotificationPopup.jsx
│   ├── NotificationItem.jsx
│   ├── NotificationTabs.jsx
│   ├── NotificationSkeleton.jsx
│   └── NotificationToast.jsx
│
├── ProfileDropdown.jsx
└── BottomSheet.jsx

pages/
└── Notifications.jsx
```
If the current project is plain HTML/CSS/JS, keep the existing architecture:
```text
notifications.html
notifications.css
notifications.js
```
Do not convert the project to React only for this feature.
---
23. Persistence
If the current frontend uses localStorage/AsyncStorage, store read/unread state there initially.
Suggested key:
```text
chefInNotifications
```
Later move notification state to the backend/database.
---
24. Backend-Ready Events
Prepare for:
```text
New Job Match
New Message
Restaurant Viewed Profile
Application Submitted
Application Shortlisted
Application Rejected
Interview Scheduled
Interview Reminder
Job Saved
Profile Reminder
System Announcement
```
---
25. Future Real-Time Notifications
When the backend is ready:
```text
Restaurant / System
        ↓
Backend
        ↓
Notification Service
        ↓
WebSocket / Socket.IO
        ↓
ChefIn Dashboard
        ↓
Bell badge + Popup
```
A new notification should appear without refreshing the page.
---
26. Accessibility
Support:
Keyboard navigation
Enter/Space activation
Escape to close
Screen-reader labels
Visible focus states
Good contrast
Touch-friendly controls
Example:
```html
aria-label="Notifications"
```
---
27. Responsive Breakpoints
```text
Desktop: 1200px+
Tablet: 768px–1199px
Mobile: below 768px
```
Desktop
Dropdown popup
Full Notifications page
Sidebar visible
Tablet
Smaller popup
Collapsible sidebar
Mobile
Bottom sheet
Full-width notification page
Mobile sidebar
Large touch targets
---
28. Development Order
Step 1 — Backup
Back up the current ChefIn dashboard.
Step 2 — Inspect Existing System
Find:
```text
Current notification bell
Current notification page
Current routes
Current notification data
Current localStorage/AsyncStorage
```
Step 3 — Create Notification Data
Create the reusable notification structure.
Step 4 — Build Notification Item
Create one reusable notification card.
Step 5 — Build Notification Bell
Add unread badge and touch animation.
Step 6 — Build Notification Popup
Add:
```text
Header
Tabs
Notification list
Mark all as read
View all
```
Step 7 — Build Full Notifications Page
Make it visually match Home Dashboard.
Step 8 — Add Filters
Implement all categories.
Step 9 — Add Read/Unread Logic
Implement:
```text
Mark read
Mark unread
Mark all read
Unread counter
```
Step 10 — Connect Actions
Connect notifications to:
```text
Jobs
Applications
Messages
Saved Jobs
Profile
```
Step 11 — Build Mobile Bottom Sheet
Make the popup responsive.
Step 12 — Add Toasts
Show action feedback.
Step 13 — Add Loading/Empty/Error States
Step 14 — Connect Existing Navigation
Ensure all current ChefIn routes continue working.
Step 15 — Test
Test every notification interaction.
---
29. Testing Checklist
Bell
[ ] Bell visible
[ ] Badge count correct
[ ] Touch animation works
[ ] Popup opens
[ ] Popup closes
[ ] Escape closes popup
[ ] Outside click closes popup
Popup
[ ] All filter works
[ ] Jobs filter works
[ ] Messages filter works
[ ] Applications filter works
[ ] System filter works
[ ] Notification cards work
[ ] Mark all as read works
[ ] View all works
[ ] Popup scroll works
Full Page
[ ] Matches Home Dashboard
[ ] Today grouping works
[ ] Yesterday grouping works
[ ] Older grouping works
[ ] Filters work
[ ] Read/unread works
[ ] Delete works if enabled
[ ] Empty state works
[ ] Loading state works
[ ] Error state works
Mobile
[ ] Bottom sheet opens
[ ] Bottom sheet closes
[ ] Swipe down works
[ ] Touch feedback works
[ ] No horizontal scrolling
[ ] Text remains readable
Final
[ ] No broken icons
[ ] No broken images
[ ] No console errors
[ ] Existing routes work
[ ] Existing dashboard functionality still works
---
30. Final UX Flow
```text
New notification
       ↓
Bell badge increases
       ↓
User touches bell
       ↓
Bell press animation
       ↓
Notification popup opens
       ↓
User selects notification
       ↓
Notification becomes read
       ↓
Relevant job/message/application opens
```
Full page:
```text
Notification Popup
       ↓
View all notifications
       ↓
/notifications
       ↓
Filter / read / delete / open
       ↓
Relevant ChefIn feature
```
---
31. Final Design Target
The Notification system must look like a natural extension of the ChefIn Home Dashboard.
Use:
```text
ChefIn Orange
+
Dark Navy
+
White Rounded Cards
+
Soft Shadows
+
Clean Typography
+
Smooth Popup Animation
+
Useful Actions
```
The final experience should be:
```text
Professional
Modern
Clean
Interactive
Fast
Trustworthy
Mobile Friendly
Consistent
Backend Ready
```
Do not create a generic notification list. Build a complete notification experience that feels like a real production feature of ChefIn.