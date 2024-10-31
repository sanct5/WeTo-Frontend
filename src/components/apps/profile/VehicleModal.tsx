import { Dispatch, SetStateAction } from 'react';
import { Vehicle } from '../../../hooks/users/userSlice'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Typography,
    Button,
} from '@mui/material'

interface VehicleModalProps {
    vehicle?: Vehicle;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, open, setOpen }) => {

    if (!vehicle) return null

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{vehicle.plate}</DialogTitle>
            <DialogContent>
                <Typography variant="h6">Model: {vehicle.model}</Typography>
                <Typography variant="h6">Color: {vehicle.color}</Typography>
                <Typography variant="h6">Year: {vehicle.year}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default VehicleModal