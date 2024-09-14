import React, { useState } from 'react';
import styles from '../styles/TaskCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faExpand, faTrash, faCalendarDays, faRectangleXmark, faHourglassHalf, faFlag,faBookmark } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import axios from 'axios';
import { useAuth } from '../authentication/AuthContext';
import { Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2'

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

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/tasks/${task._id}`, editFormData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setEditModalOpen(false);
            onTaskUpdated();
            fetchTasks(); 
        } catch (error) {
            console.error('Error updating task:', error);
        }
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
        // Convert the dates to Date objects if they are not already
        const startDate = new Date(date1);
        const endDate = new Date(date2);

        // Calculate the difference in milliseconds
        const differenceInTime = endDate.getTime() - startDate.getTime();

        // Convert milliseconds to days
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


                    <Modal style={{border:'1px solid red'}} isOpen={isViewModalOpen} onRequestClose={() => setViewModalOpen(false)} className={styles.viewModal}>
                        <div className={styles.viewCrossDiv}>
                            <FontAwesomeIcon icon={faRectangleXmark} onClick={() => setViewModalOpen(false)} />

                        </div>

                        <div >
                            <div className={styles.viewTitleDiv}>
                                {/* <span>Title: </span> */}
                                <span>{task.title}</span>
                            </div>
                            <div className={styles.viewDecDiv}>
                                {/* <span>Description: </span> */}
                                <span>{task.description}</span>

                            </div>
                            <div className={styles.viewTimeDiv}>

                                <div className={styles.viewCrtDiv}>
                                    <span style={{ color: 'blue',marginRight:'0.5rem' }}><FontAwesomeIcon icon={faBookmark} /></span>
                                    <span> {formatDate(task.createdAt)} </span>
                                    
                                </div>

                                <div className={styles.viewDeadinfo} >
                                    <span style={{    color: '#2dcc2d',marginRight:'0.5rem'}}> <FontAwesomeIcon icon={faFlag} /> </span>
                                    
                                    <span>{formatDate(task.deadline)}</span>
                                </div>

                                <div className={styles.viewDeadinfo}>
                                    <span style={{ color: '#ff7153',marginRight:'0.5rem'}}>
                                    <FontAwesomeIcon icon={faHourglassHalf} />
                                        </span>

                                    <span >Only {daysBetweenDates(formatDate(task.createdAt), formatDate(task.deadline))} Days Left</span>
                                </div>
                               
                            </div>

                        </div>

                        <div className={styles.viewExtraIcons}>
                            {user && (
                                
                                <button className={`${styles.viewbtndiv} ${styles.viewEdit}`} onClick={() => setEditModalOpen(true)}><FontAwesomeIcon icon={faPenToSquare}  style={{ marginRight:'0.5rem' }} />Edit </button>

                            )}

                            <button className={`${styles.viewbtndiv} ${styles.viewDelete}` } onClick={() => {
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
                            }}>
                            <FontAwesomeIcon icon={faTrash} style={{ marginRight:'0.5rem' }} />Delete</button>
                        </div>

                    </Modal>


                    <Modal
                        isOpen={isEditModalOpen}
                        onRequestClose={() => setEditModalOpen(false)}
                        className={styles.editModal}
                    >
                        <h2>Edit Your Task</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditChange}
                                    className={styles.inputField}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    className={styles.textArea}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="priority">Priority</label>
                                <select
                                    name="priority"
                                    value={editFormData.priority}
                                    onChange={handleEditChange}
                                    className={styles.selectField}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="deadline">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={editFormData.deadline ? new Date(editFormData.deadline).toISOString().substr(0, 10) : ''}
                                    onChange={handleEditChange}
                                    className={styles.inputField}
                                />
                            </div>
                            <div className={styles.editdiv}>
                                <button type="submit" className={styles.editbtn}>Save</button>
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className={styles.editbtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </Modal>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
