import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserState, Vehicle } from '../../../hooks/users/userSlice'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Typography,
    Button,
    TextField,
    IconButton,
} from '@mui/material'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserService } from '../../../api/UserService';
import { LoadingButton } from '@mui/lab';
import { Edit } from '@mui/icons-material';

interface VehicleModalProps {
    vehicle: Vehicle;
    open: boolean;
    reload: boolean;
    setReload: Dispatch<SetStateAction<boolean>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, open, reload, setReload, setOpen }) => {
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const user = useSelector((state: { user: UserState }) => state.user);

    const [formData, setFormData] = useState<Vehicle>({
        _id: '',
        plate: '',
        model: '',
        color: '',
        year: ''
    })

    useEffect(() => {
        if (vehicle._id === '') {
            setIsCreating(true);
            setFormData({
                _id: '',
                plate: '',
                model: '',
                color: '',
                year: ''
            });
        } else {
            setIsCreating(false);
            setEditMode(false);
            setFormData(vehicle);
        }
    }, [vehicle]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const { plate, model, color, year } = formData
        if (!plate || !model || !color || !year) {
            toast.error('Todos los campos son requeridos')
            return
        }

        setIsLoading(true)
        if (isCreating) {
            const newVehicle = {
                plate,
                model,
                color,
                year
            }
            try {
                await axios.post(`${UserService.baseUrl}${UserService.endpoints.addUserVehicle}/${user._id}`, newVehicle)
                toast.success('Vehículo creado con éxito')
                setReload(!reload)
                setOpen(false)
            } catch (error) {
                toast.error('No se pudo crear el vehículo')
            }
        } else {
            const updateVehicle = {
                ...formData,
                _id: vehicle._id
            };
            try {
                await axios.put(`${UserService.baseUrl}${UserService.endpoints.updateUserVehicle}/${user._id}`, updateVehicle)
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
                <DialogTitle>Agregar vehículo</DialogTitle>
            ) : (
                <DialogTitle>
                    {vehicle.model}
                    <IconButton onClick={() => setEditMode(true)} sx={{ ml: 1 }}>
                        {editMode ? <Edit color='disabled' /> : <Edit color='primary' />}
                    </IconButton>
                </DialogTitle>
            )}
            <DialogContent>
                {isCreating ? (
                    <Typography variant="body2" mb={1}>Todos los campos son requeridos</Typography>
                ) : (
                    <Typography variant="body2" mb={1}>Aquí puedes ver y editar la información de tu vehículo tocando el ícono de edición</Typography>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label='Placa'
                        name='plate'
                        value={formData.plate}
                        onChange={handleChange}
                        variant='outlined'
                        margin='normal'
                        disabled={!editMode}
                        required
                        slotProps={{ htmlInput: { maxLength: 15 } }}
                    />
                    <TextField
                        fullWidth
                        label='Modelo'
                        name='model'
                        value={formData.model}
                        onChange={handleChange}
                        variant='outlined'
                        margin='normal'
                        disabled={!editMode}
                        placeholder='Chevrolet, Ford, etc.'
                        required
                        slotProps={{ htmlInput: { maxLength: 20 } }}
                    />
                    <TextField
                        fullWidth
                        label='Color'
                        name='color'
                        value={formData.color}
                        onChange={handleChange}
                        variant='outlined'
                        margin='normal'
                        disabled={!editMode}
                        placeholder='Rojo, Azul, etc.'
                        required
                        slotProps={{ htmlInput: { maxLength: 20 } }}
                    />
                    <TextField
                        fullWidth
                        label='Año'
                        name='year'
                        value={formData.year}
                        onChange={handleChange}
                        variant='outlined'
                        margin='normal'
                        disabled={!editMode}
                        placeholder='2021, 2022, etc.'
                        required
                        slotProps={{ htmlInput: { maxLength: 6 } }}
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

export default VehicleModal