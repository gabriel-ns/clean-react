import { HttpGetParams, HttpPostClient, HttpPostParams, HttpResponse } from '@/data/protocols/http'
import axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpPostClient {
  async post (params: HttpPostParams): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse
    try {
      axiosResponse = await axios.post(params.url, params.body)
    } catch (error) {
      return {
        statusCode: error.response.status,
        body: error.response.data
      }
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }

  async get (params: HttpGetParams): Promise<HttpResponse> {
    await axios.get(params.url)
    return null
  }
}
