import { messages } from "@/dummy-data/db";
import ChatBubble from "./chat-bubble";
import { useConversationStore } from "@/store/chat-store";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
const MessageContainer = () => {
	const lastMessage =  useRef() ; 
	useEffect(() => {
		setTimeout(() => {
			lastMessage.current?.scrollIntoView({ behavior: "smooth" });	
		},100)
		
	})
	const { selectedConversation } = useConversationStore() ; 
	const messages = useQuery(api.messages.getMessages , {
		conversationId: selectedConversation._id,
	}) ; 
	const me = useQuery(api.users.getMe) ; 


	return (
		<div className='relative flex-1 p-3 overflow-auto bg-chat-tile-light dark:bg-chat-tile-dark scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-pink-500 scrollbar-track-pink-800'>
			<div className='mx-12 flex flex-col gap-3 h-full'>
				{messages?.map((msg, idx) => (
					<div key={msg._id} ref={lastMessage}>

						<ChatBubble me={me} message={msg} previousMessage={ idx > 0 ? messages[idx - 1] : undefined} />

					</div>
				))}
			</div>
		</div>
	);
};
export default MessageContainer;