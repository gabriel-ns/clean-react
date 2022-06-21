import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'
import { AddAccount } from '@/domain/usecases'
import { makeApiUrl } from '@/main/factories/http/api-url-factory'
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory'

export const makeRemoteAddAccount = (): AddAccount => {
  const url = makeApiUrl('/signup')
  return new RemoteAddAccount(url, makeAxiosHttpClient())
}
