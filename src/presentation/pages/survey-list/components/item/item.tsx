import { SurveyModel } from '@/domain/models'
import { Icon, IconName } from '@/presentation/components'
import React from 'react'
import Styles from './item.scss'

type Props = {
  survey: SurveyModel
}

const SurveyItem: React.FC<Props> = ({ survey }) => {
  return (
  <li className={Styles.surveyItemWrap}>
    <div className={Styles.surveyContent}>
      <Icon iconName={survey.didAnswer ? IconName.thumbUp : IconName.thumbDown} className={Styles.iconWrap}/>
      <time>
        <span data-testid="day" className={Styles.day}>
          { survey.date.getDate().toString().padStart(2, '0') }
        </span>
        <span data-testid="month" className={Styles.month}>
          {survey.date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.','')}
        </span>
        <span data-testid="year" className={Styles.year}>{survey.date.getFullYear()}</span>
      </time>
      <p data-testid="question">
        { survey.question }
      </p>
    </div>
    <footer>Ver resultado</footer>
  </li>
  )
}

export default SurveyItem
