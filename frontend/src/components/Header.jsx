import { Button, Flex, Image, Link, useColorMode, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const iconSize = useBreakpointValue({ base: 20, sm: 24 });

	const handleLogout = () => {
		logout();
		onClose();
	};

	return (
		<>
			<Flex justifyContent={"space-between"} alignItems="center" mt={6} mb="12" wrap="wrap">
				{user ? (
					<Link as={RouterLink} to="/">
						<AiFillHome size={iconSize} />
					</Link>
				) : (
					<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
						Login
					</Link>
				)}

				<Image
					cursor={"pointer"}
					alt="logo"
					w={6}
					src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
					onClick={toggleColorMode}
				/>

				{user && (
					<Flex alignItems={"center"} gap={4}>
						<Link as={RouterLink} to={`/${user.username}`}>
							<RxAvatar size={iconSize} />
						</Link>
						<Link as={RouterLink} to={`/chat`}>
							<BsFillChatQuoteFill size={iconSize} />
						</Link>
						<Link as={RouterLink} to={`/settings`}>
							<MdOutlineSettings size={iconSize} />
						</Link>
						<Button size={"xs"} onClick={onOpen} variant="ghost">
							<FiLogOut size={iconSize} />
						</Button>
					</Flex>
				)}

				{!user && (
					<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
						Sign up
					</Link>
				)}
			</Flex>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Confirm Logout</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<p>Are you sure you want to log out?</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="blue" onClick={handleLogout}>
							Logout
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Header;
