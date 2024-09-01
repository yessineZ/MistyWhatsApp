import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogClose ,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImageIcon, MessageSquareDiff } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { mutation } from "../../../convex/_generated/server";
import toast from "react-hot-toast";
import { useConversationStore } from "@/store/chat-store";
const UserListDialog = () => {
	const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
	const [groupName, setGroupName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [renderedImage, setRenderedImage] = useState("");
	const imgRef = useRef<HTMLInputElement>(null);
	const dialogCloseRef = useRef<HTMLButtonElement>(null);
	const { selectedConversation  , setSelectedConversation} = useConversationStore() ; 
	 

    const generateUploadUrl = useMutation(api.conversations.generateUploadUrl) ; 

    
	const handleClick = () => {
		imgRef.current?.click();
	};

	useEffect(() => {
		if (!selectedImage) {
			setRenderedImage('');
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			setRenderedImage(e.target?.result as string);
		};
		reader.readAsDataURL(selectedImage);
	}, [selectedImage]);

    const createConversation = useMutation(api.conversations.createConversation) ; 

    const handleCreateConversation = async () => {
        if(selectedUsers.length === 0) return ; 
        setIsLoading(true) ;

        try {
            const isGroup = selectedUsers.length > 1 ;
            let conversationId ;
            if(!isGroup) {
                 conversationId = await createConversation({
                    participants : [...selectedUsers,getMe?._id!] ,
                    isGroup : false ,
                })

            }else {
				const postUrl = await generateUploadUrl() ; 
				const result = await fetch(postUrl , {
					method : 'POST', 
                    headers : { 'Content-Type' : selectedImage?.type!}, 
                    body : selectedImage 
				});
				const {storageId } = await result.json() ; 
				await createConversation({
					participants : [...selectedUsers,getMe?._id!] ,
					isGroup : true , 
                    groupName : groupName , 
                    groupImage : storageId , 
                    admin : getMe?._id! ,  
				});
				toast.success('Conversation created Successfully') ; 
			
			
			}
			setSelectedUsers([]) ; 
			setGroupName('') ;
			setSelectedImage(null) ;
			dialogCloseRef.current?.click() ; 
			


			const conversationName = isGroup ? groupName : users?.find((user) => user._id === selectedUsers[0])?.name ;
			
		console.log(selectedConversation) ; 
			setSelectedConversation({
				_id : conversationId,
                isGroup,
                name: conversationName,
                participants: selectedUsers,
                image : isGroup ? renderedImage : users?.find(user => user._id === selectedUsers[0])?.image ,
                admin: getMe?._id,
                groupName: isGroup? groupName : "",
			})


        }catch(err) {
            console.log(err) ;   
        }finally{
            setIsLoading(false) ;

        }
    }

    const users = useQuery(api.users.getUsers) ; 
	const getMe = useQuery(api.users.getMe) ; 
	console.log(getMe) ; 

	
	

	return (
		<Dialog>
			<DialogTrigger>
				<MessageSquareDiff size={20} />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					 <DialogClose ref={dialogCloseRef} />
					<DialogTitle>USERS</DialogTitle>
				</DialogHeader>

				<DialogDescription>Start a new chat</DialogDescription>
				{renderedImage && (
					<div className='w-16 h-16 relative mx-auto'>
						<Image
							src={renderedImage}
							fill
							alt='user image'
							className='rounded-full object-cover'
						/>
					</div>
				)}
				{/* File input for image */}
				<input
					type='file'
					accept='image/*'
					onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
					ref={imgRef}
					hidden
				/>
				{selectedUsers.length > 1 && (
					<>
						<Input
							placeholder='Group Name'
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
						/>
						<Button className='flex gap-2' onClick={handleClick}>
							<ImageIcon size={20} />
							Group Image
						</Button>
					</>
				)}
				<div className='flex flex-col gap-3 overflow-auto max-h-60'>
					{users?.map((user) => (
						<div
							key={user._id}
							className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
								transition-all ease-in-out duration-300
							${selectedUsers.includes(user._id) ? "bg-green-primary" : ""}`}
							onClick={() => {
								if (selectedUsers.includes(user._id)) {
									setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
								} else {
									setSelectedUsers([...selectedUsers, user._id]);
								}
							}}
						>
							<Avatar className='overflow-visible'>
								{user.isOnline && (
									<div className='absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground' />
								)}

								<AvatarImage src={user.image} className='rounded-full object-cover' />
								<AvatarFallback>
									<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full'></div>
								</AvatarFallback>
							</Avatar>

							<div className='w-full '>
								<div className='flex items-center justify-between'>
									<p className='text-md font-medium'>{user.name || user.email.split("@")[0]}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='flex justify-between'>
					<Button variant={"outline"}>Cancel</Button>
					<Button
                    onClick={handleCreateConversation}
						disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}
					>
						{/* spinner */}
						{isLoading ? (
							<div className='w-5 h-5 border-t-2 border-b-2  rounded-full animate-spin' />
						) : (
							"Create"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
export default UserListDialog;
