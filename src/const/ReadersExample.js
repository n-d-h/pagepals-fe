import { v4 as uuidv4 } from 'uuid';

export const READERS = [
  {
    id: uuidv4(),
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
    status: 'Top Reader',
    avatar: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
    name: 'John Doe',
    accent: 'Northern dialect Vietnamese',
    rating: '4.9',
    numberReviews: '89',
    collection: '20',
    description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
    minPrice: '35000',
    online: true,
    joinSince: '2024',
    aboutMe:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
    bookTypes: ['Romance', 'Horror', 'Fantasy'],
    bookCollection: [
      {
        id: uuidv4(),
        title: 'Harry Potter',
        cover:
					'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
        author: 'J.K. Rowling',
      },
      {
        id: uuidv4(),
        title: 'Harry Potter',
        cover:
					'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
        author: 'J.K. Rowling',
      },
      {
        id: uuidv4(),
        title: 'Harry Potter',
        cover:
					'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
        author: 'J.K. Rowling',
      },
    ],
    workingTime: {
      Monday: {
        timeframe: [], // Off day
      },
      Tuesday: {
        timeframe: [
          {
            name: 'Morning Shift',
            time: ['9:00', '10:30', '11:30'],
          },
          {
            name: 'Evening Shift',
            time: ['17:00', '18:00', '19:00'],
          },
        ],
      },
      Wednesday: {
        timeframe: [
          {
            name: 'Afternoon Shift',
            time: ['13:00', '15:30 ', '16:30'],
          },
        ],
      },
      Thursday: {
        timeframe: [], // Off day
      },
      Friday: {
        timeframe: [
          {
            name: 'Full Day',
            time: ['10:00', '12:00', '13:00', '15:00', '16:00', '18:00'],
          },
        ],
      },
      Saturday: {
        timeframe: [
          {
            name: 'Morning Shift',
            time: ['8:00', '10:00'],
          },
          {
            name: 'Afternoon Shift',
            time: ['14:00', '16:00'],
          },
        ],
      },
      Sunday: {
        timeframe: [], // Off day
      },
    },
  },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader2-cover.jpg',
  //   status: 'Featured Reader',
  //   avatar: 'https://example.com/reader2-avatar.jpg',
  //   name: 'Jane Smith',
  //   accent: 'Southern dialect Vietnamese',
  //   rating: '4.7',
  //   numberReviews: '45',
  //   collection: '15',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '28000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // // Add more readers here as needed
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader3-cover.jpg',
  //   status: 'Prominent Reader',
  //   avatar: 'https://example.com/reader3-avatar.jpg',
  //   name: 'Emily Brown',
  //   accent: 'Central dialect Vietnamese',
  //   rating: '4.8',
  //   numberReviews: '60',
  //   collection: '18',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '32000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader4-cover.jpg',
  //   status: 'Expert Reader',
  //   avatar: 'https://example.com/reader4-avatar.jpg',
  //   name: 'Michael Johnson',
  //   accent: 'Northern dialect Vietnamese',
  //   rating: '4.9',
  //   numberReviews: '75',
  //   collection: '25',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '38000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader5-cover.jpg',
  //   status: 'Popular Reader',
  //   avatar: 'https://example.com/reader5-avatar.jpg',
  //   name: 'Sarah Lee',
  //   accent: 'Southern dialect Vietnamese',
  //   rating: '4.6',
  //   numberReviews: '55',
  //   collection: '22',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '31000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader6-cover.jpg',
  //   status: 'Experienced Reader',
  //   avatar: 'https://example.com/reader6-avatar.jpg',
  //   name: 'David Wilson',
  //   accent: 'Central dialect Vietnamese',
  //   rating: '4.7',
  //   numberReviews: '68',
  //   collection: '17',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '33000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader7-cover.jpg',
  //   status: 'Distinguished Reader',
  //   avatar: 'https://example.com/reader7-avatar.jpg',
  //   name: 'Laura Davis',
  //   accent: 'Northern dialect Vietnamese',
  //   rating: '4.8',
  //   numberReviews: '72',
  //   collection: '23',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '36000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader8-cover.jpg',
  //   status: 'Skilled Reader',
  //   avatar: 'https://example.com/reader8-avatar.jpg',
  //   name: 'Daniel Smith',
  //   accent: 'Southern dialect Vietnamese',
  //   rating: '4.6',
  //   numberReviews: '58',
  //   collection: '19',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '30000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader9-cover.jpg',
  //   status: 'Renowned Reader',
  //   avatar: 'https://example.com/reader9-avatar.jpg',
  //   name: 'Jennifer Brown',
  //   accent: 'Central dialect Vietnamese',
  //   rating: '4.7',
  //   numberReviews: '65',
  //   collection: '21',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '32000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader10-cover.jpg',
  //   status: 'Outstanding Reader',
  //   avatar: 'https://example.com/reader10-avatar.jpg',
  //   name: 'James Lee',
  //   accent: 'Northern dialect Vietnamese',
  //   rating: '4.9',
  //   numberReviews: '80',
  //   collection: '27',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '40000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader11-cover.jpg',
  //   status: 'Talented Reader',
  //   avatar: 'https://example.com/reader11-avatar.jpg',
  //   name: 'Ella Johnson',
  //   accent: 'Southern dialect Vietnamese',
  //   rating: '4.8',
  //   numberReviews: '70',
  //   collection: '24',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '37000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader12-cover.jpg',
  //   status: 'Accomplished Reader',
  //   avatar: 'https://example.com/reader12-avatar.jpg',
  //   name: 'William Davis',
  //   accent: 'Central dialect Vietnamese',
  //   rating: '4.7',
  //   numberReviews: '62',
  //   collection: '20',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '34000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader13-cover.jpg',
  //   status: 'Renowned Reader',
  //   avatar: 'https://example.com/reader13-avatar.jpg',
  //   name: 'Olivia Wilson',
  //   accent: 'Northern dialect Vietnamese',
  //   rating: '4.9',
  //   numberReviews: '78',
  //   collection: '26',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '39000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader14-cover.jpg',
  //   status: 'Expert Reader',
  //   avatar: 'https://example.com/reader14-avatar.jpg',
  //   name: 'Noah Smith',
  //   accent: 'Southern dialect Vietnamese',
  //   rating: '4.6',
  //   numberReviews: '50',
  //   collection: '16',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '29000',
  //   online: true,
  //   joinSince: '2024',
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  // },
  // {
  //   id: uuidv4(),
  //   cover: 'https://example.com/reader15-cover.jpg',
  //   status: 'Popular Reader',
  //   avatar: 'https://example.com/reader15-avatar.jpg',
  //   name: 'Sophia Lee',
  //   accent: 'Central dialect Vietnamese',
  //   rating: '4.7',
  //   numberReviews: '66',
  //   collection: '22',
  //   description:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  //   minPrice: '33000',
  //   online: true,
  //   bookTypes: ['Romance', 'Horror', 'Fantasy'],
  //   joinSince: '2024',
  //   bookCollection: [
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //     {
  //       id: uuidv4(),
  //       title: 'Harry Potter',
  //       cover:
  // 				'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
  //       author: 'J.K. Rowling',
  //     },
  //   ],
  //   aboutMe:
  // 		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl vitae nisi eget lectus blandit ultrices. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nunc nisl',
  // },
];
