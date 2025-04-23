import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {
	const { userProfilePic, username, text } = reply; 

	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src={userProfilePic} alt={`${username}'s profile`} size={"sm"} />
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						<Text fontSize="sm" fontWeight="bold">
							{username}
						</Text>
					</Flex>
					<Text>{text}</Text>
				</Flex>
			</Flex>
			{!lastReply && <Divider />}
		</>
	);
};

export default Comment;
