export const calculateExercise = (target: number, dailyExercises: number[]) => {
    if (target <= 0) {
        throw new Error("Target must be greater than zero.");
    }
    if (dailyExercises.length === 0) {
        throw new Error("Daily exercises array cannot be empty.");
    }

    const periodLength = dailyExercises.length;
    const trainingDays = dailyExercises.filter(day => day > 0).length;
    const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
    const average = totalHours / periodLength;
    const success = average >= target;

    let rating: number;
    let ratingDescription: string;

    if (average >= target) {
        rating = 3;
        ratingDescription = "Great job! You've met your target.";
    } else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = "Not too bad but could be better.";
    } else {
        rating = 1;
        ratingDescription = "You need to work harder.";
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};