import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Routes from "./Routes";

function App() {
	return (
		<>
			<Routes />
				<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
				/>
		</>
	)
}

export default App
