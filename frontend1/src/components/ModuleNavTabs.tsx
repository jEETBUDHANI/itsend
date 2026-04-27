import { Link, useLocation } from 'react-router-dom';

type Tab = {
  id: string;
  label: string;
  path: string;
};

type ModuleNavTabsProps = {
  tabs: Tab[];
};

export default function ModuleNavTabs({ tabs }: ModuleNavTabsProps) {
  const location = useLocation();

  return (
    <div className="w-full overflow-x-auto border border-white/10 bg-white/5 rounded-xl p-2">
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={[
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                active
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
