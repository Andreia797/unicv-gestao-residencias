import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Stack,
    Alert,
    Tooltip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AuthService from '../../services/AuthService'; // Importe o AuthService

function Quartos() {
    const [quartos, setQuartos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [quartoEdit, setQuartoEdit] = useState({
        id: null,
        numero: '',
        tipo: '',
        edificio: null, // Alterado para objeto
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchQuartos = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', '/quartos/');
                setQuartos(response.data);
            } catch (err) {
                console.error('Erro ao buscar quartos:', err);
                setError('Erro ao buscar quartos.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuartos();
    }, [success]); // Refetch após sucesso

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este quarto?')) {
            try {
                await AuthService.authenticatedRequest('delete', 'relatorios', `/quartos/${id}/`);
                setSuccess('Quarto excluído com sucesso.');
                setError(null);
            } catch (err) {
                console.error('Erro ao excluir quarto:', err);
                setError('Erro ao excluir quarto.');
                setSuccess(null);
            }
        }
    };

    const handleEdit = (quarto) => {
        setIsEdit(true);
        setQuartoEdit({
            id: quarto.id,
            numero: quarto.numero,
            tipo: quarto.tipo,
            edificio: quarto.edificio, // Mantém o objeto edificio
        });
        setOpenDialog(true);
    };

    const handleAdd = () => {
        setIsEdit(false);
        setQuartoEdit({ id: null, numero: '', tipo: '', edificio: null });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setQuartoEdit({ id: null, numero: '', tipo: '', edificio: null });
        setError(null);
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'edificioId') {
            setQuartoEdit({ ...quartoEdit, edificio: { id: e.target.value ? parseInt(e.target.value) : null } });
        } else {
            setQuartoEdit({ ...quartoEdit, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                numero: quartoEdit.numero,
                tipo: quartoEdit.tipo,
                edificio: quartoEdit.edificio?.id ? { id: quartoEdit.edificio.id } : null,
            };
            if (isEdit) {
                await AuthService.authenticatedRequest('put', 'relatorios', `/quartos/${quartoEdit.id}/`, payload);
                setSuccess('Quarto atualizado com sucesso.');
                setError(null);
            } else {
                await AuthService.authenticatedRequest('post', 'relatorios', '/quartos/', payload);
                setSuccess('Quarto adicionado com sucesso.');
                setError(null);
            }
            setOpenDialog(false);
            setQuartoEdit({ id: null, numero: '', tipo: '', edificio: null });
        } catch (err) {
            console.error('Erro ao salvar quarto:', err);
            setError(isEdit ? 'Erro ao atualizar quarto.' : 'Erro ao adicionar quarto.');
            setSuccess(null);
        }
    };

    return (
        <div className="p-4">
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lista de Quartos</h2>
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
                    Adicionar Quarto
                </Button>
            </div>
            {loading ? (
                <p>Carregando quartos...</p>
            ) : (
                <TableContainer component={Paper} className="shadow-md rounded-lg">
                    <Table>
                        <TableHead className="bg-gray-100">
                            <TableRow>
                                <TableCell className="font-semibold">Número</TableCell>
                                <TableCell className="font-semibold">Tipo</TableCell>
                                <TableCell className="font-semibold">Edifício</TableCell>
                                <TableCell className="font-semibold">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quartos.map((quarto) => (
                                <TableRow key={quarto.id}>
                                    <TableCell>{quarto.numero}</TableCell>
                                    <TableCell>{quarto.tipo}</TableCell>
                                    <TableCell>{quarto.edificio?.nome} ({quarto.edificio?.id})</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Editar">
                                                <IconButton onClick={() => handleEdit(quarto)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton onClick={() => handleDelete(quarto.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Detalhes">
                                                <Button component={Link} to={`/quartos/${quarto.id}`} variant="outlined" size="small">
                                                    Detalhes
                                                </Button>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEdit ? 'Editar Quarto' : 'Adicionar Quarto'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={2}>
                        <TextField label="Número" name="numero" value={quartoEdit.numero} onChange={handleInputChange} fullWidth variant="outlined" size="small" />
                        <TextField label="Tipo" name="tipo" value={quartoEdit.tipo} onChange={handleInputChange} fullWidth variant="outlined" size="small" />
                        <TextField
                            label="Edifício ID"
                            name="edificioId"
                            value={quartoEdit.edificio?.id || ''}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {isEdit ? 'Salvar Edições' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Quartos;