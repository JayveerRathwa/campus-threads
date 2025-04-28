import { Avatar, Image, Box, Flex, Text } from '@chakra-ui/react';
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from '../atoms/userAtom';
import postsAtom from "../atoms/postsAtom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    const getPostDetails = async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setSentiment(data.sentiment);  // Assuming sentiment is included in the post data from the backend
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getUser();
    getPostDetails();
  }, [postedBy, post._id, showToast]);

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
      setDeleteModalOpen(false);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user) return null;

  return (
    <>
      <Link to={`/${user.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size="md"
              name={user.name}
              src={user?.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            />
            <Box w="1px" h={"full"} bg="gray.300" my={2}></Box>
            <Box position={"relative"} w={"full"}>
              {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
              {post.replies.map((reply, index) => (
                <Avatar
                  key={index}
                  size="xs"
                  name={reply.userName}
                  src={reply.userProfilePic}
                  position="absolute"
                  top={index === 0 ? "0px" : "auto"}
                  bottom={index === 1 ? "0px" : "auto"}
                  left={index === 2 ? "4px" : "auto"}
                  right={index === 1 ? "-5px" : "auto"}
                  padding={"2px"}
                />
              ))}
            </Box>
          </Flex>
          <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <Text
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`);
                  }}
                >
                  {user?.username}
                </Text>
                <Image src="/verified.png" w={4} h={4} ml={1} />
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.500"}>
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>

                {currentUser?._id === user._id && <DeleteIcon size={20} onClick={() => setDeleteModalOpen(true)} />}
              </Flex>
            </Flex>

            <Text fontSize={"sm"}>{post.text}</Text>
            {sentiment && (
              <Text fontSize={"xs"} color={sentiment === "happy" ? "green.500" : sentiment === "sad" ? "yellow.500" : sentiment === "angry" ? "red.500" : "gray.500"}>
                Sentiment: {sentiment}
              </Text>
            )}
            {post.img && (
              <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.300"}>
                <Image src={post.img} w={"full"} />
              </Box>
            )}

            <Flex gap={3} my={1}>
              <Actions post={post} />
            </Flex>
          </Flex>
        </Flex>
      </Link>

      {/* Delete Post Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this post?</Text>
            <Flex mt={3} justifyContent="space-between">
              <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeletePost}>
                Delete
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Post;
