import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import Notificacoes from '../components/Notificacoes';
import AuthService from '../services/AuthService';

function FormularioCandidatura() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidatura, setCandidatura] = useState({
        DataSubmissao: '',
        Residencia_idResidencia: '',
        Estado: 'Pendente',
        TipoQuarto: '', 
    });
    const [estudante, setEstudante] = useState({
        Nome: '',
        CNIouPassaporte: '',
        Nif: '',
        Curso: '',
        Telefone: '',
        Email: '',
    });
    const [erros, setErros] = useState({});
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState('info');
    const [loading, setLoading] = useState(true);
    const [arquivos, setArquivos] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [residencias, setResidencias] = useState([]);
    const [steps] = useState(['Dados da Candidatura', 'Dados do Estudante', 'Documentos']);
    const tiposQuarto = ['Individual', 'Duplo', 'Triplo']; // Opções de tipo de quarto

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const residenciasResponse = await AuthService.authenticatedRequest('get', 'relatorios', '/residencias/');
                setResidencias(residenciasResponse.data);

                if (id) {
                    const candidaturaResponse = await AuthService.authenticatedRequest('get', 'relatorios', `/candidaturas/${id}/`);
                    setCandidatura({
                        DataSubmissao: candidaturaResponse.data.DataSubmissao || '',
                        Residencia_idResidencia: candidaturaResponse.data.Residencia_idResidencia || '',
                        Estado: candidaturaResponse.data.Estado || 'Pendente',
                        TipoQuarto: candidaturaResponse.data.TipoQuarto || '', 
                    });
                    setEstudante({
                        Nome: candidaturaResponse.data.estudante?.Nome || '',
                        CNIouPassaporte: candidaturaResponse.data.estudante?.CNIouPassaporte || '',
                        Nif: candidaturaResponse.data.estudante?.Nif || '',
                        Curso: candidaturaResponse.data.estudante?.Curso || '',
                        Telefone: candidaturaResponse.data.estudante?.Telefone || '',
                        Email: candidaturaResponse.data.estudante?.Email || '',
                    });
                    setArquivos({
                        CNIouPassaporteEntregue: candidaturaResponse.data.CNIouPassaporteEntregue_url || null,
                        DeclaracaoMatriculaEntregue: candidaturaResponse.data.DeclaracaoMatriculaEntregue_url || null,
                        DeclaracaoRendimentoEntregue: candidaturaResponse.data.DeclaracaoRendimentoEntregue_url || null,
                        DeclaracaoSubsistenciaEntregue: candidaturaResponse.data.DeclaracaoSubsistenciaEntregue_url || null,
                        DeclaracaoResidenciaEntregue: candidaturaResponse.data.DeclaracaoResidenciaEntregue_url || null,
                    });
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

    const handleCandidaturaChange = (e) => {
        setCandidatura({ ...candidatura, [e.target.name]: e.target.value });
    };

    const handleEstudanteChange = (e) => {
        setEstudante({ ...estudante, [e.target.name]: e.target.value });
    };

    const handleArquivoChange = (e) => {
        setArquivos({ ...arquivos, [e.target.name]: e.target.files[0] });
    };

    const validarAba1 = () => {
        let novosErros = {};
        if (!candidatura.DataSubmissao) novosErros.DataSubmissao = 'Data de Submissão é obrigatória.';
        if (!candidatura.Residencia_idResidencia) novosErros.Residencia_idResidencia = 'Residência é obrigatória.';
        if (!candidatura.TipoQuarto) novosErros.TipoQuarto = 'Tipo de Quarto é obrigatório.'; // Validação do TipoQuarto
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const validarAba2 = () => {
        let novosErros = { ...erros };
        if (!estudante.Nome) novosErros.Nome = 'Nome do estudante é obrigatório.';
        if (!estudante.CNIouPassaporte) novosErros.CNIouPassaporte = 'CNI ou Passaporte é obrigatório.';
        if (!estudante.Nif) novosErros.Nif = 'Nif obrigatório.';
        if (!estudante.Curso) novosErros.Curso = 'O curso é obrigatório.';
        if (!estudante.Email) novosErros.Email = 'Email é obrigatório.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarAba1() || !validarAba2()) {
            setActiveStep(validarAba1() ? 1 : 0);
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('DataSubmissao', candidatura.DataSubmissao);
            formData.append('Residencia_idResidencia', candidatura.Residencia_idResidencia);
            formData.append('Estado', candidatura.Estado);
            formData.append('TipoQuarto', candidatura.TipoQuarto); // Adiciona o TipoQuarto ao formData
            formData.append('Nome', estudante.Nome);
            formData.append('CNIouPassaporte', estudante.CNIouPassaporte);
            formData.append('Nif', estudante.Nif);
            formData.append('Curso', estudante.Curso);
            formData.append('Telefone', estudante.Telefone);
            formData.append('Email', estudante.Email);

            for (const nomeArquivo in arquivos) {
                if (arquivos[nomeArquivo] instanceof File) {
                    formData.append(nomeArquivo, arquivos[nomeArquivo]);
                }
            }

            if (id) {
                await AuthService.authenticatedRequest('put', 'relatorios', `/candidaturas/${id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setMensagem('Candidatura atualizada com sucesso.');
            } else {
                await AuthService.authenticatedRequest('post', '/candidaturas/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
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

    const handleNext = () => {
        let isValid = false;
        if (activeStep === 0) {
            isValid = validarAba1();
        } else if (activeStep === 1) {
            isValid = validarAba2();
        }

        if (isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div>
            <Container className="mt-4">
                <Paper className="p-6 rounded-lg shadow-md">
                    <Typography variant="h5" className="mb-4 text-center text-primary">
                        {id ? 'Editar Candidatura' : 'Realizar Candidatura'}
                    </Typography>
                    <Notificacoes mensagem={mensagem} tipo={tipoMensagem} limparMensagem={limparMensagem} />
                    <Stepper activeStep={activeStep} alternativeLabel className="mb-4">
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {loading ? (
                        <div className="text-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {activeStep === 0 && (
                                <div>
                                    <FormControl fullWidth margin="normal" error={!!erros.DataSubmissao}>
                                        <TextField
                                            label="Data de Submissão"
                                            type="datetime-local"
                                            name="DataSubmissao"
                                            value={candidatura.DataSubmissao}
                                            onChange={handleCandidaturaChange}
                                            InputLabelProps={{ shrink: true }}
                                            helperText={<span className="text-red-500">{erros.DataSubmissao}</span>}
                                            required
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal" error={!!erros.Residencia_idResidencia}>
                                        <InputLabel id="residencia-label">Residência</InputLabel>
                                        <Select
                                            labelId="residencia-label"
                                            id="Residencia_idResidencia"
                                            name="Residencia_idResidencia"
                                            value={candidatura.Residencia_idResidencia}
                                            onChange={handleCandidaturaChange}
                                            label="Residência"
                                            required
                                        >
                                            {residencias.map((residencia) => (
                                                <MenuItem key={residencia.id} value={residencia.id}>
                                                    {residencia.Nome}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {erros.Residencia_idResidencia && <Alert severity="error">{erros.Residencia_idResidencia}</Alert>}
                                    </FormControl>
                                    {/* Novo campo para Tipo de Quarto */}
                                    <FormControl fullWidth margin="normal" error={!!erros.TipoQuarto}>
                                        <InputLabel id="tipo-quarto-label">Tipo de Quarto</InputLabel>
                                        <Select
                                            labelId="tipo-quarto-label"
                                            id="TipoQuarto"
                                            name="TipoQuarto"
                                            value={candidatura.TipoQuarto}
                                            onChange={handleCandidaturaChange}
                                            label="Tipo de Quarto"
                                            required
                                        >
                                            {tiposQuarto.map((tipo) => (
                                                <MenuItem key={tipo} value={tipo}>
                                                    {tipo}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {erros.TipoQuarto && <Alert severity="error">{erros.TipoQuarto}</Alert>}
                                    </FormControl>
                                </div>
                            )}

                            {activeStep === 1 && (
                                <div>
                                    <Typography variant="h6" className="mb-4">Dados do Estudante</Typography>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Nome Completo"
                                        name="Nome"
                                        value={estudante.Nome}
                                        onChange={handleEstudanteChange}
                                        error={!!erros.Nome}
                                        helperText={<span className="text-red-500">{erros.Nome}</span>}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="CNI ou Passaporte"
                                        name="CNIouPassaporte"
                                        value={estudante.CNIouPassaporte}
                                        onChange={handleEstudanteChange}
                                        error={!!erros.CNIouPassaporte}
                                        helperText={<span className="text-red-500">{erros.CNIouPassaporte}</span>}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Nif"
                                        name="Nif"
                                        value={estudante.Nif}
                                        onChange={handleEstudanteChange}
                                        error={!!erros.Nif}
                                        helperText={<span className="text-red-500">{erros.Nif}</span>}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Curso"
                                        name="Curso"
                                        value={estudante.Curso}
                                        onChange={handleEstudanteChange}
                                        error={!!erros.Curso}
                                        helperText={<span className="text-red-500">{erros.Curso}</span>}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Telefone"
                                        name="Telefone"
                                        value={estudante.Telefone}
                                        onChange={handleEstudanteChange}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Email"
                                        name="Email"
                                        type="email"
                                        value={estudante.Email}
                                        onChange={handleEstudanteChange}
                                        error={!!erros.Email}
                                        helperText={<span className="text-red-500">{erros.Email}</span>}
                                        required
                                    />
                                </div>
                            )}

                            {activeStep === 2 && (
                                <div>
                                    <Typography variant="h6" className="mb-4">Documentos</Typography>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label htmlFor="CNIouPassaporteEntregue" className="block text-gray-700 text-sm font-bold mb-2">CNI ou Passaporte *</label>
                                            <input
                                                id="CNIouPassaporteEntregue"
                                                type="file"
                                                name="CNIouPassaporteEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['CNIouPassaporteEntregue'] instanceof File && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['CNIouPassaporteEntregue'].name}</p>
                                            )}
                                            {typeof arquivos['CNIouPassaporteEntregue'] === 'string' && (
                                                <p className="text-gray-600 text-sm mt-1">Ficheiro Existente</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="DeclaracaoMatriculaEntregue" className="block text-gray-700 text-sm font-bold mb-2">Declaração de Matrícula *</label>
                                            <input
                                                id="DeclaracaoMatriculaEntregue"
                                                type="file"
                                                name="DeclaracaoMatriculaEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['DeclaracaoMatriculaEntregue'] instanceof File && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['DeclaracaoMatriculaEntregue'].name}</p>
                                            )}
                                            {typeof arquivos['DeclaracaoMatriculaEntregue'] === 'string' && (
                                                <p className="text-gray-600 text-sm mt-1">Ficheiro Existente</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="DeclaracaoRendimentoEntregue" className="block text-gray-700 text-sm font-bold mb-2">Declaração de Rendimento *</label>
                                            <input
                                                id="DeclaracaoRendimentoEntregue"
                                                type="file"
                                                name="DeclaracaoRendimentoEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                           {arquivos['DeclaracaoRendimentoEntregue'] instanceof File && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['DeclaracaoRendimentoEntregue'].name}</p>
                                            )}
                                            {typeof arquivos['DeclaracaoRendimentoEntregue'] === 'string' && (
                                                <p className="text-gray-600 text-sm mt-1">Ficheiro Existente</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="DeclaracaoSubsistenciaEntregue" className="block text-gray-700 text-sm font-bold mb-2">Declaração de Subsistência * </label>
                                            <input
                                                id="DeclaracaoSubsistenciaEntregue"
                                                type="file"
                                                name="DeclaracaoSubsistenciaEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['DeclaracaoSubsistenciaEntregue'] instanceof File && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['DeclaracaoSubsistenciaEntregue'].name}</p>
                                            )}
                                            {typeof arquivos['DeclaracaoSubsistenciaEntregue'] === 'string' && (
                                                <p className="text-gray-600 text-sm mt-1">Ficheiro Existente</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="DeclaracaoResidenciaEntregue" className="block text-gray-700 text-sm font-bold mb-2">Declaração de Residência (Opcional)</label>
                                            <input
                                                id="DeclaracaoResidenciaEntregue"
                                                type="file"
                                                name="DeclaracaoResidenciaEntregue"
                                                onChange={handleArquivoChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {arquivos['DeclaracaoResidenciaEntregue'] instanceof File && (
                                                <p className="text-gray-600 text-sm mt-1">{arquivos['DeclaracaoResidenciaEntregue'].name}</p>
                                            )}
                                            {typeof arquivos['DeclaracaoResidenciaEntregue'] === 'string' && (
                                                <p className="text-gray-600 text-sm mt-1">Ficheiro Existente</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-6">
                                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                            {loading ? <CircularProgress size={24} color="inherit" /> : (id ? 'Atualizar Candidatura' : 'Submeter Candidatura')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                    <div className="mt-6 flex justify-between">
                        <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                            Anterior
                        </Button>
                        {activeStep < steps.length - 1 && (
                            <Button variant="contained" color="primary" onClick={handleNext} disabled={loading}>
                                Próximo
                            </Button>
                        )}
                    </div>
                </Paper>
            </Container>
        </div>
    );
}

export default FormularioCandidatura;