import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import UserHeader from "../components/UserHeader";
import Post from "../components/Post";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
	const { username } = useParams();
	const showToast = useShowToast();
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();

				if (data.error) {
					throw new Error(data.error);
				}

				setPosts(data);
			} catch (error) {
				showToast("Error", error.message || "Failed to fetch posts", "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, user, showToast, setPosts]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"} mt={12}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) {
		return (
			<Flex justifyContent={"center"} mt={12}>
				<Text fontSize={"xl"} fontWeight={"semibold"}>
					User not found
				</Text>
			</Flex>
		);
	}

	return (
		<>
			<UserHeader user={user} />

			{fetchingPosts ? (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			) : posts.length === 0 ? (
				<Flex justifyContent={"center"} mt={8}>
					<Text fontSize={"xl"} fontWeight={"medium"}>
						This user hasn't posted anything yet.
					</Text>
				</Flex>
			) : (
				posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))
			)}
		</>
	);
};

export default UserPage;
