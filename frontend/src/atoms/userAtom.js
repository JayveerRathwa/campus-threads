import {atom} from "recoil";

const userAtom = atom({
	key: "userAtom",
	default: (() => {
	  try {
		const storedUser = localStorage.getItem("user-threads");
		return storedUser ? JSON.parse(storedUser) : null;
	  } catch (err) {
		console.error("Failed to parse user from localStorage:", err);
		return null;
	  }
	})(),
  });

export default userAtom;
  