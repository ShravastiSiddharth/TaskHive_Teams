import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/NewTaskForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBars, faStar, faRectangleXmark, faListCheck, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Link,useNavigate } from 'react-router-dom';



const NewTaskForm = ({ onTaskAdded }) => {
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
            const response = await axios.post(
                'http://localhost:5000/api/tasks',
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
        <div className={styles.newTaskForm}>
            <div className={styles.crossForm}>
                <Link to="/dashboard" >
                    <FontAwesomeIcon icon={faRectangleXmark} style={{ fontSize: '1.5rem' }} />
                </Link>
            </div>
            <h2>Add New Task</h2>
            <form onSubmit={onSubmit}>
                <div className={styles.formGroup}>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.formGroup}>
                    <FontAwesomeIcon icon={faBars} />
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        className={styles.textArea}
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <FontAwesomeIcon icon={faListCheck} />
                    <label htmlFor="status">Status</label>
                    <select name="status" value={status} onChange={onChange} className={styles.selectField}>
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Completed">Finished</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <FontAwesomeIcon icon={faStar} />
                    <label htmlFor="priority">Priority</label>
                    <select name="priority" value={priority} onChange={onChange} className={styles.selectField}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <label htmlFor="deadline">Deadline</label>
                    <input
                        type="date"
                        name="deadline"
                        value={deadline}
                        onChange={onChange}
                        className={styles.inputField}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Add Task</button>
            </form>
        </div>
    );
};

export default NewTaskForm;
