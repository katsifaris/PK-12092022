import React from "react";
import { render } from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";

import Header from "./components/Header";
import Bank from "./components/Bank"; 

function App() {
  return (
    <ChakraProvider>
      <Header />
      <Bank />
    </ChakraProvider>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)