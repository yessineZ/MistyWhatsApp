import OpenAi from 'openai';
import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

const apiKey = process.env.OPENAI_API_KEY; 

const openAi = new OpenAi({ apiKey });


export const mistyRobot = action({
    args: {
        messageBody: v.string(),
        conversation: v.id('conversations'),
    },
    handler: async (ctx, args) => {
        let messageContent;
        try {
            const res = await openAi.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a terse bot and you are in a group chat responding to questions with 1-sentence answers.',
                    },
                    {
                        role: 'user',
                        content: args.messageBody,
                    },
                ],
            });
            messageContent = res.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            messageContent = "Something went wrong with the OpenAI API.";
        }

        
        await ctx.runMutation(api.messages.sendChatGPTMessage, {
            content: messageContent,
            conversation: args.conversation,
            messageType: 'text',
        });
    },
});


export const mistyRobot2 = action({
    args: {
        messageBody: v.string(),
        conversation: v.id('conversations'),
    },
    handler: async (ctx, args) => {
        try {
            const res = await openAi.images.generate({
                model: 'dall-e-2',
                prompt: args.messageBody,
                n: 1,
                size: '512x512',
            });
            const imageUrl = res.data[0].url;

            await ctx.runMutation(api.messages.sendChatGPTMessage, {
                content: imageUrl ?? '/mistyRobot.png',
                conversation: args.conversation,
                messageType: 'image',
            });
        } catch (error) {
            console.error('DALL-E API error:', error);
        
            await ctx.runMutation(api.messages.sendChatGPTMessage, {
                content: '/mistyRobot.png', 
                conversation: args.conversation,
                messageType: 'image',
            });
        }
    },
});
