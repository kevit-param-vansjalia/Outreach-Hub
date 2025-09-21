import { UserWorkspace } from '../workspaces/workspace.model';

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isAdmin: boolean;
  workspaces: UserWorkspace[];
  createdAt: string;
  updatedAt: string;
}