import React, { useState } from "react";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" px={5} justifyContent="center">
      <IconButton
        aria-label="up vote"
        isLoading={loadingState === "updoot-loading"}
        icon={
          <ChevronUpIcon
            w={6}
            h={6}
            flexGrow={1}
            onClick={async () => {
              setLoadingState("updoot-loading");
              await vote({ postId: post.id, value: 1 });
              setLoadingState("not-loading");
            }}
          />
        }
      ></IconButton>
      <Text textAlign="center">{post.points}</Text>
      <IconButton
        aria-label="down vote"
        isLoading={loadingState === "downdoot-loading"}
        icon={
          <ChevronDownIcon
            w={6}
            h={6}
            flexGrow={1}
            onClick={async () => {
              setLoadingState("downdoot-loading");
              await vote({ postId: post.id, value: -1 });
              setLoadingState("not-loading");
            }}
          />
        }
      ></IconButton>
    </Flex>
  );
};
