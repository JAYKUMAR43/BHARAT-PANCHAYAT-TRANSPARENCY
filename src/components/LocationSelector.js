// import React, { useEffect, useState } from "react";
// import {
//   fetchStates,
//   fetchDistricts,
//   fetchBlocks,
//   fetchVillages,
// } from "../api";

// export default function LocationSelector({ onVillageSelected }) {
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [villages, setVillages] = useState([]);

//   const [stateId, setStateId] = useState("");
//   const [districtId, setDistrictId] = useState("");
//   const [blockId, setBlockId] = useState("");
//   const [villageId, setVillageId] = useState("");

//   useEffect(() => {
//     fetchStates().then(setStates);
//   }, []);

//   useEffect(() => {
//     if (stateId) fetchDistricts(stateId).then(setDistricts);
//   }, [stateId]);

//   useEffect(() => {
//     if (districtId) fetchBlocks(districtId).then(setBlocks);
//   }, [districtId]);

//   useEffect(() => {
//     if (blockId) fetchVillages(blockId).then(setVillages);
//   }, [blockId]);

//   useEffect(() => {
//     if (villageId) onVillageSelected(villageId);
//   }, [villageId, onVillageSelected]);

//   return (
//     <div className="space-y-3">
//       <h3 className="text-lg font-bold text-blue-700">Select Village</h3>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

//         <select
//           value={stateId}
//           onChange={(e) => setStateId(e.target.value)}
//           className="p-2 rounded border"
//         >
//           <option value="">Select State</option>
//           {states.map((s) => (
//             <option key={s.id} value={s.id}>{s.name}</option>
//           ))}
//         </select>

//         <select
//           value={districtId}
//           onChange={(e) => setDistrictId(e.target.value)}
//           className="p-2 rounded border"
//         >
//           <option value="">Select District</option>
//           {districts.map((d) => (
//             <option key={d.id} value={d.id}>{d.name}</option>
//           ))}
//         </select>

//         <select
//           value={blockId}
//           onChange={(e) => setBlockId(e.target.value)}
//           className="p-2 rounded border"
//         >
//           <option value="">Select Block</option>
//           {blocks.map((b) => (
//             <option key={b.id} value={b.id}>{b.name}</option>
//           ))}
//         </select>

//         <select
//           value={villageId}
//           onChange={(e) => setVillageId(e.target.value)}
//           className="p-2 rounded border"
//         >
//           <option value="">Select Village</option>
//           {villages.map((v) => (
//             <option key={v.id} value={v.id}>{v.name}</option>
//           ))}
//         </select>

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { fetchStates, fetchDistricts, fetchBlocks, fetchVillages } from "../api";

export default function LocationSelector({ onVillageSelected }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villages, setVillages] = useState([]);

  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [blockId, setBlockId] = useState("");

  useEffect(() => {
    fetchStates().then((res) => setStates(res ?? []));
  }, []);

  useEffect(() => {
    if (!stateId) {
      setDistricts([]);
      setBlocks([]);
      setVillages([]);
      return;
    }
    fetchDistricts(stateId).then((res) => setDistricts(res ?? []));
  }, [stateId]);

  useEffect(() => {
    if (!districtId) {
      setBlocks([]);
      setVillages([]);
      return;
    }
    fetchBlocks(districtId).then((res) => setBlocks(res ?? []));
  }, [districtId]);

  useEffect(() => {
    if (!blockId) {
      setVillages([]);
      return;
    }
    fetchVillages(blockId).then((res) => setVillages(res ?? []));
  }, [blockId]);

  return (
    <div className="space-y-3">
      {/* State */}
      <select
        className="border p-2 w-full rounded"
        value={stateId}
        onChange={(e) => setStateId(e.target.value)}
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* District */}
      <select
        className="border p-2 w-full rounded"
        value={districtId}
        onChange={(e) => setDistrictId(e.target.value)}
        disabled={!stateId}
      >
        <option value="">Select District</option>
        {districts.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Block */}
      <select
        className="border p-2 w-full rounded"
        value={blockId}
        onChange={(e) => setBlockId(e.target.value)}
        disabled={!districtId}
      >
        <option value="">Select Block</option>
        {blocks.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* Village */}
      <select
        className="border p-2 w-full rounded"
        disabled={!blockId}
        onChange={(e) => {
          const vid = e.target.value;
          onVillageSelected(vid);
        }}
      >
        <option value="">Select Village</option>
        {villages.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    </div>
  );
}
