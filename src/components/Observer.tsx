import { MouseEventHandler } from "react"

const Observe = ({
  disabled,
  observing,
  observers,
  onObserve,
  onMouseEnter,
  onMouseLeave,
  className = "",
}: {
  className?: string
  disabled: boolean
  observing: boolean
  observers: number
  onObserve: () => void
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
}) => {
  return (
    <div className={`${className} relative w-full`}>
      <button
        onClick={onObserve}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:shadow-glow hover:border-[#ff8cae]"
        } border w-full border-[#F80B52] border-opacity-70 rounded transition-all px-4 py-2 peer flex space-x-2 h-10 items-center justify-center`}
      >
        <div
          className={` font-bold transition-all duration-700 flex ${
            observing ? "text-[#F80B52]" : ""
          }`}
        >
          |<span className="">⟐</span>|
        </div>
        <div> {observing ? "Unob" : "Ob"}serve</div>
        <span className="badge">{observers}</span>
      </button>
      {disabled ? (
        <div className="opacity-0 absolute text-left text-xs invisible peer-hover:visible peer-hover:opacity-100 transition-opacity duration-700 delay-75">
          Must Assimilate, To Participate
        </div>
      ) : null}
    </div>
  )
}

export default Observe
