import { createContext, useState } from 'react';
import { FC, Dispatch, SetStateAction } from 'react'; // Types

import { gender, patientInfoType } from '@resusio/simlab';

export interface SettingsType {
  patient: patientInfoType & { name: string; mrn: string };
  testIds: string[];
  orderSetIds: string[];
  diseaseIds: string[];
}

export interface SettingsContextType {
  settings: SettingsType;
  setSettings: Dispatch<SetStateAction<SettingsType>>;
}

export const defaultSettings = {
  patient: {
    name: 'John Smith',
    mrn: '1234-567-890',
    age: 45,
    weight: 70,
    height: 170,
    gender: gender.Female,
  },
  testIds: ['hstnt'],
  orderSetIds: ['udip'],
  diseaseIds: ['endo.dka'],
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const SettingsProvider: FC = ({ children }) => {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
