// frontend/src/components/Layout.jsx

import Sidebar from './Sidebar';

// Layout wraps all protected pages
// It renders the sidebar on the left and page content on the right
// Usage: <Layout><Dashboard /></Layout>
function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#0B1020] overflow-hidden">

      {/* Fixed sidebar on the left */}
      <Sidebar />

      {/* Scrollable main content area on the right */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

export default Layout;