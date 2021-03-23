import { Box, Heading, HStack, Icon, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/all';
import { useState } from 'react';

export function CoreDetailsPage({ coreJson, tlvForJson, macrosForJson, sVForJson }) {
  const [selectedFile, setSelectedFile] = useState();
  if (!coreJson) return <Redirect to='/' />;

  function handleDisplayButtonClicked(toDisplay) {
    setSelectedFile(toDisplay);
  }

  return <Box mx='auto' mt={10} maxW='85vh'>
    <Box mb={10}>
      <Heading mb={1}>Core Details</Heading>
      <Link as={RouterLink} to='/' color='teal'>Back <Icon as={BsArrowRight} /></Link>
      <Text mt={5}>Your CPU is constructed in the following steps.</Text>
      <Text> After generation, any of these can be taken as source and modified by hand.</Text>
    </Box>

    <HStack mb={10}>
      <Link onClick={() => handleDisplayButtonClicked('configuration')}>
        <Text borderWidth={1} borderRadius={15} p={2} textAlign='center'>Configuration (inputs)</Text>
      </Link>
      <Icon as={BsArrowRight} />

      <Link onClick={() => handleDisplayButtonClicked('json')}>
        <Text borderWidth={1} borderRadius={15} p={2} textAlign='center'>Configuration (.json)</Text>
      </Link>
      <Icon as={BsArrowRight} />
      <Link onClick={() => handleDisplayButtonClicked('m4')}>
        <Text borderWidth={1} borderRadius={15} p={2} textAlign='center'>Macro Definitions (.m4)</Text>
      </Link>
      <Icon as={BsArrowRight} />

      <Link onClick={() => handleDisplayButtonClicked('tlv')}>
        <Text borderWidth={1} borderRadius={15} p={2} textAlign='center'>Transaction-Level Design (TL-Verilog)</Text>
      </Link>
      <Icon as={BsArrowRight} />

      <Link onClick={() => handleDisplayButtonClicked('rtl')}>
        <Text borderWidth={1} borderRadius={15} p={2} textAlign='center'>RTL (Verilog)</Text>
      </Link>
    </HStack>

    <Box>
      {!selectedFile && <Text>No file selected</Text>}
      {selectedFile && <>
        <Text>File contents (of file selected above)</Text>
        <Box borderWidth={3} borderRadius={15} p={2}>
          {selectedFile === 'configuration' && <Text>Your configuration is determined by </Text>}
          {selectedFile === 'json' && <Text>{JSON.stringify(coreJson, null, 2)}</Text>}
          {selectedFile === 'm4' && macrosForJson && <>{macrosForJson.map(line => <Text
            key={line}>{line}<br /></Text>)}</>}
          {selectedFile === 'tlv' && tlvForJson && tlvForJson.split("\n").map((line, index) => <Text key={index}>{line}</Text>)}
          {selectedFile === 'rtl' && sVForJson && sVForJson.split("\n").map((line, index) => <Text key={index}>{line}</Text>)}
        </Box>
      </>}
    </Box>
  </Box>;
}