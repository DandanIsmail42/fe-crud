import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProductList from "./components/ProductList";

import EditProduct from "./components/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList/>}/>
        <Route path="edit/:id" element={<EditProduct/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
