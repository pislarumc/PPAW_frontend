import Navbar from "./Components/Navbar"
import PricingEffects from "./Pages/PricingEffects"
import Home from "./Pages/Home"
import About from "./Pages/About"
import Images from "./Pages/Images"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricinge_effects" element={<PricingEffects />} />
          <Route path="/about" element={<About />} />
          <Route path="/images" element={<Images />} />
        </Routes>
      </div>
    </>
  )
}

export default App