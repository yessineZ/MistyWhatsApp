import { GoogleGenerativeAI } from '@google/generative-ai';
import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || "YOUR_GOOGLE_GEMINI_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(apiKey);

export const mistyRobot = action({
    args: {
        messageBody: v.string(),
        conversation: v.id('conversations'),
    },
    handler: async (ctx, args) => {
        let messageContent;
        console.log(args.messageBody);
        try {
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: 'You are a terse bot in a group chat responding to questions.',
            });
            const result = await model.generateContent(args.messageBody);
            messageContent = result.response.text();
        } catch (error) {
            console.error('Google Gemini API error:', error);
            messageContent = "hello";
        }

        await ctx.runMutation(api.messages.sendChatGPTMessage, {
            content: messageContent!,
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
        let imageUrl;
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(args.messageBody);
            // Note: Gemini 1.5 Flash doesn't support image generation
            // This is a placeholder; consider using a dedicated image generation API
            imageUrl = '/mistyRobot.png'; // Fallback as Gemini doesn't generate images
        } catch (error) {
            console.error('Google Gemini API error:', error);
            imageUrl = '/mistyRobot.png';
        }

        await ctx.runMutation(api.messages.sendChatGPTMessage, {
            content: imageUrl,
            conversation: args.conversation,
            messageType: 'image',
        });
    },
});
