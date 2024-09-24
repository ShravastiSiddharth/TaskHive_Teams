import './App.css';
import Login from './components/Login';
import { AuthProvider } from './authentication/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/Signup';
import PrivateRoute from './authentication/PrivateRoute';
import Dashboard from './components/Dashboard';
import NewTaskForm from './components/NewTaskForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Teams_Dashboard from './components/Teams/Teams_Dashboard';

function App() {
  const handleTaskAdded = (task) => {
    console.log('New task added:', task);
};
  return (
    <>
      <Router>

        <AuthProvider>

          <Routes>

            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<SignUp/>} />

            <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>}/>
            <Route path="/add-task" element={<PrivateRoute> <NewTaskForm  onTaskAdded={handleTaskAdded}/> </PrivateRoute>} />
            <Route path='/teams' element={<PrivateRoute> <Teams_Dashboard/> </PrivateRoute>}/>
          </Routes>
          <ToastContainer/>
        </AuthProvider>

      </Router>
    </>
  );
}

export default App;
