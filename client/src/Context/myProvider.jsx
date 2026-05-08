import { MyContext } from "./myContext";

const MyProvider = ({ children }) => {
  const name = "Sudais";

  return (
    <MyContext.Provider value={{ name }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
