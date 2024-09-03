import { IMessage, useConversationStore } from "@/store/chat-store";
import { BadgeCheck, Ban, LogOut } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";
import { getMe } from "../../../convex/users";

type ChatAvatarActionsProps = {
    message: IMessage;
    me: any;
    isAI : boolean;
};

const ChatNameKick = ({ message, me , isAI }: ChatAvatarActionsProps) => {
    const kickUser = useMutation(api.conversations.kickUser);
    const unKickUser = useMutation(api.conversations.unKickUser);
    const { selectedConversation, setSelectedConversation } = useConversationStore();
    const createConversation = useMutation(api.conversations.createConversation) ; 
    const specialUsers : string[] = ['Zouari Yessine','Misty','Yessine Zouari','misty']  ; 
    
    const isMember = selectedConversation?.participants?.includes(message.sender?._id) || false;

    const handleKickUser = async () => {
        try {
            await kickUser({ conversationId: selectedConversation?._id, userId: message.sender?._id });
            toast.success("User kicked successfully");
            setSelectedConversation({
                 ...selectedConversation,
            _id: selectedConversation?._id,  // explicitly include the _id
            participants: selectedConversation?.participants?.filter(userId => userId !== message.sender?._id),
            image: selectedConversation?.image,
            admin: selectedConversation?.admin,
            groupImage: selectedConversation?.groupImage,
            groupName: selectedConversation?.groupName,
            isGroup: selectedConversation?.isGroup,
            name: selectedConversation?.name,
            lastMessage: selectedConversation?.lastMessage,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnKicked = async () => {
        try {
            await unKickUser({ conversationId: selectedConversation?._id, userId: message.sender?._id });
            toast.success("User unbanned successfully");
            setSelectedConversation({
                ...selectedConversation,
                _id: selectedConversation?._id,  
                participants: selectedConversation?.participants?.concat(message.sender?._id),
                image: selectedConversation?.image,
            admin: selectedConversation?.admin,
            groupImage: selectedConversation?.groupImage,
            groupName: selectedConversation?.groupName,
            isGroup: selectedConversation?.isGroup,
            name: selectedConversation?.name,
            lastMessage: selectedConversation?.lastMessage,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateConversation = async () => {
        try {
            if(isAI) {
                return ; 
            } 
        const conversationId = await createConversation({

            participants : [me._id,message.sender?._id] , 
            isGroup : false,

        });
        setSelectedConversation({
            _id: conversationId,
            participants: [me?._id, message.sender?._id],
            isGroup: false,
            admin: me._id,
            image : message.sender?.image ,
            
        })
    }catch(error) {
        console.error(error);
    }




    }

    return (
        <div className="flex gap-4 items-center justify-start group font-bold cursor-pointer">
            <span className={`text-sm ${isAI ?  "text-yellow-500" :  "text-black dark:text-white" } text-bold flex gap-2 items-center justify-center`} onClick={handleCreateConversation}> 
                {message.sender?.name}
                 {specialUsers.includes(message.sender?.name!) && <BadgeCheck size={16} className="text-blue-700"/> }              
            </span>
            
            {isMember && selectedConversation?.admin === me._id && !isAI && (
                <LogOut size={16} className="opacity-0 group-hover:opacity-100 text-red-600" onClick={handleKickUser} />
            )}

            {!isMember && !isAI && (
                <span className="text-sm text-red-600">
                    <Ban size={16} onClick={handleUnKicked} />
                </span>
            )}
        </div>
    );
};

export default ChatNameKick;
