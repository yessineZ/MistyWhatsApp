"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";
import { useQuery } from "convex/react";
import { BadgeCheck } from "lucide-react";
import { api } from "../../../convex/_generated/api";
const RightPanel = () => {
	 

	const { selectedConversation , setSelectedConversation} = useConversationStore() ; 
	console.log(selectedConversation);

 	if (!selectedConversation) return <ChatPlaceHolder />;

	

	const conversationName = selectedConversation.groupName || selectedConversation.name; 
	
	

	const isGroup = true ; 

	return (
		<div className='pc1:w-3/4 pc2:w-3/4 flex flex-col phone:w-full phone:h-3/4 pc1:h-full pc2:h-full'>
			<div className='w-full sticky top-0 z-50'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-3'>
					<div className='flex gap-3 items-center'>
						<Avatar>
							<AvatarImage src={selectedConversation.image || selectedConversation.groupImage || '/placeholder.png'} className='object-cover' />
							<AvatarFallback>
								<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full' />
							</AvatarFallback>
						</Avatar>
						<div className='flex flex-col'>
							<p className="flex flex-row items-center justify-center">{conversationName}
								{conversationName === ('Zouari Yessine' || 'Misty' || 'Yessine Zouari') && <BadgeCheck size={16} className="text-blue-700 m-2" />}
							</p>
							 {selectedConversation.isGroup && <GroupMembersDialog />} 

						</div>
					</div>

					<div className='flex items-center gap-7 mr-5'>
						<a href='/video-call' target='_blank'>
							<Video size={23} />
						</a>
						<X size={16} className='cursor-pointer' onClick={() => setSelectedConversation(null)} />
					</div>
				</div>
			</div>
			{/* CHAT MESSAGES */}
			<MessageContainer />

			{/* INPUT */}
            <MessageInput />

			
		</div>
	);
};
export default RightPanel;