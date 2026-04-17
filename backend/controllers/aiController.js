const { OpenAI } = require('openai');
const Task = require('../models/Task');
const Schedule = require('../models/Schedule');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        // Fetch user context
        const tasks = await Task.find({ user: req.user.id });
        const schedules = await Schedule.find({ user: req.user.id }).populate('task');

        const pendingTasks = tasks.filter(t => t.status === 'pending');
        const completedTasks = tasks.filter(t => t.status === 'completed');

        // Prepare context for the AI
        let systemPrompt = `You are Smart Task AI, a personal productivity assistant. 
Your goal is to help the user manage their time, answer questions about their schedule, and provide reasoning for task priorities.
Here is the user's current context:
- Completed Tasks: ${completedTasks.length}
- Pending Tasks: ${pendingTasks.length}
- Total tasks: ${tasks.length}

Pending Tasks List:
${pendingTasks.map(t => `- ${t.title} (Duration: ${t.duration}h, Priority: ${t.priority}, Deadline: ${new Date(t.deadline).toLocaleString()})`).join('\n')}

Current Schedule:
${schedules.map(s => `- ${s.task.title} from ${new Date(s.startTime).toLocaleTimeString()} to ${new Date(s.endTime).toLocaleTimeString()}`).join('\n')}

Based on this information, provide helpful, concise, and actionable advice to the user's query.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
        console.error(err.message);
        // If they don't have API key set up, return a mock response for now
        if (err.message.includes('API key')) {
           return res.json({ reply: "I am running in mock mode because the OpenAI API key is missing. But I see you have " + await Task.countDocuments({user: req.user.id}) + " tasks!" });
        }
        res.status(500).send('Server Error');
    }
};
