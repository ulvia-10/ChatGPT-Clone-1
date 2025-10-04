import { useMutation, useQueryClient } from "@tanstack/react-query";

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

	return res.json();
}

export function useDeleteConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteConversationById,
		onSuccess: (data, id) => {
			queryClient.invalidateQueries({ queryKey: ["conversation", id] });
		},
	});
}