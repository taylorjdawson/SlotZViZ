"use client";

import { Bid, Bids } from "@/lib/types";
import ScatterPlotChartV2 from "./ScatterPlotChartV2";
import SlotHeader from "./SlotHeader";
import { useEffect, useState } from "react";
import Button from "./Button";
import { BUILDER_PUBKEY_IDS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { colorHash } from "@/lib/utils";

// var colorHash = new ColorHash({saturation: [0.35, 0.5, 0.65]});
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { keccak256 } from "viem";

interface SlotsProps {
  bids: Bids;
  slots: string[];
}
interface Builder {
  builder: Bid["builderLabel"];
  pubKeys: Bid["builderPubKey"][];
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
  );

  return Object.entries(builderMap)
    .map(([builder, pubKeys]) => ({ builder, pubKeys: Array.from(pubKeys) }))
    .sort((a, b) => b.pubKeys.length - a.pubKeys.length);
};

const Slots = ({ slots, bids }: SlotsProps) => {
  const [selectedBids, setSelectedBids] = useState<Bids>(bids);

  const [selectedChart, setSelectedChart] = useState<string>(slots[0]);

  const [selectedBuilders, setSelectedBuilders] = useState<Set<string>>(
    new Set()
  );

  const [builders, setBuilders] = useState<Builder[]>();

  useEffect(() => {
    setBuilders(transform(bids?.[selectedChart]));
  }, [selectedBids, selectedChart, setBuilders]);

  const [showLegend, setShowLegend] = useState<boolean>(false);

  // useEffect(() => {
  //   setLegendItems(
  //     slots.reduce((prev, cur, i) => ({ [cur]: bids[i], ...prev }), {})
  //   );
  // }, [setLegendItems, selectedChart]);
  const showControls = false;
  return (
    <>
      <div className="w-full flex flex-col">
        {slots.map((slot, i) => (
          <div key={`${slot}:div`} className="h-full w-full mb-20">
            <SlotHeader
              key={`${slot}:header`}
              slot={parseInt(slot)}
              index={i}
              slots={slots}
            />
            {selectedBids[slot].length > 0 ? (
              <ScatterPlotChartV2
                key={`${slot}:chart`}
                data={selectedBids[slot]}
                selectedBuilders={selectedBuilders}
              />
            ) : (
              <div>No bids found for slot: {slot}</div>
            )}
          </div>
        ))}

        {builders?.length ? (
          <div className="flex flex-row min-w-min max-w-max mx-auto h-min text-sm p-3  backdrop-blur-xl bg-transparent bg-gradient-to-tr from-[#d7269310] to-[#0AFE9710] rounded-sm">
            {showControls ? (
              <div className="flex items-center w-1/2">
                <div className="[writing-mode:vertical-lr] text-center mr-2">
                  🕹️ Controls
                </div>
                <div className="flex flex-wrap"></div>
                <div className="divider divider-horizontal mx-2" />
              </div>
            ) : null}

            <div className="flex items-center w-full">
              <div className="[writing-mode:vertical-lr] text-center mr-2">
                Legend
              </div>
              <div className="flex flex-wrap">
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
                      <div className="stat-title text-xs">
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
                          className={`stat-value text-sm cursor-pointer select-none transition-opacity shadow-[#0AFE97] hover:text-glow flex items-center ${
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
                            );
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
                            style={{ backgroundColor: colorHash(pubKey) }}
                            className={`badge badge-xs mr-1`}
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
    </>
  );
};

export default Slots;
