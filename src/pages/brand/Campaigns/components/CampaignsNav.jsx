import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, SlidersHorizontal } from "lucide-react";
import { navLinks } from './campaignsNavData';

const CampaignsNav = ({ onFilterClick, primaryAction }) => {
  return (
    <nav className="lg:flex flex-wrap items-end justify-between gap-3">
      <ul className="md:flex grid grid-cols-2 lg:gap-8 md:gap-6 gap-2 items-end border-b border-gray-200">
        {navLinks.map((n) => (
          <li key={n.label} className="text-center  ">
            <NavLink
              to={n.href}
              end={n.href === '/brand/campaigns'}
              className={({ isActive }) =>
                `cursor-pointer ${isActive ? 'border-b-2 border-[#1E60DB] text-[#1E60DB] font-medium' : 'text-gray-500 '}`
              }
            >
              {n.label}
            </NavLink>
          </li>
        ))}
      </ul> 
   

      <div className="flex shrink-0 items-center justify-end gap-2 lg:justify-start lg:mt-0 mt-3">
              <button
                type="button"
                onClick={onFilterClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50"
                aria-label="Filter"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
              {primaryAction ? (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1E84D6] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(30,132,214,0.35)] hover:bg-[#167AC8]"
                >
                  {primaryAction.icon ?? <Plus className="h-4 w-4" />}
                  {primaryAction.label}
                </button>
              ) : null}
            </div>
    </nav>
  );
};

export default CampaignsNav;
