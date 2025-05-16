import React, { useContext } from 'react';
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
    MapPinIcon, // Ícone para Vagas
} from '@heroicons/react/24/solid';
import { AuthContext } from '../components/AuthContext';

function Sidebar() {
    const { user } = useContext(AuthContext) || {}; // Adiciona um objeto vazio como fallback
      console.log('User no Sidebar:', user);
      console.log('User Groups no Sidebar:', user?.groups);


    // Verifica se o objeto user existe antes de tentar acessar suas propriedades
    const isAdmin = user?.groups?.includes("administrador") || false;
    const isFuncionario = user?.groups?.includes("funcionario") || false;
    const isEstudante = user?.groups?.includes("estudante") || false;

    const sidebarLinks = [
        { to: '/dashboard', label: 'Início', icon: HomeIcon, roles: ['administrador', 'funcionario'] },
        { to: '/inicio', label: 'Início', icon: HomeIcon, roles: ['estudante','administrador'] },
        { to: '/candidaturas/nova', label: 'Nova Candidatura', icon: PlusCircleIcon, roles: ['estudante','administrador'] },
        { to: '/minhacandidatura', label: 'Minha Candidatura', icon: UserIcon, roles: ['estudante','administrador'] },
        { to: '/candidaturas', label: 'Listar Candidaturas', icon: ClipboardDocumentListIcon, roles: ['funcionario', 'administrador'] },
        { to: '/vagas', label: 'Vagas', icon: MapPinIcon, roles: ['estudante', 'funcionario', 'administrador'] },
        { to: '/admin/candidaturas', label: 'Gerir Candidaturas', icon: DocumentDuplicateIcon, roles: ['administrador'] },
        { to: '/admin/candidaturas/gerir', label: 'Supervisionar Candidaturas', icon: EyeIcon, roles: ['administrador', 'funcionario'] },
        { to: '/admin/candidaturas/avaliar', label: 'Avaliar Candidaturas', icon: CheckCircleIcon, roles: ['administrador', 'funcionario'] },
        { to: '/gerirresidentes', label: 'Gerir Residentes', icon: UsersIcon, roles: ['administrador', 'funcionario'] },
        { to: '/gerircamas', label: 'Gerir Camas', icon: TableCellsIcon, roles: ['administrador', 'funcionario'] },
        { to: '/geriredificios', label: 'Gerir Edifícios', icon: BuildingOfficeIcon, roles: ['administrador', 'funcionario'] },
        { to: '/gerirquartos', label: 'Gerir Quartos', icon: CubeIcon, roles: ['administrador', 'funcionario'] },
        { to: '/gerirutilizadores', label: 'Gerir Utilizadores', icon: UserIcon, roles: ['administrador'] },
        { to: '/residentes', label: 'Residentes', icon: UsersIcon, roles: [ 'funcionario', 'administrador'] },
        { to: '/edificios', label: 'Edifícios', icon: BuildingOfficeIcon, roles: ['estudante','administrador'] },
        { to: '/quartos', label: 'Quartos', icon: CubeIcon, roles: [ 'funcionario', 'administrador'] },
        { to: '/camas', label: 'Camas', icon: TableCellsIcon, roles: [ 'funcionario', 'administrador'] },
        { to: '/reports', label: 'Relatórios', icon: DocumentTextIcon, roles: ['administrador', 'funcionario'] },
    ];

    const visibleLinks = sidebarLinks.filter(link => {
        if (!link.roles) return true; 
        return link.roles.some(role =>
            (role === 'administrador' && isAdmin) ||
            (role === 'funcionario' && isFuncionario) ||
            (role === 'estudante' && isEstudante)
        );
    });

    return (
        <aside className={`bg-secondary text-white p-4 w-64 h-screen`}>
            <nav className="flex flex-col space-y-2">
                {visibleLinks.map((link) => (
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