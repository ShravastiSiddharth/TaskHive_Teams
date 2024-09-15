import React, { useState } from 'react';
import styles from '../styles/TaskCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faExpand, faTrash, faCalendarDays, faRectangleXmark, faHourglassHalf, faFlag, faBookmark } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import axios from 'axios';
import { useAuth } from '../authentication/AuthContext';
import { Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2'
import DescriptionModal from './DescriptionModal';
import EditModal from './EditModal';

const TaskCard = ({ task, onTaskMoved, onTaskUpdated, index, fetchTasks }) => {
    const { user } = useAuth();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
    });

    const priorityClass = task.priority ? styles[task.priority.toLowerCase()] : '';
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    

    const handleDelete = async () => {

        try {
            await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            Swal.fire("Deleted!", "", "success");
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    if (typeof window !== 'undefined') {
        Modal.setAppElement('#root');
    }
    const truncateDescription = (text, wordLimit = 15) => {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...'; // Add ellipsis if truncated
        }
        return text;
    };


    function daysBetweenDates(date1, date2) {
      
        const startDate = new Date(date1);
        const endDate = new Date(date2);

        
        const differenceInTime = endDate.getTime() - startDate.getTime();

       
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

        return differenceInDays;
    }


    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    className={styles.taskCard}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >

                    <div className={styles.cardHeader}>
                        <p className={styles.title}>{task.title}</p>
                        {task.priority && (
                            <span className={`${styles.priority} ${priorityClass}`}>
                                {task.priority}
                            </span>
                        )}
                    </div>

                    <p className={styles.description}> {truncateDescription(task.description, 10)}</p>
                    {task.deadline && (
                        <div className={styles.deadline}>
                            <span className={styles.deadlineLabel}>

                                <FontAwesomeIcon icon={faCalendarDays} />
                            </span>
                            <span> {formatDate(task.deadline)}</span>
                        </div>
                    )}
                    <div className={styles.extraIcons}>
                        <div className={styles.left_side_icons}>
                            {user && (
                                <FontAwesomeIcon icon={faPenToSquare} onClick={() => setEditModalOpen(true)} style={{ cursor: 'pointer' }} />

                            )}
                            <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer' }} onClick={() => {
                                Swal.fire({
                                    title: "Are you sure you want to delete this?",
                                    showCancelButton: true,
                                    confirmButtonText: "Delete",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleDelete();

                                    } else if (result.isDenied) {
                                        Swal.fire("Changes are not saved", "", "info");
                                    }
                                });
                            }} />
                        </div>
                        {user && (<FontAwesomeIcon icon={faExpand} style={{ cursor: 'pointer' }} onClick={() => setViewModalOpen(true)} />)}

                    </div>


                   


            <DescriptionModal isViewModalOpen={isViewModalOpen} setViewModalOpen={setViewModalOpen} description={task.description} title={task.title} createDate={formatDate(task.createdAt)} deadlineDate={formatDate(task.deadline)} RemainingDays={daysBetweenDates(formatDate(task.createdAt), formatDate(task.deadline))} handleDelete={handleDelete} user={user} setEditModalOpen={setEditModalOpen}/>




                   <EditModal isEditModalOpen={isEditModalOpen} setEditModalOpen={setEditModalOpen}  editFormData={editFormData} handleEditChange={handleEditChange} fetchTasks={fetchTasks} onTaskUpdated={onTaskUpdated} taskId={task._id}/>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
