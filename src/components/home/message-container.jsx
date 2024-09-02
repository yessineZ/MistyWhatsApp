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
		<div className='relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-green-primary scrollbar-track-green-primary'>
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