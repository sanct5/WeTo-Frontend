import { useSelector } from 'react-redux';
import { PqrsAnswer } from '../models';
import { Box, Paper, Typography } from '@mui/material';
import { UserState } from '../../../hooks/users/userSlice';
import { format } from '@formkit/tempo';

interface ViewOneCaseProps {
    answers: PqrsAnswer[];
    description: string;
}

export const ViewOneCase = ({ answers, description }: ViewOneCaseProps) => {
    const user = useSelector((state: { user: UserState }) => state.user);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper
                sx={{
                    backgroundColor: 'secondary.light',
                    marginBottom: 2,
                    marginTop: 2,
                    textAlign: 'center',
                    width: 'fit-content',
                    alignSelf: 'center',
                    padding: 1,
                }}
            >
                <Typography variant='body2'>
                    {description}
                </Typography>
            </Paper>
            {answers.map((answer) => (
                <Box
                    key={answer._id}
                    sx={{
                        display: 'flex',
                        justifyContent: (answer?.admin && user.role === 'ADMIN') || (answer?.resident && user.role === 'RESIDENT') ? 'flex-end' : 'flex-start',
                    }}
                >
                    <Paper
                        sx={{
                            padding: 2,
                            backgroundColor: (answer?.admin && user.role === 'ADMIN') || (answer?.resident && user.role === 'RESIDENT') ? 'primary.light' : 'grey.300',
                            maxWidth: '70%',
                            marginBottom: 2,
                        }}
                    >
                        <Typography>{answer.comment}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {format(answer.date, { date: "short", time: "short" })}
                        </Typography>
                    </Paper>
                </Box>
            ))}
        </Box>
    );
};