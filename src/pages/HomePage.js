import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BsFileCode } from 'react-icons/all';
import {
  getTLVCodeForDefinitions,
  translateJsonToM4Macros,
  translateParametersToJson,
} from '../translation/Translation';
import { PipelineSettingsForm } from '../components/PipelineSettingsForm';
import { GeneralSettingsForm } from '../components/GeneralSettingsForm';
import { useHistory } from 'react-router-dom';

export default function HomePage({
                                   generalSettings,
                                   setGeneralSettings,
                                   pipelineSettings,
                                   setPipelineSettings,
                                   setCoreJson,
                                   coreJson,
                                   getSVForTlv,
                                 }) {
  const [formErrors, setFormErrors] = useState([]);
  const history = useHistory();

  useEffect(() => {
    validateForm(false);
  }, [pipelineSettings, generalSettings]);

  function validateForm(err) {
    if (!err) {
      translateParametersToJson(generalSettings, pipelineSettings);
      const json = { general: generalSettings, pipeline: pipelineSettings };
      setCoreJson(json);
      return;
    }

    if (!generalSettings.depth) {
      setFormErrors([...formErrors, 'depth']);
    } else {
      setFormErrors([]);
      translateParametersToJson(generalSettings, pipelineSettings);
      const json = { general: generalSettings, pipeline: pipelineSettings };
      setCoreJson(json);
      return json;
    }

    return null;
  }

  function handleOpenInMakerchipButtonClicked() {
    if (validateForm(true)) {
      const macros = translateJsonToM4Macros(coreJson);
      const tlv = getTLVCodeForDefinitions(macros);
      const formBody = new FormData();
      formBody.set("source", tlv);

      fetch(
        "https://makerchip.com/project/public",
        {
          method: 'POST',
          body: formBody,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ).then(resp => resp.json())
        .then(json => console.log(json))
    }
  }

  function handleGoToCoreDetailsButtonClicked() {
    const json = validateForm(true);
    setCoreJson(json);
    if (!json) return;
    history.push('/core');
  }

  function handleDownloadRTLVerilogButtonClicked() {
    if (validateForm(true)) {
      const macros = translateJsonToM4Macros(coreJson);
      const tlv = getTLVCodeForDefinitions(macros);
      getSVForTlv(tlv, sv => {
        download('verilog.sv', sv);
      });

    }
  }

  return <>
    <Box textAlign='center' mb={5}>
      <Image src='warpv-logo.png' w={250} mx='auto' />
      <Text>The open-source RISC-V core IP you can shape to your needs!</Text>
    </Box>

    <Heading textAlign='center' size='md' mb={5}>Build an X, Y, or custom WARP-V core</Heading>

    <Box mx='auto' mb={10}>
      <HStack columns={2}>
        <CorePreview path='warpv-core-small.png' info='Low-Power, Low-Freq 1-cyc FPGA Implementation' />
        <CorePreview path='warpv-core-big.png' info='High-Freq 7-cyc ASIC Implementation' w={300} />
      </HStack>
    </Box>

    <Box mx='auto' maxW='85vh' mb={10}>
      <Heading size='md' mb={4}>Configure your CPU now</Heading>
      <Tabs borderWidth={1} borderRadius='lg' p={3}>
        <TabList>
          <Tab>General</Tab>
          <Tab>Pipeline</Tab>
          <Tab>Logic Blocks</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <GeneralSettingsForm setGeneralSettings={setGeneralSettings}
                                 generalSettings={generalSettings}
                                 formErrors={formErrors} />
          </TabPanel>
          <TabPanel>
            <PipelineSettingsForm setPipelineSettings={setPipelineSettings}
                                  pipelineSettings={pipelineSettings}
                                  formErrors={formErrors} />
          </TabPanel>
          <TabPanel>
            <Text>Coming soon!</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>

    <Box mb={15} mx='auto' maxW='85vh'>
      <Heading size='md' mb={15}>Get your code:</Heading>

      <HStack mb={50}>
        <Box w='50%'>
          <Button type='button' colorScheme='gray' onClick={handleGoToCoreDetailsButtonClicked}>Download Verilog
            (etc.)</Button>
        </Box>
        <Button type='button' colorScheme='blue' onClick={handleOpenInMakerchipButtonClicked}>Open in Makerchip
          IDE</Button>
      </HStack>

      <HStack>
        <Box w='50%'>
          <HStack>
            <Text>Download RTL Verilog</Text>
            <IconButton
              variant='ghost'
              colorScheme='gray'
              size='lg'
              fontSize='30px'
              onClick={handleDownloadRTLVerilogButtonClicked}
              icon={<BsFileCode />} />
          </HStack>
        </Box>
        <Image src='makerchip-preview.png' w='350px' />
      </HStack>

    </Box>
  </>;
}

function CorePreview({ path, info, ...rest }) {
  return <Box mx='auto'>
    <Image src={path} mx='auto' {...rest} />
    <Text mx='auto' textAlign='center' maxW={160}>{info}</Text>
  </Box>;
}


function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
