import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/http/test'
import { mockPostRequest } from '@/data/test'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = mockAxios()

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  return { sut, mockedAxios }
}

describe('AxiosHttpClient', () => {
  describe('AxiosHttpClient', () => {
    test('Should call Axios with correct values', async () => {
      const postRequest = mockPostRequest()
      const { sut, mockedAxios } = makeSut()
      await sut.post(postRequest)
      expect(mockedAxios.post).toHaveBeenCalledWith(postRequest.url, postRequest.body)
    })

    test('Should return the correct status code and body', async () => {
      const { sut, mockedAxios } = makeSut()
      const httpResponse = await sut.post(mockPostRequest())
      const axiosResponse = await mockedAxios.post.mock.results[0].value
      await expect(httpResponse).toEqual({
        body: axiosResponse.data,
        statusCode: axiosResponse.status
      })
    })

    test('Should return the correct status code and body on failure', () => {
      const { sut, mockedAxios } = makeSut()
      mockedAxios.post.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const promise = sut.post(mockPostRequest())
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  })
})
