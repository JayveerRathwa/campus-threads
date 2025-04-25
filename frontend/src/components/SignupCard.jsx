import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useSetRecoilState } from "recoil";
  import authScreenAtom from "../atoms/authAtom";
  import useShowToast from "../hooks/useShowToast";
  import userAtom from "../atoms/userAtom";
  import UniversityAutoComplete from "./UniversityAutoComplete";
  
  const FormInput = ({ label, type, value, onChange, isRequired, showPassword, onTogglePassword }) => (
	<FormControl isRequired={isRequired}>
	  <FormLabel>{label}</FormLabel>
	  <InputGroup>
		<Input
		  type={showPassword && type === "password" ? "text" : type}
		  onChange={onChange}
		  value={value}
		/>
		{type === "password" && (
		  <InputRightElement h={"full"}>
			<Button variant={"ghost"} onClick={onTogglePassword}>
			  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
			</Button>
		  </InputRightElement>
		)}
	  </InputGroup>
	</FormControl>
  );
  
  export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
	  name: "",
	  username: "",
	  email: "",
	  password: "",
	  university: "",
	});
  
	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);
  
	const handleSignup = async () => {
	  try {
		const res = await fetch("/api/users/signup", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(inputs),
		});
		const data = await res.json();
  
		if (data.error) {
		  showToast("Error", data.error, "error");
		  return;
		}
  
		localStorage.setItem("user-threads", JSON.stringify(data));
		setUser(data);
	  } catch (error) {
		showToast("Error", error.message, "error");
	  }
	};
  
	return (
	  <Flex align={"center"} justify={"center"}>
		<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
		  <Stack align={"center"}>
			<Heading fontSize={"4xl"} textAlign={"center"}>
			  Sign up
			</Heading>
		  </Stack>
		  <Box
			rounded={"lg"}
			bg={useColorModeValue("white", "gray.800")} 
			boxShadow={"lg"}
			p={8}
		  >
			<Stack spacing={4}>
			  <HStack>
				<Box>
				  <FormInput
					label="Full name"
					type="text"
					value={inputs.name}
					onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
					isRequired
				  />
				</Box>
				<Box>
				  <FormInput
					label="Username"
					type="text"
					value={inputs.username}
					onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
					isRequired
				  />
				</Box>
			  </HStack>
			  <UniversityAutoComplete
				value={inputs.university}
				onChange={(val) => setInputs({ ...inputs, university: val })}
				isRequired
			  />
			  <FormInput
				label="Email address"
				type="email"
				value={inputs.email}
				onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				isRequired
			  />
			  <FormInput
				label="Password"
				type="password"
				value={inputs.password}
				onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
				showPassword={showPassword}
				onTogglePassword={() => setShowPassword((prev) => !prev)}
				isRequired
			  />
			  <Stack spacing={10} pt={2}>
				<Button
				  loadingText="Submitting"
				  size="lg"
				  bg={useColorModeValue("gray.600", "gray.700")}
				  color={"white"}
				  _hover={{
					bg: useColorModeValue("gray.700", "gray.800"),
				  }}
				  onClick={handleSignup}
				>
				  Sign up
				</Button>
			  </Stack>
			  <Stack pt={6}>
				<Text align={"center"}>
				  Already a user?{" "}
				  <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
					Login
				  </Link>
				</Text>
			  </Stack>
			</Stack>
		  </Box>
		</Stack>
	  </Flex>
	);
  }
  