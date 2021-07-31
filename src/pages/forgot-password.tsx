import { NextPage } from "next";
import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import NextLink from "next/link";

export type ForgotPasswordProps = {};
export const ForgotPassword: NextPage<ForgotPasswordProps> = ({}) => {
  const [{}, forgotPassword] = useForgotPasswordMutation();
  const [isComplete, setIsComplete] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setIsComplete(true);
        }}
      >
        {isComplete ? (
          <Box>
            <Box>If that email exists, an email has been sent.</Box>
            <Box mt={2}>
              <NextLink href="/">
                <Link>Return to homepage</Link>
              </NextLink>
            </Box>
          </Box>
        ) : (
          ({ isSubmitting }) => (
            <Form>
              <InputField name="email" placeholder="email" label="Email" />
              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Send Email
              </Button>
            </Form>
          )
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
