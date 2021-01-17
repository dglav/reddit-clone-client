import React, { useState } from "react";
import { NextPage, NextPageContext } from "next";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { NextComponentType, withUrqlClient } from "next-urql";
import NextLink from "next/link";

type ChangePasswordProps = {
  token: string;
};

export const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
  const router = useRouter();
  const [{}, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.changePassword.errors) {
            const errors = toErrorMap(response.data.changePassword.errors);
            if ("token" in errors) {
              setTokenError(errors.token);
            }
            setErrors(errors);
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="New Password"
              label="new password"
              type="password"
            />
            {tokenError && (
              <Flex mt={1}>
                <Box mr={4} color="red.500">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>Reset token</Link>
                </NextLink>
              </Flex>
            )}
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Reset Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = async ({
  query,
}: NextPageContext): Promise<ChangePasswordProps> => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(
  (ChangePassword as unknown) as NextComponentType
);
