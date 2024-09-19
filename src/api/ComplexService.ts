export const ComplexService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_COMPLEX,
    endpoints: {
        ComplexColors: '/getComplexColors',
        DeleteComplex: '/deleteComplex',
        GetComplex: '/getComplex',
        AddComplex: '/addComplex',
        UpdateComplexColors: '/updateComplexColors',    
    },
};