import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toastify = () => {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={4500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            stacked
            closeButton={true}
            limit={5}
            transition={Zoom}
        />
    )
}

export default Toastify