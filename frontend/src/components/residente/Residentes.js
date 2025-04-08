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

function Residentes() {
    const [residentes, setResidentes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [residenteEdit, setResidenteEdit] = useState({
        id: null,
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchResidentes = async () => {
            setLoading(true);
            try {
                const response = await AuthService.authenticatedRequest('get', 'relatorios', '/residentes/');
                setResidentes(response.data);
            } catch (err) {
                console.error('Erro ao buscar residentes:', err);
                setError('Erro ao buscar residentes.');
            } finally {
                setLoading(false);
            }
        };
        fetchResidentes();
    }, [success]); // Refetch após sucesso

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este residente?')) {
            try {
                await AuthService.authenticatedRequest('delete', 'relatorios', `/residentes/${id}/`);
                setSuccess('Residente excluído com sucesso.');
                setError(null);
            } catch (err) {
                console.error('Erro ao excluir residente:', err);
                setError('Erro ao excluir residente.');
                setSuccess(null);
            }
        }
    };

    const handleEdit = (residente) => {
        setIsEdit(true);
        setResidenteEdit({ id: residente.id, nome: residente.nome, email: residente.email, telefone: residente.telefone, endereco: residente.endereco });
        setOpenDialog(true);
    };

    const handleAdd = () => {
        setIsEdit(false);
        setResidenteEdit({ id: null, nome: '', email: '', telefone: '', endereco: '' });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setResidenteEdit({ id: null, nome: '', email: '', telefone: '', endereco: '' });
        setError(null);
    };

    const handleInputChange = (e) => {
        setResidenteEdit({ ...residenteEdit, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                await AuthService.authenticatedRequest('put', 'relatorios', `/residentes/${residenteEdit.id}/`, residenteEdit);
                setSuccess('Residente atualizado com sucesso.');
                setError(null);
            } else {
                await AuthService.authenticatedRequest('post', 'relatorios', '/residentes/', residenteEdit);
                setSuccess('Residente adicionado com sucesso.');
                setError(null);
            }
            setOpenDialog(false);
            setResidenteEdit({ id: null, nome: '', email: '', telefone: '', endereco: '' });
        } catch (err) {
            console.error('Erro ao salvar residente:', err);
            setError(isEdit ? 'Erro ao atualizar residente.' : 'Erro ao adicionar residente.');
            setSuccess(null);
        }
    };

    return (
        <div className="p-4">
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lista de Residentes</h2>
                <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
                    Adicionar Residente
                </Button>
            </div>
            {loading ? (
                <p>Carregando residentes...</p>
            ) : (
                <TableContainer component={Paper} className="shadow-md rounded-lg">
                    <Table>
                        <TableHead className="bg-gray-100">
                            <TableRow>
                                <TableCell className="font-semibold">Nome</TableCell>
                                <TableCell className="font-semibold">Email</TableCell>
                                <TableCell className="font-semibold">Telefone</TableCell>
                                <TableCell className="font-semibold">Endereço</TableCell>
                                <TableCell className="font-semibold">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {residentes.map((residente) => (
                                <TableRow key={residente.id}>
                                    <TableCell>{residente.nome}</TableCell>
                                    <TableCell>{residente.email}</TableCell>
                                    <TableCell>{residente.telefone}</TableCell>
                                    <TableCell>{residente.endereco}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Editar">
                                                <IconButton onClick={() => handleEdit(residente)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton onClick={() => handleDelete(residente.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Detalhes">
                                                <Button component={Link} to={`/residentes/${residente.id}`} variant="outlined" size="small">
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
                <DialogTitle>{isEdit ? 'Editar Residente' : 'Adicionar Residente'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={2}>
                        <TextField label="Nome" name="nome" value={residenteEdit.nome} onChange={handleInputChange} fullWidth variant="outlined" size="small" />
                        <TextField label="Email" name="email" value={residenteEdit.email} onChange={handleInputChange} fullWidth variant="outlined" size="small" />
                        <TextField label="Telefone" name="telefone" value={residenteEdit.telefone} onChange={handleInputChange} fullWidth variant="outlined" size="small" />
                        <TextField label="Endereço" name="endereco" value={residenteEdit.endereco} onChange={handleInputChange} fullWidth multiline rows={2} variant="outlined" size="small" />
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

export default Residentes;