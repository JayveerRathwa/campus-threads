import {
	Avatar,
	Box,
	Button,
	Flex,
	Link,
	Text,
	VStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	useToast,
  } from '@chakra-ui/react';  
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user, onTabChange, activeTab }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); // logged in user
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	const activeTabStyle = {
		fontWeight: "bold",
		borderBottom: "2px solid blue", 
		color: "blue",
	};

	const inactiveTabStyle = {
		fontWeight: "normal",
		borderBottom: "none",
		color: "gray.500",
	};

	const handleTabClick = (tabName) => {
		onTabChange(tabName);
	};

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
						<Text fontSize={"xs"} bg={"gray.400"} color={"gray.500"} p={1} borderRadius={"full"}>
							threads.net
						</Text>
					</Flex>
					{user.university && (
						<Text fontSize={"sm"} color={"gray.400"}>
							{user.university}
						</Text>
					)}
				</Box>
				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text>{user.bio}</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.500"}>{user.followers.length} followers</Text>
				</Flex>
				<Flex>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.400"}>
									<MenuItem bg={"gray.400"} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex w={"full"}>
				<Flex 
					flex={1} 
					justifyContent={"center"} 
					pb='3' 
					cursor={"pointer"}
					onClick={() => handleTabClick("threads")} 
					style={activeTab === "threads" ? activeTabStyle : inactiveTabStyle}
				>
					<Text fontWeight={"bold"}> Threads</Text>
				</Flex>
				<Flex
					flex={1}
					justifyContent={"center"}
					color={"gray.500"}
					pb='3'
					cursor={"pointer"}
					onClick={() => handleTabClick("replies")} 
					style={activeTab === "replies" ? activeTabStyle : inactiveTabStyle}
				>
					<Text fontWeight={"bold"}> Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
