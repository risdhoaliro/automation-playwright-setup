import { faker } from '@faker-js/faker';

export const generateProfileData = () => {
    const cleanName = (name: string) => {
        return name.replace(/[^a-zA-Z\s]/g, '').trim();
    };

    // Generate name with only alphabet, max 10 characters
    const fullName = cleanName(faker.person.firstName()); // Using firstName to get simpler names
    const name = fullName.length > 10 ? fullName.substring(0, 10) : fullName;

    // Generate random number with format 08xxxxxxxxxx
    const whatsappNumber = '0878' + faker.string.numeric(10);
    
    return {
        name: name,
        email: faker.internet.email(),
        whatsappNumber: whatsappNumber,
        telegramUsername: faker.internet.username()
    };
}; 