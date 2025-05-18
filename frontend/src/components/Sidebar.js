import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  BuildingOfficeIcon,
  CubeIcon,
  UsersIcon,
  TableCellsIcon,
  DocumentDuplicateIcon,
  UserIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  EyeIcon,
  CheckCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "../components/AuthContext";

function Sidebar() {
  const { user } = useContext(AuthContext) || {};

  // Se user ou user.groups não estiver definido, considera grupos vazios
  const groups = user?.groups || [];

  const hasRole = (role) => groups.includes(role);

  const sidebarLinks = [
    { to: "/dashboard", label: "Início", icon: HomeIcon, roles: ["administrador", "funcionario"] },
    { to: "/inicio", label: "Início", icon: HomeIcon, roles: ["estudante", "administrador"] },
    { to: "/candidaturas/nova", label: "Nova Candidatura", icon: PlusCircleIcon, roles: ["estudante", "administrador"] },
    { to: "/minhacandidatura", label: "Minha Candidatura", icon: UserIcon, roles: ["estudante", "administrador"] },
    { to: "/candidaturas", label: "Listar Candidaturas", icon: ClipboardDocumentListIcon, roles: ["funcionario", "administrador"] },
    { to: "/vagas", label: "Vagas", icon: MapPinIcon, roles: ["estudante", "funcionario", "administrador"] },
    { to: "/admin/candidaturas", label: "Gerir Candidaturas", icon: DocumentDuplicateIcon, roles: ["administrador"] },
    { to: "/admin/candidaturas/gerir", label: "Supervisionar Candidaturas", icon: EyeIcon, roles: ["administrador", "funcionario"] },
    { to: "/admin/candidaturas/avaliar", label: "Avaliar Candidaturas", icon: CheckCircleIcon, roles: ["administrador", "funcionario"] },
    { to: "/gerirresidentes", label: "Gerir Residentes", icon: UsersIcon, roles: ["administrador", "funcionario"] },
    { to: "/gerircamas", label: "Gerir Camas", icon: TableCellsIcon, roles: ["administrador", "funcionario"] },
    { to: "/geriredificios", label: "Gerir Edifícios", icon: BuildingOfficeIcon, roles: ["administrador", "funcionario"] },
    { to: "/gerirquartos", label: "Gerir Quartos", icon: CubeIcon, roles: ["administrador", "funcionario"] },
    { to: "/gerirutilizadores", label: "Gerir Utilizadores", icon: UserIcon, roles: ["administrador"] },
    { to: "/residentes", label: "Residentes", icon: UsersIcon, roles: ["funcionario", "administrador"] },
    { to: "/edificios", label: "Edifícios", icon: BuildingOfficeIcon, roles: ["estudante", "administrador"] },
    { to: "/quartos", label: "Quartos", icon: CubeIcon, roles: ["funcionario", "administrador"] },
    { to: "/camas", label: "Camas", icon: TableCellsIcon, roles: ["funcionario", "administrador"] },
    { to: "/reports", label: "Relatórios", icon: DocumentTextIcon, roles: ["administrador", "funcionario"] },
  ];

  // Evita renderizar links se user não existe ainda (ex: loading)
  if (!user) {
    return (
      <aside className="bg-secondary text-white w-64 min-h-screen px-4 py-6 shadow-lg">
        <div className="text-center text-gray-300">Carregando menu...</div>
      </aside>
    );
  }

  // Filtra links de acordo com as roles do usuário
  const visibleLinks = sidebarLinks.filter((link) =>
    link.roles?.some((role) => hasRole(role))
  );

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
