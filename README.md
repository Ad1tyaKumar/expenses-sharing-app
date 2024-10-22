# Expenses Sharing Application

## Overview

An expense sharing application where user can split their expenses on the basis of different methods like: Equal, Exact and Percentage

## Features

The system will allow users to split their expenses by entering an amount and split type and an array of users to which it will be splitted.

The expenses are properly validated so that there is no exception and unit tests are written in jest.

Users can create their account and make a split by adding other users which have already created account.

Users can download Balance sheet in CSV format.

- By ID (It will fetch their expenses)
- All the users. (It will fetch all the expenses splitted.)

To create an account User have to enter their phone number, email, name and create a password. 

The password stored in the database is hashed ensuring security.


APIs:-
```
  Method - POST
  API -    /api/expense/create
```
There are various types of splits in this API:-

#### Equal

Here user need to pass the data in the JSON format as:-
```
{
  "type" : "Equal",
  "purpose" : "Petrol" (Optional),
  "splits" : {
      "amount" : 5000,
      "users": [
          "id1", "id2", "id3" ..
      ]
  }
}
```

#### Exact

Here the body will look like:-
```
{
  "type" : "Exact",
  "purpose" : "Petrol" (Optional),
  "splits" : {
      "users": [
          {
            "_id" : "id1",
            "amount" : 30
          },
          {
            "_id" : "id2",
            "amount" : 304
          },
          {
            "_id" : "id3",
            "amount" : 330
          }
      ]
  }
}
```

#### Percentage

```
{
  "type": "percentage",
  "purpose" : "Dinner",
  "splits": {
    "amount" : 100,
    "users": [
        {
          "_id" : "id1",
          "percentage" : 80
        },
        {
          "_id" : "id2",
          "percentage" : 14
        },
        {
          "_id" : "id3",
          "percentage" : 6
        }
    ]
  }

```


## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Ad1tyaKumar/expenses-sharing-app
   cd expenses-sharing-app
   ```

2. **Install Backend Dependencies**

   ```bash
   npm install
   ```

3. **Start the Project**

   ```bash
   npm run dev
   ```


Created By: Aditya Kumar