import React from 'react'
import { mockSurveyModel } from '@/domain/test'
import { IconName } from '@/presentation/components'
import { SurveyItem } from '@/presentation/pages/survey-list/components'
import { render, screen } from '@testing-library/react'

describe('SurveyItem component', () => {
  test('Should render with thumb up icon if question is answered', () => {
    const survey = mockSurveyModel()
    survey.didAnswer = true
    render(<SurveyItem survey={ survey }/>)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
  })

  test('Should render with thumb down icon if question is answered', () => {
    const survey = mockSurveyModel()
    survey.didAnswer = false
    render(<SurveyItem survey={ survey }/>)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
  })

  test('Should render with correct question', () => {
    const survey = mockSurveyModel()
    render(<SurveyItem survey={ survey }/>)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
  })

  test('Should render with correct date', () => {
    const survey = mockSurveyModel()
    survey.date = new Date('2022-06-30T12:00:00.000000-03:00')
    render(<SurveyItem survey={ survey }/>)
    expect(screen.getByTestId('day')).toHaveTextContent('30')
    expect(screen.getByTestId('month')).toHaveTextContent('jun')
    expect(screen.getByTestId('year')).toHaveTextContent('2022')
  })
})
