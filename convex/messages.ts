import { mutation , query } from "./_generated/server";
import { v , ConvexError } from 'convex/values' ; 


export const sendTextMessage = mutation({
    args : {
        sender : v.string() ,
        content : v.string() , 
        conversationId : v.id('conversations') , 
    },
    handler : async (ctx , args) => {
        const identity = await ctx.auth.getUserIdentity() ; 
        if(!identity) {
            throw new ConvexError("Unauthorized") ;
        }

        const user = await ctx.db.query('users').withIndex('by_tokenIdentifier',(q) => q.eq('tokenIdentifier',identity.tokenIdentifier.slice(8))).unique() ;
        
        if(!user) {
            throw new ConvexError("User not found") ;
        }

        const conversation = await ctx.db.query('conversations').filter( q => q.eq(q.field('_id'),args.conversationId)).first() ; 
        if(!conversation) {
            throw new ConvexError("Conversation not found") ;
        }

        if(!conversation.participants.includes(user._id)) {
            throw new ConvexError("Unauthorized to send messages in this conversation") ;
        }

        const newMessage = await ctx.db.insert('messages', {
            sender : user._id,
            content : args.content,
            conversation : args.conversationId , 
            messageType : "text",
        }) ;

    }
});



//unoptimized
export const getMessages = query({
    args : {
        conversationId : v.id('conversations') ,
    },
    handler : async (ctx,args) => {
         const identity = await ctx.auth.getUserIdentity() ; 
         if(!identity) {
             throw new ConvexError("Unauthorized") ;
         }
         const messages = await ctx.db.query('messages').withIndex('by_conversation',q =>q.eq('conversation',args.conversationId)).collect() ; 

         const messagesWithSender = await Promise.all(
             messages.map(async (message) => {
                 const sender = await ctx.db.query('users').filter(q => q.eq(q.field('_id'),message.sender)).first() ; 

                return {...message, sender } ; 
             }));

         

         return messagesWithSender ; 
    }
});

export const sendImage = mutation({
	args: { imgId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const content = (await ctx.storage.getUrl(args.imgId)) as string;

		await ctx.db.insert("messages", {
			content: content,
			sender: args.sender,
			messageType: "image",
			conversation: args.conversation,
		});
	},
});




export const sendVideo = mutation({
	args: { videoId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const content = (await ctx.storage.getUrl(args.videoId)) as string;

		await ctx.db.insert("messages", {
			content: content,
			sender: args.sender,
			messageType: "video",
			conversation: args.conversation,
		});
	},
});

