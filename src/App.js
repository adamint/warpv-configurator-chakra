import React, { useEffect, useState } from 'react';
import { Box, ChakraProvider, theme, useToast } from '@chakra-ui/react';
import { Header } from './components/header/Header';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { CoreDetailsPage } from './pages/CoreDetailsPage';
import { getTLVCodeForDefinitions, translateJsonToM4Macros } from './translation/Translation';
import useFetch from './utils/useFetch';

function App() {
  const [generalSettings, setGeneralSettings] = useState({
    isa: 'RISCV',
    depth: 4,
  });
  const [pipelineSettings, setPipelineSettings] = useState({});
  const [coreJson, setCoreJson] = useState(null)
  const [macrosForJson, setMacrosForJson] = useState(null)
  const [tlvForJson, setTlvForJson] = useState(null)
  const makerchipFetch = useFetch("http://saas.makerchip.com")
const [sVForJson, setSVForJson] = useState(null)

  function getSVForTlv(tlv, callback) {
    makerchipFetch.post(
      "/sandpiper/json",
      {tlv: JSON.stringify({"!top.tlv": tlv})},
      true
    ).then(data => {
      const verilog = data["top.sv"]
      callback(verilog)
    })
  }

  useEffect(() => {
    if (!coreJson) {
      setMacrosForJson(null)
      setTlvForJson(null)
    }
    else {
      const macros = translateJsonToM4Macros(coreJson)
      setMacrosForJson(macros)
      const tlv = getTLVCodeForDefinitions(macros)
      setTlvForJson(tlv)

      getSVForTlv(tlv, sv => setSVForJson(sv))
    }
  }, [coreJson])

  return <ChakraProvider theme={theme}>
    <Box minHeight='480px'>
      <Header />

      <Box mx={5} overflowWrap>
        <Switch>
          <Route exact path='/'>
            <HomePage generalSettings={generalSettings} setGeneralSettings={setGeneralSettings}
                      pipelineSettings={pipelineSettings} setPipelineSettings={setPipelineSettings}
                      setCoreJson={setCoreJson} coreJson={coreJson} getSVForTlv={getSVForTlv} />
          </Route>
          <Route exact path='/core'>
            <CoreDetailsPage generalSettings={generalSettings} pipelineSettings={pipelineSettings}
                             coreJson={coreJson} tlvForJson={tlvForJson} macrosForJson={macrosForJson}
                             sVForJson={sVForJson}/>
          </Route>
        </Switch>
      </Box>
    </Box>
  </ChakraProvider>;
}

export default App;
