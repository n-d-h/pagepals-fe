import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
            mutation LoginInternally($username: String!, $password: String!) {
                login(account: { username: $username, password: $password }) {
                    accessToken
                    refreshToken
                }
            }
        `;

export const bookReaderService = gql`
mutation MyMutation(
  $customerID: ID
  $bookingDetails: BookingCreate,
) {
  createBooking(
    customerId: $customerID
    booking: $bookingDetails
  ) {
    description
    meeting {
      meetingCode
      password
    }
  }
}
            `;

export const createNewStaff = gql`
            mutation CreateStaff($staff: AccountStaffCreate!){
                registerStaff(staff: $staff){
                    id
                    username
                    email
                    phoneNumber
                    fullName
                    createdAt
                    updatedAt
                    accountState {
                        name
                    } 
                }
            }
  `;

export const updateAccountState = gql`
            mutation UpdateAccountState($id: ID!, $accountState: String){
                updateAccountState(id: $id, accountState: $accountState){
                    id
                    username
                    email
                    phoneNumber
                    fullName
                    createdAt
                    updatedAt
                    customer{	
                        fullName
                        gender
                        dob
                        imageUrl
                    }
                    accountState {
                        name
                    }
                }
            }
  `;

export const updateAccount = gql`
            mutation Mutation($id: ID!, $account: AccountUpdate){
                updateAccount(id: $id, account: $account){
                    id
                    username
                    email
                    phoneNumber
                    fullName
                    createdAt
                    updatedAt
                    accountState {
                        name
                    } 
                }
            }
`;

export const registerAccount = gql`
mutation MyMutation($register: RegisterRequest) {
    verifyEmailRegister(register: $register)
  }
`;

export const verifyAccount = gql`
mutation MyMutation($register: RegisterRequest) {
    register(register: $register){
      accessToken
    }
  }
`;

export const createServiceMutation = gql`
mutation MyMutation($service: ServiceInput) {
    createService(service: $service){
      id
      description
      duration
      book{
        title
      }
      serviceType{
        name
      }
    }
  }
`;

export const updateServiceMutation = gql`
mutation MyMutation($id: ID!, $shortDescription: String!, $description: String!, $price: Float!, $serviceTypeId: ID!, $imageUrl: String) {
  updateService(
    id: $id
    service: {shortDescription: $shortDescription, description: $description, price: $price, serviceTypeId: $serviceTypeId, imageUrl: $imageUrl}
  ) {
    description
    duration
    id
    price
    rating
  }
}
`;

export const forceUpdateServiceMutation = gql`
mutation MyMutation($id: ID!, $description: String!, $price: Float!, $serviceTypeId: ID!, $imageUrl: String) {

  keepBookingAndUpdateService(
     id: $id
    service: {description: $description, price: $price, serviceTypeId: $serviceTypeId, imageUrl: $imageUrl}
  ){
    description
    duration
    id
    price
    rating
  }
}
`;

export const deleteServiceMutation = gql`
mutation MyMutation ($id: ID!){
  deleteService(id: $id)
}`;

export const forceDeleteServiceMutation = gql`
mutation MyMutation($id: ID!) {
  keepBookingAndDeleteService(id: $id)
}
`;

export const createWorkingTimeMutation = gql`
mutation CreateWorkingDate ($workingTime: WorkingTimeListCreateInput!) {
  createReaderWorkingTime(
    workingTime:$workingTime
  )
}`;

export const becomeReaderMutation = gql`
mutation BecomeReader($information: RequestInput, $accountId: ID) {
  registerReader(accountId: $accountId, data: $information) {
    id
  }
}
`;

export const customerCreatePaymentMutation = gql`
mutation CreateOrder ($amount: Int!, $id: ID!) {
  createOrder(amount: $amount, customerId: $id) {
    message
    payUrl
    resultCode
  }
}
`;

export const customerMomoCheckPaymentMutation = gql`
mutation MyMutation($momoInfoCheck: MomoInfoCheck!) {
  checkPaymentMomo(info: $momoInfoCheck) 
}
`;

export const updateRequestInterviewMutation = gql`
mutation MyMutation($interviewAt: String!, $requestId: ID!, $staffId: ID!, $description: String) {
  updateRequestInterview(
    interviewAt: $interviewAt
    requestId: $requestId
    staffId: $staffId
    description: $description
  ) {
    answers {
      id
      content
      question {
        id
        content
      }
      }
      id
      description
      createdAt
      staffId
      staffName
      rejectReason
      state
      updatedAt
      reader {
      id
      audioDescriptionUrl
      avatarUrl
      countryAccent
      createdAt
      deletedAt
      description
      genre
      introductionVideoUrl
      language
      nickname
      updatedAt
      readerRequestReference{
        account {
            id
            username
            email
        }
      }
      }
      interviews {
        id
        note
        interviewAt
        result
        state
        meeting {
          id
          meetingCode
          password
        }
      }
      lastRequests{
        answers {
          id
          content
          question {
            id
            content
          }
          }
          id
          description
          createdAt
          staffId
          staffName
          rejectReason
          state
          updatedAt
          reader {
          id
          audioDescriptionUrl
          avatarUrl
          countryAccent
          createdAt
          deletedAt
          description
          genre
          introductionVideoUrl
          language
          nickname
          updatedAt
          readerRequestReference{
            account {
                id
                username
                email
            }
          }
          }
          interviews {
          id
          note
          interviewAt
          result
          state
          meeting {
            id
            meetingCode
            password
          }
          }
        
        }
    }
}`;

export const updateCustomerMutation = gql`
mutation MyMutation($id: ID!, $customer: CustomerUpdate) {
  updateCustomer(id: $id, customer: $customer) {
    account {
      accountState {
      name
    }
     role {
      name
      accounts {
        id
      }
    }
    id
    email
    fullName
    phoneNumber
    username
    customer {
      account {
        email
        id
        phoneNumber
        username
      }
      id
      dob
      fullName
      gender
      imageUrl
      status
    }
    reader {
      id
    }
    }
  }
}
`;

export const rejectRequestMutation = gql`
mutation MyMutation($description: String, $requestId: ID!, $staffId: ID!, $reason: String) {
  rejectRequest(description: $description, requestId: $requestId, staffId: $staffId, reason: $reason) {
    answers {
      id
      content
      question {
        id
        content
      }
      }
      id
      description
      createdAt
      staffId
      staffName
      rejectReason
      state
      updatedAt
      reader {
      id
      audioDescriptionUrl
      avatarUrl
      countryAccent
      createdAt
      deletedAt
      description
      genre
      introductionVideoUrl
      language
      nickname
      updatedAt
      readerRequestReference{
        account {
            id
            username
            email
        }
      }
      }
      interviews {
        id
        note
        interviewAt
        result
        state
        meeting {
          id
          meetingCode
          password
        }
      }
      lastRequests{
        answers {
          id
          content
          question {
            id
            content
          }
          }
          id
          description
          createdAt
          staffId
          staffName
          rejectReason
          state
          updatedAt
          reader {
          id
          audioDescriptionUrl
          avatarUrl
          countryAccent
          createdAt
          deletedAt
          description
          genre
          introductionVideoUrl
          language
          nickname
          updatedAt
          readerRequestReference{
            account {
                id
                username
                email
            }
          }
          }
          interviews {
          id
          note
          interviewAt
          result
          state
          meeting {
            id
            meetingCode
            password
          }
          }
        
        }
    }
  }
`;

export const verifyChangePassword = gql`
mutation MyMutation($id: ID!) {
  verifyCode(id: $id)
}
`;

export const updatePasswordMutation = gql`
mutation MyMutation($id: ID!, $password: String!) {
  updatePassword(id: $id, password: $password) {
    email
  }
}
`;

export const acceptRequestMutation = gql`
mutation MyMutation($description: String, $requestId: ID!, $staffId: ID!) {
  acceptRequest(description: $description, requestId: $requestId, staffId: $staffId) {
    answers {
      id
      content
      question {
        id
        content
      }
      }
      id
      description
      createdAt
      staffId
      staffName
      rejectReason
      state
      updatedAt
      reader {
      id
      audioDescriptionUrl
      avatarUrl
      countryAccent
      createdAt
      deletedAt
      description
      genre
      introductionVideoUrl
      language
      nickname
      updatedAt
      readerRequestReference{
        account {
            id
            username
            email
        }
      }
      }
      interviews {
        id
        note
        interviewAt
        result
        state
        meeting {
          id
          meetingCode
          password
        }
      }
      lastRequests{
        answers {
          id
          content
          question {
            id
            content
          }
          }
          id
          description
          createdAt
          staffId
          staffName
          rejectReason
          state
          updatedAt
          reader {
          id
          audioDescriptionUrl
          avatarUrl
          countryAccent
          createdAt
          deletedAt
          description
          genre
          introductionVideoUrl
          language
          nickname
          updatedAt
          readerRequestReference{
            account {
                id
                username
                email
            }
          }
          }
          interviews {
          id
          note
          interviewAt
          result
          state
          meeting {
            id
            meetingCode
            password
          }
          }
        
        }
  }
}
`;

export const cancelBooking = gql`
mutation MyMutation($id: ID!, $reason:String) {
  cancelBooking(bookingId: $id, reason: $reason) {
    createAt
  }
}
`;

export const reviewBookingMutation = gql`
mutation MyMutation($review: ReviewBooking, $id: ID!) {
  reviewBooking(bookingId: $id, review: $review) {
    createAt
    id
    rating
    review
  }
}
`;

export const completeBookingMutation = gql`
mutation MyMutation($id: ID!) {
  completeBooking(bookingId: $id) {
    createAt
  }
} 
`;

export const completeEventBookingMutation = gql`
mutation MyMutation($eventId: ID!) {
  completeEventBooking(eventId: $eventId) {
    id
  }
}
`;

export const updateReaderProfile = gql`
mutation MyMutation($id: ID!, $data: ReaderRequestInput) {
  updateReader(
    id: $id
    data: $data
  )
}
`;

// export const acceptUpdateRequestedReader = gql`
// mutation MyMutation($id: ID!) {
//   acceptUpdateRequestedReader(id: $id) {
//     id
//   }
// }
// `;

// export const rejectUpdateRequestedReader = gql`
// mutation MyMutation($id: ID!) {
//   rejectUpdateRequestedReader(id: $id) {
//     id
//   }
// }
// `;

export const createSeminarMutation = gql`
mutation MyMutation  ($seminar: SeminarRequestCreateInput) {
  createSeminarRequest(create: $seminar) {
    id
  }
}
`;

// export const updateSeminarMutation = gql`
// mutation UpdateSeminar($seminar: SeminarUpdateInput, $id: ID!, $readerId: ID!) {
//   updateSeminar(id: $id, readerId: $readerId, seminar: $seminar) {
//     activeSlot
//   }
// }
// `;

// export const deleteSeminarMutation = gql`
// mutation DeleteSeminar($id: ID!) {
//   deleteSeminar(id: $id) {
//     createdAt
//   }
// }
// `;

// export const joinSeminarMutation = gql`
// mutation MyMutation ($customerId: ID!, $seminarId:ID!) {
//   joinSeminar(customerId: $customerId, seminarId:  $seminarId) {
//     booking {
//       createAt
//     }
//   }
// }
// `;

export const createReportMutation = gql`
mutation MyMutation ($customerId:ID!, $reason: String, $reportId: ID!, $type: ReportTypeEnum) {
  createReport(input: {customerId: $customerId, reason:$reason, reportedId: $reportId, type: $type}) {
    createdAt
  }
}
`;

export const updateFcmtoken = gql`
mutation MyMutation($fcmToken: String!, $id: ID!) {
  updateFcmToken(fcmToken: $fcmToken, id: $id, isWebToken: true) {
    createdAt
  }
}
`;

export const createWithdrawalMutation = gql`
mutation MyMutation($input: WithdrawRequestCreateInput!, $id: ID!) {
  createWithdrawRequest(input: $input, readerId: $id) {
    amount
    bankAccountName
  }
}
`;

export const readNotificationMutation = gql`
mutation MyMutation( $id: ID!) {
  readNotification(id:$id) {
    content
  }
}
`;

export const readAllNotification = gql`
mutation MyMutation($id: ID!) {
  readAllNotifications(accountId: $id) {
    createdAt
  }
}
`;

export const rejectWithdrawalMutation = gql`
mutation MyMutation($id: ID!, $rejectReason: String, $staffId: ID!) {
  rejectWithdrawRequest(id: $id, rejectReason: $rejectReason, staffId: $staffId) {
    bankAccountName
  }
}
`;

export const acceptWithdrawalMutation = gql`
mutation MyMutation($id: ID!, $imageUrl: String, $staffId: ID!) {
  acceptWithdrawRequest(
    id: $id
    staffId: $staffId
    imgUrl: $imageUrl
  ) {
    amount
  }
}
`;

export const refundCustomerMutation = gql`
mutation MyMutation ($id:ID!) {
  refundBookingForReport(id: $id) {
    id
  }
}
`;
export const rejectCustomerReportMutation = gql`
mutation MyMutation($id: ID!) {
  rejectReport(id: $id) {
    createdAt
  }
}
`;

// export const completeSeminarMutation = gql`
// mutation MyMutation($id: ID!) {
//   completeSeminar(seminarId: $id) {
//     activeSlot
//     createdAt
//   }
// }
// `;

export const acceptReportReaderMutation = gql`
mutation MyMutation($readerId: ID!, $reason:String) {
  acceptReportReader(
    readerId: $readerId, reason: $reason)
}
`;

export const deleteWorkingTimeMutation = gql`
mutation MyMutation($id: ID!) {
  deleteReaderWorkingTime(workingTimeId: $id)
}
`;

export const updateRequestToScheduling = gql`
mutation MyMutation($requestId: ID!, $staffId:ID!, $description: String) {
  updateRequestToScheduling(
    requestId: $requestId, 
    staffId: $staffId, 
    description: $description) 
  {
    answers {
      id
      content
      question {
        id
        content
      }
      }
      id
      description
      createdAt
      staffId
      staffName
      rejectReason
      state
      updatedAt
      reader {
      id
      audioDescriptionUrl
      avatarUrl
      countryAccent
      createdAt
      deletedAt
      description
      genre
      introductionVideoUrl
      language
      nickname
      updatedAt
      readerRequestReference{
        account {
            id
            username
            email
        }
      }
      }
      interviews {
        id
        note
        interviewAt
        result
        state
        meeting {
          id
          meetingCode
          password
        }
      }
      lastRequests{
        answers {
          id
          content
          question {
            id
            content
          }
          }
          id
          description
          createdAt
          staffId
          staffName
          rejectReason
          state
          updatedAt
          reader {
          id
          audioDescriptionUrl
          avatarUrl
          countryAccent
          createdAt
          deletedAt
          description
          genre
          introductionVideoUrl
          language
          nickname
          updatedAt
          readerRequestReference{
            account {
                id
                username
                email
            }
          }
          }
          interviews {
          id
          note
          interviewAt
          result
          state
          meeting {
            id
            meetingCode
            password
          }
          }
        
        }
  }
}
`;

export const updateRequestTimeMutation = gql`
mutation MyMutation($requestId: ID!, $interviewAt: String!) {
  updateInterviewTime(requestId: $requestId, interviewAt: $interviewAt) {
    id
}
}
`;

export const bookEventMutation = gql`
mutation MyMutation($customerId: ID!, $eventId: ID!) {
  bookEvent(customerId: $customerId, eventId: $eventId) {
    booking {
         cancelReason
    }
  }
}
`;

export const updateInterview = gql`
mutation MyMutation($interviewId: ID!, $note:String, $result: InterviewResultEnum, $state: InterviewStateEnum) {
  updateInterview(
    interviewId: $interviewId,
    note: $note, 
    result: $result, 
    state: $state) {
    id
  }
}
`;

export const updateSetting = gql`
mutation MyMutation($setting: UpdateSettingInput!) {
  updateSetting(setting: $setting) {
    id
    key
    value
  }
}
`;

export const createEventMutation = gql`
mutation MyMutation(
  $readerId: ID!,
  $input: CreateEventInput!
) {
  createEvent(
    input: $input
    readerId: $readerId
  ) {
    activeSlot
  }
}
`;

export const updateEventMutation = gql`
mutation MyMutation($id: ID!, $input: UpdateEventInput!, ) {
  updateEvent(id: $id, input: $input) {
    activeSlot
  }
}
`;

export const deleteEventMutation = gql`
mutation MyMutation($id: ID!) {
  deleteEvent(id: $id) {
    state
  }
}
`;

export const updateSeminarMutation = gql`
mutation MyMutation ($id: ID!, $duration: Int!, $description: String!, $imageUrl: String!, $title: String!) {
  updateSeminarRequest(
    update: {
      id: $id,
      duration: $duration, 
      description: $description, 
      imageUrl: $imageUrl, 
      title: $title
    }
  ) {
    id
  }
}
`;

export const deleteSeminarMutation = gql`
mutation MyMutation($id: ID!) {
  deleteSeminarRequest(id: $id) {
    state
  }
}
`;

export const acceptSeminarRequest = gql`
mutation MyMutation ($id: ID!, $staffId: ID! ) {
  acceptSeminarRequest(requestId: $id, staffId: $staffId) {
    id
  }
}
`;

export const rejectSeminarRequest = gql`
mutation MyMutation ($id: ID!, $staffId: ID!, $reason: String ) {
  rejectSeminarRequest(requestId: $id, staffId: $staffId, reason:$reason) {
    id
  }
}
`;
