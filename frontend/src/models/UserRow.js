import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

/**
 * Componente para renderizar uma única linha na tabela de utilizadores.
 * Recebe os dados do utilizador e as funções de ação como props.
 */
function UserRow({ user, podeVerDetalhes, podeEditarExcluir, handleDelete }) {
    return (
        <tr key={user.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.permissao}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {podeVerDetalhes && (
                    <Tooltip title="Detalhes">
                        <IconButton component={Link} to={`/users/${user.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                            <Visibility className="text-blue-500" />
                        </IconButton>
                    </Tooltip>
                )}
                {podeEditarExcluir && (
                    <>
                        <Tooltip title="Editar">
                            <IconButton component={Link} to={`/users/edit/${user.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                <Edit className="text-yellow-500" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                            <IconButton onClick={() => handleDelete(user.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
                                <Delete className="text-red-500" />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </td>
        </tr>
    );
}

export default UserRow;
