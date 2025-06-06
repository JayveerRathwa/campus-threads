import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const fetch = await import('node-fetch');
		const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
		// const HF_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
		const HF_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest";

		const response = await fetch.default(HF_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(HF_TOKEN && { Authorization: `Bearer ${HF_TOKEN}` }),
		},
		body: JSON.stringify({ inputs: text }),
		});

		if (!response.ok) {
			const errorText = await response.text(); 
			throw new Error(`Hugging Face API error ${response.status}: ${errorText}`);
		}

		const result = await response.json();

		let arr = Array.isArray(result) ? result : result[0];
		if (Array.isArray(arr[0])) arr = arr[0];

		const top = arr.reduce((a, b) => (a.score > b.score ? a : b), arr[0]);
		const labelValue = top?.label ?? "";

		let sentiment = "uncertain";
		if (labelValue === "LABEL_2" || /positive/i.test(labelValue)) sentiment = "happy";
		else if (labelValue === "LABEL_0" || /negative/i.test(labelValue)) sentiment = "sad";
		else if (labelValue === "LABEL_1" || /neutral/i.test(labelValue)) sentiment = "uncertain";

		if (/angry|furious|mad|rage|outraged|enraged|irritated|pissed/i.test(text)) {
			sentiment = "angry";
		}

		// const response = await fetch.default(HF_URL, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		...(HF_TOKEN && { Authorization: `Bearer ${HF_TOKEN}` }),
		// 	},
		// 	body: JSON.stringify({ inputs: text }),
		// });
	
		// if (!response.ok) {
		// 	const errTxt = await response.text();
		// 	console.error("HuggingFace error:", errTxt);
		// 	throw new Error(`HuggingFace API error ${response.status}: ${errTxt}`);
		// }
	
		// const result = await response.json();
		// console.log("HuggingFace API response:", result);
	
		// let arr = Array.isArray(result) ? result : result[0];
		// if (Array.isArray(arr[0])) arr = arr[0];
	
		// const top = arr.reduce((a, b) => (a.score > b.score ? a : b), arr[0]);
		// const labelValue = top?.label ?? "";
	
		// let sentiment = "uncertain";
		// if (/positive/i.test(labelValue)) sentiment = "happy";
		// else if (/negative/i.test(labelValue)) sentiment = "sad";
		// else if (/neutral/i.test(labelValue)) sentiment = "uncertain";
	
		// if (/angry|furious|mad|rage|outraged|enraged|irritated|pissed/i.test(text)) {
		// 	sentiment = "angry";
		// }

		const newPost = new Post({ postedBy, text, img, sentiment });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: [...following, userId] } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUserReplies = async (req, res) => {
	const { username } = req.params;
	try {
	  const user = await User.findOne({ username });
	  if (!user) {
		return res.status(404).json({ error: "User not found" });
	  }
  
	  // Find posts where the user has replied
	  const postsWithReplies = await Post.find({ 'replies.userId': user._id }).sort({ createdAt: -1 });
  
	  res.status(200).json(postsWithReplies);
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
};  

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, getUserReplies };
