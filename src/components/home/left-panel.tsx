import { ListFilter, LogOut, MessageSquareDiff, Search, User } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "./theme-switch";
import Conversation from "./conversation";
import {  SignIn, SignOutButton, UserButton } from "@clerk/clerk-react";
import { SignedIn , SignedOut } from "@clerk/nextjs";
import UserListDialog from "./user-list-dialog";
import { useConvexAuth, useQuery } from "convex/react";
import { query } from "../../../convex/_generated/server";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";
import { useConversationStore } from "@/store/chat-store";
const LeftPanel = () => {
 
	const { isAuthenticated, isLoading } = useConvexAuth() ; 
		const conversations = useQuery(api.conversations.getMyConversations ,isAuthenticated ? undefined : 'skip') ;
		const {selectedConversation , setSelectedConversation}  = useConversationStore() ;  
		 

		
		useEffect(() => {
			const conversationsIds = conversations?.map(conversation => conversation._id) ;
			if(selectedConversation && !conversationsIds?.includes(selectedConversation?._id)) {
				setSelectedConversation(null) ; 
			}
		},[selectedConversation,conversations]); ; 

	return (
		<div className='pc1:w-1/4 pc2:w-1/4 phone:w-full  border-gray-600 border-r'>
			<div className='sticky top-0 bg-left-panel z-10'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-3 items-center'>
					<UserButton></UserButton>

					

					<div className='flex items-center gap-3'>
				{isAuthenticated && <UserListDialog/> }	
						<ThemeSwitch />
						<SignedIn>

						<span className=''>
							<LogOut size={16}/>

							<span className='opacity-0 rounded top-3  absolute'><SignOutButton/></span>
							
						
						</span>	
						</SignedIn>
					</div>
				</div>
				<div className='p-3 flex items-center'>
					{/* Search */}
					<div className='relative h-10 mx-3 flex-1'>
						<Search
							className='absolute left-3  transform top-1/2  -translate-y-1/2 text-gray-500 z-10'
							size={20}
						/>
						<Input
							type='text'
							placeholder='Search or start a new chat'
							className='pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent'
						/>
					</div>
					<ListFilter className='cursor-pointer' />
				</div>
			</div>

			{/* Chat List */}
			<div className='my-3 flex flex-col gap-0 max-h-[80%] pc1:h-full  pc2:h-full  phone:h-[70px] overflow-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-pink-500 scrollbar-track-pink-800'>
        {conversations?.map((conversation) => (
          <Conversation key={conversation._id} conversation={conversation} />
        ))}
				{/* Conversations will go here*/}

				{conversations?.length === 0 && (
					<>
						<p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
						<p className='text-center text-gray-500 text-sm mt-3 '>
							We understand {"you're"} an introvert, but {"you've"} got to start somewhere 😊
						</p>
					</>
				)}
			</div>
		</div>
	);
};
export default LeftPanel;