import React, {useState} from 'react';
import { useAuth } from '../authentication/AuthContext';
import styles from '../styles/Sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faHouse, faChessBoard, faGear, faUserPlus, faChartSimple, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';

const Sidebar = ({ setIsModalOpen }) => {
    const { user, logout } = useAuth();
    const [isDropDown, setIsDropDown] = useState(false);
    const [userTeams, setUserTeams] = useState([]);

    const toggleDropdown = () => {
        setIsDropDown(!isDropDown);
    };

    useState( async ()=>{
            const token = localStorage.getItem('token');
            const response = await axiosInstance.get('/team/get-all-teams',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            setUserTeams(response.data);
            console.log("Data Teams",response.data);
    },[])

    return (
        <div className={styles.sidebar}>
            <div className={styles.userInfoCont}>
                <div className={styles.userInfo}>
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: '2rem', }} />
                    <h2>{user?.name}</h2>



                </div>
            </div>
            <nav className={styles.sidenav}>
                <ul>
                    <li> <FontAwesomeIcon icon={faHouse} style={{ color: "#7d7d7d", }} />
                        <Link to="/dashboard" >

                            <p> Home</p>
                        </Link>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faChessBoard} style={{ color: "#7d7d7d", }} />
                        <Link to="#"  >
                            <p>  Boards</p>
                        </Link>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faGear} style={{ color: "#7d7d7d", }} />
                        <Link to="#"  >
                            <p>Settings</p>
                        </Link>
                    </li>
                    <li onClick={toggleDropdown} className={styles.dropdown}>
                        <FontAwesomeIcon icon={faUserPlus} style={{ color: "#7d7d7d" }} />
                        <Link to="#" onClick={(e) => e.preventDefault()}>
                            <p>Teams</p>
                        </Link>
                        {isDropDown && (
                            <ul className={styles.dropdownMenu}>
                                <li>
                                    <Link to="/teams" state={{myComponent:'create_team'}}>Create Team</Link>
                                </li>
                               {userTeams.length===0 ? (
                                <li>No Teams Yet</li>
                               ) :
                               (
                                userTeams.map(team=>(
                                        <li key={team.id}> <Link state={{myComponent:'dashboard'}}>{team.title}</Link> </li>
                                ))
                               )
                            }
                            </ul>
                        )}
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faChartSimple} style={{ color: "#7d7d7d", }} />
                        <Link to="#"  >
                            <p>Analytics</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            <button className={styles.createTask} onClick={() => setIsModalOpen(true)}>


                Create task
            </button>


            <button onClick={logout} className={styles.logoutbtn}><FontAwesomeIcon icon={faRightFromBracket} />Logout</button>

        </div>
    );
};

export default Sidebar;
