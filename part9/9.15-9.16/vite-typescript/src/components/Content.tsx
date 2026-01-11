import Part from "./Part";
import type { CoursePart } from "../types";

const courseContent = ({ parts }: { parts: CoursePart[] }) => {
  return (
    <div>
      {parts.map((part) => (
        <div key={part.name}>
          <Part part={part} />
        </div>
      ))}
    </div>
  );
};

export default courseContent;