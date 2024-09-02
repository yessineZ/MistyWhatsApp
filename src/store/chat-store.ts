import { create } from "zustand"; 
import { Id } from "../../convex/_generated/dataModel"; 

export type Conversation = {
     _id: any ; 
    image?: string;
    participants?: Id<"users">[];
    admin?: Id<"users"> ;
    groupImage?: string;
    groupName?: string;
    isGroup: boolean | null | undefined ;
    name?: string;
    lastMessage?: {
        _id: Id<"messages">;
        conversation?: Id<"conversations">;
        content: string;
        sender: Id<"users">;
    };
};

type ConversationStore = {
    selectedConversation: Conversation | null;
    setSelectedConversation: (conversation: Conversation | null) => void;
};


export const useConversationStore = create<ConversationStore>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}));







export interface IMessage {
	_id: string;
	content: string;
	_creationTime: number;
	messageType: "text" | "image" | "video";
	sender: {
		_id: Id<"users">;
		image: string;
		name?: string;
		tokenIdentifier: string;
		email: string;
		_creationTime: number;
		isOnline: boolean;
	}   ;
}