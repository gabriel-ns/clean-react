import { Footer, Header, Icon, IconName } from '@/presentation/components'
import React from 'react'
import Styles from './survey-list-styles.scss'

const SurveyItem: React.FC = () => {
  return (
    <>
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
  </>
  )
}

const SurveyList: React.FC = () => {
  return (
  <div className={ Styles.surveyListWrap }>
    <Header />

    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <ul>
        <li><SurveyItem /></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>

    <Footer />
  </div>
  )
}

export default SurveyList