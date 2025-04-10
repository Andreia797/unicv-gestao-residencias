import React from 'react';
import { Link } from 'react-router-dom';
import {
    HomeIcon,
    BuildingOfficeIcon,
    CubeIcon,
    UsersIcon,
    TableCellsIcon,
    DocumentDuplicateIcon,
    UserIcon,
    DocumentTextIcon,
    LinkIcon,  
} from '@heroicons/react/24/solid';

function Sidebar() {
    const sidebarLinks = [
        { to: '/dashboard', label: 'Início', icon: HomeIcon },
        { to: '/gerircandidaturas', label: 'Gerir Candidaturas', icon: DocumentDuplicateIcon },
        { to: '/gerirresidentes', label: 'Gerir Residentes', icon: UsersIcon },
        { to: '/gerircamas', label: 'Gerir Camas', icon: TableCellsIcon },
        { to: '/associarcama', label: 'Associar Cama', icon: LinkIcon }, 
        { to: '/geriredificios', label: 'Gerir Edifícios', icon: BuildingOfficeIcon },
        { to: '/gerirquartos', label: 'Gerir Quartos', icon: CubeIcon },
        { to: '/gerirutilizadores', label: 'Gerir Utilizadores', icon: UserIcon },
        { to: '/residentes', label: 'Residentes', icon: UsersIcon },
        { to: '/edificios', label: 'Edifícios', icon: BuildingOfficeIcon },
        { to: '/quartos', label: 'Quartos', icon: CubeIcon },
        { to: '/camas', label: 'Camas', icon: TableCellsIcon },
        { to: '/candidaturas', label: 'Candidaturas', icon: DocumentDuplicateIcon },
        { to: '/reports', label: 'Relatórios', icon: DocumentTextIcon },
    ];

    return (
        <aside className={`bg-secondary text-white p-4 w-64 h-screen`}>
            <nav className="flex flex-col space-y-2">
                {sidebarLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center p-3 rounded-md hover:bg-blue-800 transition duration-300 ease-in-out"
                    >
                        <link.icon className="h-6 w-6 mr-2" aria-hidden="true" />
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;