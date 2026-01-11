
export const calculatedbmi = (height: number, weight: number): string => {
    if (height <= 0) {
        throw new Error("Height must be greater than zero.");
    }
    if (weight <= 0) {
        throw new Error("Weight must be greater than zero.");
    }
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return "Normal weight";
    } return "Overweight";
};

