import { SetStorage } from '@/data/protocols/cache/set-storage'
import { UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { UpdateCurrentAccount } from '@/domain/usecases/update-current-account'

export class LocalUpdateCurrentAccount implements UpdateCurrentAccount {
  constructor (private readonly setStorage: SetStorage) {}

  save (account: AccountModel): void {
    if (!account?.accessToken || !account?.name) throw new UnexpectedError()
    void this.setStorage.set('account', JSON.stringify(account))
  }
}
