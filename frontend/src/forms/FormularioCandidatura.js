import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Paper,
    Container,
} from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService'; // Importe o AuthService
import Header from '../components/Header';

function FormularioCandidatura() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidatura, setCandidatura] = useState({
        DataSubmissao: '',
        Residencia_idResidencia: '',
        Estudante_idEstudante: '',
    });
    const [erros, setErros] = useState({});
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true);
    const [arquivos, setArquivos] = useState({});
    const [abaAtual, setAbaAtual] = useState(0);
    const [residencias, setResidencias] = useState([]);
    const [estudantes, setEstudantes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const residenciasResponse = await AuthService.authenticatedRequest('get', 'core', '/residencias/');
                setResidencias(residenciasResponse.data);
                const estudantesResponse = await AuthService.authenticatedRequest('get', 'core', '/estudantes/');
                setEstudantes(estudantesResponse.data);
                if (id) {
                    const response = await AuthService.authenticatedRequest('get', 'core', `/candidaturas/${id}/`);
                    setCandidatura(response.data);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setMensagem('Erro ao buscar dados.');
                setTipoMensagem('error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setCandidatura({ ...candidatura, [e.target.name]: e.target.value });
    };

    const handleArquivoChange = (e) => {
        setArquivos({ ...arquivos, [e.target.name]: e.target.files[0] });
    };

    const validarFormulario = () => {
        let novosErros = {};
        if (!candidatura.DataSubmissao) novosErros.DataSubmissao = 'Data de Submissão é obrigatória.';
        if (!candidatura.Residencia_idResidencia) novosErros.Residencia_idResidencia = 'Residência é obrigatória.';
        if (!candidatura.Estudante_idEstudante) novosErros.Estudante_idEstudante = 'Estudante é obrigatório.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario() && abaAtual === 0) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('DataSubmissao', candidatura.DataSubmissao);
            formData.append('Residencia_idResidencia', candidatura.Residencia_idResidencia);
            formData.append('Estudante_idEstudante', candidatura.Estudante_idEstudante);

            Object.entries(arquivos).forEach(([nome, arquivo]) => {
                formData.append(nome, arquivo);
            });

            const headers = {
                'Content-Type': 'multipart/form-data',
            };

            if (id) {
                await AuthService.authenticatedRequest('put', 'core', `/candidaturas/${id}/`, formData, headers);
                setMensagem('Candidatura actualizada com sucesso.');
            } else {
                await AuthService.authenticatedRequest('post', 'core', '/candidaturas/', formData, headers);
                setMensagem('Candidatura criada com sucesso.');
            }
            setTipoMensagem('success');
            navigate('/candidaturas');
        } catch (error) {
            console.error('Erro ao salvar candidatura:', error);
            setMensagem('Erro ao salvar candidatura.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    const limparMensagem = () => {
        setMensagem(null);
    };

    return (
        <div>
            <Header />
            <Container className="mt-4">
                <Paper className="p-6 rounded-lg shadow-md">
                    <Typography variant="h5" className="mb-4 text-center text-primary">
                        {id ? 'Editar Candidatura' : 'Realizar Candidatura'}
                    </Typography>
                    <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
                    {loading ? (
                        <div className="text-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {abaAtual === 0 && (
                                <div>
                                    <FormControl fullWidth margin="normal" error={!!erros.DataSubmissao}>
                                        <TextField
                                            label="Data de Submissão"
                                            type="datetime-local"
                                            name="DataSubmissao"
                                            value={candidatura.DataSubmissao}
                                            onChange={handleChange}
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${erros.DataSubmissao ? 'border-red-500' : ''}`}
                                            InputLabelProps={{ shrink: true }}
                                            helperText={<span className="text-red-500">{erros.DataSubmissao}</span>}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal" error={!!erros.Residencia_idResidencia}>
                                        <InputLabel id="residencia-label" className="text-gray-700 text-sm font-bold mb-2">Residência</InputLabel>
                                        <Select
                                            labelId="residencia-label"
                                            id="Residencia_idResidencia"
                                            name="Residencia_idResidencia"
                                            value={candidatura.Residencia_idResidencia}
                                            onChange={handleChange}
                                            label="Residência"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        >
                                            {residencias.map((residencia) => (
                                                <MenuItem key={residencia.id} value={residencia.id}>
                                                    {residencia.nome}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {erros.Residencia_idResidencia && <Alert severity="error">{erros.Residencia_idResidencia}</Alert>}
                                    </FormControl>
                                    <FormControl fullWidth margin="normal" error={!!erros.Estudante_idEstudante}>
                                        <InputLabel id="estudante-label" className="text-gray-700 text-sm font-bold mb-2">Estudante</InputLabel>
                                        <Select
                                            labelId="estudante-label"
                                            id="Estudante_idEstudante"
                                            name="Estudante_idEstudante"
                                            value={candidatura.Estudante_idEstudante}
                                            onChange={handleChange}
                                            label="Estudante"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        >
                                            {estudantes.map((estudante) => (
                                                <MenuItem key={estudante.id} value={estudante.id}>
                                                    {estudante.nome}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {erros.Estudante_idEstudante && <Alert severity="error">{erros.Estudante_idEstudante}</Alert>}
                                    </FormControl>
                                </div>
                            )}
                            {abaAtual === 1 && (
                                <div>
                                    <Typography variant="h6" className="mb-4">Documentos</Typography>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label htmlFor="CNIouPassaporteEntregue" className="block text-gray-700 text-sm font-bold mb-2">CNI ou Passaporte</label>
                                            <input
                                                id="CNIouPassaporteEntregue"
                                                type="file"
                                                name="CNIouPassaporteEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['CNIouPassaporteEntregue'] && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['CNIouPassaporteEntregue'].name}</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="DeclaracaoMatriculaEntregue" className="block text-gray-700 text-sm font-bold mb-2">Declaração de Matrícula</label>
                                            <input
                                                id="DeclaracaoMatriculaEntregue"
                                                type="file"
                                                name="DeclaracaoMatriculaEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['DeclaracaoMatriculaEntregue'] && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['DeclaracaoMatriculaEntregue'].name}</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="DeclaracaoRendimentoEntregue" className="block text-gray-700 text-sm font-bold mb-2">Declaração de Rendimento</label>
                                            <input
                                                id="DeclaracaoRendimentoEntregue"
                                                type="file"
                                                name="DeclaracaoRendimentoEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['DeclaracaoRendimentoEntregue'] && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['DeclaracaoRendimentoEntregue'].name}</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="DeclaracaoSubsistenciaEntregue" className="block text-gray-700 text-sm font-bold mb-2">Declaração de Subsistência</label>
                                            <input
                                                id="DeclaracaoSubsistenciaEntregue"
                                                type="file"
                                                name="DeclaracaoSubsistenciaEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['DeclaracaoSubsistenciaEntregue'] && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['DeclaracaoSubsistenciaEntregue'].name}</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="DeclaracaoResidenciaEntregue" className="block text-gray-700 text-sm font-bold mb-2">Declaração de Residência</label>
                                            <input
                                                id="DeclaracaoResidenciaEntregue"
                                                type="file"
                                                name="DeclaracaoResidenciaEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['DeclaracaoResidenciaEntregue'] && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['DeclaracaoResidenciaEntregue'].name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-6">
                                        <Button type="submit" variant="contained" color="primary">
                                            Submeter Candidatura
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                    <div className="mt-6 flex justify-center">
                        <Button onClick={() => setAbaAtual(abaAtual === 0 ? 1 : 0)} variant="outlined">
                            {abaAtual === 0 ? 'Próximo' : 'Anterior'}
                        </Button>
                    </div>
                </Paper>
            </Container>
        </div>
    );
}

export default FormularioCandidatura;