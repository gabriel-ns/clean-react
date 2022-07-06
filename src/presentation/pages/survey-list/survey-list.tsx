import Styles from './survey-list-styles.scss'
import { Footer, Header } from '@/presentation/components'
import { LoadSurveyList } from '@/domain/usecases/survey/load-survey-list'
import { SurveyItemEmpty } from './components'
import React, { useEffect } from 'react'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  useEffect(() => {
    void loadSurveyList.loadAll()
  }, [])
  return (
  <div className={ Styles.surveyListWrap }>
    <Header />

    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <ul data-testid="survey-list">
        <SurveyItemEmpty />
      </ul>
    </div>

    <Footer />
  </div>
  )
}

export default SurveyList
