import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/NewTaskForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBars, faStar, faRectangleXmark, faListCheck, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axiosInstance from '../config/axiosInstance';


const NewTaskForm = ({ onTaskAdded, isOpen, onRequestClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'To-Do',
        priority: 'Low',
        deadline: '',
    });

    const { title, description, status, priority, deadline } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.post(
                '/tasks',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onTaskAdded(response.data);
            toast.success('Task Added successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Task Modal"
            className={styles.taskFormModal}
            overlayClassName={styles.modalOverlay}
            ariaHideApp={false}
        >
            <div className={styles.newTaskForm}>
                <div className={styles.crossForm}>
                    <FontAwesomeIcon icon={faRectangleXmark} onClick={onRequestClose} />
                </div>
                <h2>Add New Task</h2>
                <form onSubmit={onSubmit}>
                
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <label htmlFor="title">Title</label>
                    </div>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                        className={styles.inputField}
                    />

                   
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={faBars} />
                        <label htmlFor="description">Description</label>
                    </div>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        className={styles.textArea}
                    />


                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                        <label htmlFor="deadline">Deadline</label>
                    </div>
                    <input
                        type="date"
                        name="deadline"
                        value={deadline}
                        onChange={onChange}
                        className={styles.inputField}
                    />

                    
                    <div className={styles.formGroupMulti}>
                        <div className={styles.statusGroup}>
                            <div className={styles.formGroup}>
                            <FontAwesomeIcon icon={faListCheck} />
                            <label htmlFor="status">Status</label>
                            </div>
                            <select
                                name="status"
                                value={status}
                                onChange={onChange}
                                className={styles.selectField}
                            >
                                <option value="To-Do">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Completed">Finished</option>
                            </select>
                        </div>

                        <div className={styles.priorityGroup}>
                            <div className={styles.formGroup}>
                                <FontAwesomeIcon icon={faStar} />
                                <label htmlFor="priority">Priority</label></div>
                            <select
                                name="priority"
                                value={priority}
                                onChange={onChange}
                                className={styles.selectField}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>Add Task</button>
                </form>
            </div>
        </Modal>
    );
};

export default NewTaskForm;

