import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
	Text,
  } from "@chakra-ui/react";
  import { useRef, useState } from "react";
  import { useRecoilState } from "recoil";
  import userAtom from "../atoms/userAtom";
  import usePreviewImg from "../hooks/usePreviewImg";
  import useShowToast from "../hooks/useShowToast";
  import { useNavigate } from "react-router-dom";
  import UniversityAutoComplete from "../components/UniversityAutoComplete";
  
  export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
	  name: user.name,
	  username: user.username,
	  email: user.email,
	  bio: user.bio,
	  password: "",
	  university: user.university || "", 
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);
	const [isUniversityValid, setIsUniversityValid] = useState(true);
  
	const showToast = useShowToast();
	const navigate = useNavigate();
	const { handleImageChange, imgUrl } = usePreviewImg();
  
	const handleSubmit = async (e) => {
	  e.preventDefault();
	  if (updating) return;
  
	  if (!isUniversityValid) {
		showToast("Error", "Please select a valid university from the list.", "error");
		return;
	  }
  
	  setUpdating(true);
	  try {
		const res = await fetch(`/api/users/update/${user._id}`, {
		  method: "PUT",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
		});
		const data = await res.json();
		if (data.error) {
		  showToast("Error", data.error, "error");
		  return;
		}
		showToast("Success", "Profile updated successfully", "success");
		setUser(data);
		localStorage.setItem("user-threads", JSON.stringify(data));
	  } catch (error) {
		showToast("Error", error.message, "error");
		console.error(error);
	  } finally {
		setUpdating(false);
	  }
	};
  
	const handleCancel = () => {
	  navigate(`/${user.username}`);
	};
  
	return (
	  <form onSubmit={handleSubmit}>
		<Flex align="center" justify="center" my={6}>
		  <Stack
			spacing={4}
			w="full"
			maxW="md"
			bg={useColorModeValue("white", "gray.800")}
			rounded="xl"
			boxShadow="lg"
			p={6}
		  >
			<Heading fontSize={{ base: "2xl", sm: "3xl" }}>
			  User Profile Edit
			</Heading>
  
			<FormControl id="profile-pic">
			  <Stack direction={["column", "row"]} spacing={6}>
				<Center>
				  <Avatar
					size="xl"
					src={imgUrl || user.profilePic}
					boxShadow="md"
				  />
				</Center>
				<Center w="full">
				  <Button w="full" onClick={() => fileRef.current.click()}>
					Change Avatar
				  </Button>
				  <Input
					type="file"
					hidden
					ref={fileRef}
					onChange={handleImageChange}
				  />
				</Center>
			  </Stack>
			</FormControl>
  
			<FormControl id="name">
			  <FormLabel>Full name</FormLabel>
			  <Input
				placeholder="John Doe"
				value={inputs.name}
				onChange={(e) =>
				  setInputs({ ...inputs, name: e.target.value })
				}
				type="text"
			  />
			</FormControl>
  
			<FormControl id="username">
			  <FormLabel>Username</FormLabel>
			  <Input
				placeholder="johndoe"
				value={inputs.username}
				onChange={(e) =>
				  setInputs({ ...inputs, username: e.target.value })
				}
				type="text"
			  />
			</FormControl>
  
			<FormControl id="email">
			  <FormLabel>Email address</FormLabel>
			  <Input
				placeholder="your-email@example.com"
				value={inputs.email}
				onChange={(e) =>
				  setInputs({ ...inputs, email: e.target.value })
				}
				type="email"
			  />
			</FormControl>
  
			<FormControl id="bio">
			  <FormLabel>Bio</FormLabel>
			  <Input
				placeholder="Your bio."
				value={inputs.bio}
				onChange={(e) =>
				  setInputs({ ...inputs, bio: e.target.value })
				}
				type="text"
			  />
			</FormControl>
  
			<UniversityAutoComplete
			  value={inputs.university}
			  onChange={(uni) => {
				setInputs({ ...inputs, university: uni });
				setIsUniversityValid(uni !== ""); 
			  }}
			  isRequired={false}
			/>
			{!isUniversityValid && inputs.university && (
			  <Text color="red.500" fontSize="sm">
				Please select a valid university from the list.
			  </Text>
			)}
  
			<FormControl id="password">
			  <FormLabel>Password</FormLabel>
			  <Input
				placeholder="••••••"
				value={inputs.password}
				onChange={(e) =>
				  setInputs({ ...inputs, password: e.target.value })
				}
				type="password"
			  />
			</FormControl>
  
			<Stack spacing={6} direction={["column", "row"]}>
			  <Button
				colorScheme="red"
				variant="outline"
				w="full"
				onClick={handleCancel}
				isDisabled={updating}
			  >
				Cancel
			  </Button>
			  <Button
				colorScheme="green"
				w="full"
				type="submit"
				isLoading={updating}
			  >
				Submit
			  </Button>
			</Stack>
		  </Stack>
		</Flex>
	  </form>
	);
  }
  