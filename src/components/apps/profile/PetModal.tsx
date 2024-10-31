import { Dispatch, SetStateAction } from 'react';
import { Pet } from '../../../hooks/users/userSlice'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Typography,
    Button,
} from '@mui/material'

interface PetModalProps {
    pet?: Pet;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const PetModal: React.FC<PetModalProps> = ({ pet, open, setOpen }) => {

    if (!pet) return null

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{pet.name}</DialogTitle>
            <DialogContent>
                <Typography variant="h6">Type: {pet.type}</Typography>
                <Typography variant="h6">Breed: {pet.breed}</Typography>
                <Typography variant="h6">Color: {pet.color}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PetModal