export const ComplexService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_COMPLEX,
    endpoints: {
        ComplexColors: '/getColors',
        DeleteComplex: '/delete',
        GetComplex: '/get',
        AddComplex: '/add',
        UpdateComplexColors: '/updateColors',    
    },
};