import { Laugh, Mic, Plus, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useConversationStore } from "@/store/chat-store";
import toast from "react-hot-toast";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import useComponentVisible from "@/hooks/useComponentVisible";
import loadingSpinner from "../loadingSpinner";
import MediaDropdown from "./mediaDropDown";
const MessageInput = () => {
    const [msgText, setMsgText] = useState("");
	const [isSending,setIsSending] = useState(false)  ;
    const me = useQuery(api.users.getMe);
    const { selectedConversation } = useConversationStore();
    const sendMessage = useMutation(api.messages.sendTextMessage);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!msgText) return;

        try {
			setIsSending(true);
            await sendMessage({
                content: msgText,
                conversationId: selectedConversation._id,
                sender: me._id,
            });
        } catch (e) {
            console.error(e);
            toast.error("Failed to send message.");
        } finally {
            setMsgText("");
			setIsSending(false);
        }
    };

    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible();

    return (
        <div className="bg-gray-primary p-2 flex gap-4 items-center">
            <div className="relative flex gap-2 ml-2">
                <div ref={ref} onClick={() => setIsComponentVisible(true)}>
                    <Laugh className="text-gray-600 dark:text-gray-400 cursor-pointer" />
                    {isComponentVisible && (
                        <EmojiPicker
                            theme={Theme.DARK}
                            onEmojiClick={(emoji) => setMsgText((prev) => prev + emoji.emoji)}
                            style={{
                                position: "absolute",
                                bottom: "1.5rem",
                                left: "1rem",
                                zIndex: 150,
                            }}
                        />
                    )}
                </div>
                <MediaDropdown/>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex gap-3">
                <div className="flex-1">
					 
                    <Input
                        type="text"
                        placeholder="Type a message"
                        className="py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent"
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                    />

                </div>
					
                <div className="mr-4 flex items-center gap-3">
                    
					
					{isSending ? <span className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
  </span> :
					<Button
                        type="submit"
                        size="sm"
                        className="bg-transparent text-foreground hover:bg-transparent"
                    >
                        {msgText.length > 0 ? <Send /> : <Mic />}
					
                    </Button>
}
                </div>
            </form>
        </div>
    );
};

export default MessageInput;
