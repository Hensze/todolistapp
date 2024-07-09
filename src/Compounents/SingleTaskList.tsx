import React from "react";
import Icon from "./Icon";
import { MdAdd, MdDelete, MdEdit, MdKeyboardArrowDown } from "react-icons/md";
import Tasks from "./Tasks";
import { taskListType } from "../Types";

type Props = {
  singleTaskList: taskListType;
};

function SingleTaskList({ singleTaskList }: Props) {
  const { id, editMode, tasks, title } = singleTaskList;

  return (
    <div className="relative">
      <div
        className="bg-[#d3f0f9] w-full md:w-[400px] drop-sh adow-md 
      rounded-md min-h-[150px] overflow-hidden"
      >
        <div
          className="flex flex-wrap items-center justify-center md:gap-10 bg-gradient-to-tr 
        from-myBlue to-myPink bg-opacity-70 p-3 text-white text-center"
        >
          <p className=" flex-1 text-left md:text-center">{title}</p>

          <div>
            <Icon IconName={MdEdit} />
            <Icon IconName={MdDelete} />
            <Icon IconName={MdKeyboardArrowDown} />
          </div>
        </div>
        <Tasks />
      </div>
      <Icon
        IconName={MdAdd}
        className="absolute -mt-6 -ml-4 p-3 drop-shadow-lg hover:bg-myPink"
        reduceOpacityOnHover={false}
      />
    </div>
  );
}

export default SingleTaskList;
