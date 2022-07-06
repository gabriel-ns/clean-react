import { Icon, IconName } from '@/presentation/components'
import React from 'react'
import Styles from './survey-item.scss'

const SurveyItem: React.FC = () => {
  return (
    <li className={Styles.surveyItemWrap}>
    <div className={Styles.surveyContent}>
      <Icon iconName={IconName.thumbDown} className={Styles.iconWrap}/>
      <time>
        <span className={Styles.day}>22</span>
        <span className={Styles.month}>12</span>
        <span className={Styles.year}>2022</span>
      </time>
      <p>
        Lorem ipsum dolor sit amet?
      </p>
    </div>
    <footer>Ver resultado</footer>
  </li>
  )
}

export default SurveyItem
