import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Paper,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    IconButton,
    Tooltip,
    TablePagination,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import Notificacoes from "../Notificacoes";
import AuthService from '../../services/AuthService'; // Importe o AuthService

function GerirCamas() {
    const [camas, setCamas] = useState([]);
    const [novaCama, setNovaCama] = useState({
        numero: "",
        tipo: "",
        quartoId: null,
    });
    const [editCamaId, setEditCamaId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        numero: "",
        tipo: "",
        quartoId: null,
    });
    const [mensagem, setMensagem] = useState(null);
    const [tipoMensagem, setTipoMensagem] = useState("success");
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [resultadosPorPagina, setResultadosPorPagina] = useState(5);

    const fetchCamas = async () => {
        setLoading(true);
        try {
            const response = await AuthService.authenticatedRequest("get", "relatorios", "/camas/");
            setCamas(response.data);
        } catch (error) {
            console.error("Erro ao buscar camas:", error);
            setMensagem("Erro ao buscar camas.");
            setTipoMensagem("error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCamas();
    }, []);

    const handleInputChange = (e) => {
        setNovaCama({ ...novaCama, [e.target.name]: e.target.value });
    };

    const handleCriarCama = async () => {
        try {
            await AuthService.authenticatedRequest("post", "relatorios", "/camas/", novaCama);
            setNovaCama({ numero: "", tipo: "", quartoId: null });
            fetchCamas();
            setMensagem("Cama criada com sucesso.");
            setTipoMensagem("success");
        } catch (error) {
            console.error("Erro ao criar cama:", error);
            setMensagem("Erro ao criar cama.");
            setTipoMensagem("error");
        }
    };

    const handleEdit = (cama) => {
        setEditCamaId(cama.id);
        setEditFormData({ ...cama });
    };

    const handleUpdate = async () => {
        try {
            await AuthService.authenticatedRequest("put", "relatorios", `/camas/${editCamaId}/`, editFormData);
            setEditCamaId(null);
            fetchCamas();
            setMensagem("Cama atualizada com sucesso.");
            setTipoMensagem("success");
        } catch (error) {
            console.error("Erro ao atualizar cama:", error);
            setMensagem("Erro ao atualizar cama.");
            setTipoMensagem("error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await AuthService.authenticatedRequest("delete", "relatorios", `/camas/${id}/`);
            fetchCamas();
            setMensagem("Cama excluída com sucesso.");
            setTipoMensagem("success");
        } catch (error) {
            console.error("Erro ao excluir cama:", error);
            setMensagem("Erro ao excluir cama.");
            setTipoMensagem("error");
        }
    };

    const limparMensagem = () => {
        setMensagem(null);
    };

    const handleChangePage = (event, novaPagina) => {
        setPagina(novaPagina);
    };

    const handleChangeRowsPerPage = (event) => {
        setResultadosPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };

    return (
        <div className="p-4">
            <Notificacoes
                mensagem={mensagem}
                tipo={tipoMensagem}
                limparMensagem={limparMensagem}
            />
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-4">Adicionar Nova Cama</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                        label="Número"
                        name="numero"
                        value={novaCama.numero}
                        onChange={handleInputChange}
                        className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Tipo"
                        name="tipo"
                        value={novaCama.tipo}
                        onChange={handleInputChange}
                        className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Quarto ID"
                        name="quartoId"
                        type="number"
                        value={novaCama.quartoId || ""}
                        onChange={handleInputChange}
                        className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCriarCama}
                    className="mt-4"
                >
                    Adicionar Cama
                </Button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <Paper className="shadow-md rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quarto ID</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {camas
                                    .slice(pagina * resultadosPorPagina, pagina * resultadosPorPagina + resultadosPorPagina)
                                    .map((cama) => (
                                        <tr key={cama.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cama.numero}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cama.tipo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cama.quartoId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Tooltip title="Detalhes">
                                                    <IconButton component={Link} to={`/camas/${cama.id}`} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                                                        <Visibility className="text-blue-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton onClick={() => handleEdit(cama)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full ml-2">
                                                        <Edit className="text-yellow-500" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton onClick={() => handleDelete(cama.id)} className="hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full ml-2">
                                                        <Delete className="text-red-500" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={camas.length}
                                rowsPerPage={resultadosPorPagina}
                                page={pagina}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Camas por página:"
                                className="text-sm text-gray-700"
                            />
                        </div>
                    </Paper>
                </div>
            )}
            <Dialog open={!!editCamaId} onClose={() => setEditCamaId(null)}>
                <DialogTitle>Editar Cama</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Número"
                        name="numero"
                        value={editFormData.numero}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, numero: e.target.value })
                        }
                        className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Tipo"
                        name="tipo"
                        value={editFormData.tipo}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, tipo: e.target.value })
                        }
                        className="mb-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Quarto ID"
                        name="quartoId"
                        type="number"
                        value={editFormData.quartoId || ""}
                        onChange={(e) =>
                            setEditFormData({ ...editFormData, quartoId: e.target.value })
                        }
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditCamaId(null)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Atualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GerirCamas;