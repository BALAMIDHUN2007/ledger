import Sidebar from "./Sidebar.jsx";

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">{children}</main>
    </div>
  );
};

export default AppLayout;
