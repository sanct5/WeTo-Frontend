import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppTheme } from './theme/appTheme.tsx'
import { RouterProvider } from "react-router-dom"
import router from "./router/AppRouter";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Toastify from './services/Toastify.tsx'
import { Provider } from 'react-redux'
import store from './hooks/store.ts'

import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppTheme>
        <Toastify />
        <RouterProvider router={router} />
      </AppTheme>
    </Provider>
  </React.StrictMode>,
)