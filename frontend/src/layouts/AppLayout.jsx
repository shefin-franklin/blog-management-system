import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  ['/', 'Home'],
  ['/dashboard', 'Dashboard'],
  ['/editor', 'Editor'],
  ['/admin', 'Admin'],
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f2a5f,#050816_42%)]">
      <header className="sticky top-0 z-10 glass">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <b className="text-xl">Gemini BlogOS</b>
          <div className="flex gap-2">
            {links.map(([to, label]) => (
              <NavLink className="rounded-xl px-3 py-2 text-muted hover:bg-accent hover:text-white" to={to} key={to}>
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl p-4">
        <Outlet />
      </motion.main>
    </div>
  );
}
