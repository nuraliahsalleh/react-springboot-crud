
// // src/component/Todo.jsx
// import React, { useEffect, useState } from "react";


// // Backend base URL
// const API  = import.meta.env.VITE_API_URL || "http://localhost:8080";
// const BASE = `${API}/api/todos`;

// export default function Todo() {
//   const [lists, setLists] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // input for creating a parent list
//   const [newListTitle, setNewListTitle] = useState("");

//   // local inputs per parent for adding/updating a child
//   // itemInputs: { [listId]: string }
//   const [itemInputs, setItemInputs] = useState({});
//   // editingItem: { [listId]: { itemId: number, text: string } | null }
//   const [editingItem, setEditingItem] = useState({});

//   // -------- utilities ----------
//   const getTextError = async (res) => {
//     try { return await res.text(); } catch { return ""; }
//   };
//   const fetchJSON = async (url, init) => {
//     const res = await fetch(url, init);
//     if (!res.ok) {
//       const msg = await getTextError(res);
//       throw new Error(`${res.status} ${res.statusText} ${msg && `- ${msg}`}`);
//     }
//     return res.json();
//   };

//   // -------- load all lists ----------
//   const loadLists = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchJSON(BASE);
//       setLists(data);
//     } catch (e) {
//       console.error(e);
//       alert(`Load failed: ${e.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadLists(); }, []);

//   // -------- create parent list ----------
//   const createList = async () => {
//     const title = newListTitle.trim();
//     if (!title) return;
//     try {
//       const created = await fetchJSON(BASE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title }), // IMPORTANT: controller expects {title}
//       });
//       setLists(prev => [created, ...prev]);
//       setNewListTitle("");
//     } catch (e) {
//       console.error(e);
//       alert(`Create list failed: ${e.message}`);
//     }
//   };

//   // -------- delete parent list ----------
//   const deleteList = async (listId) => {
//     if (!confirm("Delete this list?")) return;
//     try {
//       const res = await fetch(`${BASE}/${listId}`, { method: "DELETE" });
//       if (!res.ok && res.status !== 204) {
//         const msg = await getTextError(res);
//         throw new Error(`${res.status} ${res.statusText} - ${msg}`);
//       }
//       setLists(prev => prev.filter(l => l.id !== listId));
//     } catch (e) {
//       console.error(e);
//       alert(`Delete list failed: ${e.message}`);
//     }
//   };

//   // -------- add/update child item ----------
//   const saveItem = async (listId) => {
//     const editing = editingItem[listId];
//     const text = (editing ? editing.text : (itemInputs[listId] || "")).trim();
//     if (!text) return;

//     try {
//       if (editing) {
//         await fetchJSON(`${BASE}/${listId}/items/${editing.itemId}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ text }),
//         });
//         setEditingItem(prev => ({ ...prev, [listId]: null }));
//       } else {
//         await fetchJSON(`${BASE}/${listId}/items`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ text }),
//         });
//         setItemInputs(prev => ({ ...prev, [listId]: "" }));
//       }
//       await loadLists();
//     } catch (e) {
//       console.error(e);
//       alert(`Save item failed: ${e.message}`);
//     }
//   };

//   const startEditItem = (listId, item) => {
//     setEditingItem(prev => ({ ...prev, [listId]: { itemId: item.id, text: item.text } }));
//   };

//   const cancelEditItem = (listId) => {
//     setEditingItem(prev => ({ ...prev, [listId]: null }));
//   };

//   // -------- delete child item ----------
//   const deleteItem = async (listId, itemId) => {
//     try {
//       const res = await fetch(`${BASE}/${listId}/items/${itemId}`, { method: "DELETE" });
//       if (!res.ok && res.status !== 204) {
//         const msg = await getTextError(res);
//         throw new Error(`${res.status} ${res.statusText} - ${msg}`);
//       }
//       await loadLists();
//     } catch (e) {
//       console.error(e);
//       alert(`Delete item failed: ${e.message}`);
//     }
//   };

//   // -------- toggle child completed ----------
//   const toggleItem = async (listId, itemId) => {
//     try {
//       await fetchJSON(`${BASE}/${listId}/items/${itemId}/toggle`, { method: "PATCH" });
//       await loadLists();
//     } catch (e) {
//       console.error(e);
//       alert(`Toggle failed: ${e.message}`);
//     }
//   };

//   return (
//     <main className="container mt-5 p-4">
//       <div className="text-center mb-4">
//         <h3>TODO Apps</h3>
//         {loading && <div className="text-muted small">Loading...</div>}
//       </div>

//       {/* Create Parent List */}
//       <div className="row justify-content-center mb-4">
//         <div className="col-12 col-md-8">
//           <div className="input-group">
//             <span className="input-group-text">+</span>
//             <input
//               className="form-control"
//               placeholder="Create a list (e.g. Buy groceries)"
//               value={newListTitle}
//               onChange={(e) => setNewListTitle(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && createList()}
//             />
//             <button className="btn btn-success" onClick={createList}>
//               Add List
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Lists */}
//       <div className="mx-auto" style={{ maxWidth: 900 }}>
//         {lists.map((list) => {
//           const isEditing = !!editingItem[list.id];
//           const inputVal = isEditing ? editingItem[list.id].text : (itemInputs[list.id] || "");
//           return (
//             <div key={list.id} className="card mb-4">
//               <div className="card-header d-flex justify-content-between align-items-center">
//                 <div>
//                   <strong>{list.title}</strong>
//                   {typeof list.itemCount === "number" && (
//                     <span className="badge text-bg-secondary ms-2">
//                       {list.itemCount} items
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   className="btn btn-outline-danger btn-sm"
//                   onClick={() => deleteList(list.id)}
//                 >
//                   Delete List
//                 </button>
//               </div>

//               <div className="card-body">
//                 {/* Add/Edit child input */}
//                 <div className="input-group mb-3">
//                   <input
//                     className="form-control"
//                     placeholder="Add item (e.g. susu)"
//                     value={inputVal}
//                     onChange={(e) =>
//                       isEditing
//                         ? setEditingItem(prev => ({
//                             ...prev,
//                             [list.id]: { ...prev[list.id], text: e.target.value },
//                           }))
//                         : setItemInputs(prev => ({ ...prev, [list.id]: e.target.value }))
//                     }
//                     onKeyDown={(e) => e.key === "Enter" && saveItem(list.id)}
//                   />
//                   <button className="btn btn-primary" onClick={() => saveItem(list.id)}>
//                     {isEditing ? "Update Item" : "Add Item"}
//                   </button>
//                   {isEditing && (
//                     <button className="btn btn-secondary" onClick={() => cancelEditItem(list.id)}>
//                       Cancel
//                     </button>
//                   )}
//                 </div>

//                 {/* Items */}
//                 <ul className="list-group">
//                   {list.items?.map((item) => (
//                     <li
//                       key={item.id}
//                       className="list-group-item d-flex justify-content-between align-items-center"
//                     >
//                       <span
//                         onClick={() => toggleItem(list.id, item.id)}
//                         style={{
//                           textDecoration: item.completed ? "line-through" : "none",
//                           cursor: "pointer",
//                         }}
//                         title="Toggle complete"
//                       >
//                         {item.text}
//                       </span>
//                       <div>
//                         <button
//                           className="btn btn-warning btn-sm me-2"
//                           onClick={() => startEditItem(list.id, item)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => deleteItem(list.id, item.id)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </li>
//                   ))}
//                   {!list.items || list.items.length === 0 ? (
//                     <li className="list-group-item text-muted">No items yet</li>
//                   ) : null}
//                 </ul>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </main>
//   );
// }

// src/component/Todo.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const BASE = `${API}/api/todos`;

export default function Todo() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const [itemInputs, setItemInputs] = useState({});
  const [editingItem, setEditingItem] = useState({});

  // -------- load all lists ----------
  const loadLists = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE);
      setLists(res.data);
    } catch (err) {
      console.error("Load failed:", err);
      alert(`Load failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  // -------- create parent list ----------
  const createList = async () => {
    const title = newListTitle.trim();
    if (!title) return;
    try {
      const res = await axios.post(BASE, { title });
      setLists((prev) => [res.data, ...prev]);
      setNewListTitle("");
    } catch (err) {
      console.error("Create failed:", err);
      alert(`Create list failed: ${err.message}`);
    }
  };

  // -------- delete parent list ----------
  const deleteList = async (listId) => {
    if (!confirm("Delete this list?")) return;
    try {
      await axios.delete(`${BASE}/${listId}`);
      setLists((prev) => prev.filter((l) => l.id !== listId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(`Delete list failed: ${err.message}`);
    }
  };

  // -------- add/update child item ----------
  const saveItem = async (listId) => {
    const editing = editingItem[listId];
    const text = (editing ? editing.text : (itemInputs[listId] || "")).trim();
    if (!text) return;

    try {
      if (editing) {
        await axios.put(`${BASE}/${listId}/items/${editing.itemId}`, { text });
        setEditingItem((prev) => ({ ...prev, [listId]: null }));
      } else {
        await axios.post(`${BASE}/${listId}/items`, { text });
        setItemInputs((prev) => ({ ...prev, [listId]: "" }));
      }
      await loadLists();
    } catch (err) {
      console.error("Save failed:", err);
      alert(`Save item failed: ${err.message}`);
    }
  };

  const startEditItem = (listId, item) => {
    setEditingItem((prev) => ({ ...prev, [listId]: { itemId: item.id, text: item.text } }));
  };

  const cancelEditItem = (listId) => {
    setEditingItem((prev) => ({ ...prev, [listId]: null }));
  };

  // -------- delete child item ----------
  const deleteItem = async (listId, itemId) => {
    try {
      await axios.delete(`${BASE}/${listId}/items/${itemId}`);
      await loadLists();
    } catch (err) {
      console.error("Delete item failed:", err);
      alert(`Delete item failed: ${err.message}`);
    }
  };

  // -------- toggle child completed ----------
  const toggleItem = async (listId, itemId) => {
    try {
      await axios.patch(`${BASE}/${listId}/items/${itemId}/toggle`);
      await loadLists();
    } catch (err) {
      console.error("Toggle failed:", err);
      alert(`Toggle failed: ${err.message}`);
    }
  };

  return (
    <main className="container mt-5 p-4">
      <div className="text-center mb-4">
        <h3>TODO Apps</h3>
        {loading && <div className="text-muted small">Loading...</div>}
      </div>

      {/* Create Parent List */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8">
          <div className="input-group">
            <span className="input-group-text">+</span>
            <input
              className="form-control"
              placeholder="Create a list (e.g. Buy groceries)"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createList()}
            />
            <button className="btn btn-success" onClick={createList}>
              Add List
            </button>
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        {lists.map((list) => {
          const isEditing = !!editingItem[list.id];
          const inputVal = isEditing ? editingItem[list.id].text : (itemInputs[list.id] || "");
          return (
            <div key={list.id} className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <strong>{list.title}</strong>
                  {typeof list.itemCount === "number" && (
                    <span className="badge text-bg-secondary ms-2">
                      {list.itemCount} items
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => deleteList(list.id)}
                >
                  Delete List
                </button>
              </div>

              <div className="card-body">
                {/* Add/Edit child input */}
                <div className="input-group mb-3">
                  <input
                    className="form-control"
                    placeholder="Add item (e.g. susu)"
                    value={inputVal}
                    onChange={(e) =>
                      isEditing
                        ? setEditingItem((prev) => ({
                            ...prev,
                            [list.id]: { ...prev[list.id], text: e.target.value },
                          }))
                        : setItemInputs((prev) => ({ ...prev, [list.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && saveItem(list.id)}
                  />
                  <button className="btn btn-primary" onClick={() => saveItem(list.id)}>
                    {isEditing ? "Update Item" : "Add Item"}
                  </button>
                  {isEditing && (
                    <button className="btn btn-secondary" onClick={() => cancelEditItem(list.id)}>
                      Cancel
                    </button>
                  )}
                </div>

                {/* Items */}
                <ul className="list-group">
                  {list.items?.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span
                        onClick={() => toggleItem(list.id, item.id)}
                        style={{
                          textDecoration: item.completed ? "line-through" : "none",
                          cursor: "pointer",
                        }}
                        title="Toggle complete"
                      >
                        {item.text}
                      </span>
                      <div>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => startEditItem(list.id, item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteItem(list.id, item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                  {!list.items || list.items.length === 0 ? (
                    <li className="list-group-item text-muted">No items yet</li>
                  ) : null}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
