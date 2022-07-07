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
})
