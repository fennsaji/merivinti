import { IMembers } from "./member.model";

export interface IChurch {
  cName: string,
  churchId: string,
  members: IMembers[],
  families?: any
}
