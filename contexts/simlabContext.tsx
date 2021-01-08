import { createContext, useEffect, useState, useContext } from 'react';
import { FC } from 'react'; // Types

import { SettingsContext } from './settingsContext';

import LabReportGenerator from '@resusio/simlab';
import simlabSetBasic from '@resusio/simlab-set-basic';

export interface SimlabContextType {
  simlab: LabReportGenerator;
}

export const SimlabContext = createContext<SimlabContextType>({
  simlab: new LabReportGenerator(),
});

export const SimlabProvider: FC = ({ children }) => {
  const { settings } = useContext(SettingsContext);
  const [simlab] = useState<LabReportGenerator>(
    new LabReportGenerator([], [], undefined, [], {
      labTests: simlabSetBasic.labTests,
      orderSets: simlabSetBasic.orderSets,
      categories: simlabSetBasic.categories,
      diseases: simlabSetBasic.diseases,
    })
  );

  // effect to set new simlab settings
  useEffect(() => {
    simlab.setRequestedLabTests(settings.testIds);
    simlab.setRequestedOrderSets(settings.orderSetIds);
    simlab.setDiseases(settings.diseaseIds);
    simlab.setPatient(settings.patient);
  }, [
    settings.diseaseIds,
    settings.orderSetIds,
    settings.testIds,
    settings.patient.age,
    settings.patient.gender,
    settings.patient.height,
    settings.patient.weight,
  ]);

  return <SimlabContext.Provider value={{ simlab }}>{children}</SimlabContext.Provider>;
};
