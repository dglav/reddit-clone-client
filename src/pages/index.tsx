import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import Layout from "../components/Layout";
import NextLink from "next/link";

const TEXT_SNIPPET_LENGTH = 100;

const Index = () => {
  const [{ data }] = usePostsQuery({ variables: { limit: 10 } });
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data.posts.map((post) => {
            return (
              <Box key={post.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{post.title}</Heading>
                <Text mt={4}>
                  {post.text.slice(0, TEXT_SNIPPET_LENGTH)}
                  {post.text.length > TEXT_SNIPPET_LENGTH && "..."}
                </Text>
              </Box>
            );
          })}
        </Stack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
