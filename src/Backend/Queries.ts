import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../Utils/toast";
import CatchErr from "../Utils/catchErr";
import { authDataType, setLoadingType, taskListType, userType } from "../Types";
import { NavigateFunction } from "react-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { defaultUser, setUser, userStorageName } from "../Redux/userSlice";
import { AppDispatch } from "../Redux/store";
import ConvertTime from "../Utils/ConvertTime";
import AvatarGenerator from "../Utils/avatarGenerator";
import {
  addTaskList,
  defaultTasList,
  defaultTask,
  setTaskList,
} from "../Redux/taskListSlice";

// collection names
const userColl = "users";
const tasksColl = "tasks";
const taskListColl = "taskList";
const chatsColl = "chats";
const messagesColl = "messages";

// register or signup user
export const BE_signUp = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  goTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password, confirmPassword } = data;

  // loading true
  setLoading(true);

  if (email && password) {
    if (password === confirmPassword) {
      console.log(email, password, confirmPassword);

      createUserWithEmailAndPassword(auth, email, password)
        .then(async ({ user }) => {
          // generate user avatar with username
          const imgLink = AvatarGenerator(user.email?.split("@")[0]);

          const userInfo = await addUserToCollection(
            user.uid,
            user.email || "",
            user.email?.split("@")[0] || "",
            imgLink
          );
          console.log(userInfo);
          // set user in store
          dispatch(setUser(userInfo));

          setLoading(false);
          reset();
          goTo("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          CatchErr(err);
          setLoading(false);
        });
    } else toastErr("Passwords must match!", setLoading);
  } else toastErr("Fields should't be left empty!", setLoading);
};
// sign in a user

export const Be_signIn = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  goTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password } = data;
  // loading true
  setLoading(true);

  signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      // updatate user isOnline to true

      await updateUserInfo({ id: user.uid, isOnline: true });

      // get user info
      const userInfo = await getUserInfo(user.uid);

      // set user in store
      dispatch(setUser(userInfo));

      setLoading(false);
      reset();
      goTo("/dashboard");
    })
    .catch((err) => {
      CatchErr(err);
      setLoading(false);
    });
};
export const Be_signOut = (
  dispatch: AppDispatch,
  goTo: NavigateFunction,
  setLoading: setLoadingType
) => {
  //  set currentSelected user to empty user

  setLoading(true);
  // logout in firebase

  signOut(auth)
    .then(async () => {
      // route to auth page
      goTo("/auth");

      // st user offline
      await updateUserInfo({ isOffline: true });

      // remove from local storage
      localStorage.removeItem(userStorageName);
      setLoading(false);
    })
    .catch((err) => CatchErr(err));
};

export const getStorageUser = () => {
  const usr = localStorage.getItem("userStorageName");
  if (usr) return JSON.parse(usr);
  else return null;
};

// add user to collection

const addUserToCollection = async (
  id: string,
  email: string,
  username: string,
  img: string
) => {
  await setDoc(doc(db, "usersColl", "id"), {
    isOnline: true,
    img,
    username,
    email,
    creationTime: serverTimestamp(),
    lastSeen: serverTimestamp(),
    bio: `Hi my name is ${username},thanks to Desmond i understand React and TypeScript now, and i'm 
    confortable working with them. I can also build beautiful user interface`,
  });

  return getUserInfo(id);
};
// get user information

const getUserInfo = async (id: string): Promise<userType> => {
  const userRef = doc(db, userColl, id);
  const user = await getDoc(userRef);
  if (user.exists()) {
    const { img, isOnline, username, bio, email, creationTime, lastSeen } =
      user.data();

    return {
      id: user.id,
      img,
      isOnline,
      username,
      email,
      bio,
      creationTime: creationTime
        ? ConvertTime(creationTime.toDate())
        : "no date yet: userinfo",
      lastSeen: lastSeen
        ? ConvertTime(creationTime.toDate())
        : "no date yet: userinfo",
    };
  } else {
    toastErr("getUserInfo:user not found");
    return defaultUser;
  }
};
// update user info
const updateUserInfo = async ({
  id,
  username,
  img,
  isOnline,
  isOffline,
}: {
  id?: string;
  username?: string;
  img?: string;
  isOnline?: boolean;
  isOffline?: boolean;
}) => {
  if (!id) {
    id = getStorageUser().id;
  }

  if (id) {
    // set the "capital" field of the city "DC"
    await updateDoc(doc(db, userColl, id), {
      ...(username && { username }),
      ...(isOnline && { isOnline }),
      ...(isOffline && { isOnline: false }),
      ...(img && { img }),
      lastSeen: serverTimestamp(),
    });
  }
};

// ---------------For tak list---------------

// add a single tasl list
export const BE_addTaskList = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  setLoading(true);
  const { title } = defaultTasList;
  const list = await addDoc(collection(db, taskListColl), {
    title,
    userId: getStorageUser(),
  });

  const newDocSnap = await getDoc(doc(db, list.path));

  if (newDocSnap.exists()) {
    const newlyAddedDoc: taskListType = {
      id: newDocSnap.id,
      title: newDocSnap.data().title,
    };

    dispatch(addTaskList(newlyAddedDoc));
    setLoading(false);
  } else {
    toastErr("BE_addTaslList:No such doc");
    setLoading(false);
  }
};

// get all task list

export const BE_getTaskList = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  setLoading(true);

  // get user task list
  const taskList = await getAllTaskList();
  // if(( taskList).length)

  dispatch(setTaskList(taskList));
  setLoading(false);
};

// get all users tasklist
const getAllTaskList = async () => {
  const q = query(
    collection(db, taskListColl),
    where("userId", "==", getStorageUser().id)
  );

  const taskListSnapshot = await getDocs(q);
  const taskList: taskListType[] = [];

  taskListSnapshot.forEach((doc) => {
    const { title } = doc.data();
    taskList.push({
      id: doc.id,
      title,
      editMode: false,
      tasks: [],
    });
  });
  return taskList;
};
