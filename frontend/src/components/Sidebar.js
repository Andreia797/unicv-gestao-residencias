import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    HomeIcon,
    BuildingOfficeIcon,
    CubeIcon,
    UsersIcon,
    TableCellsIcon,
    DocumentDuplicateIcon,
    UserIcon,
    DocumentTextIcon,
    PlusCircleIcon,
    EyeIcon,
    CheckCircleIcon,
    MapPinIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "../components/AuthContext";

function Sidebar() {
    const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext) || {};
    const navigate = useNavigate();
    const [visibleLinks, setVisibleLinks] = useState([]);
    const [loadingSidebar, setLoadingSidebar] = useState(true); // Novo estado de loading para a sidebar

    useEffect(() => {
        if (!authLoading && isAuthenticated && user) {
            const groups = user?.groups || [];
            const hasRole = (role) => groups.includes(role);

            const allSidebarLinks = [
                // Início (Geral e Específico)
                { to: "/dashboard", label: "Início", icon: HomeIcon, roles: ["administrador", "funcionario"] },
                { to: "/inicio", label: "Início", icon: HomeIcon, roles: ["estudante"] },

                // Candidaturas (Estudante)
                { to: "/candidaturas/nova", label: "Nova Candidatura", icon: PlusCircleIcon, roles: ["estudante", "administrador"] },
                { to: "/minhacandidatura", label: "Minha Candidatura", icon: UserIcon, roles: ["estudante", "administrador"] },

                // Vagas (Geral e Gestão)
                { to: "/vagas", label: "Vagas", icon: MapPinIcon, roles: ["estudante", "funcionario", "administrador"] },
                { to: "/gerirvagas", label: "Gerir Vagas", icon: MapPinIcon, roles: ["funcionario", "administrador"] },

                // Gestão de Candidaturas (Funcionário e Administrador)
                { to: "/admin/candidaturas/gerir", label: "Verificar Candidaturas", icon: EyeIcon, roles: ["administrador", "funcionario"] },
                { to: "/admin/candidaturas/avaliar", label: "Avaliar Candidaturas", icon: CheckCircleIcon, roles: ["administrador", "funcionario"] },
                { to: "/admin/candidaturas", label: "Gerir Candidaturas", icon: DocumentDuplicateIcon, roles: ["administrador"] },

                // Gestão de Residência (Funcionário e Administrador)
                { to: "/gerirresidentes", label: "Gerir Residentes", icon: UsersIcon, roles: ["administrador", "funcionario"] },
                { to: "/geriredificios", label: "Gerir Edifícios", icon: BuildingOfficeIcon, roles: ["administrador", "funcionario"] },
                { to: "/gerirquartos", label: "Gerir Quartos", icon: CubeIcon, roles: ["administrador", "funcionario"] },
                { to: "/gerircamas", label: "Gerir Camas", icon: TableCellsIcon, roles: ["administrador", "funcionario"] },

                // Gestão de Utilizadores (Administrador)
                { to: "/gerirutilizadores", label: "Gerir Utilizadores", icon: UserIcon, roles: ["administrador"] },

                // Relatórios (Funcionário e Administrador)
                { to: "/reports", label: "Relatórios", icon: DocumentTextIcon, roles: ["administrador", "funcionario"] },
            ];

            // Filtra links de acordo com as roles do usuário
            const filteredLinks = allSidebarLinks.filter((link) =>
                link.roles?.some((role) => hasRole(role))
            );
            setVisibleLinks(filteredLinks);
            setLoadingSidebar(false);
        } else if (!authLoading && !isAuthenticated) {
            // Se não estiver autenticado, talvez redirecione para a página de login
            navigate("/login");
        } else {
            // Ainda carregando a autenticação
            setLoadingSidebar(true);
            setVisibleLinks([]);
        }
    }, [user, isAuthenticated, authLoading, navigate]);

    // Evita renderizar links se ainda estiver carregando a autenticação ou a sidebar
    if (authLoading || loadingSidebar) {
        return (
            <aside className="bg-secondary text-white w-64 min-h-screen px-4 py-6 shadow-lg">
                <div className="text-center text-gray-300">Carregando menu...</div>
            </aside>
        );
    }

    return (
        <aside className="bg-secondary text-white w-64 min-h-screen px-4 py-6 shadow-lg">
            <nav className="flex flex-col gap-2">
                {visibleLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition duration-200 text-white text-base font-medium"
                    >
                        <link.icon className="h-5 w-5 text-white" aria-hidden="true" />
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;