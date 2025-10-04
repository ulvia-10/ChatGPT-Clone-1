import { useMutation } from "@tanstack/react-query";

async function deleteConversationById(id) {
	const res = await fetch(
		`https://chat-chatcuek.satrya.dev/api/conversations/${id}`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	if (!res.ok) {
		throw new Error("Failed to delete conversation");
	}

	const text = await res.text();
	try {
		return text ? JSON.parse(text) : true;
	} catch {
		return true;
	}
}

export function useDeleteConversation() {
	return useMutation({
		mutationFn: deleteConversationById,
	});
}