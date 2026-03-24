import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { ubeTheme } from './theme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={ubeTheme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
)
