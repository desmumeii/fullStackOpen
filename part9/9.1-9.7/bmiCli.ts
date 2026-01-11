import { calculatedbmi } from "./bmiCalculator";
interface BmiValues {
    height: number;
    weight: number;
}

const parseBmiArguments = (args: Array<string>): BmiValues => {
    if (args.length < 4) throw new Error("Not enough arguments");
    
    const height = Number(args[2]);
    const weight = Number(args[3]);

    return {
        height,
        weight
    };
};

try {
    const { height, weight } = parseBmiArguments(process.argv);
    console.log(calculatedbmi(height, weight));
} catch (e) {
    if (e instanceof Error) {
        console.log("Error:", e.message);
    } else {
        console.log("Unknown error");
    }
};