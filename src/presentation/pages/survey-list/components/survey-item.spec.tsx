import React from 'react'
import { mockSurveyModel } from '@/domain/test'
import { IconName } from '@/presentation/components'
import { SurveyItem } from '@/presentation/pages/survey-list/components'
import { render, screen } from '@testing-library/react'
import faker from 'faker'

const makeSut = (survey = mockSurveyModel()): void => {
  render(<SurveyItem survey={ survey }/>)
}

describe('SurveyItem component', () => {
  test('Should render with thumb up icon if question is answered', () => {
    const survey = mockSurveyModel()
    survey.didAnswer = true
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
  })

  test('Should render with thumb down icon if question is answered', () => {
    const survey = mockSurveyModel()
    survey.didAnswer = false
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
  })

  test('Should render with correct question', () => {
    const survey = mockSurveyModel()
    makeSut(survey)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
  })

  test('Should render with correct date', () => {
    const survey = mockSurveyModel()
    const day = String(faker.datatype.number({ min: 1, max: 28 })).padStart(2)
    const year = faker.datatype.number({ min: 2000, max: 2100 })
    survey.date = new Date(`${year}-06-${day}T12:00:00.000000-03:00`)
    makeSut(survey)
    expect(screen.getByTestId('day')).toHaveTextContent(`${day}`)
    expect(screen.getByTestId('month')).toHaveTextContent('jun')
    expect(screen.getByTestId('year')).toHaveTextContent(`${year}`)
  })
})
