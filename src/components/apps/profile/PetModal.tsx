import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Pet, UserState } from '../../../hooks/users/userSlice'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Typography,
} from '@mui/material'
import axios from 'axios';
import { UserService } from '../../../api/UserService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Edit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

interface PetModalProps {
    pet: Pet;
    open: boolean;
    reload: boolean;
    setReload: Dispatch<SetStateAction<boolean>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const PetModal: React.FC<PetModalProps> = ({ pet, open, reload, setReload, setOpen }) => {
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const user = useSelector((state: { user: UserState }) => state.user);

    const [formData, setFormData] = useState<Pet>({
        _id: '',
        name: '',
        type: '',
        breed: '',
        color: ''
    })

    useEffect(() => {
        if (pet._id === '') {
            setIsCreating(true);
            setFormData({
                _id: '',
                name: '',
                type: '',
                breed: '',
                color: ''
            });
        } else {
            setIsCreating(false);
            setEditMode(false);
            setFormData(pet);
        }
    }, [pet]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const { name, type, breed, color } = formData
        if (!name || !type || !breed || !color) {
            toast.error('Todos los campos son requeridos')
            return
        }

        setIsLoading(true)
        if (isCreating) {
            const newPet = {
                name,
                type,
                breed,
                color
            }
            try {
                await axios.post(`${UserService.baseUrl}${UserService.endpoints.addUserPet}/${user._id}`, newPet)
                toast.success('Mascota agregada con éxito')
                setReload(!reload)
                setOpen(false)
            } catch (error) {
                toast.error('No se pudo crear la mascota')
            }
        } else {
            const updatePet = {
                ...formData,
                _id: pet._id
            };
            try {
                await axios.put(`${UserService.baseUrl}${UserService.endpoints.updateUserPet}/${user._id}`, updatePet)
                toast.success('Mascota actualizada con éxito')
                setReload(!reload)
                setOpen(false)
            } catch (error) {
                toast.error('No se pudo actualizar la mascota')
            }
        }
        setIsLoading(false)
    }

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setIsCreating(false);
    };

    return (
        <Dialog open={open} onClose={() => handleClose()}>
            {isCreating ? (
                <DialogTitle>Agregar mascota</DialogTitle>
            ) : (
                <DialogTitle>
                    {pet.name}
                    <IconButton onClick={() => setEditMode(true)} sx={{ ml: 1 }}>
                        {editMode ? <Edit color='disabled' /> : <Edit color='primary' />}
                    </IconButton>
                </DialogTitle>
            )}
            <DialogContent>
                {isCreating ? (
                    <Typography variant="body2" mb={1}>Todos los campos son requeridos</Typography>
                ) : (
                    <Typography variant="body2" mb={1}>Aquí puedes ver y editar la información de tu mascota tocando el ícono de edición</Typography>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        disabled={!editMode}
                        required
                        slotProps={{ htmlInput: { maxLength: 25 } }}
                    />
                    <TextField
                        margin="normal"
                        label="Tipo"
                        placeholder='Perro, Gato, etc.'
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                        disabled={!editMode}
                        required
                        slotProps={{ htmlInput: { maxLength: 20 } }}
                    />
                    <TextField
                        margin="normal"
                        label="Raza"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        fullWidth
                        disabled={!editMode}
                        required
                        slotProps={{ htmlInput: { maxLength: 20 } }}
                    />
                    <TextField
                        margin="normal"
                        label="Color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        fullWidth
                        disabled={!editMode}
                        required
                        slotProps={{ htmlInput: { maxLength: 15 } }}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button color='secondary' onClick={() => handleClose()}>Cancelar</Button>
                {editMode && (
                    <LoadingButton
                        color='primary'
                        onClick={handleSubmit}
                        loading={isLoading}
                        variant="contained"
                        disabled={isLoading}
                    >
                        Guardar
                    </LoadingButton>
                )}
            </DialogActions>
        </Dialog>
    )
}
export default PetModal