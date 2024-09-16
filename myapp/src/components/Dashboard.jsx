import { useAuth } from '../authentication/AuthContext';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TaskBoard from '../components/TaskBoard';
import NewTaskForm from './NewTaskForm';
import styles from '../styles/Dashboard.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';

const Dashboard = () => {
   
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        } else {
            fetchTasks();
        }
    }, [isAuthenticated, navigate]);

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleTaskAdded = (newTask) => {
        fetchTasks(); 
        setIsModalOpen(false); 
    };

    const handleTaskMoved = async (task, newStatus) => {
        try {
            await axiosInstance.put(`/tasks/${task._id}`, { status: newStatus }, {
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
                <Sidebar setIsModalOpen={setIsModalOpen}/>
            </div>
            <div className={styles.content}>
                <h1>Welcome!  </h1>
                <TaskBoard tasks={tasks} onTaskMoved={handleTaskMoved} onTaskUpdated={handleTaskUpdated} fetchTasks={fetchTasks} />
            </div>
            <NewTaskForm isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onTaskAdded={handleTaskAdded} />
        </div>
    );
};

export default Dashboard;
