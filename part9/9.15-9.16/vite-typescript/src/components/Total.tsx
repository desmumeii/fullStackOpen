const courseTotal = ({ parts }: { parts: { exerciseCount: number }[] }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return <p>Number of exercises {totalExercises}</p>;
};

export default courseTotal;