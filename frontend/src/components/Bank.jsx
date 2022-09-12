import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure,
    FormErrorMessage,
    FormControl,
    FormLabel
} from "@chakra-ui/react";


const BankContext = React.createContext({
    bankDetails: [], fetchBankDetails: () => {}, myList: []
  })

export default function Bank() {
    const [bankDetails, setBankDetails] = useState([])
    const fetchBankDetails = async () => {
        const response = await fetch("http://localhost:8000/bankDetail")
        const bankDetails = await response.json()
        setBankDetails(bankDetails.data)
    }
    useEffect(() => {
        fetchBankDetails()
    }, [])
    
    return (
        <BankContext.Provider value={{bankDetails, fetchBankDetails}}>
          <AddBankDetailsForm item={bankDetails}/>
          <ImportCSV fetchBankDetails={fetchBankDetails}/>
          
          <Stack spacing={5}>
            {
              bankDetails.map((bankDetail) => (
                <BankHelper instance={bankDetail} fetchBankDetails={fetchBankDetails} />
              ))
            }
          </Stack>
        </BankContext.Provider>
      )
    }

  function BankHelper({instance, id, fetchBankDetails}) {
    return (
      <Box p={1} shadow="sm">
        <Flex justify="space-between">
            <Text mt={4} width="25%">
                <b>Bank Name:</b> {instance.bankName}
            </Text>
            <Text mt={4} width="25%">
                <b>Card Number:</b> {instance.accNo}
            </Text>
            <Text mt={4} width="25%">
                <b>Expiry Date:</b> {instance.expiryDate}
            </Text>
            <Text mt={4} as="div">
                <Flex align="end">
                    <DeleteBankDetail id={instance.id} fetchBankDetails={fetchBankDetails}/>
                </Flex>
            </Text>
        </Flex>
      </Box>
    )
  }

  function DeleteBankDetail({id}) {
    const {fetchBankDetails} = React.useContext(BankContext)
  
    const deleteBankDetail = async () => {
      await fetch(`http://localhost:8000/bankDetail/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: { "id": id }
      })
      await fetchBankDetails()
    }
  
    return (
      <Button h="1.5rem" size="sm" onClick={deleteBankDetail}>Delete</Button>
    )
  }

  function AddBankDetailsForm() {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [bankName, setBankName] = useState("")
    const [accNo, setAccNo] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const {bankDetails, fetchBankDetails} = React.useContext(BankContext)
    
    const missingBankName = bankName === ''
    const missingAccNo = accNo === ''
    const missingExpiryDate = expiryDate === ''
    const isError = missingBankName || missingAccNo || missingExpiryDate;

    const addInstance = async () => {
        const newBankAccount = {
            "id": bankDetails.length + 1,
            "bankName": bankName,
            "accNo": accNo,
            "expiryDate": expiryDate
          }

        await fetch(`http://localhost:8000/bankDetail/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBankAccount)
        })
        setBankName('');
        setAccNo('');
        setExpiryDate('');
        onClose()
        await fetchBankDetails()
      }
    const requiredFieldErrorMessage = <FormErrorMessage>Field is required.</FormErrorMessage>;

    return (
    <>
    <Button h="1.5rem" size="sm" onClick={onOpen}>Add New</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
        <ModalHeader>Add New Bank Account</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>

        <FormControl isInvalid={missingBankName}>
            <FormLabel>Bank name</FormLabel>
            <Input
                type='text'
                value={bankName}
                placeholder='Please enter the bank name'
                onChange={event => setBankName(event.target.value)}
                />
                {missingBankName ? requiredFieldErrorMessage : ''}        
        </FormControl>
        <FormControl isInvalid={missingAccNo}>
            <FormLabel>Card Number</FormLabel>
            <Input
                type='text'
                value={accNo}
                placeholder='Please enter the card number'
                onChange={event => setAccNo(event.target.value)}
            />
                {missingAccNo ? requiredFieldErrorMessage : ''}
        </FormControl>
        <FormControl isInvalid={missingExpiryDate}>
            <FormLabel>Bank name</FormLabel>
            <Input
            type='date'
            value={expiryDate}
            onChange={event => setExpiryDate(event.target.value)}
            />
                {missingExpiryDate ? requiredFieldErrorMessage : ''}
      </FormControl>
      </ModalBody>
      
      <ModalFooter>
      <Button h="1.5rem" size="sm" onClick={addInstance} isDisabled={isError}>Add</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
      </>
    )
  }

function ImportCSV({fetchBankDetails}) {
    const [file, setFile] = useState();
    const [array, setArray] = useState([]);

    const [bankDetails, setBankDetails] = useState([])
  
    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvFileToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    
        const array = csvRows.map(i => {
          const values = i.split(",");
          debugger;
          const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
          return obj;
        });
    
        setArray(array);

        return array;
    };

    const handleOnSubmit = async () => {
        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
                csvFileToArray(csvOutput);
                setBankDetails(array);
            };

            fileReader.readAsText(file);

            const response = await fetch(`http://localhost:8000/bankDetails/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(array)
            })

            const bankDetails = await response.json()    
            await fetchBankDetails()
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <form>
                <input
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                />
                <button
                    onClick={(e) => {
                        handleOnSubmit(e);
                    }}
                >
                    IMPORT CSV - N/W
                </button>
            </form>
        </div>
    );
}
