import { SurveyList } from '@/presentation/pages'
import { LoadSurveyList } from '@/domain/usecases/survey/load-survey-list'
import { SurveyModel } from '@/domain/models'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockSurveyModelList } from '@/domain/test'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { UnexpectedError } from '@/domain/errors'

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0
  surveys = mockSurveyModelList()
  async loadAll (): Promise<SurveyModel[]> {
    this.callsCount++
    return Promise.resolve(this.surveys)
  }
}

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />)
  return {
    loadSurveyListSpy
  }
}

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', async () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
    expect(surveyList.children).toHaveLength(4)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    await act(async () => {
      await waitFor(() => surveyList)
    })
  })

  test('Should call LoadSurveyList on start', async () => {
    const { loadSurveyListSpy } = makeSut()
    expect(loadSurveyListSpy.callsCount).toBe(1)
    await act(async () => {
      await waitFor(() => screen.getByRole('heading'))
    })
  })

  test('Should render SurveyItems on success', async () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    await act(async () => {
      await waitFor(() => surveyList)
    })
    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })

  test('Should render error if LoadSurveyList throws', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)

    makeSut(loadSurveyListSpy)

    await act(async () => {
      await waitFor(() => screen.getByRole('heading'))
    })
    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })

  test('Should call LoadSurveyList on retry', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)

    makeSut(loadSurveyListSpy)

    await act(async () => {
      await waitFor(() => screen.getByRole('heading'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('reload'))
      await waitFor(() => screen.getByRole('heading'))
    })

    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})
