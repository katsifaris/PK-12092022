from operator import itemgetter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

bankDetails = [
    {
        "id": "1",
        "bankName": "Lloyds Bank",
        "accNo": "8565-5678-1234-4345",
        "expiryDate": "2022-01-01"
    },
    {
        "id": "2",
        "bankName": "HSBC Bank",
        "accNo": "9797-9876-3453-2365",
        "expiryDate": "2021-10-10"
    }
]

@app.get("/bankDetail")
async def get_bank_details() -> dict:
    print(bankDetails)

    validBankDetails = []
    for item in bankDetails:
        print(item)
        print('expiryDate' not in item)
        if 'expiryDate' not in item:
            continue
        item["accNo"] = hide_bank_details(item["accNo"])
        validBankDetails.append(item)

    sorted_list = sorted(validBankDetails, key=itemgetter('expiryDate'), reverse=True)

    return {"data": sorted_list}

def hide_bank_details(accNo):
    if '-' not in accNo:
        return accNo

    accNoSplit = accNo.split('-', 1)

    if len(accNo) < 3:
        return accNo

    firstPart = accNoSplit[0]
    secondPart = accNoSplit[1]

    for i in secondPart:
        if not i.isnumeric():
            continue
        secondPart = secondPart.replace(i, "X")

    accNo = firstPart + '-' + secondPart

    return accNo


@app.post("/bankDetail")
async def add_bank_detail(instance: dict) -> dict:
    bankDetails.append(instance)
    return {
        "data": { "Bank details added." }
    }

@app.post("/bankDetails")
async def add_bank_detail(instances: dict) -> dict:
    print(instances)
    for instance in instances:
        bankDetails.append(instance)
    return {
        "data": { "Bank details added." }
    }

@app.delete("/bankDetail/{id}")
async def delete_bank_detail(id: int) -> dict:
    for instance in bankDetails:
        if int(instance["id"]) == id:
            bankDetails.remove(instance)
            return {
                "data": f"Bank detail with id {id} has been removed."
            }

    return {
        "data": f"Bank detail with id {id} not found."
    }