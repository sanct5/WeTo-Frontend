export const pqrsService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_PQRS,
    endpoints: {
        addPqrs: '/addPqrs',
        getPqrsByComplex: '/getPqrsByComplex',
    },
};