export interface User {
  id: string,
  username: string,
  email: string,
  savedAccounts: Array<object>,
  linkedAccounts: Array<object>,
  userIconId: number
  creationDate: Date
}
