import React from "react";
import Navbar from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar />
      <div>Hello world</div>
      <br></br>
      {data?.posts.map((post) => {
        return <div key={post.id}>{post.title}</div>;
      })}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
