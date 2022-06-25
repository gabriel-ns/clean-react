import { HttpGetClient } from '@/data/protocols/http'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyList } from '@/domain/usecases/survey/load-survey-list'

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor (
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient
  ) {}

  async loadAll (): Promise<SurveyModel[]> {
    await this.httpGetClient.get({ url: this.url })
    return []
  }
}
