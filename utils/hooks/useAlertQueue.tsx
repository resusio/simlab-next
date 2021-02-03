import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import Alert from 'react-bootstrap/Alert';

import styles from './useAlertQueue.module.scss';

interface AlertMessage {
  id: string;
  message: string;
  type: 'success' | 'failed';
  cssAnimClasses: string[];
}

const transitionTime = 250;

const useAlertQueue = (displayTime: number) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  function removeAlert(alertId: string) {
    setAlerts((currAlerts) => currAlerts.filter((alert) => alert.id !== alertId));
  }

  function hiddenToVisible(alertId: string) {
    setAlerts((currAlerts) =>
      currAlerts.map((currAlert) =>
        currAlert.id === alertId
          ? { ...currAlert, cssAnimClasses: [styles.alert, styles.visible] }
          : currAlert
      )
    );
  }

  function visibleToHidden(alertId: string) {
    setAlerts((currAlerts) =>
      currAlerts.map((currAlert) =>
        currAlert.id === alertId
          ? { ...currAlert, cssAnimClasses: [styles.alert, styles.hidden] }
          : currAlert
      )
    );
  }

  const pushAlert = (message: string, type: 'success' | 'failed' = 'failed') => {
    const id = nanoid();
    setAlerts((currAlerts) => [
      ...currAlerts,
      { id, message, type, cssAnimClasses: [styles.alert, styles.hidden] },
    ]);

    setTimeout(() => {
      hiddenToVisible(id); // Start the fade in
      setTimeout(() => {
        // Wait displayTime and fade in time, then start to hide
        visibleToHidden(id);
        setTimeout(() => {
          // Remove from DOM after fadeout
          removeAlert(id);
        }, transitionTime); // Allow fadeout to complete, then remove from DOM
      }, displayTime + transitionTime); // Hold visible for displayTime ms, plus transitionTime ms for fade in time, then start fade out
    }, 10); // hidden to visible after 10ms to start fade in
  };

  const AlertsList = (
    /*() => */ <div className={styles.alertQueue}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          className={alert.cssAnimClasses.join(' ')}
          variant={alert.type === 'success' ? 'success' : 'danger'}
          dismissible
          onClick={() => {
            visibleToHidden(alert.id);
            setTimeout(() => removeAlert(alert.id), transitionTime);
          }}
        >
          <Alert.Heading>{alert.type === 'success' ? '🎉 Success!' : '😓 Oh, no!'}</Alert.Heading>
          <p>{alert.message}</p>
        </Alert>
      ))}
    </div>
  );

  return { pushAlert, AlertsList };
};

export default useAlertQueue;
