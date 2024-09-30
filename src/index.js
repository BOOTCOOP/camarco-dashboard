import { store } from 'Redux/app/store'
import 'antd/dist/antd.css' // or 'antd/dist/antd.less'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './assets/styles/main.css'
import './assets/styles/responsive.css'
// import { AntUpload } from "./Practics";

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
        {/* <AntUpload /> */}
      </Provider>
    </HashRouter>
  </React.StrictMode>
)
