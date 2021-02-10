import { FC, useEffect, useState } from 'react';

import isNumeric from '../../utils/isNumeric';

import Form from 'react-bootstrap/Form';
import { Lock, LockFill, Calculator, Unlock } from 'react-bootstrap-icons';

import {
  testResultFlag,
  testResultWithMetadataType,
} from '@resusio/simlab/dist/types/labReportTypes';
import { labTestGenerateMethod, testResultType } from '@resusio/simlab';

import styles from './testResultRow.module.scss';

function TestValueToString(test: testResultWithMetadataType) {
  return test.valueType === 'number'
    ? (test.value as number).toFixed(test.display.precision)
    : test.value.toString();
}

const textFlagStyles = {
  [testResultFlag.NORMAL]: styles.normal,
  [testResultFlag.ABNORMAL]: styles.abnormal,
  [testResultFlag.CRITICAL_LOW]: styles.critLow,
  [testResultFlag.LOW]: styles.low,
  [testResultFlag.HIGH]: styles.high,
  [testResultFlag.CRITICAL_HIGH]: styles.critHigh,
};

const rowFlagStyles = {
  [testResultFlag.NORMAL]: styles.normalRow,
  [testResultFlag.ABNORMAL]: styles.abnormalRow,
  [testResultFlag.CRITICAL_LOW]: styles.critLowRow,
  [testResultFlag.LOW]: styles.lowRow,
  [testResultFlag.HIGH]: styles.highRow,
  [testResultFlag.CRITICAL_HIGH]: styles.critHighRow,
};

export interface TestResultRowProps {
  testResult: testResultWithMetadataType;
  updateValue: (newValue: testResultType) => void;
  toggleLocked: (isLocked: boolean) => void;
}

const TestResultRow: FC<TestResultRowProps> = ({ testResult, updateValue, toggleLocked }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isLocked, setIsLocked] = useState(testResult.isLocked);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setValue(TestValueToString(testResult));
  }, [testResult.value]);

  const flagTextStyle = textFlagStyles[testResult.display.flag];
  const flagRowStyle = rowFlagStyles[testResult.display.flag];

  const validateInput = (value: string) => {
    if (testResult.valueType === 'number') return isNumeric(value);
    else return true;
  };

  const valueControl = isOpen ? (
    <Form.Control
      type="text"
      size="sm"
      value={value}
      plaintext
      autoFocus
      onChange={(e) => {
        setValue(e.target.value);
        setIsValid(validateInput(e.target.value));
      }}
      onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          const valAsString = TestValueToString(testResult);
          setValue(valAsString);
          (e.target as HTMLInputElement).value = valAsString;
          (e.target as HTMLInputElement).blur();
        } else if (e.key === 'Enter') {
          if (isValid) {
            (e.target as HTMLInputElement).blur();
          }
        }
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        if (!isValid) {
          e.preventDefault();
          e.target.focus();
        } else {
          setIsOpen(false);

          const typedValue = isNumeric(e.target.value)
            ? Number.parseFloat(e.target.value.toString())
            : e.target.value;
          updateValue(typedValue);
        }
      }}
      className={`${styles.valueControl} ${!isValid ? styles.invalid : ''}`}
    />
  ) : (
    <Form.Control
      type="text"
      plaintext
      readOnly
      onFocus={() => setIsOpen(true)}
      value={value}
      className={styles.valueControl}
    />
  );

  return (
    <tr className={flagRowStyle}>
      <td>{testResult.nomenclature.short}</td>
      <td width={100}>{valueControl}</td>
      <td dangerouslySetInnerHTML={{ __html: testResult.display.unitDisplay }} />
      <td className={`${styles.flagCol} ${flagTextStyle}`}>{testResult.display.flag}</td>
      <td className={`${styles.calcCol} d-print-none`}>
        {testResult.generatedType === labTestGenerateMethod.DERIVED ? <Calculator /> : ''}
      </td>
      <td
        className={`${styles.lockCol} d-print-none`}
        onClick={() => {
          setIsLocked((currState) => !currState);
          toggleLocked(!isLocked);
        }}
      >
        {isLocked ? <LockFill className={styles.locked} /> : <Unlock className={styles.unlocked} />}
      </td>
    </tr>
  );
};

export default TestResultRow;
