"use client"

import { Bid, GroupBy, Slot } from "@/lib/types"
import ScatterPlotChartV2 from "./ScatterPlotChartV2"
import SlotHeader from "./SlotHeader"
import { useEffect, useState } from "react"
import { colorHash } from "@/lib/utils"
import { useConnectWallet } from "@web3-onboard/react"
import supabase from "../lib/supabaseClient"

import Observe from "./Observer"

import { isObserver, observe } from "@/lib/observe"
import useAppState from "@/lib/hooks/useAppState"

interface SlotsProps {
  slots: Slot[]
}

interface Builder {
  builder: Bid["builderLabel"]
  pubKeys: Bid["builderPubKey"][]
}

const transform = (bids: Bid[]): Builder[] => {
  const builderMap: Record<string, Set<string>> = bids.reduce(
    (acc: Record<string, Set<string>>, bid) => ({
      ...acc,
      [bid.builderLabel]: acc[bid.builderLabel]
        ? acc[bid.builderLabel].add(bid.builderPubKey)
        : new Set([bid.builderPubKey]),
    }),
    {}
  )

  return Object.entries(builderMap)
    .map(([builder, pubKeys]) => ({ builder, pubKeys: Array.from(pubKeys) }))
    .sort((a, b) => b.pubKeys.length - a.pubKeys.length)
}

const Slots = ({ slots }: SlotsProps) => {
  const { state, setState } = useAppState()
  const [selectedBids, setSelectedBids] = useState<Bid[]>(slots[0].bids)

  const [selectedChart, setSelectedChart] = useState<Slot>(slots[0])

  const [selectedBuilders, setSelectedBuilders] = useState<Set<string>>(
    new Set()
  )

  // const [observers, setObservers] = useState<{ slot: string, observers: number}>}()

  const [builders, setBuilders] = useState<Builder[]>()

  useEffect(() => {
    setBuilders(transform(slots[0].bids))
  }, [setBuilders, slots])

  const [observing, setObserving] = useState<boolean>(false)

  const [{ wallet, connecting }] = useConnectWallet()

  useEffect(() => {
    const checkObservations = async (address: string) => {
      const observesSlot = await isObserver(address, selectedChart.id)
      console.log({ observesSlot })
      if (observesSlot !== null) {
        console.log("setObserving...", observesSlot)
        setObserving(observesSlot)
      }
    }

    if (state.user && wallet?.accounts[0].address) {
      console.log("LOGGIED INNN")
      enableObserveButton(true)
      checkObservations(wallet?.accounts[0].address)
    }
  }, [observing, selectedChart, state, wallet?.accounts])

  // useEffect(() => {
  //   console.log({
  //     ...selectedChart,
  //     observers: selectedChart?.observers + (observing ? 1 : -1),
  //   })
  //   setSelectedChart({
  //     ...selectedChart,
  //     observers: selectedChart?.observers + (observing ? 1 : -1),
  //   })
  // }, [observing, selectedChart])
  // Used for mobile view only
  const [controlsVisible, setControls] = useState<boolean>(false)

  const [observeButtonEnabled, enableObserveButton] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      console.log("stetting state", event.target.value)
      setState({ ...state, groupBy: event.target.value as GroupBy })
    }
  }
  return (
    <div className="w-full flex flex-col">
      {slots.map((slot, i) => (
        <div key={`${slot}:div`} className="h-full w-full mb-20">
          <SlotHeader
            key={`${slot}:header`}
            slot={parseInt(slot.id)}
            index={i}
            slots={slots.map(({ id }) => id)}
          />
          {slot.bids.length > 0 ? (
            <ScatterPlotChartV2
              groupBy={state.groupBy}
              key={`${slot}:chart`}
              data={slot.bids}
              selectedBuilders={selectedBuilders}
            />
          ) : (
            <div>No bids found for slot: {slot.id}</div>
          )}
        </div>
      ))}

      {builders?.length ? (
        <div className="flex flex-row min-w-min max-w-max mx-auto text-sm p-3 h-[25vh] md:h-min  backdrop-blur-xl bg-transparent bg-gradient-to-tr from-[#d7269310] to-[#0AFE9710] rounded-sm">
          <div className="flex items-center w-min">
            <div className="[writing-mode:vertical-lr] text-center mr-2">
              🕹️ Controls
            </div>
            <div className="flex flex-wrap space-y-4">
              <div className="w-full flex items-center justify-center text-sm border-opacity-25 border border-[#F80B52] rounded px-4 py-2 h-10">
                <span className="mr-1 w-max">Color by:</span>
                <select
                  value={state.groupBy}
                  onChange={handleChange}
                  className="bg-transparent cursor focus:outline-none focus:ring-0 outline-none ring-0 border-none"
                >
                  <option value="builder">Builder</option>
                  <option value="entity">Entity</option>
                </select>
              </div>

              <Observe
                observers={selectedChart.observers}
                disabled={!observeButtonEnabled}
                onObserve={async () => {
                  if (!observeButtonEnabled) return
                  const { data, error } = await supabase.auth.getSession()
                  if (
                    error === null &&
                    data?.session &&
                    wallet?.accounts[0].address
                  ) {
                    await observe(
                      wallet?.accounts[0].address ?? "",
                      selectedChart.id
                    ).then((res) => {
                      console.log(observing)
                      setSelectedChart({
                        ...selectedChart,
                        observers:
                          selectedChart?.observers + (!observing ? 1 : -1),
                      })
                    })
                  }
                }}
                observing={observing}
              />
            </div>
            <div className="divider divider-horizontal mx-2" />
          </div>

          <div className="flex items-center w-full">
            <div className="[writing-mode:vertical-lr] text-center mr-2">
              Legend
            </div>
            <div className="flex flex-wrap overflow-scroll">
              {builders.map(({ builder, pubKeys }, i) => (
                // <div key={i} className="flex h-min">
                // <div
                //   style={{ backgroundColor: colorHash(pubKey) }}
                //   className={`badge badge-md`}
                // ></div>
                //   <div>{pubKey.slice(0, 10)}</div>
                // </div>
                <div key={builder} className="flex h-min w-min">
                  <div className="stat p-1">
                    <div className="stat-title text-gray-300 text-xs">
                      {/* logo?
                        <div className="avatar placeholder">
                          <div className=" rounded-full w-3">
                            
                          </div>
                        </div> */}
                      {builder || "🥷 rouge"}
                    </div>
                    {[...pubKeys].map((pubKey) => (
                      <div
                        key={pubKey}
                        className={`stat-value text-sm cursor-pointer  transition-opacity shadow-[#0AFE97] hover:text-glow flex items-center ${
                          selectedBuilders.size > 0
                            ? selectedBuilders.has(pubKey)
                              ? "opacity-100"
                              : "opacity-50"
                            : "opacity-100"
                        }`}
                        onClick={() => {
                          setSelectedBuilders(
                            new Set([
                              ...(selectedBuilders.has(pubKey)
                                ? selectedBuilders.delete(pubKey)
                                  ? selectedBuilders
                                  : selectedBuilders
                                : selectedBuilders.add(pubKey)),
                            ])
                          )
                        }}
                        //   onMouseEnter={() => {
                        //     setSelectedBuilders(
                        //       new Set([
                        //         ...(selectedBuilders.has(pubKey)
                        //           ? selectedBuilders.delete(pubKey)
                        //             ? selectedBuilders
                        //             : selectedBuilders
                        //           : selectedBuilders.add(pubKey)),
                        //       ])
                        //     );
                        //   }}
                        //   onMouseLeave={() => {
                        //     setSelectedBuilders(
                        //       new Set([
                        //         ...(selectedBuilders.has(pubKey)
                        //           ? selectedBuilders.delete(pubKey)
                        //             ? selectedBuilders
                        //             : selectedBuilders
                        //           : selectedBuilders.add(pubKey)),
                        //       ])
                        //     );
                        //   }}
                      >
                        <div
                          style={{
                            backgroundColor:
                              state.groupBy === "entity"
                                ? colorHash(builder)
                                : colorHash(pubKey),
                          }}
                          className={`badge badge-xs mr-1 transition-all`}
                        ></div>
                        {pubKey.slice(0, 8)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {/* <div key={i} className="badge badge-md"></div>
              <div key={i} className="flex flex-col">
                {[...pubKeys.values()].map((pubKey) => (
                  <div className="">{`${pubKey.slice(0, 10)}:${builder}`}</div>
                ))}
              </div> */}
      {/* <AnimatePresence mode="wait">
          {!showLegend ? (
            <motion.div
              key="legendButton"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{
                duration: 0.2,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <Button
                className={`${showLegend ? "" : "rotate-90"}`}
                onClick={() => {
                  setShowLegend(true);
                }}
              >
                Legend
              </Button>
            </motion.div>
          ) : null}

          {builders && (
            <motion.div
              key="builders"
              initial={{ opacity: 0, y: -100, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.2,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              className="flex flex-wrap w-full h-min text-sm p-4 top-[10%] left-[5%] backdrop-blur-xl bg-transparent bg-gradient-to-tr from-[#d7269310] to-[#0AFE9710] rounded-sm"
            >
              {Object.keys(builders).map((builder, i) => (
                <div key={i}></div>
              ))}
              {Object.values(builders)
                .flatMap((set) => Array.from(set))
                .map((pubKey, i) => (
                  <div key={i} className="flex h-min">
                    <div
                      style={{ backgroundColor: colorHash(pubKey) }}
                      className={`badge badge-md`}
                    ></div>
                    {/* <Jazzicon
                      diameter={18}
                      paperStyles={{}}
                      seed={jsNumberForAddress(pubKey)}
                      svgStyles={{
                        filter: "blur(3px) contrast(1.5)",
                      }}
                    /> 

                    <div>{pubKey.slice(0, 10)}</div>
                  </div>
                ))}
              {/* <div key={i} className="badge badge-md"></div>
              <div key={i} className="flex flex-col">
                {[...pubKeys.values()].map((pubKey) => (
                  <div className="">{`${pubKey.slice(0, 10)}:${builder}`}</div>
                ))}
              </div> 
            </motion.div>
          )}
        </AnimatePresence> */}
    </div>
  )
}

export default Slots
