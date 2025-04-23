import { Provider } from './components/ui/provider'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketCotext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Provider>
          <SocketContextProvider>
            <App /> 
          </SocketContextProvider>
        </Provider>
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>
)
