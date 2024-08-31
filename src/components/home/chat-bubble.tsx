import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat-store";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Bot } from "lucide-react";
import ChatBubbleAvatar from "./chat-bubble-avatar" ; 
import DateIndicator from "./date-Indicator";
import { ReactAction } from "convex/react";
import ReactPlayer from "react-player";
import ChatNameKick from "./chat-bubble-name-kick";

type ChatBubbleProps = {
	message: IMessage;
	me: any;
	previousMessage: IMessage;
};

const ChatBubble = ({ me, message, previousMessage }: ChatBubbleProps) => {
	const date = new Date(message._creationTime);
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	const time = `${hour}:${minute}`;

	const { selectedConversation } = useConversationStore();
	const isMember = selectedConversation?.participants.includes(message.sender?._id) || false;
	const isGroup = selectedConversation?.isGroup;
	const fromMe = message.sender?._id === me._id;
	const fromAI = message.sender?.name === "ChatGPT";
	const bgClass = fromMe ? "bg-green-chat" : !fromAI ? "bg-white dark:bg-gray-primary" : "bg-blue-500 text-white";
	console.log(message.sender);
	const [open, setOpen] = useState(false);

	

	if (!fromMe) {
		return (
			<>
				<DateIndicator message={message} previousMessage={previousMessage} />
				<div className='flex gap-1 w-2/3'>
					
					<ChatBubbleAvatar isGroup={isGroup} isMember={isMember} message={message} fromAI={fromAI} />
					
					<div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
						<ChatNameKick message={message} me={me}/>
						{message.messageType === 'text' && <TextMessage message={message}/> }
				{message.messageType === 'image' && <ImageMessage message={message} handleClick={() => setOpen(true)} /> }
				{message.messageType ==='video' && <VideoMessage message={message} /> }
						
						{!fromAI && <OtherMessageIndicator />}
						{fromAI && <Bot size={16} className='absolute bottom-[2px] left-2' />}

						{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
						<MessageTime time={time} fromMe={fromMe} />
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<DateIndicator message={message} previousMessage={previousMessage} />

			<div className='flex gap-1 w-2/3 ml-auto'>
				<div className={`flex  z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}>
				{message.messageType === 'text' && <TextMessage message={message}/> }
				{message.messageType === 'image' && <ImageMessage message={message} handleClick={() => setOpen(true)} /> }
				{message.messageType ==='video' && <VideoMessage message={message} /> }
				
					<SelfMessageIndicator />
					
					{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
					<MessageTime time={time} fromMe={fromMe} />
					
				
				</div>
				<ChatBubbleAvatar isGroup={isGroup} isMember={isMember} message={message} fromAI={fromAI} />
			</div>
		</>
	);
};
export default ChatBubble;


const ImageMessage = ({ message , handleClick  }: { message: IMessage , handleClick : () => void }) => {
	return (
		<div className='md:w-[150px] lg:w-[250px] lg:h-[250px] md:h-[150px] m-2 relative'>
			<Image
				src={message.content}
				fill
				className='cursor-pointer object-cover rounded'
				alt='image'
				onClick={handleClick}
				
			/>
		</div>
	);
};

const ImageDialog = ({ src, onClose, open }: { open: boolean; src: string; onClose: () => void }) => {
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent className='min-w-[750px]'>
				<DialogDescription className='relative h-[450px] flex justify-center'>
					<Image src={src} fill className='rounded-lg object-contain' alt='image' />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
	return (
		<p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
			{time} {fromMe && <MessageSeenSvg />}
		</p>
	) ;
};

const OtherMessageIndicator = () => (
	<div className='absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full' />
);

const SelfMessageIndicator = () => (
	<div className='absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden' />
);

const VideoMessage = ({ message } : { message : IMessage }) => {
	return <ReactPlayer url={message.content} width="250px" height="250px" controls={true} />
}



const TextMessage = ({ message }: { message: IMessage }) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

	return (
		<div>
			{isLink ? (
				<a
					href={message.content}
					target='_blank'
					rel='noopener noreferrer'
					className={`mr-2 text-sm font-bold text-blue-400 underline`}
				>
					{message.content}
				</a>
			) : (
				<p className={`mr-2 text-sm font-bold text-pretty text-red-600`}>{message.content}</p>
			)}
		</div>
	);
};