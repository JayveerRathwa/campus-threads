import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";

const UserPost = ({ postImg, postTitle, likes, replies }) => {
	const [liked, setLiked] = useState(false);

	return (
		<Link to={"/markzuckerberg/post/1"}>
			<Flex gap={3} mb={4} py={5} bg="gray.800" borderRadius="lg" boxShadow="md">
				{/* Left side: Avatars and vertical divider */}
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar size='md' name='Mark Zuckerberg' src='/zuck-avatar.png' borderColor="teal.300" borderWidth="2px" />
					<Box w='1px' h={"full"} bg='gray.600' my={2}></Box>
					<Box position={"relative"} w={"full"}>
						{/* Stacked avatars for post interactions */}
						<Avatar
							size='xs'
							name='John doe'
							src='https://bit.ly/dan-abramov'
							position={"absolute"}
							top={"0px"}
							left='15px'
							padding={"2px"}
							borderColor="blue.300"
							borderWidth="2px"
						/>
						<Avatar
							size='xs'
							name='John doe'
							src='https://bit.ly/sage-adebayo'
							position={"absolute"}
							bottom={"0px"}
							right='-5px'
							padding={"2px"}
							borderColor="pink.300"
							borderWidth="2px"
						/>
						<Avatar
							size='xs'
							name='John doe'
							src='https://bit.ly/prosper-baba'
							position={"absolute"}
							bottom={"0px"}
							left='4px'
							padding={"2px"}
							borderColor="green.300"
							borderWidth="2px"
						/>
					</Box>
				</Flex>

				{/* Right side: Post content */}
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize={"sm"} fontWeight={"bold"} color="white">
								markzuckerberg
							</Text>
							<Image src='/verified.png' w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontStyle={"sm"} color={"gray.400"}>
								1d
							</Text>
							<BsThreeDots color="gray.400" />
						</Flex>
					</Flex>

					<Text fontSize={"sm"} color="gray.200">{postTitle}</Text>

					{/* Conditional rendering for post image */}
					{postImg && (
						<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.600"}>
							<Image src={postImg} w={"full"} />
						</Box>
					)}

					{/* Actions component for liking, commenting */}
					<Flex gap={3} my={1}>
						<Actions liked={liked} setLiked={setLiked} />
					</Flex>

					{/* Post statistics (replies and likes) */}
					<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.400"} fontSize='sm'>
							{replies} replies
						</Text>
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.400"}></Box>
						<Text color={"gray.400"} fontSize='sm'>
							{likes} likes
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

export default UserPost;
