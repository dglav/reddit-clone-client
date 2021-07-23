import React from "react";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export type NavbarProps = {};
export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;
  if (fetching) {
    // data is loading
  } else if (!data?.me) {
    // user not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link color="black" mr={4}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="black">Register</Link>
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>
            Create Post
          </Button>
        </NextLink>
        <Box mr={4} color="black">
          {data.me.username}
        </Box>
        <NextLink href="/">
          <Button
            isLoading={logoutFetching}
            onClick={() => logout()}
            variant="link"
            color="black"
          >
            Logout
          </Button>
        </NextLink>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4} justify="center">
      <Flex flex={1} alignItems="center" maxW={800}>
        <Box>
          <NextLink href="/">
            <Link>
              <Heading>LiReddit</Heading>
            </Link>
          </NextLink>
        </Box>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
