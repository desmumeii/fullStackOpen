import { calculateExercise } from "./exerciseCalculator";
interface ExerciseValues {
    target: number;
    dailyExercises: number[];
}

const parseExerciseArguments = (args: Array<string>): ExerciseValues => {
    if (args.length < 4) throw new Error("Not enough arguments");
    
    const target = Number(args[2]);
    const dailyExercises = args.slice(3).map(Number);

    return {
        target,
        dailyExercises
    };
};

try {
    const { target, dailyExercises } = parseExerciseArguments(process.argv);
    console.log(calculateExercise(target, dailyExercises));
} catch (e) {
    if (e instanceof Error) {
        console.log("Error:", e.message);
    } else {
        console.log("Unknown error");
    }
}