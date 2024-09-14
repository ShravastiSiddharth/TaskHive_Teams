import { useAuth } from '../authentication/AuthContext';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TaskBoard from '../components/TaskBoard';
import styles from '../styles/Dashboard.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
   
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
            fetchTasks();
        }
    }, [isAuthenticated, navigate]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleTaskMoved = async (task, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error moving task:', error);
        }
    };

    const handleTaskUpdated = () => {
        fetchTasks();
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.dashboard}>
            <div>
                <Sidebar />
            </div>
            <div className={styles.content}>
                <h1>Welcome!  </h1>
                <TaskBoard tasks={tasks} onTaskMoved={handleTaskMoved} onTaskUpdated={handleTaskUpdated} fetchTasks={fetchTasks} />
            </div>
        </div>
    );
};

export default Dashboard;
