import type { CoursePart } from "../types";

const coursePart = (props: { part: CoursePart }) => {
  const { part } = props;

  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>{part.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>Project exercises: {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>{part.description}</p>
          <p>Background material: {part.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>{part.description}</p>
          <p>Requirements: [{part.requirements.join(", ")}]</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export default coursePart;