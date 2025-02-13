import appstore from "./utils/appstore"
import './App.css'
import { Provider } from 'react-redux';
import Body from "./components/Body";

function App(){
  return <Provider store={appstore}>
    
    <Body/>
  </Provider>;
}

export default App
