import React from 'react';
import TaskCard from './TaskCard';
import styles from '../styles/TaskColumn.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { Droppable } from 'react-beautiful-dnd';

const TaskColumn = ({ title, status, tasks, fetchTasks, onTaskUpdated }) => {
    const titleClass = title ? styles[title.toLowerCase().replace(/\s+/g, '')] : '';

    return (
        <Droppable droppableId={status}>
            {(provided) => (
                <div
                    className={`${styles.taskColumn} ${titleClass}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <div className={styles.bardiv}>
                        <h3>{title}</h3>
                        <FontAwesomeIcon icon={faList} />
                    </div>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                index={index}
                                fetchTasks={fetchTasks}
                                onTaskUpdated={onTaskUpdated}
                            />
                        ))
                    ) : (
                        <p>No tasks yet</p>
                    )}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default TaskColumn;
