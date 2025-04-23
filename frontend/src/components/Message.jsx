import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const user = useRecoilValue(userAtom);
	const [imgLoaded, setImgLoaded] = useState(false);

	const MessageContent = () => {
		if (message.text) {
			return (
				<Text
					maxW={"350px"}
					bg={ownMessage ? "green.800" : "gray.400"}
					p={1}
					borderRadius={"md"}
					color={ownMessage ? "white" : "black"}
				>
					{message.text}
				</Text>
			);
		}
		if (message.img) {
			return (
				<Flex mt={5} w={"200px"}>
					<Image
						src={message.img}
						hidden={!imgLoaded}
						onLoad={() => setImgLoaded(true)}
						alt="Message image"
						borderRadius={4}
					/>
					{!imgLoaded && <Skeleton w={"200px"} h={"200px"} />}
				</Flex>
			);
		}
		return null;
	};

	const MessageStatus = () => {
		if (message.seen) {
			return (
				<Box
					alignSelf={"flex-end"}
					ml={1}
					color={"blue.400"}
					fontWeight={"bold"}
				>
					<BsCheck2All size={16} />
				</Box>
			);
		}
		return null;
	};

	return (
		<Flex
			gap={2}
			justifyContent={ownMessage ? "flex-end" : "flex-start"}
			alignSelf={ownMessage ? "flex-end" : "flex-start"}
		>
			<Avatar
				src={ownMessage ? user.profilePic : selectedConversation.userProfilePic}
				w="7"
				h={7}
			/>

			<Flex direction="column" alignItems={ownMessage ? "flex-end" : "flex-start"}>
				<MessageContent />
				<MessageStatus />
			</Flex>
		</Flex>
	);
};

export default Message;
