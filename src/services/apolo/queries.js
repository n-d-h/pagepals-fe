import { gql } from '@apollo/client';

export const getListStaff = gql`
	query MyQuery {
		getListStaff {
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

export const getListAccountState = gql`
	query MyQuery {
		getListAccountState {
			id
			name
		}
	}
`;

export const getListStaffAndListAccountState = gql`
	query MyQuery {
		getListStaff {
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
		getListAccountState {
			id
			name
		}
	}
`;

export const getListCustomerAndListAccountState = gql`
	query MyQuery {
		getListCustomer {
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
				reader {
					id
					avatarUrl
					nickname
				}
				accountState {
					name
				}
				role{
					name
				}
			}
		getListAccountState {
			id
			name
		}
	}
`;

export const getListReaderAndListAccountState = gql`
	query MyQuery {
		getListReader {
				id
				username
				email
				phoneNumber
				fullName
				createdAt
				updatedAt
				reader{
					id
					nickname
					rating
					genre
					language
					countryAccent
					audioDescriptionUrl
					description
					totalOfReviews
					totalOfBookings
					introductionVideoUrl
					avatarUrl
				  }
				accountState {
					name
				}
			}
		getListAccountState {
			id
			name
		}
	}
`;

export const getListReaderHomePage = gql`
query GetListReaders {
	getListPopularReaders {
	  countryAccent
	  description
	  genre
	  id
	  language
	  nickname
	  rating
	  status
	  totalOfReviews
	  avatarUrl
	  introductionVideoUrl
	  thumbnailUrl
	}
  }
`;

export const getReaderProfileDetail = gql`
	query GetReaderProfile($id: ID!) {
		getReaderProfile(id: $id) {
			workingTimeList {
				workingDates {
					date
					timeSlots {
						startTime
						id
					}
				}
			}
			profile {
				audioDescriptionUrl
				countryAccent
				description
				genre
				id
				introductionVideoUrl
				language
				nickname
				rating
				status
				avatarUrl
			}
		}
	}
`;

export const getBooksByReader = gql`
query MyQuery($id: ID!, $page: Int!, $pageSize: Int!, $title: String) {
	getReaderBooks(
	  id: $id
	  filter: {page: $page, pageSize: $pageSize, title: $title}
	) {
	  list {
		book {
		  language
		  title
		  id
		  publishedDate
		  publisher
		  thumbnailUrl
		  authors {
			name
		  }
		  categories {
			name
		  }
		  description
		}
		services {
			id
			price
			rating
			duration
			shortDescription
			description
			imageUrl
			serviceType {
			  name
			}
			totalOfBooking
			totalOfReview
		}
		ratingAverage
		serviceMaxPrice
		serviceMinPrice
		servicesCount
		totalReview
		status
	  }
	  paging {
		currentPage
		pageSize
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const bookReaderService = gql`
	mutation MyMutation(
		$customerID: ID
		$description: String
		$meetingCode: String
		$workingTimeID: ID
		$bookingDetails: [BookingDetailCreate]
	) {
		createBooking(
			customerId: $customerID
			booking: {
				description: $description
				meetingCode: $meetingCode
				promotionCode: ""
				totalPrice: 1.5
				workingTimeId: $workingTimeID
				bookingDetails: $bookingDetails
			}
		) {
			description
			meeting {
				meetingCode
				password
			}
		}
	}
`;

export const getProfileSchedule = gql`
query MySchedule($id: ID!, $filter: filterBooking) {
	getListBookingByCustomer(customerId: $id, filter: $filter) {
	  list {
		id
		totalPrice
		description
		createAt
		startAt
		rating
		meeting {
		  meetingCode
		  password
		  id
		}
		state {
		  name
		}
		service {
		  id
		  book {
			title
			thumbnailUrl
		  }
		  reader {
			nickname
		  }
		  duration
		  rating
		}
		event {
		  startAt
		  seminar {
			imageUrl
			id
			title
			duration
		  }
		  id
		}
	  }
	  pagination {
		totalOfPages
		totalOfElements
		currentPage
		pageSize
	  }
	}
  }
`;

export const getProfileReaderSchedule = gql`
query MySchedule($id: ID!, $filter: filterBooking) {
	getListBookingByReader(readerId: $id, filter: $filter) {
	  list {
		id
		totalPrice
		description
		createAt
		startAt
		rating
		meeting {
		  meetingCode
		  password
		  records {
			duration
			id
			recordFiles {
			  downloadUrl
			  id
			  playUrl
			}
		  }
		}
		state {
		  name
		}
		service {
		  id
		  book {
			title
			thumbnailUrl
		  }
		  reader {
			nickname
		  }
		  duration
		  rating
		}
		event {
		  seminar {
			book {
			  id
			  title
			}
			imageUrl
			title
			duration
			id
			description
		  }
		}
		customer {
		  fullName
		  id
		  imageUrl
		}
	  }
	  pagination {
		totalOfPages
		totalOfElements
		currentPage
		pageSize
	  }
	}
  }
`;

export const getReaderEventSchedule = gql`
query MySchedule($id: ID!, $filter: filterBooking) {
	getListEventBookingByReader(readerId: $id, filter: $filter) {
	  list {
		id
		totalPrice
		description
		createAt
		startAt
		rating
		meeting {
		  meetingCode
		  password
		  records {
			duration
			id
			recordFiles {
			  downloadUrl
			  id
			  playUrl
			}
		  }
		}
		state {
		  name
		}
		event {
			id
			createdAt
			activeSlot
			isFeatured
			limitCustomer
			startAt
			state
			price
			seminar {
			  id
			  title
			  imageUrl
			  duration
			  description
			  createdAt
			  rejectReason
			  state
			  book {
				id
				title
				thumbnailUrl
			  }
			}
		}
		customer {
		  fullName
		  id
		  imageUrl
		}
	  }
	  pagination {
		totalOfPages
		totalOfElements
		currentPage
		pageSize
	  }
	}
  }
`;

export const getSearchedReaders = gql`
query SearchReaderQuery($pageIndex: Int, $pageSize: Int, $nickname: String, $language: String, $genre: String, $country: String, $rating: Int) {
	getListReaders(
	  query: {pageSize: $pageSize, page: $pageIndex, nickname: $nickname, language: $language, genre: $genre, countryAccent: $country, rating: $rating}
	) {
	  pagination {
		pageSize
		totalOfPages
		totalOfElements
		currentPage
	  }
	  list {
		countryAccent
		description
		genre
		id
		language
		nickname
		rating
		status
		avatarUrl
		introductionVideoUrl
		totalOfReviews
		account {
		  accountState {
			name
		  }
		}
		thumbnailUrl
	  }
	}
  }
`;

export const getSearchedBooks = gql`
	query SearchBookQuery($pageIndex: Int, $pageSize: Int, $name: String) {
		getListBookForCustomer(
			searchBook: { search: $name, page: $pageIndex, pageSize: $pageSize }
		) {
			list {
				language
				publisher
				title
				id
				authors {
					name
				}
				categories {
					name
				}
				thumbnailUrl
				description
			}
			pagination {
				currentPage
				pageSize
				totalOfElements
				totalOfPages
			}
		}
	}
`;

export const getBookDetail = gql`
	query GetBookDetail($id: ID!) {
		getBookById(id: $id) {
			id
			language
			title
			publisher
			authors {
				name
			}
			thumbnailUrl
			description
			pageCount
			categories {
				id
				name
			}
		}
	}
`;

export const getReaderServices = gql`
	query MyQuery(
		$id: ID!
		$page: Int!
		$pageSize: Int!
		$search: String!
		$sort: String!
	) {
		getServicesByReader(
			readerId: $id
			filter: { page: $page, pageSize: $pageSize, search: $search, sort: $sort }
		) {
			paging {
				currentPage
				pageSize
				totalOfElements
			}
			services {
				shortDescription
				description
				duration
				id
				price
				rating
				status
				totalOfReview
				serviceType {
					id
					name
				}
				book {
					authors {
						name
					}
					title
					thumbnailUrl
					smallThumbnailUrl
				}
			}
		}
	}
`;

export const readerGetServicesBook = gql`
	query MyQuery(
		$author: String!
		$page: Int!
		$pageSize: Int!
		$title: String!
	) {
		searchBook(
			author: $author
			page: $page
			pageSize: $pageSize
			title: $title
		) {
			items {
				id
				volumeInfo {
					authors
					categories
					description
					imageLinks {
						smallThumbnail
						thumbnail
					}
					language
					pageCount
					publishedDate
					publisher
					title
				}
			}
			totalItems
		}
	}
`;

export const getReaderServiceType = gql`
	query MyQuery {
		getListServiceType {
			id
			name
			description
		}
	}
`;

export const getServicebyId = gql`
query getServiceById($id: ID!){
	serviceById(id: $id) {
	  id
	  duration
	  shortDescription
	  description
	  createdAt
	  imageUrl
	  price
	  rating
	  status
	  totalOfBooking
	  totalOfReview
	  serviceType {
		id
		name
	  }
	  book {
		  language
		  title
		  id
		  publishedDate
		  publisher
		  thumbnailUrl
		  authors {
			name
		  }
		  categories {
			name
		  }
		  description
		}
	}
  }
`;

export const getServiceByBook = gql`
query GetBookService($id: ID!) {
	getServicesByBook(bookId: $id, filter: {page: 0, pageSize: 3}) {
	  services {
		book {
			language
			title
			id
			externalId
			publishedDate
			publisher
			thumbnailUrl
			authors {
			  name
			}
			categories {
			  name
			}
			description
		}
		serviceType {
			name
		}
		imageUrl
		shortDescription
		description
		duration
		id
		price
		rating
		totalOfReview
		imageUrl
		serviceType {
		  name
		}
		reader {
		  nickname
		  rating
		  id
		  totalOfReviews
		  countryAccent
		  account {
			customer {
			  imageUrl
			}
		  }
		}
	  }
	}
  }
`;

export const getServiceByBookAndReader = gql`
query GetBookService($id: ID!, $readerId: ID!, $page: Int!, $pageSize: Int!, $search: String) {
	getServicesByBook(
	  bookId: $id
	  readerId: $readerId
	  filter: {page: $page, pageSize: $pageSize, search: $search}
	) {
	  services {
		book {
		  language
		  title
		  id
		  externalId
		  publishedDate
		  publisher
		  thumbnailUrl
		  authors {
			name
		  }
		  categories {
			name
		  }
		  description
		}
		serviceType {
		  name
		}
		imageUrl
		shortDescription
		description
		duration
		id
		price
		rating
		totalOfReview
		imageUrl
		serviceType {
		  name
		}
		reader {
		  nickname
		  rating
		  id
		  totalOfReviews
		  countryAccent
		  account {
			customer {
			  imageUrl
			}
		  }
		}
	  }
	  paging {
		currentPage
		pageSize
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getReaderCalendar = gql`
query MyQuery($id: ID!, $date:String, $view:String) {
	getReaderWorkingTimesByViewAndDate(readerId: $id, date: $date, view: $view) {
	  workingDates {
			date
			timeSlots {
			  id
			  startTime
			  endTime
			  isSeminar
			  isBooked
			}
		  }
	}
  }
`;

export const getAnalyticAdmin = gql`
query MyQuery($startDate: String, $endDate: String) {
	getAnalyticAdmin(startDate: $startDate, endDate: $endDate) {
	  totalService
	  totalReaders
	  totalCustomers
	  totalBookings
	  incomeByToken {
		percentageIncrease
		seriesData {
		  date
		  income
		  token
		}
		totalIncome
		totalTokenSale
	  }
		incomeByRevenueShare {
			percentageIncrease
			seriesData {
				date
				income
			}
			totalIncome
		}
	  	bookingStatics {
			months
			percentageOfDone
			seriesData {
			data
			state
			}
		}
		topReaders {
			reader {
			  id
			  nickname
			  avatarUrl
			  rating
			  account{
				email
			  }
			}
			totalIncome
		}
		topServices {
			totalBooking
			service {
			  id
			  book{
				smallThumbnailUrl
				title
			  }
			  rating
			  reader{
				nickname
			  }
			  price
			}
		}
		freeStorage {
			totalStorage
			usedStorage
		  }
		  cloudStorage {
			totalStorage
			usedStorage
		}
		circulatingToken {
			totalCirculating
			percentageIncrease
			seriesData {
			  token
			  date
			}
		  }	
	}
}
`;

export const getListQuestions = gql`
query GetQuestions {
    getListQuestion {
      content
      id
    }
  }
  `;

export const getCustomerWallet = gql`
	query MyQuery ($id: ID!) {
	getAccount(id: $id) {
	  wallet {
		id
		tokenAmount
	  }
	}
  }
`;

export const getReaderWallet = gql`
query MyQuery ($id: ID!) {
	getAccount(id: $id) {
	  wallet {
		id
		cash
	  }
	}
  }
`;

export const getReaderRequest = gql`
query MyQuery {
	getListRequest {
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
`;

export const getUserTransactions = gql`
query MyQuery($filter: TransactionFilter, $userId: ID) {
	getListTransactionForCustomer(customerId: $userId, filter: $filter) {
	  list {
		id
		amount
		currency
		paymentMethod {
		  name
		}
		transactionType
		createAt
		status
	  }
	  paging {
		pageSize
		currentPage
		sort
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getReaderRequestById = gql`
query MyQuery($requestId: ID!) {
	getRequestById(requestId: $requestId) {
		id
		description
		state
		createdAt
		updatedAt
		staffId
	  	staffName
		rejectReason
		answers {
		  question {
			content
		  }
		  content
		}
		reader {
			audioDescriptionUrl
			introductionVideoUrl
			avatarUrl
			countryAccent
			description
			language
			nickname
			genre
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

export const getReaderTransactions = gql`
query ReaderWorkingTime($id: ID!, $filter: TransactionFilter ) {
	getListTransactionForReader(
	  filter: $filter
	  readerId: $id
	) {
	  list {
		transactionType
		status
		id
		description
		currency
		createAt
		amount
		paymentMethod {
		  name
		}
	  }
	  paging {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getReaderReviews = gql`
query MyQuery($page: Int, $id: ID!, $pageSize: Int) {
	getReaderReviews(readerId: $id, page: $page, pageSize: $pageSize) {
	  list {
		date
		rating
		review
		customer {
		  imageUrl
		  fullName
		}
	  }
	  pagination {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getBecomeAReaderRequestDetailQuery = gql`
query MyQuery ($id: ID!) {
	getRequestByReaderId(readerId: $id) {
		id
		description
		state
		createdAt
		updatedAt
		staffId
	  	staffName
		rejectReason
		answers {
		  question {
			content
		  }
		  content
		}
		reader {
			audioDescriptionUrl
			introductionVideoUrl
			avatarUrl
			countryAccent
			description
			language
			nickname
			genre
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

export const getReaderUpdateRequestQueries = gql`
query MyQuery ($id: ID!) {
	getUpdateRequestByReaderId(readerId: $id) {
	  audioDescriptionUrl
	  avatarUrl
	  countryAccent
	  description
	  genres
	  introductionVideoUrl
	  languages
	  nickname
	}
  }
`;

export const getListReportBooking = gql`
query MyQuery {
	listReportBooking {
	  booking {
		id
		createAt
		updateAt
		totalPrice
		description
		startAt
		state {
		  name
		}
		service {
		  id
		  book {
			title
		  }
		}

	  }
	  listReport {
		id
		reason
		reportedId
		state
		type
		updatedAt
		createdAt
	  }
	}
  }
`;

export const getListReportReader = gql`
query MyQuery {
	listReportReader {
	  reader {
		id
		nickname
		totalOfBookings
		totalOfReviews
		avatarUrl
		language
		rating
	  }
	  listReport {
		id
		reason
		reportedId
		state
		type
		updatedAt
		createdAt
	  }
	}
  }
`;

export const getListWithdrawRequestByReader = gql`
query MyQuery ($page: Int, $pageSize: Int, $id: ID!) {
	withdrawRequestsByReaderId(
	  query: {page: $page, pageSize: $pageSize, sort: "desc"}
	  readerId:  $id
	) {
	  list {
		amount
		bankAccountName
		bankAccountNumber
		bankName
		transactionImage
		rejectReason
		createdAt
		updatedAt
		state
	  }
	  paging {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getNotificationByUser = gql`
query MyQuery($page: Int, $pageSize: Int, $id: ID!, $role: NotificationRole) {
	getAllNotificationsByAccountId(
	  accountId: $id
	  notificationRole: $role
	  sort: "desc"
	  pageSize: $pageSize
	  page: $page
	) {
	total
	  list {
		content
		createdAt
		id
		isRead
		notificationRole
		status
		title
	  }
	  pagination {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getWithdrawRequests = gql`
query MyQuery {
	withdrawRequests {
	  amount
	  bankAccountName
	  bankAccountNumber
	  bankName
	  createdAt
	  id
	  reader {
		avatarUrl
		id
		nickname
	  }
	  rejectReason
	  staffId
	  staffName
	  state
	  transactionImage
	}
  }
  `;

export const getBookingReportById = gql`
  query MyQuery ($id: ID!) {
	getReportById(id: $id) {
	  createdAt
	  id
	  reason
	  state
	  type
	  updatedAt
	  reportedId
	  customer {
		imageUrl
		fullName
	  }
	}
  }
  `;

export const getBookingDetailById = gql`
query MyQuery($id: ID!) {
	getBookingById(bookingId: $id) {
	  cancelReason
	  createAt
	  description
	  id
	  startAt
	  totalPrice
	  state {
		status
		name
	  }
	  service {
		book {
		  thumbnailUrl
		  title
		  id
		}
		duration
		id
		serviceType {
		  name
		}
		reader {
		  audioDescriptionUrl
		  countryAccent
		  avatarUrl
		  createdAt
		  deletedAt
		  description
		  genre
		  id
		  introductionVideoUrl
		  language
		  nickname
		  rating
		  status
		  thumbnailUrl
		  totalOfBookings
		  totalOfReviews
		  updatedAt
		}
	  }
	  meeting {
		id
		meetingCode
		records {
			duration
			externalId
			id
			recordingCount
			startTime
			status
			recordFiles {
			  downloadUrl
			  id
			  playUrl
			  startAt
			  endAt
			  fileExtention
			  fileType
			  recordingType
			  status
			}
		}
	  }
	  event {
		seminar {
		  reader {
			audioDescriptionUrl
			avatarUrl
			createdAt
			countryAccent
			deletedAt
			description
			genre
			id
			introductionVideoUrl
			language
			nickname
			rating
			status
			thumbnailUrl
			totalOfBookings
			updatedAt
			totalOfReviews
		  }
		}
	  }
	}
  }
  `;

export const getMeetingRecordByMeetingCode = gql`
query MyQuery($id: String!) {
	getRecording(roomId: $id) {
	  duration
	  id
	  recording_files {
		play_url
		download_url
		file_size
		status
		file_extension
		file_type
		recording_end
		recording_start
		recording_type
	  }
	  recording_play_passcode
	  password
	  download_access_token
	}
  }
`;

export const getReaderByReportTypeAndId = gql`
query MyQuery($id: ID!) {
	getReportGenericByIdAndType(id: $id, type: "BOOKING") {
	  booking {
		workingTime {
		  reader {
			id
			nickname
			status
			avatarUrl
			introductionVideoUrl
			language
			genre
			countryAccent
			description
		  }
		}
	  }
	}
  }
`;

export const getReportListByReader = gql`
query MyQuery($id: ID!) {
	getReportGenericByIdAndType(id: $id, type: "READER") {
	  listReport {
		id
		reason
		reportedId
		state
		type
		updatedAt
		createdAt
	  }
	  reader {
		  id
          nickname
          status
          avatarUrl
          introductionVideoUrl
          language
          genre
          countryAccent
          description
	  }
	}
  }
`;

export const getReportReaders = gql`
query MyQuery {
	listReportReader {
	  listReport {
		id
		reason
		reportedId
		state
		type
		updatedAt
		createdAt
	  }
	  reader {
		id
		description
		nickname
	  }
	}
  }
`;

// export const getAllSeminarsNotJoinByCustomerId = gql`
// query MyQuery($id: ID!) {
//   getAllSeminarsNotJoinByCustomerId(
//     page: 0
//     pageSize: 5
//     customerId: $id
//     sort: "desc"
//     state: "ACTIVE"
//   ) {
//     list {
//       activeSlot
//       createdAt
//       description
//       duration
//       id
//       imageUrl
//       limitCustomer
//       price
//       startTime
//       status
//       title
//       updatedAt
//       meeting {
//         id
//         meetingCode
//         password
//       }
//     }
//     pagination {
//       currentPage
//       pageSize
//       sort
//       totalOfElements
//       totalOfPages
//     }
//   }
// }
// `;

// export const getPopularSeminars = gql`
// query MyQuery {
// 	getAllSeminars(
// 	  page: 0
// 	  pageSize: 5
// 	  sort: "desc"
// 	  state: "ACTIVE"
// 	) {
// 	  list {
// 		activeSlot
// 		createdAt
// 		description
// 		duration
// 		id
// 		imageUrl
// 		limitCustomer
// 		price
// 		startTime
// 		status
// 		title
// 		updatedAt
// 		meeting {
// 		  id
// 		  meetingCode
// 		  password
// 		}
// 	  }
// 	  pagination {
// 		currentPage
// 		pageSize
// 		sort
// 		totalOfElements
// 		totalOfPages
// 	  }
// 	}
//   }
// `;

// export const getSeminarByReaderID = gql`
// query MyQuery ($id:ID!, $page: Int, $pageSize: Int) {
// 	getAllSeminarsByReaderId(
// 	  page: $page
// 	  readerId:$id
// 	  pageSize: $pageSize
// 	  sort: "desc"
// 	  state: "ACTIVE",
// 	  isCustomer: true,
// 	) {
// 	  list {
// 		activeSlot
// 		createdAt
// 		description
// 		duration
// 		id
// 		imageUrl
// 		limitCustomer
// 		price
// 		startTime
// 		status
// 		title
// 		updatedAt
// 		meeting {
// 		  id
// 		  meetingCode
// 		  limitOfPerson
// 		  startAt
// 		  password
// 		}
// 	  }
// 	}
//   }
// `;

export const getReaderStatistic = gql`
query ($id:ID!, $startDate: String!, $endDate:String!) {
	getReaderStatistics(
	  readerId: $id,
	  startDate: $startDate,
	  endDate:  $endDate
	) {
	  milestones
	  completedBookingData
	  canceledBookingData
	  successBookingRate
	  totalFinishBookingInThisPeriod
	  totalIncomeInThisPeriod
	  totalAmountShareInThisPeriod
	  totalProfitInThisPeriod
	  totalRefundInThisPeriod
	  allTimeTotalFinishBooking
	  allTimeIncome
	  totalActiveServices
	}
  }
`;

export const getAllSettings = gql`
query  {
	getAllSettings {
	  id
	  key
	  value
	}
  }
`;

export const getMeetingDetails = gql`
query MyQuery($id: ID!) {
	getBookingById(bookingId: $id) {
	  id
	  meeting {
		id
		createAt
		meetingCode
		password
		startAt
		state
	  }
	}
  }
`;

export const getMeetingByMeetingCode = gql`
query MyQuery($id: String!) {
	getMeetingById(roomId: $id) {
	  createAt
	  id
	  meetingCode
	  password
	  state
	  startAt
	}
  }
`;

export const getServiceByID = gql`
query MyQuery($id: ID!) {
	serviceById(id: $id) {
	  createdAt
	  shortDescription
	  description
	  duration
	  id
	  imageUrl
	  price
	  rating
	  status
	  totalOfBooking
	  totalOfReview
	  reader {
		avatarUrl
		id
		nickname
		rating
		totalOfReviews
		totalOfBookings
	  }
	  book {
		description
		id
		language
		pageCount
		publishedDate
		publisher
		thumbnailUrl
		title
		authors {
		  id
		  name
		}
		categories {
		  description
		  id
		  name
		  status
		}
	  }
	  serviceType {
		name
		description
		id
	  }
	  bookings {
		customer {
		  fullName
		  id
		  imageUrl
		}
		rating
		review
		startAt
	  }
	}
  }
`;

export const getBannerAdsQuery = gql`
query MyQuery {
	getAllBannerAds {
	  createdAt
	  id
	  startAt
	  status
	  event {
		activeSlot
		createdAt
		id
		isFeatured
		limitCustomer
		price
		startAt
		state
		seminar {
		  imageUrl
		  title
		  state
		  duration
		  reader {
			nickname
		  }
		}
	  }
	}
  }
`;

export const getEventDetails = gql`
query MyQuery($id: ID!) {
	getEventById(id: $id) {
	  activeSlot
	  createdAt
	  id
	  isFeatured
	  price
	  limitCustomer
	  startAt
	  state
	  seminar {
		createdAt
		description
		duration
		id
		imageUrl
		rejectReason
		state
		title
		updatedAt
		book {
		  description
		  id
		  language
		  publisher
		  publishedDate
		  thumbnailUrl
		  title
		  categories {
			id
			name
		  }
		}
		reader {
		  id
		  nickname
		  rating
		  totalOfReviews
		  totalOfBookings
		  description
		  genre
		  avatarUrl
		  countryAccent
		}
	  }
	}
  }
`;

export const getEventList = gql`
query MyQuery($id: ID!, $pageIndex: Int) {
	getAllEventsNotJoinByCustomer(
	  customerId: $id
	  page: $pageIndex
	  pageSize: 9
	  sort: "asc"
	) {
	  pagination {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	  list {
		activeSlot
		limitCustomer
		price
		startAt
		id
		seminar {
		  imageUrl
		  title
		  duration
		  reader {
			nickname
			avatarUrl
		  }
		}
	  }
	}
  }
`;

export const getReaderEvents = gql`
query GetBookService($id: ID!, $page: Int, $pageSize: Int) {
	getAllEventsByReader(page:  $page, pageSize: $pageSize, readerId: $id, sort: "desc") {
	  list {
		activeSlot
		createdAt
		id
		isFeatured
		limitCustomer
		price
		startAt
		state
		seminar {
		  duration
		  id
		  imageUrl

		  description
		  state
		  title
		}
	  }
	  pagination {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getReaderActiveEvents = gql`
query GetBookService($id: ID!, $page: Int, $pageSize: Int) {
	getAllActiveEventsByReader(page: $page, pageSize: $pageSize, readerId: $id, sort: "asc") {
	  list {
		activeSlot
		createdAt
		id
		isFeatured
		limitCustomer
		price
		startAt
		state
		seminar {
		  duration
		  id
		  imageUrl
		  description
		  state
		  title
		}
	  }
	  pagination {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getWorkingTimeByStaff = gql`
query MyQuery($staffId: ID!) {
	getWorkingTimeListByStaffId(staffId: $staffId) {
	  workingDates {
		date
		timeSlots {
		  endTime
		  id
		  isBooked
		  isSeminar
		  startTime
		}
	}
}
}
`;

export const getReaderSeminarRequests = gql`
query MySchedule($id: ID!, $pageIndex: Int, $pageSize: Int, $state: SeminarStatus!, $search: String) {
	getAllSeminarRequestsByReaderIdAndState(
	  readerId: $id
	  state: $state
	  page:  $pageIndex
	  pageSize: $pageSize
	  sort: "desc"
	  search: $search
	) {
	  list {
		createdAt
		duration
		description
		id
		imageUrl
		rejectReason
		state
		title
		updatedAt
		events {
		  activeSlot
		  createdAt
		  id
		  isFeatured
		  limitCustomer
		  price
		  startAt
		  state
		  seminar {
			title
			id
			imageUrl
		  }
		}
	  }
	  pagination {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getSeminarRequestDetail = gql`
query MySchedule($id: ID!) {
	getSeminarRequest(id: $id) {
	  createdAt
	  description
	  duration
	  imageUrl
	  id
	  rejectReason
	  state
	  title
	  updatedAt
	  events {
		activeSlot
		createdAt
		id
		isFeatured
		limitCustomer
		price
		startAt
		state
		seminar {
		  id
		  imageUrl
		  title
		  duration
		  reader {
			id
			nickname
			avatarUrl
		  }
		}
	  }
	  book {
			language
			title
			id
			publishedDate
			publisher
			thumbnailUrl
			authors {
			  name
			}
			categories {
			  name
			}
			description
		  }
	}
  }
`;

export const getEventBySeminarId = gql`
query MySchedule($id: ID!, $page: Int, $pageSize: Int) {
	getAllEventBySeminarId(page: $page, sort: "desc", seminarId: $id, pageSize: $pageSize) {
	  list {
		activeSlot
		createdAt
		id
		isFeatured
		limitCustomer
		price
		startAt
		state
		seminar {
		  createdAt
		  description
		  duration
		  id
		  imageUrl
		  rejectReason
		  state
		  title
		  updatedAt
		}
	  }
	  pagination {
		currentPage
		pageSize
		totalOfElements
		totalOfPages
	  }
	}
  }
`;

export const getRecordingsByMeetingId = gql`
query MyQuery ($id: String) {
	getMeetingRecordings(meetingId: $id) {
	  from
	  next_page_token
	  page_count
	  page_size
	  to
	  total_records
	  meetings {
		account_id
		download_access_token
		host_email
		duration
		host_id
		id
		password
		recording_count
		recording_play_passcode
		share_url
		start_time
		timezone
		topic
		total_size
		type
		uuid
		recording_files {
		  download_url
		  file_extension
		  file_size
		  file_type
		  id
		  meeting_id
		  play_url
		  recording_end
		  recording_start
		  recording_type
		  status
		}
	  }
	}
  }
`;

export const getBookingById = gql`
query MyQuery($id: ID!) {
	getBookingById(bookingId: $id) {
	  meeting {
		records {
		  duration
		  externalId
		  id
		  recordingCount
		  startTime
		  status
		  recordFiles {
			downloadUrl
			id
			playUrl
			startAt
			endAt
			fileExtention
			fileType
			recordingType
			status
		  }
		}
		createAt
		id
		password
		meetingCode
		state
		startAt
	  }
	  cancelReason
	  createAt
	  description
	  id
	  rating
	  review
	  isReported
	  state {
		name
	  }
	}
  }
`;

export const getSeminarListByStaff = gql`
query MySchedule($state: SeminarStatus!, $page: Int) {
	getAllSeminarRequestsByState(
	  state: $state
	  page: $page
	  pageSize: 9
	  sort: "desc"
	) {
	  pagination {
		currentPage
		pageSize
		sort
		totalOfElements
		totalOfPages
	  }
	  list {
		description
		duration
		id
		imageUrl
		state
		title
		updatedAt
		rejectReason
		reader {
		  id
		  nickname
		  avatarUrl
		}
	  }
	}
  }
`;

export const getMeetingRecording = gql`
query MyQuery($meetingId: String) {
	getMeetingRecordings(meetingId: $meetingId) {
	  	meetings{
			  duration
			  id
			  recording_count
			  start_time
			  recording_files {
				download_url
				id
				play_url
				recording_start
				recording_end
				file_extension
				file_type
				recording_type
				status
			  }
	  }
	}
  }
  `;
