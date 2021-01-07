import { createContext, useState } from 'react';
import { FC, Dispatch, SetStateAction } from 'react'; // Types

export interface UserType {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatarPicture: string;
}

export interface UserContextType {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>> | null;
}

export const UserContext = createContext<UserContextType>({ user: null, setUser: null });

export const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
