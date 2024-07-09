import React, { useEffect, useState } from "react";
import SingleTaskList from "../Compounents/SingleTaskList";
import { BE_addTaskList, BE_getTaskList } from "../Backend/Queries";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";

type Props = {};

function ListPage({}: Props) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const taskList = useSelector(
    (state: RootState) => state.taskList.currentTaskList
  );

  useEffect(() => {
    BE_getTaskList(dispatch, setLoading);
  }, [dispatch]);

  useEffect(() => {
    console.log(taskList);
  }, [taskList]);
  return (
    <div className="p-10 ">
      <div className="flex flex-wrap justify-center gap-5">
        {taskList.map((t) => (
          <SingleTaskList key={t.id} singleTaskList={t} />
        ))}
      </div>
    </div>
  );
}

export default ListPage;
