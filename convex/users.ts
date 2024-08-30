import { ConvexError, v }  from 'convex/values' ;
import { internalMutation , query } from './_generated/server';
import { copyFileSync } from 'fs';
"ts-ignore"
export const createUser = internalMutation({
    args : {
        tokenIdentifier : v.string() ,
        name : v.string() ,
        image : v.string(),
        email : v.string() 
    },
    handler : async (ctx , args) => {
         await ctx.db.insert("users",{
            tokenIdentifier : args.tokenIdentifier,
            name : args.name ,
            image : args.image ,
            email : args.email ,
            isOnline : true ,
         })
    }




});






export const getUsers = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
        const tokenIdentifier = identity?.tokenIdentifier.slice(8) ; 
        console.log(tokenIdentifier) ; 
		 
        if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const users = await ctx.db.query("users").collect();
		return users.filter((user) => {
           console.log(user.tokenIdentifier+ " piw  " + identity.tokenIdentifier) ; 
            return user.tokenIdentifier !== tokenIdentifier ;
        })
	},
});

export const getMe = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const users = await ctx.db.query("users").collect();
		const currentUser = users.find((user) => user.email === identity.email);
		console.log(currentUser) ;
        return currentUser;
	},
});




export const updateUser = internalMutation({
	args: { tokenIdentifier: v.string(), image: v.string() },
	async handler(ctx, args) {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, {
			image: args.image,
		});

	},
});



export const  setUserOnline = internalMutation({
    args : {
        tokenIdentifier : v.string()
    },
    handler : async(ctx , args) => {
        const user = await ctx.db.query('users').withIndex('by_tokenIdentifier',q => q.eq("tokenIdentifier",args.tokenIdentifier)).unique() 
    
    if(!user)  {
        return new ConvexError("User not found") ; 
    
        }    
    await ctx.db.patch(user._id,{isOnline : true}) ; 
    }
})


export const  setUserOffline = internalMutation({
    args : {
        tokenIdentifier : v.string()
    },
    handler : async(ctx , args) => {
        const user = await ctx.db.query('users').withIndex('by_tokenIdentifier',q => q.eq("tokenIdentifier",args.tokenIdentifier)).unique() 
    
    if(!user)  {
        return new ConvexError("User not found") ; 
    
        }    
    await ctx.db.patch(user._id,{isOnline : false}) ; 
    }
});

