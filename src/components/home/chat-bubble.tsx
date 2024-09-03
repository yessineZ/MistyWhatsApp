import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat-store";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { Bot, Video } from "lucide-react";
import ChatBubbleAvatar from "./chat-bubble-avatar" ; 
import DateIndicator from "./date-Indicator";
import { ReactAction } from "convex/react";
import ReactPlayer from "react-player";
import ChatNameKick from "./chat-bubble-name-kick";
import { cp } from "fs";

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
	const isMember = selectedConversation?.participants?.includes(message.sender?._id) || false;
	const isGroup = selectedConversation?.isGroup;
	const fromMe = message.sender?._id === me._id;
	console.log(message) ; 
	const fromAI = message?.sender.name === 'mistyRobot';
	console.log(fromAI) ; 
	const bgClass = fromMe ? "bg-green-chat" : !fromAI ? "bg-white dark:bg-gray-primary" : "bg-blue-500 text-white";
	const [open, setOpen] = useState(false);
	const [openVid,setOpenVid] = useState(false) ; 
	console.log(openVid) ; 
	
	

	if (!fromMe) {
		return (
			<>
				<DateIndicator message={message} previousMessage={previousMessage} />
				<div className='flex gap-1 w-2/3'>
					
					<ChatBubbleAvatar isGroup={isGroup!} isMember={isMember} message={message} fromAI={fromAI} />
					
					<div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
					<ChatNameKick message={message} me={me} isAI={fromAI} /> 
						{message.messageType === 'text' && <TextMessage chpt={fromAI} message={message}/> }
				{message.messageType === 'image' && <ImageMessage message={message} handleClick={() => setOpen(true)} /> }
				{message.messageType ==='video' &&
				<span className='pc1:h-[150px] pc1:w-[150px] pc2:h-[200px] pc2:w-[200px] phone:h-[50px] phone:w'>	
				<VideoMessage handleClick={() => setOpenVid(true)} message={message} />  </span>}
						{!fromAI && <OtherMessageIndicator />}
						{fromAI && <Bot size={16} className='absolute bottom-[2px] left-2' />}

						{open && <MediaDialog src={message.content} open={open} onClose={() => setOpen(false)} type="image"/>}
						<MessageTime time={time} fromMe={fromMe} />
						{openVid && <MediaDialog src={message.content} open={openVid} onClose={() => setOpenVid(false) } type='video' /> }    
					</div>
					 
				</div>
			</>
		);
	}
 
	return (
		<>
			<DateIndicator message={message} previousMessage={previousMessage} />

			<div className='flex gap-1 w-2/3 ml-auto'>
				<div className={`flex z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}>
				{message.messageType === 'text' && <TextMessage chpt={fromAI} message={message}/> }
				{message.messageType === 'image' && <ImageMessage message={message} handleClick={() => setOpen(true)} /> }
				{message.messageType ==='video' &&
				<span className='pc1:h-[150px] pc1:w-[150px] pc2:h-[200px] pc2:w-[200px] phone:h-[50px] phone:w-[50px]'>	
				<VideoMessage message={message} handleClick={() => setOpenVid(true)} /> 
				</span>}
					<SelfMessageIndicator />
					
					{open && <MediaDialog src={message.content} open={open} onClose={() => setOpen(false)} type="image" />}
					<MessageTime time={time} fromMe={fromMe} />
					
					{openVid && <MediaDialog src={message.content} open={openVid} onClose={() => setOpenVid(false) } type='video' /> }    
				</div>
				<ChatBubbleAvatar isGroup={isGroup!} isMember={isMember} message={message} fromAI={fromAI} />
			</div>
		</>
	);
};
export default ChatBubble;

const MediaDialog = ({ src, onClose, open, type }: { open: boolean; src: string; onClose: () => void; type: "image" | "video" }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className='pc1:min-w-[750px] pc2:min-w-[750px] pc1:h-max pc2:h-full phone:w-[300px] phone:h-[300px]'>
        <DialogDescription className='relative h-[450px] flex justify-center'>
          {type === "image" ? (
            <Image src={src} fill className='rounded-lg object-contain' alt='image' />
          ) : (
            <ReactPlayer url={src} width='100%' height='100%' controls={true} />
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};



const VideoMessage = ({ message, handleClick }: { message: IMessage; handleClick: () => void }) => {
  return (
    <div onClick={handleClick}>
      <ReactPlayer url={message.content} width='80%' height='80%' controls={true} />
    </div>
  );
};

const ImageMessage = ({ message, handleClick }: { message: IMessage; handleClick: () => void }) => {
  return (
    <div className='md:w-[150px] pc1:w-[200px] pc1:h-[200px] pc2:h-[250px] pc2:w-[250px] phone:h-[50px] phone:w-[50px] m-2 relative' onClick={handleClick}>
      <Image
        src={message.content}
        fill
        className='object-cover rounded'
        alt='image'
      />
    </div>
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



const TextMessage = ({ message , chpt }: { message: IMessage , chpt : boolean }) => {
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

	return (
		<div>
			{isLink ? (
				<a
					href={message.content}
					target='_blank'
					rel='noopener noreferrer'
					className={`mr-2 text-sm font-bold ${chpt ? ' text-black' : 'text-blue-400'  } underline`}
				>
					{message.content}
				</a>
			) : (
				<p className={`mr-2 text-sm font-bold text-pretty ${chpt ? 'text-red-600' : 'dark:text-white text-black'  }`}>{message.content}</p>
			)}
		</div>
	);
};