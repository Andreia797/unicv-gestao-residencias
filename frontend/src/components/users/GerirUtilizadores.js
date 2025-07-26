import React, { useState, useEffect, useContext } from 'react';
import {
    Paper,
    TextField,
    Button,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    TablePagination,
    FormControl,
    InputLabel,
    FormHelperText,
} from '@mui/material';
import UserService from '../../services/UserService'; 
import { AuthContext } from '../AuthContext';
import UserRow from '../../models/UserRow';

function GerirUtilizadores() {
    // Estados para gerir os utilizadores, formulários e UI
    const [utilizadores, setUtilizadores] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '', // Adicionado campo de email para a criação/edição
        permissao: '',
        permissoesDetalhadas: [],
    });
    const [permissoesDisponiveis, setPermissoesDisponiveis] = useState([]);
    const [mensagem, setMensagem] = useState(null); // Mensagens de feedback para o utilizador
    const [tipoMensagem, setTipoMensagem] = useState('success');
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [pagina, setPagina] = useState(0); // Paginação da tabela
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);
    const { user } = useContext(AuthContext); // Contexto de autenticação para permissões

    // Estados para os modais (Dialogs)
    const [openCreateDialog, setOpenCreateDialog] = useState(false); // Controla o modal de criação de utilizador
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false); // Controla o modal de sucesso após criação

    // Efeito para carregar utilizadores e permissões disponíveis ao montar o componente
    useEffect(() => {
        fetchUtilizadores();
        // Definição das permissões disponíveis (pode vir de uma API no futuro)
        setPermissoesDisponiveis(['gerir_utilizadores', 'gerir_candidaturas', 'gerir_residentes', 'gerir_edificios', 'visualizar_candidaturas']);
    }, []);

    // Função para buscar a lista de utilizadores do backend
    const fetchUtilizadores = async () => {
        setLoading(true);
        try {
            // Usa a função getUtilizadores do seu UserService
            const responseData = await UserService.getUtilizadores();
            // Mapeia os campos da resposta da API para o formato esperado pelo frontend
            setUtilizadores(responseData.map(user => ({
                ...user,
                username: user.nome_utilizador || '',
                name: user.nome || '',
                email: user.email || '',
                permissao: user.nome_permissao || '',
                permissoesDetalhadas: user.permissoes_detalhadas || [],
            })));
        } catch (error) {
            console.error('Erro ao buscar utilizadores:', error);
            setMensagem('Erro ao buscar utilizadores.');
            setTipoMensagem('error');
        } finally {
            setLoading(false);
        }
    };

    // Removido: handleEdit e handleUpdate não são usados diretamente neste componente para um modal de edição
    // Se a intenção for ter um modal de edição aqui, eles precisariam ser reintroduzidos e chamados
    // por um botão de edição que abre o modal. Atualmente, a edição é via Link para outra rota.

    // Lida com a exclusão de um utilizador
    const handleDelete = async (id) => {
        try {
            // Usa a função excluirUtilizador do seu UserService
            await UserService.excluirUtilizador(id);
            fetchUtilizadores(); // Atualiza a lista
            setMensagem('Utilizador excluído com sucesso.');
            setTipoMensagem('success');
        } catch (error) {
            console.error('Erro ao excluir utilizador:', error);
            setMensagem('Erro ao excluir utilizador.');
            setTipoMensagem('error');
        }
    };

    // Lida com a mudança nos campos do formulário
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Lida com a mudança nas permissões detalhadas (checkboxes)
    const handlePermissaoDetalhadaChange = (permissao) => {
        setFormData((prevFormData) => {
            const currentPermissoes = prevFormData.permissoesDetalhadas;
            if (currentPermissoes.includes(permissao)) {
                return {
                    ...prevFormData,
                    permissoesDetalhadas: currentPermissoes.filter((p) => p !== permissao),
                };
            } else {
                return {
                    ...prevFormData,
                    permissoesDetalhadas: [...currentPermissoes, permissao],
                };
            }
        });
    };

    // Lida com a criação de um novo utilizador
    const handleCriarUtilizador = async () => {
        try {
            // Usa a função criarUtilizador do seu UserService
            await UserService.criarUtilizador({
                username: formData.username,
                name: formData.name,
                email: formData.email,
                profile: {
                    name: formData.name,
                    permissao: formData.permissao,
                    permissoes_detalhadas: formData.permissoesDetalhadas,
                },
            });
            // Limpa o formulário e atualiza a lista
            setFormData({ username: '', name: '', email: '', permissao: '', permissoesDetalhadas: [] });
            fetchUtilizadores();
            setMensagem('Utilizador criado com sucesso. Um e-mail foi enviado para o utilizador para definir a sua senha.');
            setTipoMensagem('success');
            setOpenCreateDialog(false); // Fecha o modal de criação
            setOpenSuccessDialog(true); // Abre o modal de sucesso
        } catch (error) {
            console.error('Erro ao criar utilizador:', error);
            setMensagem('Erro ao criar utilizador.');
            setTipoMensagem('error');
        }
    };

    // Lida com a mudança de página da tabela
    const handleChangePage = (event, novaPagina) => {
        setPagina(novaPagina);
    };

    // Lida com a mudança de resultados por página da tabela
    const handleChangeRowsPerPage = (event) => {
        setResultadosPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };

    // Verifica permissões do utilizador logado para exibir/ocultar botões
    const podeEditarExcluir = user?.groups?.includes("administrador");
    const podeAdicionar = user?.groups?.includes("administrador");
    const podeVerDetalhes = user?.groups?.includes("administrador") || user?.groups?.includes("funcionario");

    return (
        <div className="p-4">
            {/* Mensagem de feedback (sucesso/erro) */}
            {mensagem && <Alert severity={tipoMensagem}>{mensagem}</Alert>}

            <h2 className="text-2xl font-semibold mb-4">Gestão de Utilizadores</h2>

            {/* Botão para adicionar novo utilizador (abre o modal) */}
            {podeAdicionar && (
                <div className="flex justify-end mb-4">
                    <Button
                        variant="contained"
                        color="primary"
                        className="mb-4"
                        onClick={() => setOpenCreateDialog(true)} // Abre o modal
                    >
                        Adicionar Utilizador
                    </Button>
                </div>
            )}

            {/* Indicador de carregamento */}
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    {/* Tabela de utilizadores */}
                    <Paper className="shadow-md rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissão</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {utilizadores
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((utilizador) => (
                                        // Usa o componente UserRow para renderizar cada linha
                                        <UserRow
                                            key={utilizador.id}
                                            user={utilizador}
                                            podeVerDetalhes={podeVerDetalhes}
                                            podeEditarExcluir={podeEditarExcluir}
                                            handleDelete={handleDelete}
                                        />
                                    ))}
                            </tbody>
                        </table>
                        {/* Paginação da tabela */}
                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={utilizadores.length}
                                rowsPerPage={resultadosPorPagina}
                                page={pagina}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Utilizadores por página:"
                                className="text-sm text-gray-700"
                            />
                        </div>
                    </Paper>
                </div>
            )}

            {/* Modal de Criação de Utilizador */}
            <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
                <DialogTitle>Criar Novo Utilizador</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.username}
                        onChange={handleChange}
                        className="mb-4"
                    />
                    <TextField
                        margin="dense"
                        name="name"
                        label="Nome Completo"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange}
                        className="mb-4"
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                        className="mb-4"
                    />
                    <FormControl fullWidth variant="outlined" className="mb-4">
                        <InputLabel>Permissão</InputLabel>
                        <Select
                            name="permissao"
                            value={formData.permissao}
                            onChange={handleChange}
                            label="Permissão"
                        >
                            <MenuItem value="">
                                <em>Nenhum</em>
                            </MenuItem>
                            <MenuItem value="administrador">Administrador</MenuItem>
                            <MenuItem value="funcionario">Funcionário</MenuItem>
                            <MenuItem value="residente">Residente</MenuItem>
                        </Select>
                        <FormHelperText>Selecione a permissão principal do utilizador.</FormHelperText>
                    </FormControl>
                    <div className="mb-4">
                        <h4 className="text-md font-medium mb-2">Permissões Detalhadas:</h4>
                        {permissoesDisponiveis.map((permissao) => (
                            <FormControlLabel
                                key={permissao}
                                control={
                                    <Checkbox
                                        checked={formData.permissoesDetalhadas.includes(permissao)}
                                        onChange={() => handlePermissaoDetalhadaChange(permissao)}
                                        name={permissao}
                                    />
                                }
                                label={permissao.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} // Formata para leitura
                            />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateDialog(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleCriarUtilizador} color="primary" variant="contained">
                        Criar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Sucesso após Criação (informando sobre o email de senha) */}
            <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
                <DialogTitle>Utilizador Criado com Sucesso!</DialogTitle>
                <DialogContent>
                    <Alert severity="success">
                        Um e-mail foi enviado para o novo utilizador para que ele defina a sua própria senha.
                        Por favor, instrua o utilizador a verificar a caixa de entrada (e spam).
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSuccessDialog(false)} color="primary" variant="contained">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GerirUtilizadores;