import React, { useState, useEffect } from 'react';

import {
  createMachine,
  state,
  transition,
  invoke,
  reduce,
  ContextFunction,
  immediate,
} from 'robot3';
import type { SendEvent } from 'robot3';
import { createUseMachine } from 'robot-hooks';
const useMachine = createUseMachine(useEffect, useState);

import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

interface ConfirmContext {
  message: JSX.Element | null;
  doAction: (() => Promise<boolean>) | null;
  error?: string;
}

interface ContextSendEvent {
  type: string;
  value: ConfirmContext;
}

interface ErrorSendEvent {
  type: 'error';
  error: string;
}

const initialContext: ConfirmContext = {
  message: null,
  doAction: null,
  error: undefined,
};

const createContext: ContextFunction<ConfirmContext> = (initialContext): ConfirmContext => ({
  ...initialContext,
});

const useConfirmation = (): [(context: ConfirmContext) => void, () => JSX.Element] => {
  const [machine] = useState(() =>
    createMachine(
      {
        initial: state(
          transition(
            'begin',
            'confirming',
            reduce<ConfirmContext, ContextSendEvent>((ctx, evt) => ({ ...evt.value })) // Store the context
          )
        ),
        confirming: state(transition('confirm', 'loading'), transition('cancel', 'reset')),
        loading: invoke(
          async (ctx: ConfirmContext) => {
            if (ctx.doAction) {
              const result = await ctx.doAction();
              if (result === true) return;
              else throw result; // Failed, reject promise with the error string
            }
            return;
          },
          transition('done', 'reset'),
          transition(
            'error',
            'error',
            reduce<ConfirmContext, ErrorSendEvent>((ctx, evt) => ({ ...ctx, error: evt.error })) // Save error to context
          )
        ),
        error: state(immediate('reset')), // For now just fall through error state. Could also have an acknowledge error function here by using this state.
        reset: state(
          // This state resets the state machine and context back to initial state.
          immediate(
            'initial',
            reduce<ConfirmContext, SendEvent>(() => createContext(initialContext))
          )
        ),
      },
      createContext
    )
  );
  const [current, send] = useMachine(machine, initialContext);

  // Flags to derive UI state from FSM state
  const isOpen = current.name !== 'initial';
  const isLoading = current.name === 'loading';
  const isError = current.name === 'error';

  // Method to start confirmation process, returned from hook
  const open = (context: ConfirmContext) => {
    send({ type: 'begin', value: context });
  };

  const ModalDialog = () => (
    <Modal show={isOpen} animation={false} backdrop="static">
      <Modal.Header>
        <Modal.Title>{!isError ? 'Are you sure?' : 'Error'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-0">
        <Container fluid>
          <div>
            {!isError && !isLoading ? (
              current.context.message
            ) : isError ? (
              <Alert variant="danger">
                <h5>{current.context.error}</h5>
              </Alert>
            ) : null}
          </div>
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'center' }}>
        {!isError ? (
          <>
            <Button variant="secondary" disabled={isLoading} onClick={() => send('cancel')}>
              Cancel
            </Button>
            <Button variant="primary" disabled={isLoading} onClick={() => send('confirm')}>
              Confirm
            </Button>{' '}
          </>
        ) : (
          <Button variant="danger" onClick={() => send('acknowledge')}>
            Okay
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
  return [open, ModalDialog];
};

export default useConfirmation;
