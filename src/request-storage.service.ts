import { Injectable, Scope } from "@nestjs/common";

export type UserRequestStorage = {
  id: string,
  email: string,
}

@Injectable({ scope: Scope.REQUEST })
export class RequesteStorageService {
  user: UserRequestStorage  =  {
    id: "",
    email: ""
  }

  setUser(user: UserRequestStorage) {
    this.user = user
  }

  getUser() {
    return this.user
  }
}