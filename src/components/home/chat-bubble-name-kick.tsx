import { IMessage, useConversationStore } from "@/store/chat-store";
import { Ban, LogOut } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";

type ChatAvatarActionsProps = {
    message: IMessage;
    me: any;
};

const ChatNameKick = ({ message, me }: ChatAvatarActionsProps) => {
    const kickUser = useMutation(api.conversations.kickUser);
    const unKickUser = useMutation(api.conversations.unKickUser);
    const { selectedConversation, setSelectedConversation } = useConversationStore();
    
    const isMember = selectedConversation?.participants?.includes(message.sender?._id) || false;

    const handleKickUser = async () => {
        try {
            await kickUser({ conversationId: selectedConversation?._id, userId: message.sender._id });
            toast.success("User kicked successfully");
            setSelectedConversation({
                ...selectedConversation,
                participants: selectedConversation.participants.filter(userId => userId !== message.sender._id),
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnKicked = async () => {
        try {
            await unKickUser({ conversationId: selectedConversation?._id, userId: message.sender._id });
            toast.success("User unbanned successfully");
            setSelectedConversation({
                ...selectedConversation,
                participants: selectedConversation?.participants?.concat(message.sender._id),
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex gap-4 items-center justify-start group font-bold cursor-pointer">
            <span className="text-sm text-white text-bold">{message.sender.name}</span>
            
            {isMember && selectedConversation?.admin === me._id && (
                <LogOut size={16} className="opacity-0 group-hover:opacity-100 text-red-600" onClick={handleKickUser} />
            )}

            {!isMember && (
                <span className="text-sm text-red-600">
                    <Ban size={16} onClick={handleUnKicked} />
                </span>
            )}
        </div>
    );
};

export default ChatNameKick;
