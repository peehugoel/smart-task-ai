const Task = require('../models/Task');
const Schedule = require('../models/Schedule');

exports.getSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user.id }).populate('task');
    res.json(schedules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.autoSchedule = async (req, res) => {
  try {
    // 1. Clear current schedule for today onwards (simplified)
    const now = new Date();
    await Schedule.deleteMany({ user: req.user.id, startTime: { $gte: now } });

    // 2. Fetch pending tasks
    const tasks = await Task.find({ user: req.user.id, status: 'pending' });

    // 3. Sort tasks: Priority (High > Medium > Low), then Deadline
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    tasks.sort((a, b) => {
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(a.deadline) - new Date(b.deadline);
    });

    // 4. Basic Scheduling Logic
    // We assume the user works from 9 AM to 6 PM every day.
    // We will start scheduling from the next available working hour.
    let currentSlotStart = new Date(now);
    // Round up to next hour for simplicity
    currentSlotStart.setMinutes(0, 0, 0);
    currentSlotStart.setHours(currentSlotStart.getHours() + 1);
    
    // Ensure it's within working hours (9 to 18)
    if (currentSlotStart.getHours() < 9) {
      currentSlotStart.setHours(9, 0, 0, 0);
    } else if (currentSlotStart.getHours() >= 18) {
      currentSlotStart.setDate(currentSlotStart.getDate() + 1);
      currentSlotStart.setHours(9, 0, 0, 0);
    }

    const newSchedules = [];
    const conflicts = []; // to track tasks that overbook

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let durationMs = task.duration * 60 * 60 * 1000;
        let slotEnd = new Date(currentSlotStart.getTime() + durationMs);

        // If slot End breaches 6 PM, we might need to split or move to next day
        // For simplicity, we just move the whole task to the next day if it doesn't fit
        if (slotEnd.getHours() > 18 || (slotEnd.getHours() === 18 && slotEnd.getMinutes() > 0)) {
            currentSlotStart.setDate(currentSlotStart.getDate() + 1);
            currentSlotStart.setHours(9, 0, 0, 0);
            slotEnd = new Date(currentSlotStart.getTime() + durationMs);
        }

        // Check against deadline
        if (slotEnd > new Date(task.deadline)) {
            conflicts.push(`Task "${task.title}" cannot be scheduled before its deadline.`);
        }

        const scheduleItem = new Schedule({
            startTime: currentSlotStart,
            endTime: slotEnd,
            task: task._id,
            user: req.user.id
        });

        await scheduleItem.save();
        newSchedules.push(scheduleItem);

        // Move current slot start for the next task
        currentSlotStart = new Date(slotEnd);
    }

    res.json({ message: "Auto-scheduling complete", schedules: newSchedules, conflicts });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
