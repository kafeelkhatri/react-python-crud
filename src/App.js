import React, { useEffect, useState } from "react";
import "../src/App.css";

export default function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [id, setId] = useState("");
  const [editMode, setEditMode] = useState(false);

  const fetchData = () => {
    fetch("http://127.0.0.1:5000/emp")
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result);
        resetForm();
      });
  };

  const handleSubmit = () => {
    if (editMode == true) {
      fetch("http://127.0.0.1:5000/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          name: name,
          age: age,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          resetForm();
          fetchData();
          setEditMode(false);
        })
        .catch((err) => console.log(err));
    } else {
      fetch("http://127.0.0.1:5000/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          age: age,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          resetForm();
          fetchData();
        })
        .catch((err) => console.log(err));
    }
  };

  const resetForm = () => {
    setName("");
    setAge("");
  };

  const deleteUser = (id) => {
    fetch("http://127.0.0.1:5000/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchData();
      })
      .catch((err) => console.log(err));
  };

  const getData = (id) => {
    fetch("http://127.0.0.1:5000/emp_data/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setId(data.id);
        setAge(data.age);
        setName(data.name);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-auto max-w-4xl py-5">
      <h1 className="text-3xl font-bold text-center mb-4">Pythod CRUD</h1>
      <div className="mx-auto max-w-4xl py-6">
        {data.length > 0 ? (
          <table className="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="w-1/3 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-center">
                  ID
                </th>
                <th className="w-1/3 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-center">
                  Name
                </th>
                <th className="w-1/3 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-center">
                  Age
                </th>
                <th className="w-1/3 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                    {item.id}
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                    {item.name}
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                    {item.age}
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
                    <div className="flex gap-3 p-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setId(item.id);
                          setEditMode(true);
                          getData(item.id);
                        }}
                        className=" rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteUser(item.id);
                        }}
                        className="rounded-md px-4 py-2 text-center font-medium shadow-sm ring-1 text-white bg-red-600 hover:bg-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Record Found</p>
        )}
      </div>
      <div className="mx-auto max-w-4xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please fill the Form
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Age
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="age"
                    id="age"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="pt-5">
              <button
                type="submit"
                className=" rounded-md px-4 py-2 text-center font-medium shadow-sm ring-1 text-white bg-green-600 hover:bg-green-400"
              >
                {editMode ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
