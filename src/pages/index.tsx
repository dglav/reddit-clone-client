import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { UpdootSection } from "../components/UpdootSection";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching, stale }] = usePostsQuery({ variables });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>you got query failed for some reason</div>;
  }

  return (
    <Layout>
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts?.posts?.map((post) =>
            !post ? null : (
              <Box key={post.id} shadow="md" borderWidth="1px" d="flex">
                <UpdootSection post={post} />
                <Flex py={5} pr={5} flexGrow={1} align="center">
                  <Box>
                    <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                      <Link>
                        <Heading fontSize="xl">{post.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text>posted by {post.creator.username}</Text>
                    <Text mt={4}>{post.textSnippet}</Text>
                  </Box>
                  {meData?.me?.id === post.creator.id && (
                    <Box ml="auto">
                      <NextLink
                        href="/post/edit/[id]"
                        as={`/post/edit/${post.id}`}
                      >
                        <IconButton
                          as={Link}
                          aria-label="Edit post"
                          icon={<EditIcon />}
                          mr={3}
                        />
                      </NextLink>
                      <IconButton
                        aria-label="Delete post"
                        icon={<DeleteIcon />}
                        onClick={() => deletePost({ id: post.id })}
                      />
                    </Box>
                  )}
                </Flex>
              </Box>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex justifyContent="center">
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor:
                  data?.posts.posts[data?.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching || stale}
            my={8}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
