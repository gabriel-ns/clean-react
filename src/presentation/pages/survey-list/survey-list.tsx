import Styles from './survey-list-styles.scss'
import { Footer, Header } from '@/presentation/components'
import { LoadSurveyList } from '@/domain/usecases/survey/load-survey-list'
import { List, SurveyContext } from './components'
import React, { useEffect, useState } from 'react'
import { SurveyModel } from '@/domain/models'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const [state, setState] = useState({
    surveys: [] as SurveyModel[],
    error: ''
  })

  useEffect(() => {
    void loadSurveyList.loadAll()
      .then(surveys => setState({ ...state, surveys: surveys }))
      .catch(error => setState({ ...state, error: error.message }))
  }, [])

  return (
  <div className={ Styles.surveyListWrap }>
    <Header />

    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <SurveyContext.Provider value={{ state, setState }}>
        { state.error
          ? <div>
              <span data-testid="error">{state.error}</span>
              <button>Recarregar</button>
            </div>
          : <List />
        }
      </SurveyContext.Provider>
    </div>

    <Footer />
  </div>
  )
}

export default SurveyList
