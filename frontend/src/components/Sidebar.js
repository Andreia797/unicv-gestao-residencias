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
    ClipboardDocumentListIcon, // Ícone para listagem de candidaturas
    PlusCircleIcon, // Ícone para nova candidatura
    EyeIcon, // Ícone para detalhes da candidatura
    CheckCircleIcon, // Ícone para validar/avaliar
    MapPinIcon, // Ícone para Vagas (você pode precisar instalar @heroicons/react/24/solid para este ícone)
} from '@heroicons/react/24/solid';

function Sidebar() {
    const sidebarLinks = [
        { to: '/dashboard', label: 'Início', icon: HomeIcon },
        { to: '/inicio', label: 'Início', icon: HomeIcon },
        { to: '/candidaturas/nova', label: 'Nova Candidatura', icon: PlusCircleIcon },
        { to: '/minhacandidatura', label: 'Minha Candidatura', icon: UserIcon },
        { to: '/candidaturas', label: 'Listar Candidaturas', icon: ClipboardDocumentListIcon },
        { to: '/vagas', label: 'Vagas', icon: MapPinIcon }, // Nova rota para Vagas
        { to: '/admin/candidaturas', label: 'Gerir Candidaturas', icon: DocumentDuplicateIcon },
        { to: '/admin/candidaturas/gerir', label: 'Supervisionar Candidaturas', icon: EyeIcon },
        { to: '/admin/candidaturas/avaliar', label: 'Avaliar Candidaturas', icon: CheckCircleIcon },
        { to: '/gerirresidentes', label: 'Gerir Residentes', icon: UsersIcon },
        { to: '/gerircamas', label: 'Gerir Camas', icon: TableCellsIcon },
        { to: '/geriredificios', label: 'Gerir Edifícios', icon: BuildingOfficeIcon },
        { to: '/gerirquartos', label: 'Gerir Quartos', icon: CubeIcon },
        { to: '/gerirutilizadores', label: 'Gerir Utilizadores', icon: UserIcon },
        { to: '/residentes', label: 'Residentes', icon: UsersIcon },
        { to: '/edificios', label: 'Edifícios', icon: BuildingOfficeIcon },
        { to: '/quartos', label: 'Quartos', icon: CubeIcon },
        { to: '/camas', label: 'Camas', icon: TableCellsIcon },
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