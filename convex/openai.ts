import OpenAi from 'openai';
import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

const apiKey = process.env.OPENAI_API_KEY; 

const openAi = new OpenAi({ apiKey });

// First Action: mistyRobot (chat response generation)
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

        // Send message content back to the conversation
        await ctx.runMutation(api.messages.sendChatGPTMessage, {
            content: messageContent,
            conversation: args.conversation,
            messageType: 'text',
        });
    },
});

// Second Action: mistyRobot2 (image generation with DALL-E 2)
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

            // Send the generated image URL back to the conversation
            await ctx.runMutation(api.messages.sendChatGPTMessage, {
                content: imageUrl ?? '/mistyRobot.png', // Fallback to a default image if generation fails
                conversation: args.conversation,
                messageType: 'image',
            });
        } catch (error) {
            console.error('DALL-E API error:', error);
            // Fallback if image generation fails
            await ctx.runMutation(api.messages.sendChatGPTMessage, {
                content: '/mistyRobot.png', // Fallback image
                conversation: args.conversation,
                messageType: 'image',
            });
        }
    },
});
