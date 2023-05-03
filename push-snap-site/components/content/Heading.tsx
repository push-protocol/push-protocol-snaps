import { HEADING } from "../../utils/constants"

export default function Heading() {
  return (
    <h1 className="text-3xl min-[420px]:text-4xl sm:text-5xl text-center font-bold">
        {HEADING.HEAD_1}
        <span className="text-text-secondary">
        {HEADING.HEAD_2}
        </span>
    </h1>
  )
}
