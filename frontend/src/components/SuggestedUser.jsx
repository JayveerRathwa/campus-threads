import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
  const { username, profilePic, name } = user;
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const buttonStyles = {
    color: following ? "black" : "white",
    bg: following ? "white" : "blue.400",
    _hover: {
      color: following ? "black" : "white",
      opacity: ".8",
    },
  };

  return (
    <Flex gap={2} justifyContent="space-between" alignItems="center">
      {/* Left Side */}
      <Flex gap={2} as={Link} to={`/${username}`}>
        <Avatar src={profilePic} />
        <Box>
          <Text fontSize="sm" fontWeight="bold">
            {username}
          </Text>
          <Text color="gray.500" fontSize="sm">  {/* Changed to gray.500 */}
            {name}
          </Text>
        </Box>
      </Flex>
      {/* Right Side */}
      <Button
        size="sm"
        onClick={handleFollowUnfollow}
        isLoading={updating}
        {...buttonStyles}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;
