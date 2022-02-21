import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Header from './components/Header'


function App() {
  return (
    <BrowserRouter>
      <div>
      <Route path="/" component={Header} exact />
      </div>
    </BrowserRouter>
  );
}

export default App;