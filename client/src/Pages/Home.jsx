import { useContext } from 'react'
import { MyContext } from '../Context/myContext';

const Home = () => {

    const {name} = useContext(MyContext);

  return (
    <div>Home {name}</div>
  )
}

export default Home