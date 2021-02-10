import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useForm } from 'react-hook-form';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { Github } from 'react-bootstrap-icons';

import PageHeader from '../components/PageHeader';

import styles from '../styles/contact.module.scss';

import sendFeedbackMessage from '../api-lib/client/sendFeedbackMessage';
import { asSimlabUser } from '../utils/authTypes';

import type { FeedbackMessageType } from '../models/feedbackMessage.model';

type FeedbackMessageInputs = Omit<FeedbackMessageType, '_id' | 'userId'>;

const ContactPage = () => {
  const auth0 = useAuth0();
  const user = asSimlabUser(auth0.user);

  const { register, handleSubmit, watch, errors, setValue } = useForm<FeedbackMessageInputs>();
  const onSubmit = async (data: FeedbackMessageInputs) => {
    setIsSending(true);

    const result = await sendFeedbackMessage(data, auth0);

    setIsSending(false);

    if (result == false) setSendFailed(true);
    else setSendSucceed(true);
  };

  const [isSending, setIsSending] = useState(false);
  const [sendSucceed, setSendSucceed] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  useEffect(() => {
    setValue('firstName', user?.firstName ?? '', { shouldValidate: true });
    setValue('lastName', user?.lastName ?? '', { shouldValidate: true });
    setValue('email', user?.email ?? '', { shouldValidate: true });
  }, [user?.userId]);

  const StaticHead = (
    <Row>
      <Col xs={12} lg={8}>
        <PageHeader title="Contact Resuscitate.io" />
        <p>
          Resuscitate.io SimLab is currently an{' '}
          <em>
            <strong>alpha version</strong>
          </em>
          , and as such we welcome any feedback! Please feel free to send any bugs, feature
          requests, gripes, or pleasant notes to us using the form below.
        </p>
        <h6>
          You can also report bugs and request features on{' '}
          <Button variant="primary" size="sm" href="https://github.com/resusio/simlab-next/issues">
            Github <Github style={{ position: 'relative', top: -2 }} />
          </Button>
        </h6>
      </Col>
    </Row>
  );

  if (isSending) {
    return (
      <>
        {StaticHead}
        <Row className="mt-4">
          <Col xs={12}>
            <Spinner animation="border" />
          </Col>
        </Row>
        ,
      </>
    );
  }

  if (sendSucceed) {
    return (
      <>
        {StaticHead}
        <Row className="mt-4">
          <Col xs={12}>
            <h4>📟 Your feedback has been received, thank you 📟</h4>
          </Col>
        </Row>
      </>
    );
  }

  if (sendFailed) {
    return (
      <>
        {StaticHead}
        <Row className="mt-4">
          <Col xs={12}>
            <h4>⚠️ Sorry! something went wrong on our side ⚠️</h4>
            <h6>Please try again a bit later.</h6>
            <Button
              onClick={() => {
                setIsSending(false);
                setSendSucceed(false);
                setSendFailed(false);
              }}
            >
              Back to feedback form
            </Button>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      {StaticHead}
      <Row className="mt-4">
        <Col xs={12} lg={8}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="contactName">
              <Row>
                <Col>
                  <Form.Control
                    name="firstName"
                    ref={register({ required: true })}
                    placeholder="First name"
                  />
                </Col>
                <Col>
                  <Form.Control name="lastName" ref={register} placeholder="Last name" />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="contactEmail">
              <Form.Control
                name="email"
                ref={register({
                  required: true,
                  pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
                type="email"
                placeholder="Email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="contactMessage">
              <Form.Control
                name="message"
                ref={register({ required: true })}
                as="textarea"
                rows={6}
                placeholder="Have your say..."
                autoFocus
              />
            </Form.Group>
            <Form.Row className="text-right">
              <Col>
                <Button type="submit">Send Feedback</Button>
              </Col>
            </Form.Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ContactPage;
