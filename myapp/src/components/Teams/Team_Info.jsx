import React from 'react'
import styles from '../../styles/Teams_Dashboard.module.css'
import Team_Members from './Team_Members'
import Send_Invitation from './Send_Invitation'

const Team_Info = ({myTeamInfo}) => {
  return (
   <>
   <h1>{myTeamInfo.title}</h1>
     <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.card}><Team_Members teamId={myTeamInfo.id}/></div>
                        <div className={styles.card}>Card 2</div>
                        <div className={styles.card}><Send_Invitation teamId={myTeamInfo.id}/></div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.fullWidthCard}>Card 4</div>
                    </div>
                </div>
   </>
  )
}

export default Team_Info