import { AxiosHttpClient } from './axios-http-client'
import axios from 'axios'
import faker from 'faker'
import { HttpPostParams } from '@/data/protocols/http'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockedAxiosPostResponse = ({
  data: faker.random.objectElement(),
  status: faker.random.number()
})

mockedAxios.post.mockResolvedValue(mockedAxiosPostResponse)

const makeSut = (): { sut: AxiosHttpClient } => {
  const sut = new AxiosHttpClient()
  return { sut }
}

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

describe('AxiosHttpClient', () => {
  test('Should call Axios with correct values', async () => {
    const postRequest = mockPostRequest()
    const { sut } = makeSut()
    await sut.post(postRequest)
    expect(mockedAxios.post).toHaveBeenCalledWith(postRequest.url, postRequest.body)
  })

  test('Should return the correct status code and body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.post(mockPostRequest())
    expect(httpResponse).toEqual({
      statusCode: mockedAxiosPostResponse.status,
      body: mockedAxiosPostResponse.data
    })
  })
})
