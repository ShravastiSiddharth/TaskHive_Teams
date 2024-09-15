import React from 'react';
import TaskColumn from './TaskColumn';
import styles from '../styles/TaskBoard.module.css';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';

const TaskBoard = ({ tasks = [], onTaskMoved, onTaskUpdated, fetchTasks }) => {

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const task = tasks.find(task => task._id === draggableId);
        if (!task) return;

        try {
            await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, {
                status: destination.droppableId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const columns = [
        { title: 'To-Do', status: 'To-Do' },
        { title: 'In Progress', status: 'In Progress' },
        { title: 'Under Review', status: 'Under Review' },
        { title: 'Finished', status: 'Completed' },
    ];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.taskBoard}>
                {columns.map(column => (
                    <TaskColumn
                        key={column.status}
                        title={column.title}
                        status={column.status}  // Ensure this matches droppableId
                        tasks={tasks.filter(task => task.status === column.status)}
                        fetchTasks={fetchTasks}
                        onTaskUpdated={onTaskUpdated}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};



export default TaskBoard;
