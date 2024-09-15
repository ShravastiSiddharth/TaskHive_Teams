import React from 'react'
import Modal from 'react-modal';
import styles from '../styles/TaskCard.module.css';
import axios from 'axios';

const EditModal = ({isEditModalOpen, setEditModalOpen, editFormData, handleEditChange, fetchTasks, onTaskUpdated, taskId}) => {
  
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/tasks/${taskId}`, editFormData, {
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
  
    return (
    <>
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
    
    </>
  )
}

export default EditModal