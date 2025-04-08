import React, { useState, useEffect } from 'react';
import AuthService from '../../services/AuthService'; // Importe o AuthService

function AssociarCama({ camaId }) {
    const [residentes, setResidentes] = useState([]);
    const [residenteSelecionado, setResidenteSelecionado] = useState('');
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResidentes = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', '/residentes/');
                setResidentes(response.data);
            } catch (error) {
                console.error('Erro ao buscar residentes:', error);
                setMensagem('Erro ao buscar residentes.');
                setTipoMensagem('error');
            } finally {
                setLoading(false);
            }
        };

        fetchResidentes();
    }, []);

    const handleAssociar = async () => {
        setLoading(true);
        try {
            await AuthService.authenticatedRequest('post', 'relatorios', `/camas/${camaId}/associar/`, {
                residenteId: residenteSelecionado,
            });
            setMensagem('Residente associado com sucesso.');
            setTipoMensagem('success');
            // Opcional: Recarregar a lista de residentes ou camas após a associação
        } catch (error) {
            console.error('Erro ao associar residente:', error.response?.data);
            setMensagem(error.response?.data?.message || 'Erro ao associar residente.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    const limparMensagem = () => {
        setMensagem(null);
    };

    return (
        <div className="p-4 max-w-md mx-auto mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-blue-600">Associar Residente à Cama</h2>
                {mensagem && (
                    <div
                        className={`mb-4 p-3 rounded ${
                            tipoMensagem === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {mensagem}
                        <button
                            onClick={limparMensagem}
                            className="float-right text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                    </div>
                )}
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <>
                        <div className="mb-4">
                            <label htmlFor="residente-select" className="block text-sm font-medium text-gray-700">
                                Selecione um residente
                            </label>
                            <select
                                id="residente-select"
                                value={residenteSelecionado}
                                onChange={(e) => setResidenteSelecionado(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecione um residente</option>
                                {residentes.map((residente) => (
                                    <option key={residente.id} value={residente.id}>
                                        {residente.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleAssociar}
                            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                            disabled={!residenteSelecionado || loading}
                        >
                            {loading ? 'Associando...' : 'Associar'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default AssociarCama;