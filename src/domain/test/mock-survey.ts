import { SurveyModel } from '../models'
import faker from 'faker'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  date: faker.date.recent(),
  question: faker.random.words(10),
  answers: [{
    answer: faker.random.words(4)
  }, {
    answer: faker.random.words(5)
  }],
  didAnswer: false
})

export const mockSurveyModelList = (): SurveyModel[] => ([mockSurveyModel(), mockSurveyModel(), mockSurveyModel()])
