import React from 'react';

function StatusCandidatura({ status }) {
    let statusColor = 'gray';
    switch (status?.toLowerCase()) { 
        case 'aprovada':
            statusColor = 'green';
            break;
        case 'em análise':
        case 'em_analise': 
            statusColor = 'yellow';
            break;
        case 'rejeitada':
            statusColor = 'red';
            break;
        case 'pendente':
            statusColor = 'blue'; 
            break;
        default:
            break;
    }

    return (
        <span className={`bg-${statusColor}-200 text-${statusColor}-800 py-1 px-3 rounded-full text-xs font-semibold`}>
            {status}
        </span>
    );
}

export default StatusCandidatura;