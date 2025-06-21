# Sidebar Layout Guidelines

## Structure Overview
The CollapsibleDashboardLayout has two distinct header areas:

1. **SidebarHeader** (inside sidebar):
   - Contains EdVirons logo and branding
   - Collapses/expands with sidebar
   - NO toggle button here

2. **Main Content Header** (in SidebarInset):
   - Contains page title and subtitle
   - Contains the SidebarTrigger (toggle button)
   - Contains user info
   - Always visible

## Rules to Prevent Duplicate Headers

### ✅ DO:
- Keep toggle button ONLY in main content header
- Maintain separate header structures for their specific purposes
- Add animations/styling without changing the structural layout
- Test both expanded and collapsed states

### ❌ DON'T:
- Put toggle button in SidebarHeader
- Create duplicate header structures
- Remove either header completely
- Mix content between the two headers

## Safe Modification Approach

When adding features like animations:
1. Focus on CSS/styling changes
2. Add classes without removing existing structure
3. Test in both expanded and collapsed states
4. Keep the two-header structure intact

## Current Working Structure

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>
      {/* Logo and branding only */}
    </SidebarHeader>
    <SidebarContent>
      {/* Navigation menu */}
    </SidebarContent>
  </Sidebar>
  
  <SidebarInset>
    <header>
      <SidebarTrigger /> {/* Toggle button here */}
      {/* Page title and user info */}
    </header>
    <main>
      {/* Page content */}
    </main>
  </SidebarInset>
</SidebarProvider>
```

This structure prevents the double header issue and maintains proper functionality.