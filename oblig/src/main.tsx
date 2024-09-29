import ReactDOM from 'react-dom/client'
import App from './App'

const rootContainer = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootContainer).render(<App />)
//Orginalkode funket ikke, nå har jeg rootContainer som alltid vil returnere elementet med id 'root'