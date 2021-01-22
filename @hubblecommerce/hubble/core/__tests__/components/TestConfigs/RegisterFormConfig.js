const testData = {
    email: 'test@test.com',
    password: 'testPassword',
    firstName: 'testFirstName',
    lastName: 'testLastName',
    street: 'teststreet 1',
    zipCode: '12345',
    city: 'testCity'
}

export const testDataArray = [
    testData.email,
    testData.password,
    testData.password,
    testData.firstName,
    testData.lastName,
    testData.street,
    testData.zipCode,
    testData.city
]

export const expectedErrorMessages = [
    'The email is required.',
    'The password is required.',
    'The password confirmation is required.',
    'The firstName is required.',
    'The lastName is required.',
    'The street is required.',
    'The postal is required.',
    'The city is required.'
]

export const expectedRegisterData = {
    name: testData.firstName + ' ' + testData.lastName,
    email: testData.email,
    password: testData.password,
    password_confirm: testData.password,
    address: {
        city: testData.city,
        company: '',
        country: 2,
        firstName: testData.firstName,
        gender: 'f',
        lastName: testData.lastName,
        postal: testData.zipCode,
        street: testData.street,
    },
    birthday: '',
    phoneNumber: '',
    shippingAddress: null,
    guest: false,
    isGuest: false
}
